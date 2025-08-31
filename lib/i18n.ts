import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar archivos de traducción
import ay from '../locales/ay.json';
import es from '../locales/es.json';
import gn from '../locales/gn.json';
import qu from '../locales/qu.json';

const resources = {
    es: {
        translation: es,
    },
    qu: {
        translation: qu,
    },
    ay: {
        translation: ay,
    },
    gn: {
        translation: gn,
    },
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            // Intentar obtener el idioma guardado en AsyncStorage
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                return callback(savedLanguage);
            }

            // Si no hay idioma guardado, usar español por defecto
            return callback('es');
        } catch (error) {
            console.log('Error detecting language:', error);
            return callback('es');
        }
    },
    init: () => { },
    cacheUserLanguage: async (lng: string) => {
        try {
            await AsyncStorage.setItem('user-language', lng);
        } catch (error) {
            console.log('Error saving language:', error);
        }
    },
};

i18n
    .use(LANGUAGE_DETECTOR)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        debug: __DEV__,

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    });

export default i18n;

// Función para cambiar el idioma
export const changeLanguage = async (language: string) => {
    try {
        await i18n.changeLanguage(language);
        await AsyncStorage.setItem('user-language', language);
    } catch (error) {
        console.log('Error changing language:', error);
    }
};

// Función para obtener el idioma actual
export const getCurrentLanguage = () => {
    return i18n.language;
};

// Función para obtener el nombre del idioma en español
export const getLanguageName = (code: string) => {
    const languageNames: { [key: string]: string } = {
        es: 'Español',
        qu: 'Runa Simi (Quechua)',
        ay: 'Aymar Aru (Aymara)',
        gn: 'Avañe\'ẽ (Guaraní)',
    };
    return languageNames[code] || code;
};

// Función para obtener todos los idiomas disponibles
export const getAvailableLanguages = () => {
    return [
        { code: 'es', name: 'Español', nativeName: 'Español' },
        { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi' },
        { code: 'ay', name: 'Aymara', nativeName: 'Aymar Aru' },
        { code: 'gn', name: 'Guaraní', nativeName: 'Avañe\'ẽ' },
    ];
}; 