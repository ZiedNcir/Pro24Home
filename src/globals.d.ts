import { resources } from '@utils/i18n';

export type IDictionary = {
    translation: (typeof resources)['fr']['translation'];
};

declare module 'react-i18next' {
    interface CustomTypeOptions {
        returnNull: false;
        returnEmptyString: false;
        keySeparator: '.';
        resources: IDictionary;
    }
};
