#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# publish-github.sh — Sync SENAR standard to public GitHub mirror
#
# What it does:
#   1. Exports git-tracked files from GitLab repo (senar/)
#   2. Excludes private AI/development files (.claude/, CLAUDE.md, etc.)
#   3. Copies to senar-public/ directory (separate git repo → GitHub)
#   4. Shows diff for review
#   5. Commits and pushes ONLY with --push flag
#
# Usage:
#   ./scripts/publish-github.sh          # dry run — shows what changed
#   ./scripts/publish-github.sh --push   # actually commit and push
#
# Prerequisites:
#   - senar-public/ directory exists with git init + github remote
#   - GitHub repo created: https://github.com/Kibertum/SENAR.git
#
# What gets EXCLUDED (stays only in GitLab):
#   .claude/          — KAI framework (scripts, MCP, skills, references)
#   .claude-lib       — KAI submodule
#   .claude-project/  — KAI project config (CouchDB connection)
#   CLAUDE.md         — AI agent instructions
#   .mcp.json         — MCP server config
#   .gitlab-ci.yml    — GitLab CI pipeline
#   .gitmodules       — submodule refs
#   .settings.json    — claude settings
#
# What gets INCLUDED (public on GitHub):
#   standard/         — SENAR Standard v1.3 (13 chapters)
#   guide/            — Practical Guide (12 chapters, EN + RU)
#   core/             — Core document (EN + RU)
#   reference/        — Reference materials (glossary, scaling, etc.)
#   site/             — Astro website source (senar.tech)
#   scripts/          — Build scripts (PDF generation)
#   README.md         — GitHub-facing README
#   LICENSE           — CC BY-SA 4.0
#   CHANGELOG.md      — Version history
#   Dockerfile        — Site build
#   docker-compose.yml
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="$(cd "$SOURCE_DIR/../senar-public" 2>/dev/null && pwd)" || {
    echo "ERROR: senar-public/ not found at $SOURCE_DIR/../senar-public"
    echo "Create it first:"
    echo "  mkdir ../senar-public && cd ../senar-public"
    echo "  git init && git remote add origin https://github.com/Kibertum/SENAR.git"
    exit 1
}

PUSH=false
if [[ "${1:-}" == "--push" ]]; then
    PUSH=true
fi

# Patterns to exclude (private/AI files)
EXCLUDE_PATTERNS=(
    ".claude/"
    ".claude-lib"
    ".claude-project/"
    "CLAUDE.md"
    ".mcp.json"
    ".gitlab-ci.yml"
    ".gitmodules"
    ".settings.json"
)

echo "═══ SENAR GitHub Publisher ═══"
echo "Source:  $SOURCE_DIR (GitLab)"
echo "Target:  $TARGET_DIR (GitHub)"
echo ""

# Build rsync exclude args
EXCLUDE_ARGS=()
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_ARGS+=(--exclude="$pattern")
done

# Also exclude non-tracked dirs
EXCLUDE_ARGS+=(--exclude=".rag/")
EXCLUDE_ARGS+=(--exclude=".venv/")
EXCLUDE_ARGS+=(--exclude="node_modules/")
EXCLUDE_ARGS+=(--exclude=".git/")

# Sync
echo "Syncing files..."
rsync -av --delete \
    "${EXCLUDE_ARGS[@]}" \
    "$SOURCE_DIR/" "$TARGET_DIR/"

echo ""
echo "═══ Changes in senar-public ═══"
cd "$TARGET_DIR"
git add -A
git status --short

CHANGES=$(git diff --cached --stat | tail -1)
if [[ -z "$CHANGES" ]]; then
    echo "No changes to publish."
    exit 0
fi

echo ""
echo "$CHANGES"

if [[ "$PUSH" == true ]]; then
    # Get latest GitLab commit hash for reference
    GITLAB_HASH=$(cd "$SOURCE_DIR" && git rev-parse --short HEAD)

    echo ""
    echo "Committing and pushing..."
    git commit -m "sync: update from GitLab ($GITLAB_HASH)"
    git push origin main
    echo ""
    echo "✓ Published to GitHub"
else
    echo ""
    echo "Dry run complete. To publish:"
    echo "  ./scripts/publish-github.sh --push"
fi
