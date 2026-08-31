#!/usr/bin/env bash
# Re-mix the full film's soundtrack at 20% of the original level, in place.
#
# Jonathan asked for a tenth of the original volume overall (2026-09-01), taken
# in two halves: 20% baked into the file here, and the player opening at 50% of
# that in FilmSection.tsx. Halving it in the file means a visitor who drags the
# slider to maximum still does not get the original blast, which a player-only
# setting cannot promise.
#
# The video stream is copied, never re-encoded — the AV1/H.264 encodes and
# their measured SSIM stand untouched. Only the AAC track is rebuilt.
set -euo pipefail
cd "$(dirname "$0")/.."

for f in public/video/everview-film.av1.mp4 public/video/everview-film.h264.mp4; do
  echo "remixing $f"
  ffmpeg -v error -y -i "$f" \
    -c:v copy -af "volume=0.2" -c:a aac -b:a 128k \
    -movflags +faststart "$f.tmp.mp4"
  mv "$f.tmp.mp4" "$f"
done
echo "done — the film is now at 20% of the original mix"
