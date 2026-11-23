# Use Shared Header in Intervention Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the professional intervention tracking screen use the shared project header while retaining its full-screen map.

**Architecture:** Replace the screen's custom back/title bar with `InterventionHeader` inside a positioned overlay wrapper. Keep the existing map, navigation banner, and voice control behavior unchanged.

**Tech Stack:** React Native, TypeScript, styled-components.

**Spec:** `docs/superpowers/specs/2026-11-23-use-shared-header-in-intervention-tracking-design.md`

## Global Constraints

- Reuse `src/shared/ui/navigation/InterventionHeader.tsx` as-is.
- Preserve the current full-bleed tracking map and safe-area behavior.
- Do not change navigation controls, route guidance, or trip/status behavior.

## Review Focus

- The shared header keeps a back action and displays the existing tracking title.
- Help is hidden in this header.
- The header overlays the map and does not reduce map height.
- The navigation banner and voice toggle remain visible and unchanged.
- Existing unrelated workspace edits remain untouched.

---

### Task 1: Replace the tracking screen's custom top bar

**Files:**
- Modify: `src/roles/professional/intervention-tracking/screens/InterventionTrackingScreen.tsx`

**Interfaces:**
- Consumes: Existing `navigation`, translation hook, and shared `InterventionHeader` component.
- Produces: A positioned shared header overlay with the tracking title, back action, and no help action.

- [x] Import `InterventionHeader` and render it in an absolute wrapper above the navigation banner, using the existing `professional.tracking.toClient` title and `showHelp={false}`.
- [x] Remove the custom `TopBar`, `BackButton`, `TopTitle`, and `MapSpacer` elements and their styles if no longer used.
- [x] Review the focused diff and run `git diff --check` for the screen; confirm the map, navigation banner, and voice toggle are unchanged.
