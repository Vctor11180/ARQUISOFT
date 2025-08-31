declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof import('../locales/es.json');
        };
    }
}

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof import('../locales/es.json');
        };
    }
} 