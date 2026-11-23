# Simplify Intervention Tracking Controls

## Intent

Reduce clutter on the professional intervention tracking map by removing custom controls that currently have no behavior.

## Goals

- Remove the custom layers, recenter, and show-route buttons from the map overlay.
- Keep the working voice-guidance toggle.
- Keep Google Navigation SDK controls and the existing route, trip, and status behavior.

## Non-goals and anti-goals

- Do not add new map-control behavior.
- Do not remove or replace Google Navigation SDK controls.
- Do not change trip status, route guidance, or arrival actions.

## Constraints

- Implement in the existing React Native tracking screen.
- Preserve existing unrelated workspace changes.

## Approaches

1. **Remove only inactive custom controls (selected).** Keep the voice toggle and SDK controls. This removes dead actions while preserving useful controls.
2. **Remove the whole custom control stack.** This is simpler but also removes the working voice toggle.

The user chose approach 1.

## Builder decisions

- Remove the custom button entries and any now-unused styling or imports that are only needed by those entries.
- Leave the SDK's `NavigationView` configuration unchanged.
- No visual redesign beyond the resulting reduction in controls.
