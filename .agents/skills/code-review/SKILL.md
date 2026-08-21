---
name: code-review
description: Performs a multi-axis code review (correctness, readability, architecture, security, and performance) before merge. Use when reviewing GitHub PRs, your own code, another agent's, or a human's, or when assessing quality before the main branch. Triggers on code-review, /code-review, PR review.
---

# Code Review and Quality

## Overview

Multi-dimensional code review with quality gates. Every change is reviewed before merge — no exceptions. The review covers five axes: correctness, readability, architecture, security, and performance.

**Approval standard:** Approve a change when it clearly improves overall code health, even if it is not perfect. Perfect code does not exist — the goal is continuous improvement. Do not block a change because it was not written exactly the way you would write it. If it improves the codebase and follows the project's conventions, approve it.

## When to use

- Before merging any PR or change
- After completing a feature implementation
- When another agent or model produced code that needs to be evaluated
- When refactoring existing code
- After any bug fix (review the fix and the regression test)

## Where the review shows up

**Deliver the review in this conversation only** (verdict, findings by level, suggestions). Do not publish comments, notes, or discussions on GitHub automatically. Only post to GitHub if the user explicitly asks.

## Collecting the diff

Before any analysis, get the complete diff (read-only; there is no need to comment on the PR):

**If the user provides a GitHub pull-request link or number (preferred):**

```bash
gh pr diff <number|url>
```

**Otherwise, use the current branch against origin/main:**

```bash
git diff origin/main...HEAD
```

Use `origin/main` (not the local `main`), since the local branch is usually out of date. For PR context (`title`, `body`, base), `gh pr view <number|url>`.

If the output is saved to a file (persisted output), read the **entire** file with `Read` using successive `offset` and `limit` until you reach the end — do not start the review from a partial read.

## The five review axes

Every review evaluates code across these dimensions:

### 1. Correctness

Does the code do what it claims to do?

- Does it match the spec or the task requirements?
- Are edge cases handled (null, empty, boundary values)?
- Are error paths handled (not just the happy path)?
- Does it pass all tests? Do the tests actually verify the right behavior?
- Are there off-by-one errors, race conditions, or state inconsistencies?

### 2. Readability and simplicity

Can another engineer (or agent) understand this code without the author explaining it?

- Are names descriptive and consistent with the project's conventions? (No `temp`, `data`, `result` without context)
- Is the control flow straightforward (avoid nested ternaries, deep callbacks)?
- Is the code organized logically (related code grouped, clear module boundaries)?
- Are there "clever" tricks that should be simplified?
- **Could this be done in fewer lines?** (1000 lines where 100 suffice is a failure)
- **Do the abstractions pay for their complexity?** (Do not generalize until the third use case)
- Would comments clarify non-obvious intent? (But do not comment the obvious.)
- Are there dead-code artifacts: no-op variables (`_unused`), compatibility shims, or `// removed` comments?
- **Was a new conditional bolted onto an unrelated flow?** That is a design smell, not Optional — move the logic into its own helper, state, or policy instead of tangling an existing path.
- **Do repeated conditionals on the same shape appear?** They signal a missing model or dispatcher. A "temporary" branch usually becomes permanent debt.

### 3. Architecture

Does the change fit the system's design?

- Does it follow existing patterns or introduce a new one? If new, is it justified?
- Does it keep clean module boundaries?
- Is there code duplication that should be shared?
- Do dependencies flow in the right direction (no circular dependencies)?
- Is the abstraction level appropriate (no over-engineering, no excessive coupling)?
- **Does this refactor reduce complexity or just relocate it?** Count the concepts the reader must hold to follow the change. If the "cleaner" version leaves that count unchanged, it is not cleaner — prefer the restructuring that makes whole branches, modes, or layers disappear over one that re-centralizes the same logic. Prefer deleting an abstraction to polishing it.
- **Is feature-specific logic leaking into a shared or general-purpose module?** Keep the logic in the owning layer, reuse the existing canonical helper instead of a near-duplicate, and do not normalize architectural drift.
- **Are type boundaries explicit?** Question gratuitous `any`/`unknown`/optionals/casts and silent fallbacks that mask an unclear invariant — making the boundary explicit usually simplifies the surrounding control flow.

### 4. Security

