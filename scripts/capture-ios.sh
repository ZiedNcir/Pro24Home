#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v xcrun >/dev/null 2>&1; then
  echo "xcrun is required. Install Xcode and its command line tools." >&2
  exit 1
fi

device="${IOS_DEVICE:iPhone Xs}"
if [[ -z "$device" ]]; then
  devices="$(xcrun simctl list devices available 2>/dev/null || true)"
  device="$(printf '%s\n' "$devices" | awk -F'[()]' '$0 ~ /\(Booted\)/ { print $2; exit }')"
fi

if [[ -z "$device" ]]; then
  echo "No booted iOS Simulator was found. Boot a simulator in Xcode or set IOS_DEVICE to a simulator name/UUID." >&2
  exit 1
fi

output_dir="$PROJECT_ROOT/artifacts/ios"
mkdir -p "$output_dir"
output="$output_dir/$(date +%Y%m%d-%H%M%S).png"
latest="$output_dir/latest.png"

xcrun simctl io "$device" screenshot "$output"
cp "$output" "$latest"
echo "Saved iOS Simulator screenshot to $output"
echo "Updated latest review image at $latest"
