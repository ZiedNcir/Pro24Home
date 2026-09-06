import type { IconName } from '@components/Icon';

export const SUPPORT_TOPICS: Array<{ key: string; label: string; icon: IconName }> = [
    { key: 'account', label: 'Vérification de mon compte', icon: 'fa-user' },
    { key: 'documents', label: 'Documents', icon: 'fa-file-alt' },
    { key: 'payment', label: 'Paiement', icon: 'fa-credit-card' },
    { key: 'application', label: 'Application', icon: 'fa-cog' },
];

export const isSupportFormValid = (topic: string, message: string) => Boolean(topic && message.trim());
