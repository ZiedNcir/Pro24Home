# Settings document management — selected option 1

Implement a separate ProfessionalDocumentsManagement route from settings. Preserve the first-upload Documents route. Reuse ScreenContainer, InterventionHeader, Text, Button, SvgIcon and the document type model. Five document rows show actual server status or unknown/missing, with Voir and Remplacer/Ajouter. Narrow layouts place actions beneath names.

Use login user.documents as the source (GET profile is unavailable). Upload through existing POST endpoint, update only the chosen type after acknowledgement, stay on the management screen, preserve prior data on failure. View authenticated downloaded files with the native viewer; never send credentials to document URLs or third-party preview services. Use app cache and clean up previews.

Tasks: implement management view/controller and preview helper; wire dedicated navigation and translations; add focused upload/view/session tests; check TypeScript, lint and onboarding regression tests; capture native preview against selected image. Do not upload real user documents during QA.
