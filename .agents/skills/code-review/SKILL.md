---
name: code-review
description: Performs a multi-axis code review (correctness, readability, architecture, security and performance) before merge. Use when reviewing your own code, another agent's, or a human's, or when assessing quality before the main branch.
---

# Code Review and Quality

## Overview

Multi-dimensional code review with quality gates. Every change is reviewed before merge — no exceptions. The review covers five axes: correctness, readability, architecture, security and performance.

**Approval standard:** Approve a change when it clearly improves overall code health, even if it is not perfect. Perfect code does not exist — the goal is continuous improvement. Do not block a change because it was not written exactly the way you would write it. If it improves the codebase and follows the project's conventions, approve it.

## When to use

- Before merging any PR or change
- After completing a feature implementation
- When another agent or model produced code that needs to be evaluated
- When refactoring existing code
- After any bug fix (review the fix and the regression test)

## Where the review shows up

**Deliver the review in this conversation only** (verdict, findings by severity, suggestions). Do not publish comments, notes or discussions on GitHub automatically. Only post to GitHub if the user explicitly asks for it.

## Collecting the diff

Before any analysis, get the complete diff (read-only; there is no need to comment on the PR):

**If the user provides a GitHub pull-request link or number (preferred):**

```bash
gh pr diff <number>
```

**Otherwise, use the current branch against origin/main:**

```bash
git diff origin/main...HEAD
```

Use `origin/main` (not the local `main`), since the local branch is usually out of date.

If the output is saved to a file (persisted output), read the **entire** file with `Read` using successive `offset` and `limit` until you reach the end — do not start the review from a partial read.

## The five review axes

Every review evaluates code across these dimensions:

### 1. Correctness

Does the code do what it claims to do?

- Does it match the spec or the task requirements?
- Are edge cases handled (null, empty, boundary values)?
- Are error paths handled (not just the happy path)?
- Does it pass all tests? Do the tests actually verify the right behavior?
- Are there off-by-one errors, race conditions or state inconsistencies?

### 2. Readability and simplicity

Can another engineer (or agent) understand this code without the author explaining it?

- Are names descriptive and consistent with the project's conventions? (No `temp`, `data`, `result` without context)
- Is the control flow straightforward (avoid nested ternaries, deep callbacks)?
- Is the code organized logically (related code grouped, clear module boundaries)?
- Are there "clever" tricks that should be simplified?
- **Could this be done in fewer lines?** (1000 lines where 100 suffice is a failure)
- **Do the abstractions pay for their complexity?** (Do not generalize until the third use case)
- Would comments clarify non-obvious intent? (But do not comment the obvious.)
- Are there dead code artifacts: no-op variables (`_unused`), compatibility shims or `// removed` comments?
- **Was a new conditional bolted onto an unrelated flow?** That is a design smell, not a nit — move the logic into its own helper, state or policy instead of tangling an existing path.
- **Do repeated conditionals on the same shape appear?** They signal a missing model or dispatcher. A "temporary" branch usually becomes permanent debt.

### 3. Architecture

Does the change fit the system's design?

- Does it follow existing patterns or introduce a new one? If new, is it justified?
- Does it keep clean module boundaries? (Plugin types: `CorePlugin`, `UICorePlugin`, `ContainerPlugin`, `UIContainerPlugin`, `Playback`, `MediaControl`)
- Is there code duplication that should be shared? Check duplication across packages.
- Do dependencies flow in the right direction (no circular dependencies)?
- Is the abstraction level appropriate (no over-engineering, no excessive coupling)?
- **Does this refactor reduce complexity or just relocate it?** Count the concepts the reader must hold to follow the change. If the "cleaner" version leaves that count unchanged, it is not cleaner — prefer the restructuring that makes whole branches, modes or layers disappear over one that re-centralizes the same logic. Prefer deleting an abstraction to polishing it.
- **Is feature-specific logic leaking into a shared or general-purpose package?** Keep the logic in the owning layer (`@clappr/core` vs `@clappr/plugins` vs playbacks), reuse the existing canonical helper instead of a near-duplicate, and do not normalize architectural drift.
- **Does the change alter a published API?** `@clappr/core`, `@clappr/plugins` and `@clappr/player` are consumer-facing. Watch for breaking changes to the public surface, including the ES5 subclassing contract of the published `dist/`.
- **Are type boundaries explicit?** Question gratuitous `any`/`unknown`/optionals/casts and silent fallbacks that mask an unclear invariant — making the boundary explicit usually simplifies the surrounding control flow.

