#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  DocSoThanhChu AI — macOS Install Script
#  Sideloads manifest.xml into Excel for Mac
# ═══════════════════════════════════════════════════════════
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="$SCRIPT_DIR/manifest.xml"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   DocSoThanhChu AI — macOS Installer     ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check manifest exists
if [ ! -f "$MANIFEST" ]; then
  echo "[ERROR] manifest.xml not found at: $MANIFEST"
  exit 1
fi

# Excel for Mac sideload paths (try both M365 and older)
CATALOG_DIRS=(
  "$HOME/Library/Containers/com.microsoft.Excel/Data/Documents/wef"
  "$HOME/Library/Application Support/Microsoft/Office/16.0/Wef"
)

INSTALLED=0
for DIR in "${CATALOG_DIRS[@]}"; do
  if [ -d "$(dirname "$DIR")" ]; then
    mkdir -p "$DIR"
    cp "$MANIFEST" "$DIR/manifest.xml"
    echo "[OK] Manifest copied to: $DIR"
    INSTALLED=1
    break
  fi
done

if [ $INSTALLED -eq 0 ]; then
  echo "[WARN] Could not find Excel for Mac installation."
  echo "   Trying manual sideload path..."
  FALLBACK="$HOME/Library/Containers/com.microsoft.Excel/Data/Documents/wef"
  mkdir -p "$FALLBACK"
  cp "$MANIFEST" "$FALLBACK/manifest.xml"
  echo "[OK] Manifest copied to: $FALLBACK"
fi

echo ""
echo "══════════════════════════════════════════"
echo "  NEXT STEPS:"
echo "  1. npm install && npm run dev   (in this directory)"
echo "     (server phải chạy trước khi dùng add-in)"
echo ""
echo "  2. Mở Excel"
echo "  3. Insert → Add-ins → My Add-ins → Shared Folder"
echo "     → DocSoThanhChu AI → Add"
echo ""
echo "  HOẶC: Excel → Tools → Excel Add-ins → Automation"
echo "        → Chọn manifest.xml thủ công"
echo "══════════════════════════════════════════"
echo ""
