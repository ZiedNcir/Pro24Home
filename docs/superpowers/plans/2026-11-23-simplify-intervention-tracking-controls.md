# Simplify Intervention Tracking Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the three inactive custom map controls from intervention tracking while preserving voice guidance and Google Navigation SDK controls.

**Architecture:** Make a focused UI cleanup in the existing tracking screen. Keep the custom voice toggle and remove only the custom layers, recenter, and show-route buttons, along with styling that is no longer used.

**Tech Stack:** React Native, TypeScript, styled-components, Google Maps Navigation SDK.

**Spec:** `docs/superpowers/specs/2026-11-23-simplify-intervention-tracking-controls-design.md`

## Global Constraints

- Preserve existing unrelated workspace changes.
- Do not add map-control behavior.
- Do not remove or replace Google Navigation SDK controls.
- Do not change trip status, route guidance, or arrival actions.

## Review Focus

- Voice guidance remains toggleable after the inactive buttons are removed.
- Google Navigation SDK's `NavigationView` configuration remains unchanged.
- Layers, recenter, and show-route controls no longer appear in the custom overlay.
- No handler, icon import, or styled control used only by the removed buttons remains.
- Tracking status actions and route behavior remain untouched.

---

### Task 1: Remove inactive custom tracking controls

**Files:**
- Modify: `src/roles/professional/intervention-tracking/screens/InterventionTrackingScreen.tsx`

**Interfaces:**
- Consumes: Existing `voiceGuidance` state and Google Navigation SDK navigation controller.
- Produces: A tracking map overlay with the working voice toggle only; SDK controls remain supplied by `NavigationView`.

- [x] Remove the custom layers, recenter, and show-route buttons from `MapTools` while keeping the voice toggle and its accessibility label and handler.
- [x] Remove `MapControlButton` properties or styling that are only needed by the removed controls, if no longer used.
- [x] Review the diff to confirm `NavigationView` props and trip/status handlers are unchanged, and that the custom overlay contains only the voice toggle.