### 4. Security

Does the change introduce vulnerabilities? Focus on this monorepo's surface (web/TV player, plugins, DOM via Zepto, remote config and manifests, dependencies):

**Never accept in these diffs:**

- Secrets, tokens or `.env` files committed; tokens or credentials in `localStorage` (prefer memory)
- `eval()`, the `Function` constructor, or `innerHTML` / unsafe HTML with untrusted input
- Sensitive data in logs, error messages or URLs
- `postMessage` without validating `event.origin` and the message structure; sending with `targetOrigin: "*"`

**Always check when the diff touches the subject:**

- User or third-party content (media URLs, manifests, playlists, remote config, plugin options) sanitized/encoded for the right context (HTML, JS, URL)
- Merging objects from untrusted sources without dangerous keys (`__proto__`, `constructor`, `prototype`)
- Data from APIs, manifests, config and external SDKs treated as untrusted until validated at the boundary
- URLs validated before redirect or before being handed to a playback
- New dependencies / bumps: trusted origin, `yarn audit` with no reachable critical/high without mitigation, `yarn.lock` diff reviewed
- If a secret already leaked into history: rotate first; deleting the line is not enough

### 5. Performance

Evaluate static patterns evident in the diff for this monorepo (web/smart TV):

**Cleanup and memory**

- Timers, listeners, observers, connections, workers, media elements, `MediaSource` and Blob URLs released on destroy/unload?
- Caches or collections without a limit/TTL that grow over a long session?
- Obvious retention of DOM, buffers or large closures (relevant on smart TVs — `html5-tvs-playback`)?

**Hot paths**

- Heavy synchronous work or layout thrashing (reading and writing layout in a loop) in frequent handlers (`timeupdate`, progress, media control)?
- Large allocations or unnecessary O(n) work in paths called many times per second?
- New dependency or code in the player's hot path without a clear need?
- Animations on `transform`/`opacity` and work batched with `requestAnimationFrame`?
- Bundle impact on the published `dist/` — is the added weight justified for every consumer?

## Structural remedies

When you flag a structural problem, propose the move — not just the problem. A review that only says "this is complex" leaves the author guessing. Use a named restructuring:

- **Replace a chain of conditionals** with a typed model or an explicit dispatcher.
- **Collapse duplicate branches** into a single clearer flow.
- **Separate orchestration from business logic** so each reads on its own.
- **Move feature-specific logic** out of a shared module into the package that owns the concept.
- **Reuse the canonical helper** instead of a bespoke near-duplicate.
- **Make a type boundary explicit** so downstream branching disappears.
- **Delete a pass-through wrapper** that adds indirection without clarifying the API.
- **Extract a helper, or split a large file** into focused modules.

Prefer the remedy that removes moving pieces over one that spreads the same complexity around.

## Change sizing

Small, focused changes are easier to review, faster to merge and safer to deploy. Targets:

```
~100 lines changed   → Good. Reviewable in one sitting.
~300 lines changed   → Acceptable if it is a single logical change.
~1000 lines changed  → Too large. Split it.
```

**Watch file size, not just diff size.** A small diff can still push a file past a healthy boundary — around 1000 _total_ lines in a single file (distinct from the ~1000 _changed_-lines threshold above) is a common inspection signal, not a hard cap. When a change materially grows an already-large file, ask whether to extract helpers, subcomponents or modules _first_, before piling more on. Decompose, then add.