Does the change introduce vulnerabilities? Focus on this monorepo's surface (web/TV player, plugins, DOM, ad SDKs, config, and dependencies):

**Never accept in these diffs:**
- Secrets, tokens, or `.env` files committed; tokens or credentials in `localStorage` (prefer memory)
- `eval()`, the `Function` constructor, or `innerHTML` / unsafe HTML with untrusted input
- Sensitive data in logs, error messages, or URLs
- `postMessage` without validating `event.origin` and the message structure; sending with `targetOrigin: "*"`

**Always check when the diff touches the subject:**
- User or third-party content (ads, playlist, remote config) sanitized/encoded for the right context (HTML, JS, URL)
- Merging objects from untrusted sources without dangerous keys (`__proto__`, `constructor`, `prototype`)
- Data from APIs, logs, config, and external SDKs treated as untrusted until validated at the boundary
- New dependencies / bumps: trusted origin, `yarn audit` with no reachable critical/high without mitigation, `yarn.lock` diff reviewed
- If a secret already leaked into history: rotate first; deleting the line is not enough

### 5. Performance

Evaluate static patterns evident in the diff for this monorepo (web/TV):

**Cleanup and memory**
- Timers, listeners, observers, WebSockets, workers, media elements, `MediaSource`, and Blob URLs released on destroy/unload?
- Caches or collections without a limit/TTL that grow over a long session?
- Obvious retention of DOM, buffers, or large closures (relevant on Tizen/WebOS)?

**Hot paths**
- Heavy synchronous work or layout thrashing (reading and writing layout in a loop) in frequent handlers (`timeupdate`, progress, metrics, media control)?
- Large allocations or unnecessary O(n) work in paths called many times per second?
- New dependency or code in the player's hot path without a clear need?
- React: unnecessary re-renders only where React exists (`app-frames`, `player-tvs-native`) — do not treat memoization as a default axis of the monorepo

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

Small, focused changes are easier to review, faster to merge, and safer to deploy. Targets:

```
~100 lines changed   → Good. Reviewable in one sitting.
~300 lines changed   → Acceptable if it is a single logical change.
~1000 lines changed  → Too large. Split it.
```

**Watch file size, not just diff size.** A small diff can still push a file past a healthy boundary — around 1000 _total_ lines in a single file (distinct from the ~1000 _changed_-lines threshold above) is a common inspection signal, not a hard cap. When a change materially grows an already-large file, ask whether to extract helpers, subcomponents, or modules _first_, before piling more on. Decompose, then add.

**What counts as "one change":** A self-contained modification that addresses one thing, includes related tests, and keeps the system functional after submission. One part of a feature — not the whole feature.

**Splitting strategies when a change is too large:**

| Strategy | How | When |
|---|---|---|
| **Stack** | Submit a small change, start the next one based on it | Sequential dependencies |
| **By file group** | Separate changes for groups needing different reviewers | Cross-cutting concerns |
| **Horizontal** | Create shared code/stubs first, then the consumers | Layered architecture |
| **Vertical** | Break into smaller full-stack slices of the feature | Feature work |

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

Two levels, and only two:

| Level | Meaning | Author action |
|---|---|---|
| **Required** | Blocks merge | Fix before merge. Bug, regression, vulnerability, leftover dead code, structural debt the merge would normalize. |
| **Optional** | Suggestion | Worth considering; the author decides. Never blocks. |

There is no third level above Required. If it blocks merge, it is Required — severity shows up in the order of findings and in the explanation, not in an extra label.

**At most 3 Optionals**, the highest-leverage ones. A tail of small suggestions dilutes what matters: the fourth Optional costs the author more attention than it delivers.

**Lead with what matters.** Order findings by leverage: correctness and security first, then structural regressions and missed simplifications, then everything else. Do not bury a real issue under cosmetic Optionals — a few high-conviction findings beat a long list. If there is one structural problem and ten nits, the structural problem _is_ the review.

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

After any refactoring or implementation change, check for orphaned code: now-unreachable snippets, no-op variables, compatibility shims, early-returns commented out "for testing".

Dead code found is **a Required finding like any other** — not a separate section at the end of the report, and not a block in all caps. It follows the same anatomy as the other findings, and the question about deleting goes in the Suggestion:

> **Suggestion:** remove `formatLegacyDate()` — replaced by `formatDate()` with no remaining references. I can delete it, or would you rather do it on the branch?

