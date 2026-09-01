export const normalizeAddressesResponse = <T>(response: any): T[] => {
    const isAddressRecord = (value: any) => (
        value && typeof value === 'object' && (
            typeof value.address === 'string'
            || typeof value.location_name === 'string'
            || (typeof value.latitude === 'number' && typeof value.longitude === 'number')
        )
    );

    const unwrap = (value: any, depth = 0): T[] | null => {
        if (Array.isArray(value)) {
            return value.length === 0 || value.some(isAddressRecord) ? value : null;
        }

        if (!value || typeof value !== 'object' || depth > 4) {
            return null;
        }

        if (isAddressRecord(value)) {
            return [value];
        }

        const preferredKeys = ['addresses', 'address', 'data', 'result', 'items', 'results'];
        const remainingKeys = Object.keys(value).filter(key => !preferredKeys.includes(key));

        for (const key of [...preferredKeys, ...remainingKeys]) {
            const result = unwrap(value[key], depth + 1);
            if (result) {
                return result;
            }
        }

        return null;
    };

    return unwrap(response) || [];
};
