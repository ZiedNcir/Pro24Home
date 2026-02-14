import { resources } from '@utils/i18n';

export type IDictionary = (typeof resources)['fr'];

declare module 'react-i18next' {
    interface CustomTypeOptions {
        returnNull: false;
        returnEmptyString: false;
        keySeparator: '.';
        resources: IDictionary;
    }
};