Do not leave dead code around — it confuses future readers and agents. But do not silently delete what you are unsure about. When in doubt, ask.

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

**Rule:** Prefer the standard library and existing utilities over new dependencies. Every dependency is a liability.

**Upgrading an existing dependency** is a code change like any other, and the riskiest upgrades are the ones merged in bulk with a message like "bump deps." Review them with the same discipline:

1. **Read the changelog, not just the version number.** Semver is a promise the maintainer may not have kept — a "patch" can carry a behavioral change. For a major bump, read the migration notes and find what breaks.
2. **One dependency per change.** Upgrade and merge them individually (or in small related groups). When a bulk bump breaks the build, you lose which package did it; a single-package change makes the cause obvious and the revert clean.
3. **Let the tests decide.** The upgrade is verified by a green suite before _and_ after, not by "it installed." If coverage around the dependency's behavior is thin, that gap is the real finding — add a test first.
4. **Mind the transitive graph.** Most installed packages are ones nobody chose directly. Review the lockfile diff, not just `package.json`; a single direct bump can pull in dozens of indirect changes.
5. **Keep the lockfile honest.** Commit it, review its diff, and never hand-edit it. The lockfile is what actually pins what ships.

**`yarn audit` / supply-chain triage:** critical/high reachable at runtime, build, or deploy → block until upgraded, patched, or replaced; not reachable → fix soon, document. Moderate in production → next cycle; dev-only → backlog. Never blind forced remediation (`yarn audit --force` or equivalent). Review typosquats, release age, and ownership for new deps. In this monorepo: Yarn 1.22, a single `yarn.lock` at the root, reproducible install with `yarn install --frozen-lockfile`.

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
- [ ] No feature logic in shared modules; file stays within a healthy size

### Security
- [ ] No secrets in code, logs, or localStorage for tokens
- [ ] No `eval` / `Function` / unsafe `innerHTML`
- [ ] `postMessage` validates origin and payload; no `targetOrigin: "*"`
- [ ] Config/object merging free of prototype pollution
- [ ] External data (APIs, ads, playlist) treated as untrusted
- [ ] Dependencies / lockfile reviewed (`yarn audit` when there is a bump)

### Performance
- [ ] Resources released on destroy/unload (timers, listeners, media, Blob URLs, MediaSource)
- [ ] No heavy work or layout thrashing in hot paths (timeupdate, progress, metrics)
- [ ] Caches/collections bounded or with TTL; no obvious DOM/buffer retention
- [ ] Bundle / deps in the hot path justified

### Verification
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Manual verification done (if applicable)

### Verdict
- [ ] **Approve** — Ready to merge
- [ ] **Request changes** — There are open Required findings
```

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "It works, that's good enough" | Working code that is unreadable, insecure, or architecturally wrong creates debt that compounds. |
| "I wrote it, so I know it's correct" | Authors are blind to their own assumptions. Every change benefits from another set of eyes. |
| "We'll clean it up later" | Later never comes. The review is the quality gate — use it. Require cleanup before merge, not after. |
| "AI-generated code is probably fine" | AI code needs more scrutiny, not less. It is confident and plausible, even when wrong. |
| "The tests pass, so it's good" | Tests are necessary but not sufficient. They do not catch architecture, security, or readability problems. |
| "The refactor makes it cleaner" | Relocating complexity is not reducing it. If the reader still holds the same number of concepts, the structure did not improve — look for the version where branches disappear. |
| "It's just a small addition to this file" | Small diffs still push files past a healthy size and bolt branches onto unrelated flows. Judge the resulting structure, not the diff size. |
| "It's just a version bump" | A bump is a behavior change you did not write. Read the changelog; semver does not guarantee no breakage. |
| "I'll upgrade everything in one PR to save time" | A bulk bump that breaks the build hides which package did it. One dependency per change keeps the cause and the revert clean. |

## Red flags

- PRs merged without any review
- Review that only checks whether the tests pass (ignoring the other axes)
- "LGTM" without evidence of actual review
- Security-sensitive changes without a security-focused review
- Large PRs that are "too big to review properly" (split them)
- Bug fixes without regression tests
- Findings without a level — makes it unclear what blocks merge and what is a suggestion
- A finding written as a single paragraph, stacking symptom, fix, and test suggestion inline
- Accepting "I'll fix it later" — it never happens
- A refactor that moves code around without reducing the number of concepts the reader must hold
- A change that grows an already-large file instead of decomposing it
- New conditionals scattered into unrelated code paths (a missing abstraction)
- A bespoke helper that duplicates an existing canonical one, or feature logic placed in a shared module
- A bulk "bump dependencies" PR with no changelog review and no per-package isolation
- A lockfile change that is hand-edited, uncommitted, or merged without reviewing its diff

## Verification

After the review is complete:

- [ ] All Required findings are resolved or explicitly deferred with justification
- [ ] Tests pass
- [ ] Build succeeds
- [ ] The verification story is documented (what changed, how it was verified)
- [ ] Dependency upgrades were reviewed against their changelog, isolated per package, and verified by a green suite with the lockfile diff reviewed

**Presumptive blockers:** surface and propose the simpler design for each of these; escalate to Required only when the change actively makes the structure worse: a refactor that relocates complexity instead of reducing it; a change that pushes a file past the size boundary with no decomposition; feature logic added to a shared module; a near-duplicate of an existing canonical helper; a silent fallback that hides an unclear invariant.

## Output format

The review is read by people — junior through senior — almost always in a terminal or a PR tab. A dense paragraph that stacks symptom, mechanism, fix, and test suggestion is unreadable no matter how correct it is.

**Didactics are this skill's differentiator.** If the author has to reread a finding twice to understand what the problem is, the review failed even if it was right.

### Report structure

Four sections, in this order. Nothing beyond them.

```markdown
## Review: [PR/change title]

