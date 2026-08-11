---
name: commit
description: Stage and commit changed files using the conventional commits format
---

# Commits (conventional)

- Confirm you are not on the `main` branch.
- Stage the changed files and commit.
- Follow the conventional commits pattern: `type(scope): description`.
- Write the commit message in English.

**Format ([Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)):**

```
type(scope): description

[optional body]

[optional footer(s)]
```

Use English keywords for `type` and `scope`, as the convention prescribes (for example: `feat`, `fix`, `chore`; scope aligned with the package or area).

Commit messages are validated by commitlint through the Husky hook (`.commitlintrc.js`), so a message that does not match the convention is rejected before the commit lands.
