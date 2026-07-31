# Contributing to Clappr

Thanks for your interest in Clappr. This guide covers how to report issues, propose changes, and submit pull requests.

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Did you find a bug?

- **Search first** on [Issues](https://github.com/clappr/clappr/issues) to see if it was already reported.
- If not, open a new issue via [New issue](https://github.com/clappr/clappr/issues/new/choose) and choose **Bug Report**.
- Include as much detail as you can: player version, browser, OS, configuration, and steps to reproduce.

## Do you have a question?

- Check the [FAQ](./apps/clappr.io/docs/faq.md) first.
- If you still need help, open [New issue](https://github.com/clappr/clappr/issues/new/choose) and choose **Question**.

## Do you want a new feature?

- Open [New issue](https://github.com/clappr/clappr/issues/new/choose) and choose **Feature Request** before starting large work.
- Describe the problem and the solution you have in mind so maintainers can discuss scope early.
- We may decline changes that significantly increase bundle size or hurt streaming performance.

## Did you write a patch?

1. Fork the repository and create a branch from `main`.
2. Make your changes and keep the pull request focused.
3. Open a pull request with a clear description of the problem and solution.
4. Link the related issue when applicable.

Before submitting, make sure CI checks pass locally:

```bash
yarn test
yarn lint
yarn format:check
```

## Development setup

Requires **Node.js ≥ 24** (see [`.nvmrc`](.nvmrc); with nvm, run `nvm install` then `nvm use` before `yarn install`). Yarn 1 enforces the root `engines` field and will abort install on older Node versions.

See the [README](README.md) for:

- [Local Development](README.md#local-development)
- [Project Structure](README.md#project-structure)
- [Documentation](README.md#documentation)

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

Examples: `fix(core): restore volume after unmute`, `docs(player): clarify autoplay options`.

Commit messages are validated by commitlint via Husky.

## Coding expectations

- Follow ESLint and Prettier (run `yarn lint` and `yarn format:check`).
- Test behavior, not implementation details.
- Clean up timers, listeners, observers, connections, media elements, and Blob URLs.
- Do not commit secrets, tokens, or `.env` files.
- Ask maintainers before adding new dependencies — bundle size and maintenance matter in a media player.

## Documentation and plugins

Documentation lives under [`apps/clappr.io/docs/`](./apps/clappr.io/docs/). See the README [Documentation](README.md#documentation) section for the full index.

To build a plugin, start with the [Plugin Development Guide](./apps/clappr.io/docs/guides/how_to_build_plugins.md).

## License

By contributing, you agree that your contributions will be licensed under the [BSD 3-Clause License](LICENSE).