**Verdict:** APPROVE | REQUEST CHANGES

[Overview in 1-2 sentences: what the change does and the overall assessment.]

### Required

[numbered findings]

### Optional

[at most 3, numbered]

### Verification

- **Tests reviewed:** yes/no — [half a line]
- **Build verified:** yes/no — [half a line]
- **Security verified:** yes/no — [half a line]
```

**Verdict rule:** any Required finding → REQUEST CHANGES. None → APPROVE.

If either list is empty, write "None found" and continue. **There is no praise section** — what the change got right belongs in the overview, in one sentence, when it fits. A list of positives inflates the report and nobody reads it.

### Anatomy of a finding

Four parts, in this order, **separated by a blank line**:

````markdown
#### 1. [Title: the problem in at most 8 words]

[Didactic explanation. 2 to 4 sentences. One idea per paragraph — if
you have two, split them. Write for someone who does not know this
stretch of code: say what happens and why it breaks, not just the
symptom's name.]

`file:line`

```js
// the code as it is today, 3 to 8 lines
// just enough to see the problem without opening the file
```

**Suggestion:** [the direction of the fix, in one sentence. Do not write the patch.]
````

The code block is required on Required findings and optional on Optionals — include it when the snippet is the argument, omit it when the problem is structural and the code does not show anything on its own.

### Hard formatting rules

1. **Blank line between every part.** Title, explanation, `file:line`, code, and Suggestion never sit flush against each other.
2. **Never stack symptom + fix + test suggestion in the same paragraph.** Symptom and mechanism go in the explanation; the fix goes in the Suggestion; a missing test is its own finding, not an appendix of another.
3. **At most 3 sentences per paragraph.** If you go past that, split.
4. **A finding is a `####` heading block, not a bullet.** A bullet turns into a run-on paragraph.
5. **One `file:line` per finding.** If the same problem appears in three places, cite the main one and mention the others in the explanation — do not paste `a.js:65,135,194` into the title.
6. **The Suggestion is one sentence.** If it does not fit in one, the finding is mixing two problems — split them.
7. **Number the findings,** so the author can say "about 3...".
8. **Write things out.** "`PLAYBACK_READY` arrives after the resource" is better than "PR > res". Project jargon is fine; improvised abbreviations are not.
9. **No all-caps for emphasis** and no invented sections outside the four above.

### Content rules

1. Review the tests first — they reveal intent and coverage
2. Read the spec or task description before reviewing the code
3. Every Required finding brings the direction of the fix in the Suggestion
4. Do not approve code with open Required findings
5. If you are uncertain, say so and suggest investigation instead of guessing

### Complete example

This is the pattern to copy — note the spacing and the size of each part.

