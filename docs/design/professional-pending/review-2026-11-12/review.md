# Pending professional account — simulator refinement

Refinement of the previously selected option 2 using the existing native screen, logo, illustration, Text, Button, SvgIcon, theme and ScreenContainer.

1. Summary: inspected on iOS 17.4, light theme, English. Reduced illustration height from 170 to 125, made description smaller, grouped the three steps and emphasized the current review step. The existing 404 reconnection guidance now uses neutral text; other errors remain red. Summary capture: summary.png.
2. Documents: scrolled to the bottom and back. All five document names and unknown statuses are readable, with the existing ghost button for sign-out below the list. Status text wraps below its document name. Capture: documents.png.

The development error overlay was dismissed for capture; no errors were suppressed in production code. The profile endpoint still returns 404, so the existing sign-in fallback remains. Account data, status inference, logout and routing logic were not changed.

Validation: TypeScript, targeted ESLint, diff whitespace checks and 22 tests across professionalPendingNavigation, professionalSignIn and professionalOnboardingScenarios passed.

Limits: only this iOS/light/English viewport was visually reviewed. Android, dark theme, French wrapping, enlarged system text and VoiceOver were not exercised. No claim of complete accessibility or pixel-exact matching to the earlier generated mockup.
