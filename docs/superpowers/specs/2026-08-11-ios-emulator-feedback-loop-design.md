# iOS Emulator Feedback Loop Design

## Goal

Provide an iOS-first development command that starts Metro, launches the Pro24Home app in an available iOS Simulator, and makes it easy to capture the current rendered screen for review while Fast Refresh applies local edits.

## Scope

- Add `npm run dev:ios` for the development loop.
- Add `npm run capture:ios` for simulator screenshots.
- Support an optional `IOS_DEVICE` simulator name or UUID.
- Keep existing Android and iOS commands unchanged.
- Document prerequisites, usage, reload behavior, and screenshot output.

## Design

The workflow uses a small shell helper in `scripts/ios-dev.sh`. It starts Metro in a child process, waits for the Metro port to respond, then invokes the existing React Native iOS launcher. A trap forwards interrupts and removes only the Metro child process started by this command. The launcher delegates the native build/install behavior to `react-native run-ios`, preserving the project’s existing Xcode scheme and CocoaPods setup.

The screenshot helper in `scripts/capture-ios.sh` uses `xcrun simctl io <device> screenshot` and writes timestamped PNG files under `artifacts/ios/`. It resolves `IOS_DEVICE` when supplied, otherwise selects the first booted simulator and explains how to boot one if none is available.

## Error handling

- Fail early when `xcrun` or the React Native CLI is unavailable.
- Fail with an actionable message if no simulator is booted and no device was specified.
- Avoid killing unrelated Metro, Simulator, or Xcode processes.
- Clean up the Metro child process on normal exit or interrupt.

## Verification

- Shell syntax checks for both helpers.
- Package script/config inspection.
- Run the capture helper against a booted simulator when one is available.
- Run the project’s existing lint/test commands if the local environment supports them.
