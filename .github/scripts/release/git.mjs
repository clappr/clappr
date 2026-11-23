import { execFileSync } from 'node:child_process'

export function createGit(root) {
  function git(args, options = {}) {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', ...options })
  }

  return {
    run: args => git(args),

    tagExists(tag) {
      try {
        git(['rev-parse', '--quiet', '--verify', `refs/tags/${tag}`], { stdio: 'pipe' })
        return true
      } catch {
        return false
      }
    },

    // `--name-only` after a record separator yields each commit with the files it touched.
    commitsSince(tag) {
      const log = git(['log', '--name-only', '--format=%x1e%H', `refs/tags/${tag}..HEAD`])

      return log
        .split('\x1e')
        .filter(record => record.trim())
        .map(record => {
          const [sha, ...files] = record.trim().split('\n')
          return { sha, files: files.filter(Boolean) }
        })
    },

    versionAt(tag, dir) {
      return JSON.parse(git(['show', `refs/tags/${tag}:${dir}/package.json`])).version
    },

    fileAt(tag, path) {
      return git(['show', `refs/tags/${tag}:${path}`])
    },

    tags(pattern) {
      return git(['tag', '--list', pattern]).split('\n').filter(Boolean)
    }
  }
}
