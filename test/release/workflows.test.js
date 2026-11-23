import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const read = path => readFileSync(join(ROOT, path), 'utf8')

const PACKAGES = [
  '@clappr/player',
  '@clappr/core',
  '@clappr/plugins',
  '@clappr/hlsjs-playback',
  '@clappr/telemetry',
  'dash-shaka-playback',
  '@clappr/clappr-html5-tvs-playback',
  '@clappr/level-selector'
]

const unquote = value => value.trim().replace(/^'(.*)'$/, '$1')

// Dependency-free reading of the workflow text: inputs are the keys one level under `inputs:`.
function inputsOf(workflow) {
  const lines = workflow.split('\n')
  const start = lines.findIndex(line => line === '    inputs:')
  const inputs = {}
  let current

  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !line.startsWith('      ')) break

    const header = /^ {6}(\w+):$/.exec(line)
    if (header) {
      current = inputs[header[1]] = { options: [] }
      continue
    }

    const property = /^ {8}(\w+): (.*)$/.exec(line)
    if (property) current[property[1]] = unquote(property[2])

    const option = /^ {10}- (.*)$/.exec(line)
    if (option) current.options.push(unquote(option[1]))
  }

  return inputs
}

function stepsOf(workflow) {
  return workflow
    .split(/^ {6}- /m)
    .slice(1)
    .map(block => ({
      text: block,
      name: /^name: (.*)$/m.exec(block)?.[1],
      condition: /^ {8}if: (.*)$/m.exec(block)?.[1] ?? ''
    }))
}

function listFiles(dir) {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? listFiles(path) : [path]
  })
}

describe('release workflow', () => {
  const workflow = read('.github/workflows/release.yml')
  const steps = stepsOf(workflow)
  const indexOfStep = predicate => steps.findIndex(predicate)

  it('exposes package, bump and preview inputs with their defaults', () => {
    const inputs = inputsOf(workflow)

    expect(Object.keys(inputs)).toEqual(['package', 'bump', 'preview'])
    expect(inputs.package).toMatchObject({ type: 'choice', default: '@clappr/player' })
    expect(inputs.package.options).toEqual(PACKAGES)
    expect(inputs.bump).toMatchObject({ type: 'choice', default: 'patch' })
    expect(inputs.bump.options).toEqual(['patch', 'minor', 'major'])
    expect(inputs.preview).toMatchObject({ type: 'boolean', default: 'true' })
  })

  it('validates the dispatch before minting the app token', () => {
    const validate = indexOfStep(step => step.name === 'Validate dispatch')
    const token = indexOfStep(step => step.text.includes('actions/create-github-app-token'))

    expect(validate).toBeGreaterThanOrEqual(0)
    expect(steps[validate].text).toContain('release/cli.mjs validate')
    expect(token).toBeGreaterThan(validate)
  })

  it('pushes commit then tag and publishes after the push', () => {
    const push = indexOfStep(step => step.text.includes('git push origin'))
    const publish = indexOfStep(step => step.text.includes('npm publish -w'))
    const pushText = steps[push].text

    expect(push).toBeGreaterThanOrEqual(0)
    expect(pushText.indexOf('git push origin HEAD:main')).toBeGreaterThanOrEqual(0)
    expect(pushText.indexOf('git push origin HEAD:main')).toBeLessThan(
      pushText.indexOf('git push origin "$TAG"')
    )
    expect(publish).toBeGreaterThan(push)
    expect(steps[publish].text).toContain('--provenance')
  })

  it('guards every mutating step on preview', () => {
    const mutating = steps.filter(step =>
      /release\/cli\.mjs apply|git push|npm publish|registry-url|npm install -g/.test(step.text)
    )

    expect(mutating.length).toBeGreaterThanOrEqual(4)
    mutating.forEach(step => expect(step.condition).toContain('!inputs.preview'))
  })

  it('fails the run when publish fails', () => {
    const publish = steps.find(step => step.text.includes('npm publish -w'))

    expect(publish.text).not.toContain('continue-on-error')
    expect(publish.text).not.toContain('|| true')
  })

  it('serializes runs without cancelling', () => {
    expect(workflow).toMatch(/^concurrency:\n {2}group: release\n {2}cancel-in-progress: false$/m)
  })
})

describe('notes workflow', () => {
  it('is manual only and not called by release', () => {
    const notes = read('.github/workflows/release-notes.yml')
    const release = read('.github/workflows/release.yml')

    expect(notes).toMatch(/^name: Release notes$/m)
    expect(notes).toMatch(/^on:\n {2}workflow_dispatch:\n {4}inputs:\n {6}player_tag:/m)
    expect(notes).not.toMatch(/workflow_call|workflow_run|^ {2}(push|schedule|release):/m)
    expect(release).not.toMatch(/release-notes|Release notes|workflow_call|uses: \.\//)
  })
})

describe('repository', () => {
  it('has no trace of the old release flow', () => {
    expect(JSON.parse(read('lerna.json')).command?.version).toBeUndefined()
    expect(JSON.parse(read('package.json')).scripts.release).toBeUndefined()

    for (const removed of [
      '.github/scripts/generate-release-notes.sh',
      '.github/release-notes-instructions.md',
      '.github/workflows/generate-release-notes.yml'
    ]) {
      expect(existsSync(join(ROOT, removed))).toBe(false)
    }

    for (const file of listFiles(join(ROOT, '.github'))) {
      expect(readFileSync(file, 'utf8')).not.toContain('COPILOT_GITHUB_TOKEN')
    }
  })

  it('documents the new flow in every release doc', () => {
    const docs = [
      '.github/RELEASING.md',
      'AGENTS.md',
      '.github/instructions/project.instructions.md',
      'packages/hlsjs-playback/README.md'
    ]

    for (const doc of docs) {
      const text = read(doc)

      expect(text, doc).toContain('Release notes')
      for (const stale of ['dry_run', 'publish_only', 'lerna version', 'yarn release']) {
        expect(text, `${doc} mentions ${stale}`).not.toContain(stale)
      }
    }
  })
})
