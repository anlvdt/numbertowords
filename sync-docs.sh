#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  sync-docs.sh — Sync web-addin/src/ → docs/src/
#  Run this before deploying to GitHub Pages to ensure
#  the production (docs/) files match the dev (web-addin/) source.
# ═══════════════════════════════════════════════════════════
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/web-addin/src"
DEST="$SCRIPT_DIR/docs/src"
CONVERTER_SRC="$SCRIPT_DIR/web-addin/src/core/converter.js"
CONVERTER_DEST="$SCRIPT_DIR/docs/converter.js"

if [ ! -d "$SRC" ]; then
  echo "[ERROR] Source not found: $SRC"
  exit 1
fi

echo ""
echo "Syncing web-addin/src/ -> docs/src/ ..."
echo ""

# Sync the src directory (core, functions, taskpane)
rsync -av --delete \
  "$SRC/core/" "$DEST/core/"

rsync -av --delete \
  "$SRC/functions/" "$DEST/functions/"

rsync -av --delete \
  "$SRC/taskpane/" "$DEST/taskpane/"

# Also sync the standalone converter.js used by the web tool
cp "$CONVERTER_SRC" "$CONVERTER_DEST"

echo ""
echo "[OK] Sync complete."
echo "  - docs/src/core/       (ai-client.js, converter.js)"
echo "  - docs/src/functions/  (functions.js, functions.json)"
echo "  - docs/src/taskpane/   (taskpane.html, taskpane.js, taskpane.css)"
echo "  - docs/converter.js    (standalone copy for web tool)"
echo ""
