export const ACCOUNT_PENDING_STEPS = [
    { titleKey: 'client.pending.receivedTitle', descriptionKey: 'client.pending.receivedDescription', status: 'done' as const },
    { titleKey: 'client.pending.verifyingTitle', descriptionKey: 'client.pending.verifyingDescription', status: 'current' as const },
    { titleKey: 'client.pending.activatedTitle', descriptionKey: 'client.pending.activatedDescription', status: 'upcoming' as const },
];

export const getPendingStep = (steps = ACCOUNT_PENDING_STEPS) =>
    steps.findIndex(step => step.status === 'current');