**What counts as "one change":** A self-contained modification that addresses one thing, includes related tests and keeps the system functional after submission. One part of a feature — not the whole feature.

**Splitting strategies when a change is too large:**

| Strategy          | How                                                     | When                    |
| ----------------- | ------------------------------------------------------- | ----------------------- |
| **Stack**         | Submit a small change, start the next one based on it   | Sequential dependencies |
| **By file group** | Separate changes for groups needing different reviewers | Cross-cutting concerns  |
| **Horizontal**    | Create shared code/stubs first, then the consumers      | Layered architecture    |
| **Vertical**      | Break into smaller full-stack slices of the feature     | Feature work            |

**When large changes are acceptable:** Complete file deletions and automated refactors where the reviewer only needs to verify intent, not every line.

**Separate refactoring from feature work.** A change that refactors existing code and adds new behavior is two changes — submit them separately. Small cleanups (renaming variables) can be included at the reviewer's discretion.

## Review process

### Step 1: Understand the context

Before looking at the code, understand the intent:

```
- What is this change trying to accomplish?
- What spec or task does it implement?
- What is the expected behavior change?
```

### Step 2: Review the tests first

Tests reveal intent and coverage:

```
- Do tests exist for the change?
- Do they test behavior (not implementation details)?
- Are edge cases covered?
- Do the tests have descriptive names?
- Would the tests catch a regression if the code changed?
```

### Step 3: Review the implementation

Walk through the code with the five axes in mind:

```
For each changed file:
1. Correctness: Does this code do what the test says it should?
2. Readability: Can I understand it without help?
3. Architecture: Does this fit the system?
4. Security: Any vulnerabilities?
5. Performance: Any bottlenecks?
```

### Step 4: Categorize the findings

Label every comment with its severity so the author knows what is required vs optional:

| Prefix                        | Meaning          | Author action                                           |
| ----------------------------- | ---------------- | ------------------------------------------------------- |
| **Critical:**                 | Blocks merge     | Security vulnerability, data loss, broken functionality |
| **Required:** (or no prefix)  | Mandatory change | Must be addressed before merge                          |
| **Optional:** / **Consider:** | Suggestion       | Worth considering, but not required                     |

This prevents authors from treating all feedback as mandatory and wasting time on optional suggestions.

**Lead with what matters.** Order findings by leverage: correctness and security first, then structural regressions and missed simplifications, then everything else. Do not bury a real issue under cosmetic nits — a few high-conviction comments beat a long list. If there is one structural problem and ten nits, the structural problem _is_ the review.

### Step 5: Verify the verification

Check the author's verification story:

```
- Which tests were run?
- Did the build pass?
- Was the change tested manually?
- Are there screenshots for UI changes?
- Is there a before/after comparison?
```

## Dead code hygiene

After any refactoring or implementation change, check for orphaned code:

1. Identify code that is now unreachable or unused
2. List it explicitly
3. **Ask before deleting:** "Should I remove these now-unused elements: [list]?"

Do not leave dead code around — it confuses future readers and agents. But do not silently delete what you are unsure about. When in doubt, ask.

```
DEAD CODE IDENTIFIED:
- formatLegacyDate() in src/utils/date.js — replaced by formatDate()
- OldSeekBar component in src/plugins/ — replaced by SeekBar
- LEGACY_API_URL constant in src/config.js — no remaining references
→ Can I remove these?
```

## Honesty in review

When reviewing code — whether your own, another agent's, or a human's:

- **Do not rubber-stamp.** "LGTM" without evidence of review helps no one.
- **Do not soften real issues.** "This might be a minor concern" when it is a bug that will hit production is dishonest.
- **Quantify problems when possible.** "This listener on every `timeupdate` with no throttle will fire dozens of times per second on the main thread" is better than "this could be slow."
- **Push back on approaches with clear problems.** Sycophancy is a failure mode in reviews. If the implementation has issues, say so directly and propose alternatives.
- **Accept override gracefully.** If the author has full context and disagrees, defer to their judgment. Comment on the code, not on people — reframe personal critiques to focus on the code itself.

