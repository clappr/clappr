---
name: commit
description: Stage and commit changed files using the conventional commits format
---

# Commits (conventional)

- Confirm you are not on the `main` branch.
- Confirm the user requested a commit.
- Run `git status --short` and stage only the paths for this task — never secrets, tokens, or `.env` files.
- Review `git diff --cached` before committing.
- Follow the conventional commits pattern: `type(scope): description`.
- Write the commit message in English.

**Format ([Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)):**

```
type(scope): description

[optional body]

[optional footer(s)]
```

Use English keywords for `type` and `scope`, as the convention prescribes (for example: `feat`, `fix`, `chore`; scope aligned with the package or area).

Commit messages are validated by commitlint (rules in `.commitlintrc.js`) via the Husky `commit-msg` hook, so a message that does not match the convention is rejected before the commit lands.
