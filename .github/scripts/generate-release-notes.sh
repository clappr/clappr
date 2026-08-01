#!/usr/bin/env bash
# Resolve player tags / version table, or render + create/update a draft GitHub Release.
# resolve refuses to announce a player tag that is not on npm; Published versions
# rows are likewise filtered to versions present on the registry. Both tolerate
# publish-to-registry lag via REGISTRY_ATTEMPTS (default 3) and REGISTRY_RETRY_DELAY
# (default 10s), and fail loudly when the registry cannot answer at all.
# REQUIRE_NPM=1 additionally turns a *confirmed* absence into a failure — set it only
# when the caller already published the player in this run (see resolve).
# Usage:
#   MODE=auto|manual [PLAYER_TAG=...] ./generate-release-notes.sh resolve
#   MODE=auto|manual PLAYER_TAG=... RELEASE_ID=... HIGHLIGHTS=... \
#     VERSIONS_TABLE=... CHANGELOG_LINKS=... ./generate-release-notes.sh render
#   DRY_RUN=1 ... ./generate-release-notes.sh render   # print body only; no create/update
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-clappr/clappr}"
MODE="${MODE:-auto}"
GITHUB_OUTPUT="${GITHUB_OUTPUT:-/dev/null}"
GITHUB_STEP_SUMMARY="${GITHUB_STEP_SUMMARY:-/dev/null}"
# Overridable so the registry-unreachable path can be exercised locally.
NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"
# Deliberately not derived from MODE: `auto` is also the default for a bare local
# run, and MODE answers a different question (may render overwrite a draft?).
# Off by default so inspecting an orphan tag by hand stays a clean skip.
REQUIRE_NPM="${REQUIRE_NPM:-0}"

# Script-scoped so the EXIT trap can still see the path after cmd_render returns
# (a `local body_file` would be unbound under `set -u` when the trap fires).
body_file=""
trap 'rm -f "$body_file"' EXIT

emit() {
  local key="$1"
  local value="$2"
  # Multiline-safe GitHub Actions output
  {
    echo "${key}<<EOF"
    echo "${value}"
    echo "EOF"
  } >>"$GITHUB_OUTPUT"
}

player_tags() {
  git tag --sort=-v:refname --list '@clappr/player@*'
}

find_release_for_tag() {
  local tag="$1"
  # List endpoint includes drafts for actors with push access.
  # GET /releases/tags/{tag} only returns published releases — do not use it here.
  # gh api --jq does not accept jq --arg flags; interpolate carefully (tag is ours).
  # per_page=100 keeps the clappr release list on a single page today.
  gh api --paginate "repos/${REPO}/releases?per_page=100" \
    --jq ".[] | select(.tag_name == \"${tag}\") | {id: .id, draft: .draft}" \
    | head -n1
}

pkg_version_at() {
  local ref="$1"
  local path="$2"
  git show "${ref}:${path}" 2>/dev/null | jq -r '.version // empty'
}

# Asks registry.npmjs.org whether name@version exists, so git-only tags are never
# announced. Three-state on purpose: "we could not find out" must not be silently
# equivalent to "not published". Queried over HTTP rather than `npm view` because the
# status code is a stable contract — this workflow has no setup-node, so it would
# otherwise depend on the runner image's npm keeping E404 in its stderr (see #2472).
#   0 = present (200)   1 = confirmed absent (404)   2 = inconclusive (anything else)
# A 404 is retried: the packument can lag seconds behind a publish.
registry_has_version() {
  local name="$1"
  local ver="$2"
  local attempts="${3:-1}"
  local attempt=1
  local code=""

  while true; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 \
      "${NPM_REGISTRY}/${name//\//%2f}/${ver}" || true)"

    if [ "$code" = "200" ]; then
      return 0
    fi
    if [ "$attempt" -ge "$attempts" ]; then
      if [ "$code" = "404" ]; then
        return 1
      fi
      echo "::warning::Registry lookup for ${name}@${ver} was inconclusive (HTTP ${code:-none})"
      return 2
    fi
    attempt=$((attempt + 1))
    sleep "${REGISTRY_RETRY_DELAY:-10}"
  done
}

