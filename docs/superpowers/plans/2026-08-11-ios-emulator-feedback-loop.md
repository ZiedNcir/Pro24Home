# iOS Emulator Feedback Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an iOS-first command workflow that starts Metro, launches the app in an iOS Simulator, and captures screenshots for visual review.

**Architecture:** Keep orchestration in two small POSIX shell helpers. The development helper owns only the Metro process it starts and delegates app build/launch to `npx react-native run-ios`; the capture helper delegates simulator screenshots to `xcrun simctl`. NPM scripts expose both helpers without changing existing commands.

**Tech Stack:** React Native 0.83.1, npm scripts, POSIX shell, Xcode `xcrun simctl`.

## Global Constraints

- The workflow is iOS-first.
- Existing `android`, `ios`, `start`, `lint`, and `test` scripts remain available.
- No new runtime dependency is added.
- The workflow must not terminate unrelated development processes.
- Screenshot output is written under `artifacts/ios/`.

---

### Task 1: Add the iOS development launcher

**Files:**
- Create: `scripts/ios-dev.sh`
- Modify: `package.json:scripts`

**Interfaces:**
- Consumes: optional `IOS_DEVICE`; project root; local React Native CLI.
- Produces: `npm run dev:ios` command that starts Metro, waits for port 8081, and runs the iOS app.

- [ ] **Step 1: Create the helper with strict shell behavior and cleanup.**

  The helper must use `set -euo pipefail`, derive the project root from its own location, start `npx react-native start --port 8081` in the background, retain its PID, and trap `EXIT INT TERM` to terminate only that PID.

- [ ] **Step 2: Add a bounded Metro readiness check.**

  Poll `http://127.0.0.1:8081/status` for at most 30 seconds using `curl`, then exit with a message naming the Metro URL if readiness fails.

- [ ] **Step 3: Launch React Native with optional simulator selection.**

  Run `npx react-native run-ios --simulator "$IOS_DEVICE"` when `IOS_DEVICE` is set; otherwise run `npx react-native run-ios`.

- [ ] **Step 4: Expose the helper through npm.**

  Add `"dev:ios": "bash scripts/ios-dev.sh"` to `package.json` without removing existing scripts.

- [ ] **Step 5: Check shell syntax and package JSON.**

  Run `bash -n scripts/ios-dev.sh` and `node -e "JSON.parse(require('fs').readFileSync('package.json'))"`; expect both to succeed.

### Task 2: Add iOS simulator screenshot capture

**Files:**
- Create: `scripts/capture-ios.sh`
- Modify: `package.json:scripts`

**Interfaces:**
- Consumes: optional `IOS_DEVICE`; `xcrun simctl`; current simulator state.
- Produces: timestamped PNG at `artifacts/ios/YYYYMMDD-HHMMSS.png` via `npm run capture:ios`.

- [ ] **Step 1: Resolve the simulator device.**

  If `IOS_DEVICE` is set, use it directly. Otherwise query `xcrun simctl list devices | awk` for the first device whose state is `Booted`; if none exists, exit with the exact remedy `Boot a simulator in Xcode or set IOS_DEVICE to a simulator name/UUID.`

- [ ] **Step 2: Capture to a project-local artifact directory.**

  Create `artifacts/ios` with `mkdir -p`, construct a timestamped `.png` path, and run `xcrun simctl io "$device" screenshot "$output"`.

- [ ] **Step 3: Expose and validate the script.**

  Add `"capture:ios": "bash scripts/capture-ios.sh"` to `package.json`, run `bash -n scripts/capture-ios.sh`, and verify the command gives an actionable no-booted-device message when no simulator is running.

### Task 3: Document the feedback loop

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the `dev:ios` and `capture:ios` commands from Tasks 1 and 2.
- Produces: copy-pasteable iOS setup and daily workflow documentation.

- [ ] **Step 1: Add an iOS-first quick start section.**

  Document Xcode/CocoaPods prerequisites, `npm install`, `bundle exec pod install`, `npm run dev:ios`, and optional `IOS_DEVICE="iPhone 16" npm run dev:ios`.

- [ ] **Step 2: Explain edit and capture behavior.**

  State that saved JavaScript/TypeScript edits appear through Fast Refresh, full reload is available from the Simulator menu/keyboard, and `npm run capture:ios` writes the screenshot path under `artifacts/ios/`.

- [ ] **Step 3: Add troubleshooting for simulator selection and Metro.**

  Include the no-booted-simulator remedy and the Metro readiness failure remedy without changing the generated React Native getting-started content unnecessarily.

### Task 4: Verify the integrated workflow

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: scripts and README from Tasks 1–3.
- Produces: evidence that the helpers parse, npm scripts resolve, and the project checks remain healthy.

- [ ] **Step 1: Run static checks.**

  Run `bash -n scripts/ios-dev.sh scripts/capture-ios.sh`, `npm run lint`, and `npm test -- --runInBand`; record any pre-existing environment failures separately.

- [ ] **Step 2: Run simulator capture when possible.**

  If `xcrun simctl` reports a booted simulator, run `npm run capture:ios` and confirm a PNG exists in `artifacts/ios/`; otherwise verify the documented actionable error.

- [ ] **Step 3: Review the diff.**

  Run `git diff --check` and inspect the final diff to ensure only the intended scripts, package scripts, documentation, and plan/spec files changed.
