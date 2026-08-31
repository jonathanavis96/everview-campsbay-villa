#!/usr/bin/env bash
# Multiply the full film's soundtrack by a factor, in place. Default 0.5.
#
#   ./scripts/encode-film-audio.sh 0.5
#
# The factor is relative to whatever is in the file NOW, not to the camera
# original — this edits in place, so running it twice compounds. It has been
# run twice on 2026-09-01, at 0.2 and then 0.5, leaving the file at 10% of the
# original; FilmSection.tsx then opens the player at 50% of that, for a
# twentieth overall. Keeping most of the reduction in the file means a visitor
# who drags the slider to maximum still does not get the original blast, which
# a player-only setting cannot promise.
#
# Check the result against the camera original rather than trusting the maths —
# a compounded run is silent and easy to miss:
#   ffmpeg -i <file> -map a:0 -af volumedetect -f null /dev/null
# mean_volume should move by 20*log10(factor) dB.
#
# The video stream is copied, never re-encoded — the AV1/H.264 encodes and
# their measured SSIM stand untouched. Only the AAC track is rebuilt.
set -euo pipefail
cd "$(dirname "$0")/.."

FACTOR="${1:-0.5}"

for f in public/video/everview-film.av1.mp4 public/video/everview-film.h264.mp4; do
  echo "remixing $f at ${FACTOR}x"
  ffmpeg -v error -y -i "$f" \
    -c:v copy -af "volume=$FACTOR" -c:a aac -b:a 128k \
    -movflags +faststart "$f.tmp.mp4"
  mv "$f.tmp.mp4" "$f"
done
echo "done — each track multiplied by $FACTOR"
