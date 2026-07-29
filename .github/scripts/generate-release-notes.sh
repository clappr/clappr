#!/usr/bin/env bash
# Resolve player tags / version table, or render + create/update a draft GitHub Release.
# Usage:
#   MODE=auto|manual [PLAYER_TAG=...] ./generate-release-notes.sh resolve
#   MODE=auto|manual PLAYER_TAG=... RELEASE_ID=... HIGHLIGHTS=... \
#     VERSIONS_TABLE=... CHANGELOG_LINKS=... ./generate-release-notes.sh render
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-clappr/clappr}"
MODE="${MODE:-auto}"
GITHUB_OUTPUT="${GITHUB_OUTPUT:-/dev/null}"
GITHUB_STEP_SUMMARY="${GITHUB_STEP_SUMMARY:-/dev/null}"

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
  gh api --paginate "repos/${REPO}/releases" \
    --jq ".[] | select(.tag_name == \"${tag}\") | {id: .id, draft: .draft}" \
    | head -n1
}

pkg_version_at() {
  local ref="$1"
  local path="$2"
  git show "${ref}:${path}" 2>/dev/null | jq -r '.version // empty'
}

build_versions_table_and_links() {
  local base_tag="$1"
  local player_tag="$2"
  local table_rows=""
  local links=""
  local pkg_json dir name private prev now

  # Discover packages from the tag tree — not the worktree (checkout may lag tags).
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

    table_rows+="| \`${name}\` | ${prev} | **${now}** |"
    table_rows+=$'\n'
    if git cat-file -e "${player_tag}:${dir}/CHANGELOG.md" 2>/dev/null; then
      links+="- [\`${name}\`](https://github.com/${REPO}/blob/main/${dir}/CHANGELOG.md)"
      links+=$'\n'
    fi
  done < <(git ls-tree -r --name-only "$player_tag" -- packages | awk -F/ 'NF==3 && $3=="package.json" {print}')

  VERSIONS_TABLE_OUT="$table_rows"
  CHANGELOG_LINKS_OUT="$links"
}

cmd_resolve() {
  local player_tag="${PLAYER_TAG:-}"
  local base_tag=""
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

  if [ -n "$release_id" ] && [ "$is_draft" = "false" ]; then
    echo "Published release already exists for ${player_tag} (id=${release_id}); skipping"
    should_run="false"
  elif [ -n "$release_id" ] && [ "$is_draft" = "true" ] && [ "$MODE" = "auto" ]; then
    echo "Draft already exists for ${player_tag} (id=${release_id}) and MODE=auto; skipping"
    should_run="false"
  fi

  base_tag="$(player_tags | awk -v t="$player_tag" '$0 == t { getline; print; exit }')"
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
  local body_file
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
    rm -f "$body_file"
    return 0
  fi

  if [ -n "$release_id" ]; then
    if [ "$MODE" != "manual" ]; then
      echo "Release id ${release_id} present but MODE=${MODE}; refusing to update" >&2
      exit 1
    fi
    echo "Updating draft release id=${release_id} for ${player_tag}"
    # --input expects JSON on stdin; use jq to build the payload safely.
    jq -n --rawfile body "$body_file" '{body: $body}' \
      | gh api -X PATCH "repos/${REPO}/releases/${release_id}" --input -
  else
    echo "Creating draft release for ${player_tag} (title=${title})"
    gh release create "$player_tag" \
      --repo "$REPO" \
      --draft \
      --title "$title" \
      --notes-file "$body_file"
  fi

  rm -f "$body_file"
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