## Dependency discipline

Part of code review is dependency review:

**Before adding any dependency:**

1. Does the existing stack solve this? (It often does.)
2. How large is the dependency? (Check the bundle impact.)
3. Is it actively maintained? (Check last commit, open issues.)
4. Does it have known vulnerabilities? (`yarn audit`)
5. What is the license? (Must be compatible with the project.)

**Rule:** Prefer the standard library and existing utilities over new dependencies. Every dependency is a liability. In this monorepo, a dependency used by 2+ packages belongs in the root `devDependencies`; single-use stays in the owning package.

**Upgrading an existing dependency** is a code change like any other, and the riskiest upgrades are the ones merged in bulk with a message like "bump deps." Review them with the same discipline:

1. **Read the changelog, not just the version number.** Semver is a promise the maintainer may not have kept — a "patch" can carry a behavioral change. For a major bump, read the migration notes and find what breaks.
2. **One dependency per change.** Upgrade and merge them individually (or in small related groups). When a bulk bump breaks the build, you lose which package did it; a single-package change makes the cause obvious and the revert clean.
3. **Let the tests decide.** The upgrade is verified by a green suite before _and_ after, not by "it installed." If coverage around the dependency's behavior is thin, that gap is the real finding — add a test first.
4. **Mind the transitive graph.** Most installed packages are ones nobody chose directly. Review the lockfile diff, not just `package.json`; a single direct bump can pull in dozens of indirect changes.
5. **Keep the lockfile honest.** Commit it, review its diff, and never hand-edit it. The lockfile is what actually pins what ships.

**`yarn audit` / supply-chain triage:** critical/high reachable at runtime, build or deploy → block until upgraded, patched or replaced; not reachable → fix soon, document. Moderate in production → next cycle; dev-only → backlog. Never blind forced remediation (`yarn audit --force` or equivalent). Review typosquats, release age and ownership for new deps. In this monorepo: Yarn 1 with Lerna workspaces, a single `yarn.lock` at the root, reproducible install with `yarn install --frozen-lockfile`.

## Review checklist

```markdown
## Review: [PR/change title]

### Context

- [ ] I understand what this change does and why

### Correctness

- [ ] The change matches the spec/task requirements
- [ ] Edge cases handled
- [ ] Error paths handled
- [ ] Tests cover the change adequately

### Readability

- [ ] Names are clear and consistent
- [ ] Logic is straightforward
- [ ] No unnecessary complexity

### Architecture

- [ ] Follows existing patterns
- [ ] No unnecessary coupling or dependencies
- [ ] Appropriate abstraction level
- [ ] Refactors reduce complexity rather than relocate it
- [ ] No feature logic in shared packages; file stays within a healthy size
- [ ] No unintended breaking change to a published API

### Security

- [ ] No secrets in code or logs, no tokens in localStorage
- [ ] No `eval` / `Function` / unsafe `innerHTML`
- [ ] `postMessage` validates origin and payload; no `targetOrigin: "*"`
- [ ] Config/object merging free of prototype pollution
- [ ] External data (APIs, manifests, plugin options) treated as untrusted
- [ ] Dependencies / lockfile reviewed (`yarn audit` when there is a bump)

### Performance

- [ ] Resources released on destroy/unload (timers, listeners, media, Blob URLs, MediaSource)
- [ ] No heavy work or layout thrashing in hot paths (timeupdate, progress, media control)
- [ ] Caches/collections bounded or with TTL; no obvious DOM/buffer retention
- [ ] Bundle / deps in the hot path justified

### Verification

- [ ] Tests pass
- [ ] Build succeeds
- [ ] Manual verification done (if applicable)

### Verdict

- [ ] **Approve** — Ready to merge
- [ ] **Request changes** — Issues must be addressed
```

