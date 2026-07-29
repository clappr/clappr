# Release Notes Style Guide

Generate **only** the Highlights section body for Clappr package releases.
Do not invent a title, version table, or changelog links — the workflow adds those.

## What to include

User-facing changes only:

- Bug fixes that affect playback, UI, or public APIs
- New player/playback/plugin behavior visible to integrators
- Public API additions or changes that consumers should know about

Write for people who consume `@clappr/player` and related packages, not for maintainers.

## What to skip

Do **not** generate entries for:

- CI/CD and GitHub Actions changes
- Tests, test framework migrations, coverage
- Internal refactors with no user-visible effect
- Documentation-only or website/docs site changes
- Dependency bumps (unless they fix a security issue users must act on)
- `chore: publish`, `chore(package): bump version`, and similar release housekeeping
- Repository URL / provenance / tooling-only fixes

## Semver noise

If some minor version bumps in the range come only from tooling, docs, CI, or test work (not player/playback API changes), add **one** bullet at most, for example:

- Some minor version bumps reflect tooling and docs changes, not player API changes

Do not create a separate "Semver caveats" section. Do not list each infra `feat` individually.

## Style

- Present tense: "Fix", "Add", "Restore"
- Concise bullets (one change per line)
- No conventional-commit prefixes (`fix:`, `feat(scope):`, etc.)
- No attribution like `by @author in #123`
- Prefer the outcome for users ("Fix mute toggle not restoring volume") over the implementation detail
