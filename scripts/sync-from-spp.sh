#!/bin/sh
# spp(웹) 최신본을 가져와 저사양 앱 버전으로 만든다: 웹 파일 복사 → 저사양 패치 → 이미지 축소.
# 사용: scripts/sync-from-spp.sh ../spp   (spp 저장소 경로)
set -e
SRC=${1:-../spp}
rsync -a --exclude=.git --exclude=android --exclude=tests --exclude=README.md --exclude='package*.json' --exclude=capacitor.config.js --exclude=.github --exclude=node_modules --exclude=.qa.js --exclude=.impeccable --exclude=CNAME --exclude=dist --exclude=scripts --exclude=ads.txt --exclude=.gitignore "$SRC"/ ./
python3 scripts/apply-low-spec.py
# 얼굴 사진 최대 768px, assets 최대 1024px: 고밀도 모바일 화면에서도 선명하게 유지
shrink(){ lim=$1; shift; for f in "$@"; do w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}'); h=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}'); if [ "$w" -gt "$lim" ] || [ "$h" -gt "$lim" ]; then sips -Z "$lim" "$f" >/dev/null; fi; done; }
shrink 768 *.png
find assets -name '*.png' | while read -r f; do shrink 1024 "$f"; done
node tests/android-low-spec.test.cjs