build_versions_table_and_links() {
  local base_tag="$1"
  local player_tag="$2"
  local table_rows=""
  local links=""
  local skipped=""
  local pkg_json dir name private prev now rc

  # Discover packages from the tag tree — not the worktree (checkout may lag tags).
  # NF==3 matches packages/<name>/package.json only (no nested package roots).
  while IFS= read -r pkg_json; do
    [ -n "$pkg_json" ] || continue
    dir="${pkg_json%/package.json}"
    name="$(git show "${player_tag}:${pkg_json}" | jq -r '.name')"
    private="$(git show "${player_tag}:${pkg_json}" | jq -r 'if .private == true then "true" else "false" end')"
    if [ "$private" = "true" ]; then
      continue
    fi

    now="$(pkg_version_at "$player_tag" "$pkg_json")"
    if [ -z "$now" ]; then
      continue
    fi

    if [ -n "$base_tag" ] && git cat-file -e "${base_tag}:${pkg_json}" 2>/dev/null; then
      prev="$(pkg_version_at "$base_tag" "$pkg_json")"
    else
      prev=""
    fi

    if [ -z "$prev" ]; then
      prev="—"
    elif [ "$prev" = "$now" ]; then
      continue
    fi

    # Only list versions that actually landed on npm (partial publish batches).
    # Checked last: unchanged packages already dropped out above, so this is one
    # registry call per table row instead of one per package in the monorepo.
    # Same retry budget as the player gate — these siblings were published in the
    # same run, so they are just as exposed to packument lag, and a row silently
    # dropped would announce fewer packages than were actually released.
    rc=0
    registry_has_version "$name" "$now" "${REGISTRY_ATTEMPTS:-3}" || rc=$?
    if [ "$rc" = "2" ]; then
      echo "::error::Could not determine whether ${name}@${now} is on npm; refusing to render a partial table"
      exit 1
    fi
    if [ "$rc" != "0" ]; then
      echo "Skipping ${name}@${now} in Published versions (not on npm)"
      skipped+="- \`${name}@${now}\`"
      skipped+=$'\n'
      continue
    fi

    table_rows+="| \`${name}\` | ${prev} | **${now}** |"
    table_rows+=$'\n'
    if git cat-file -e "${player_tag}:${dir}/CHANGELOG.md" 2>/dev/null; then
      links+="- [\`${name}\`](https://github.com/${REPO}/blob/main/${dir}/CHANGELOG.md)"
      links+=$'\n'
    fi
  done < <(git ls-tree -r --name-only "$player_tag" -- packages | awk -F/ 'NF==3 && $3=="package.json" {print}')

  VERSIONS_TABLE_OUT="$table_rows"
  CHANGELOG_LINKS_OUT="$links"

  # A dropped row means the draft understates the release — say so where a human
  # will see it, not only in the job log.
  if [ -n "$skipped" ]; then
    echo "::warning::Some bumped packages were left out of Published versions (not on npm)"
    {
      echo "### Packages left out of the release notes"
      echo
      echo "Bumped between tags but not found on npm, so they are not listed in the draft:"
      echo
      printf '%s\n' "$skipped" | sed '/^$/d'
    } >>"$GITHUB_STEP_SUMMARY"
  fi
}

cmd_resolve() {
  local player_tag="${PLAYER_TAG:-}"
  local base_tag=""
  local player_ver=""
  local registry_rc=0
  local release_json release_id is_draft should_run="true" skip_copilot="false"
  local versions_table="" changelog_links="" title=""

  if [ -z "$player_tag" ]; then
    player_tag="$(player_tags | head -1 || true)"
  fi

  if [ -z "$player_tag" ]; then
    echo "No @clappr/player tag found"
    emit should_run "false"
    emit player_tag ""
    emit base_tag ""
    emit release_id ""
    emit skip_copilot "true"
    emit title ""
    emit versions_table ""
    emit changelog_links ""
    return 0
  fi

  if ! git rev-parse -q --verify "refs/tags/${player_tag}" >/dev/null; then
    echo "Tag not found: ${player_tag}" >&2
    exit 1
  fi

  # Git tags can land before npm publish succeeds — never draft that case. Retries
  # because Release calls this seconds after publishing. An inconclusive registry is
  # always a failure, so the run goes red instead of staying silently green.
  # A confirmed absence is a deliberate skip when a human aimed us at the
  # tag, but a failure under REQUIRE_NPM: there the caller already published the
  # player, so "not on npm" contradicts its own precondition — lag or incident, both
  # need a human, and only a red job notifies anyone.
  player_ver="${player_tag##*@}"
  registry_rc=0
  registry_has_version "@clappr/player" "$player_ver" "${REGISTRY_ATTEMPTS:-3}" || registry_rc=$?
  if [ "$registry_rc" = "2" ]; then
    echo "::error::Could not determine whether @clappr/player@${player_ver} is on npm; failing instead of skipping silently"
    exit 1
  fi
  if [ "$registry_rc" != "0" ]; then
    if [ "$REQUIRE_NPM" = "1" ]; then
      echo "::error::Release published @clappr/player@${player_ver} but the registry still reports it absent (attempts: ${REGISTRY_ATTEMPTS:-3}); failing so the notes can be re-run"
      exit 1
    fi
    echo "::warning::@clappr/player@${player_ver} is tagged in git but not on npm; no draft release created"
    {
      echo "### Release notes skipped"
      echo
      echo "\`@clappr/player@${player_ver}\` is tagged in git but was not found on npm, so no draft GitHub Release was created."
    } >>"$GITHUB_STEP_SUMMARY"
    should_run="false"
  fi

  release_json="$(find_release_for_tag "$player_tag" || true)"
  release_id=""
  is_draft=""
  if [ -n "$release_json" ]; then
    # Do not use `// empty` on .draft — in jq, false is falsy so `false // empty` yields empty.
    release_id="$(echo "$release_json" | jq -r '.id')"
    is_draft="$(echo "$release_json" | jq -r '.draft')"
    if [ "$release_id" = "null" ]; then
      release_id=""
    fi
    if [ "$is_draft" = "null" ]; then
      is_draft=""
    fi
  fi

  if [ "$should_run" = "true" ] && [ -n "$release_id" ]; then
    if [ "$is_draft" = "false" ]; then
      echo "Published release already exists for ${player_tag} (id=${release_id}); skipping"
      should_run="false"
    elif [ "$is_draft" = "true" ] && [ "$MODE" = "auto" ]; then
      echo "Draft already exists for ${player_tag} (id=${release_id}) and MODE=auto; skipping"
      should_run="false"
    fi
  fi

  # When player_tag is the oldest tag, getline hits EOF and must not reprint $0.
  base_tag="$(player_tags | awk -v t="$player_tag" '$0 == t { if ((getline line) > 0) print line; exit }')"
  if [ -z "$base_tag" ]; then
    echo "No previous @clappr/player tag before ${player_tag}; Copilot step will be skipped"
    skip_copilot="true"
  fi

  title="${player_tag##*@}"

  if [ "$should_run" = "true" ]; then
    build_versions_table_and_links "$base_tag" "$player_tag"
    versions_table="$VERSIONS_TABLE_OUT"
    changelog_links="$CHANGELOG_LINKS_OUT"
  fi

  echo "player_tag=${player_tag}"
  echo "base_tag=${base_tag:-<none>}"
  echo "release_id=${release_id:-<none>}"
  echo "is_draft=${is_draft:-<none>}"
  echo "should_run=${should_run}"
  echo "skip_copilot=${skip_copilot}"
  echo "mode=${MODE}"

  emit should_run "$should_run"
  emit player_tag "$player_tag"
  emit base_tag "$base_tag"
  emit release_id "$release_id"
  emit skip_copilot "$skip_copilot"
  emit title "$title"
  emit versions_table "$versions_table"
  emit changelog_links "$changelog_links"
}