`````markdown
## Review: DASH live captions (Shaka and Tizen providers)

**Verdict:** REQUEST CHANGES

Splitting Shaka and Tizen into per-playback providers is the right direction: it takes the `if (tizen) / if (shaka)` out of the sidecar flow. But the gate that separates live from VOD is incomplete, and an early-return was commented out "for testing", so the merge would regress DASH VOD and HLS live.

### Required

#### 1. DASH VOD enters the live flow

The code decides between downloading the sidecar caption and using the player's text tracks by asking only "is this resource DASH?". The second half of the question is missing: "is it DASH **live**?".

On DASH VOD with Shaka, `PLAYBACK_READY` arrives after the resource. When that happens the provider runs again, emits `WM_SUBTITLE_AVAILABLE` with Shaka's tracks, and replaces the sidecar that had already loaded — on screen, the language list swaps by itself.

`subtitle_loader.js:65`

```js
if (this.isDashResource(resource)) {
  this.setupDashSubtitles()
}
```

**Suggestion:** use `isDashLivePlayback` — the predicate `onResourceReady` already uses — in `setupDashSubtitles`, `onSubtitleChanged`, and the `PLAYBACK_READY` listener as well.

#### 2. The user's chosen caption snaps back to default

Shaka fires `trackschanged` several times during a live broadcast, not only on the initial load. On every fire the provider reapplies the initial caption and re-emits the menu.

The track objects that arrive on that event have no selection mark. Anyone who picked English is put back on the default mid-session without touching anything. The Tizen provider already guards against this by storing track ids; the Shaka one does not.

`shaka_dash_live_subtitle_provider.js:68`

```js
this._player.addEventListener('trackschanged', () => {
  this.setDashTracks()
  this.setInitialSubtitle()
})
```

**Suggestion:** always update the track map, but call `setInitialSubtitle` only the first time and keep the current selection while the id still exists.

#### 3. Commented-out early-return "for testing" shipped

The `return` that kept the language menu from mounting on live broadcasts is commented out, not removed. Commented this way, it opens the menu for **all** live — HLS included — not only the DASH live this branch is meant to cover.

The new tests still call `bindContainerEvents()` by hand, which means they were written to work around the return, not to validate removing it.

`language_menu_tv.js:139`

```js
onMetadataLoaded(video) {
  this.video = video
  //if (this.video?.isLive) return
  this.bindContainerEvents()
  this.renderPlugin()
}
```

**Suggestion:** delete the commented line and put an explicit DASH-live gate in its place — I can do that, or would you rather adjust it on the branch?

#### 4. Setup retry runs forever, four times per second

When the provider does not exist yet, `scheduleDashSetup` schedules a new 250ms timer. That timer calls back into the same function, which schedules another — no counter and no stop condition.

On any DASH whose playback is neither Shaka nor Tizen the provider never appears, and the cycle continues until destroy. On an entry-level TV that is constant main-thread work for the whole session.

`subtitle_loader.js:152`

```js
scheduleDashSetup() {
  clearTimeout(this._dashSetupTimer)
  this._dashSetupTimer = setTimeout(() => this.setupDashSubtitles(), 250)
}
```

**Suggestion:** cap the number of attempts and log once when they run out, instead of rescheduling forever.

### Optional

#### 1. `pt-BR` is normalized in Shaka but not in Tizen

The Shaka provider turns `pt-BR` into `pt` before matching the language map; the Tizen provider uses the raw value from AVPlay. It works today by accident, because AVPlay delivers `por`, which is also in the map.

`shaka_dash_live_subtitle_provider.js:321`

**Suggestion:** extract a `normalizeLanguage` and use it in both providers.

#### 2. One invalid `extra_info` wipes every track

Parsing Tizen's track list wraps `JSON.parse` of all of them in a single `try`. If one track comes with malformed `extra_info`, the exception also discards the valid tracks that had already been read.

`tizen_dash_live_subtitle_provider.js:388`

**Suggestion:** move the `try` inside the loop, dropping only the bad track.

### Verification

- **Tests reviewed:** yes — they cover flow choice and the menu label; they do not cover DASH VOD or selection preservation.
- **Build verified:** no — static review of the remote branch, working tree on `main`.
- **Security verified:** yes — no secrets, `eval`, `postMessage`, or new deps; the native cue goes to the DOM with `.text()`.
`````
