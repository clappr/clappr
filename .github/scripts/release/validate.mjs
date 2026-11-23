// Re-states the two guarantees the old `workflow_run: [CI]` trigger gave for free: the commit
// passed CI and it comes from main. A button gives neither.
export function validateDispatch({ ref, sha, ciRun }) {
  if (ref !== 'refs/heads/main') {
    throw new Error(
      `Release only runs from main (got ${ref}). Re-dispatch with main selected in the branch dropdown.`
    )
  }

  if (!ciRun) {
    throw new Error(
      `No CI run found for ${sha}. Wait for push CI, or run CI via workflow_dispatch on this commit, then dispatch again.`
    )
  }

  // Merging a PR and clicking Release at once is the common mistake: pending is not success.
  if (ciRun.status !== 'completed') {
    throw new Error(
      `CI for ${sha} is still '${ciRun.status}'. Wait for it to finish, then dispatch again.`
    )
  }

  if (ciRun.conclusion !== 'success') {
    throw new Error(`CI for ${sha} concluded '${ciRun.conclusion}'. Fix main before releasing.`)
  }
}
