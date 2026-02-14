// Component-specific theme constants
export const buttonTheme = {
    sizes: {
        small: {
            height: 36,
            paddingHorizontal: 12,
            fontSize: 12,
            iconSize: 14,
        },
        medium: {
            height: 44,
            paddingHorizontal: 16,
            fontSize: 14,
            iconSize: 16,
        },
        large: {
            height: 52,
            paddingHorizontal: 24,
            fontSize: 16,
            iconSize: 18,
        },
    },
    borderRadius: {
        square: 8,
        rounded: 20,
        pill: 999,
    },
} as const;

export const inputTheme = {
    sizes: {
        small: {
            height: 36,
            paddingHorizontal: 12,
            fontSize: 14,
        },
        medium: {
            height: 44,
            paddingHorizontal: 16,
            fontSize: 16,
        },
        large: {
            height: 52,
            paddingHorizontal: 16,
            fontSize: 18,
        },
    },
    borderRadius: {
        square: 8,
        rounded: 12,
    },
} as const;

export const cardTheme = {
    padding: {
        small: 12,
        medium: 16,
        large: 24,
    },
    borderRadius: {
        small: 8,
        medium: 12,
        large: 16,
    },
} as const;

export const modalTheme = {
    borderRadius: 16,
    backdropOpacity: 0.5,
} as const;