cmd_render() {
  local player_tag="${PLAYER_TAG:?PLAYER_TAG is required}"
  local title="${TITLE:-${player_tag##*@}}"
  local release_id="${RELEASE_ID:-}"
  local highlights="${HIGHLIGHTS:-}"
  local versions_table="${VERSIONS_TABLE:-}"
  local changelog_links="${CHANGELOG_LINKS:-}"
  body_file="$(mktemp)"

  if [ -z "$(echo "$highlights" | tr -d '[:space:]')" ]; then
    highlights="- See package changelogs below for details."
  fi

  {
    echo "## Published versions"
    echo
    if [ -n "$(echo "$versions_table" | tr -d '[:space:]')" ]; then
      echo "| Package | Previous | Now |"
      echo "|---|---|---|"
      # Ensure trailing newline handling is consistent
      printf '%s\n' "$versions_table" | sed '/^$/d'
    else
      echo "_No public package version changes detected between tags._"
    fi
    echo
    echo "## Highlights"
    echo
    printf '%s\n' "$highlights"
    echo
    echo "## Full changelogs"
    echo
    if [ -n "$(echo "$changelog_links" | tr -d '[:space:]')" ]; then
      printf '%s\n' "$changelog_links" | sed '/^$/d'
    else
      echo "- See package CHANGELOG.md files on \`main\`."
    fi
  } >"$body_file"

  {
    echo "### Draft release body preview"
    echo
    cat "$body_file"
  } >>"$GITHUB_STEP_SUMMARY"

  if [ "${DRY_RUN:-}" = "1" ]; then
    echo "DRY_RUN=1 — not creating/updating GitHub Release"
    echo "---- body ----"
    cat "$body_file"
    return 0
  fi

  if [ -n "$release_id" ]; then
    if [ "$MODE" != "manual" ]; then
      echo "Release id ${release_id} present but MODE=${MODE}; refusing to update" >&2
      exit 1
    fi
    echo "Updating draft release id=${release_id} for ${player_tag}"
    # --input expects JSON on stdin; use jq to build the payload safely.
    jq -n --rawfile body "$body_file" --arg name "$title" '{body: $body, name: $name}' \
      | gh api -X PATCH "repos/${REPO}/releases/${release_id}" --input -
  else
    echo "Creating draft release for ${player_tag} (title=${title})"
    gh release create "$player_tag" \
      --repo "$REPO" \
      --draft \
      --title "$title" \
      --notes-file "$body_file"
  fi
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    resolve) cmd_resolve ;;
    render) cmd_render ;;
    *)
      echo "Usage: $0 resolve|render" >&2
      exit 2
      ;;
  esac
}

main "$@"
