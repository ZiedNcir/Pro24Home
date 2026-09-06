export const ACCOUNT_PENDING_STEPS = [
    { title: 'Informations reçues', description: 'Votre dossier a bien été reçu.', status: 'done' as const },
    { title: 'Vérification en cours', description: 'Nous vérifions vos informations.', status: 'current' as const },
    { title: 'Compte activé', description: 'Vous pourrez commencer à recevoir des missions.', status: 'upcoming' as const },
];

export const getPendingStep = (steps = ACCOUNT_PENDING_STEPS) =>
    steps.findIndex(step => step.status === 'current');