## Common rationalizations

| Rationalization                                  | Reality                                                                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "It works, that's good enough"                   | Working code that is unreadable, insecure or architecturally wrong creates debt that compounds.                                                                                 |
| "I wrote it, so I know it's correct"             | Authors are blind to their own assumptions. Every change benefits from another set of eyes.                                                                                     |
| "We'll clean it up later"                        | Later never comes. The review is the quality gate — use it. Require cleanup before merge, not after.                                                                            |
| "AI-generated code is probably fine"             | AI code needs more scrutiny, not less. It is confident and plausible, even when wrong.                                                                                          |
| "The tests pass, so it's good"                   | Tests are necessary but not sufficient. They do not catch architecture, security or readability problems.                                                                       |
| "The refactor makes it cleaner"                  | Relocating complexity is not reducing it. If the reader still holds the same number of concepts, the structure did not improve — look for the version where branches disappear. |
| "It's just a small addition to this file"        | Small diffs still push files past a healthy size and bolt branches onto unrelated flows. Judge the resulting structure, not the diff size.                                      |
| "It's just a version bump"                       | A bump is a behavior change you did not write. Read the changelog; semver does not guarantee no breakage.                                                                       |
| "I'll upgrade everything in one PR to save time" | A bulk bump that breaks the build hides which package did it. One dependency per change keeps the cause and the revert clean.                                                   |

## Red flags

- PRs merged without any review
- Review that only checks whether the tests pass (ignoring the other axes)
- "LGTM" without evidence of actual review
- Security-sensitive changes without a security-focused review
- Large PRs that are "too big to review properly" (split them)
- Bug fixes without regression tests
- Review comments without severity labels — makes it unclear what is required vs optional
- Accepting "I'll fix it later" — it never happens
- A refactor that moves code around without reducing the number of concepts the reader must hold
- A change that grows an already-large file instead of decomposing it
- New conditionals scattered into unrelated code paths (a missing abstraction)
- A bespoke helper that duplicates an existing canonical one, or feature logic placed in a shared package
- A bulk "bump dependencies" PR with no changelog review and no per-package isolation
- A lockfile change that is hand-edited, uncommitted, or merged without reviewing its diff

## Verification

After the review is complete:

- [ ] All Critical issues are resolved
- [ ] All Required (or unprefixed) changes are resolved or explicitly deferred with justification
- [ ] Tests pass
- [ ] Build succeeds
- [ ] The verification story is documented (what changed, how it was verified)
- [ ] Dependency upgrades were reviewed against their changelog, isolated per package, and verified by a green suite with the lockfile diff reviewed

**Presumptive blockers:** surface and propose the simpler design for each of these; escalate to Required only when the change actively makes the structure worse: a refactor that relocates complexity instead of reducing it; a change that pushes a file past the size boundary with no decomposition; feature logic added to a shared package; a near-duplicate of an existing canonical helper; a silent fallback that hides an unclear invariant.

## Output format

```markdown
## Review Summary

**Verdict:** APPROVE | REQUEST CHANGES

**Overview:** [1-2 sentences on the change and the overall assessment]

### Critical

- [file:line] [description and recommended fix]

### Required

- [file:line] [description and recommended fix]

### Optional

- [file:line] [description]

### What's good

- [positive observation — always include at least one]

### Verification story

- Tests reviewed: [yes/no, notes]
- Build verified: [yes/no]
- Security verified: [yes/no, notes]
```

### Format rules

1. Review the tests first — they reveal intent and coverage
2. Read the spec or task description before reviewing the code
3. Every Critical and Required finding must include a specific fix recommendation
4. Do not approve code with Critical issues
5. Acknowledge what is well done — specific praise reinforces good practices
6. If you are uncertain about something, say so and suggest investigation instead of guessing
7. If there are no issues in a category, write "None found"
