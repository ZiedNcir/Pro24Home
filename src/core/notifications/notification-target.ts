const parseInterventionId = (value: unknown): number | undefined => {
    if (typeof value !== 'number' && typeof value !== 'string') return undefined;
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : undefined;
};

export const getNotificationInterventionId = (message: unknown): number | undefined => {
    if (!message || typeof message !== 'object') return undefined;
    const notification = message as { intervention_id?: unknown; data?: unknown };
    const directId = parseInterventionId(notification.intervention_id);
    if (directId !== undefined) return directId;
    let data = notification.data;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { return undefined; }
    }
    if (!data || typeof data !== 'object') return undefined;
    return parseInterventionId((data as { intervention_id?: unknown }).intervention_id);
};
