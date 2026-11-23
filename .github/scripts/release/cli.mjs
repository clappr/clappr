// Glue between the workflows and the rules in this folder: reads env and argv, builds the real
// adapters (git, GitHub, npm) and reports. Decisions live in the modules it calls.
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { applyRelease } from './apply.mjs'
import { createGit } from './git.mjs'
import {
  createDraftRelease,
  createGithub,
  findCiRun,
  findPullRequest,
  findRelease,
  updateReleaseBody
} from './github.mjs'
import { isPublished } from './npm.mjs'
import { publishNotes } from './notes.mjs'
import { planRelease, renderSummary } from './planner.mjs'
import { validateDispatch } from './validate.mjs'
import { readWorkspaces } from './workspaces.mjs'

const ROOT = process.cwd()

function appendTo(envName, text) {
  if (process.env[envName]) appendFileSync(process.env[envName], text)
}

function githubFromEnv() {
  return createGithub({ token: process.env.GH_TOKEN, repo: process.env.REPO })
}

async function validate() {
  const { request } = githubFromEnv()
  const { REF: ref, SHA: sha } = process.env

  validateDispatch({ ref, sha, ciRun: await findCiRun({ request, sha }) })
  console.log(`CI passed for ${sha}`)
}

async function plan({ package: packageName, bump, preview, 'allow-empty': allowEmpty, out }) {
  const { request } = githubFromEnv()
  const releasePlan = await planRelease({
    packageName,
    bump,
    allowEmpty: allowEmpty === 'true',
    now: new Date(),
    workspaces: readWorkspaces(ROOT),
    git: createGit(ROOT),
    github: { findPullRequest: sha => findPullRequest({ request, sha }) },
    npm: { isPublished }
  })

  writeFileSync(out, JSON.stringify(releasePlan))
  appendTo('GITHUB_STEP_SUMMARY', renderSummary(releasePlan, { isPreview: preview === 'true' }))
  appendTo(
    'GITHUB_OUTPUT',
    `mode=${releasePlan.mode}\nname=${releasePlan.name}\nversion=${releasePlan.version}\ntag=${releasePlan.tag}\n`
  )
  console.log(`${releasePlan.mode}: ${releasePlan.tag}`)
}

function apply({ plan: planFile }) {
  applyRelease({
    root: ROOT,
    plan: JSON.parse(readFileSync(planFile, 'utf8')),
    git: createGit(ROOT)
  })
}

async function notes({ tag }) {
  const git = createGit(ROOT)
  const { request } = githubFromEnv()

  const outcome = await publishNotes({
    tag,
    tags: () => git.tags('@clappr/player@*'),
    changelogAt: playerTag => git.fileAt(playerTag, 'packages/player/CHANGELOG.md'),
    releases: {
      find: releaseTag => findRelease({ request, tag: releaseTag }),
      createDraft: ({ tag: releaseTag, body }) =>
        createDraftRelease({ request, tag: releaseTag, body }),
      updateBody: ({ id, body }) => updateReleaseBody({ request, id, body })
    },
    warn: message => console.log(`::warning::${message}`)
  })
  console.log(`Release notes ${outcome}`)
}

const COMMANDS = { validate, plan, apply, notes }

async function main() {
  const [command, ...argv] = process.argv.slice(2)
  const { values } = parseArgs({
    args: argv,
    options: {
      package: { type: 'string' },
      bump: { type: 'string' },
      preview: { type: 'string' },
      'allow-empty': { type: 'string' },
      out: { type: 'string' },
      plan: { type: 'string' },
      tag: { type: 'string', default: '' }
    }
  })

  if (!COMMANDS[command]) throw new Error(`Unknown command "${command}"`)
  await COMMANDS[command](values)
}

main().catch(error => {
  console.log(`::error::${error.message.replaceAll('\n', '%0A')}`)
  appendTo('GITHUB_STEP_SUMMARY', `## Release failed\n\n${error.message}\n`)
  process.exitCode = 1
})
