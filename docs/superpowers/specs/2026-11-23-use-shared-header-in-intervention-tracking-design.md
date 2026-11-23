# Use Shared Header in Intervention Tracking

## Intent

Make the professional tracking screen use the same shared header style as other intervention screens while keeping the map full-screen.

## Goals

- Replace the tracking screen's custom top bar with the shared `InterventionHeader`.
- Keep a back action and the existing “Route to the client” title.
- Keep the map full-screen with the header overlaid above it.

## Non-goals and anti-goals

- Do not change navigation controls, route guidance, or trip/status behavior.
- Do not reduce the map's visible area by putting the header in a separate row.

## Constraints

- Reuse `src/shared/ui/navigation/InterventionHeader.tsx` as-is.
- Preserve the current full-bleed tracking map and safe-area behavior.

## Approaches

1. **Overlay the shared header on the map (selected).** Matches the app's header style and preserves the map's full-screen layout.
2. **Place the shared header above the map.** Uses normal page flow but reduces the map area.

The user requested the shared project header. The overlay is the recommended layout to retain the existing map presentation.

## Builder decisions

- Replace `TopBar`, `BackButton`, `TopTitle`, and `MapSpacer` with a positioned wrapper containing `InterventionHeader`.
- Set `showHelp={false}` and use the existing tracking title translation.
- Keep the header above the navigation banner in the existing overlay hierarchy.
