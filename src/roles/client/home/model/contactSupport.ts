import type { IconName } from '@shared/ui/icon';

export const SUPPORT_TOPICS: Array<{ key: string; labelKey: string; icon: IconName }> = [
    { key: 'account', labelKey: 'client.support.subjectAccount', icon: 'fa-user' },
    { key: 'documents', labelKey: 'client.support.subjectDocuments', icon: 'fa-file-alt' },
    { key: 'payment', labelKey: 'client.support.subjectPayment', icon: 'fa-credit-card' },
    { key: 'application', labelKey: 'client.support.subjectApplication', icon: 'fa-cog' },
];

export const isSupportFormValid = (topic: string, message: string) => Boolean(topic && message.trim());
