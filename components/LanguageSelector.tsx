import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { changeLanguage, getAvailableLanguages, getCurrentLanguage } from '../lib/i18n';

interface LanguageSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());
    const availableLanguages = getAvailableLanguages();

    const handleLanguageChange = async (languageCode: string) => {
        try {
            await changeLanguage(languageCode);
            setSelectedLanguage(languageCode);
            onClose();

            // Mostrar confirmación del cambio
            Alert.alert(
                t('common.success'),
                `Idioma cambiado a ${getLanguageName(languageCode)}`,
                [{ text: t('common.confirm') }]
            );
        } catch (error) {
            Alert.alert(
                t('common.error'),
                'Error al cambiar el idioma',
                [{ text: t('common.confirm') }]
            );
        }
    };

    const getLanguageName = (code: string) => {
        const languageNames: { [key: string]: string } = {
            es: 'Español',
            qu: 'Runa Simi (Quechua)',
            ay: 'Aymar Aru (Aymara)',
        };
        return languageNames[code] || code;
    };

    const getLanguageFlag = (code: string) => {
        const flags: { [key: string]: string } = {
            es: '🇪🇸',
            qu: '🏔️',
            ay: '🏔️',
        };
        return flags[code] || '🌐';
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('common.language')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.languageList}>
                        {availableLanguages.map((language) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageItem,
                                    selectedLanguage === language.code && styles.selectedLanguage,
                                ]}
                                onPress={() => handleLanguageChange(language.code)}
                            >
                                <View style={styles.languageInfo}>
                                    <Text style={styles.languageFlag}>
                                        {getLanguageFlag(language.code)}
                                    </Text>
                                    <View style={styles.languageText}>
                                        <Text style={styles.languageName}>
                                            {language.name}
                                        </Text>
                                        <Text style={styles.languageNative}>
                                            {language.nativeName}
                                        </Text>
                                    </View>
                                </View>

                                {selectedLanguage === language.code && (
                                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Selecciona el idioma de tu preferencia
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    languageList: {
        padding: 20,
    },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedLanguage: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    languageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 15,
    },
    languageText: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    languageNative: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
}); 