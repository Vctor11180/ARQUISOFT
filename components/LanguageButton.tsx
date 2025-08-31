import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCurrentLanguage, getLanguageName } from '../lib/i18n';
import LanguageSelector from './LanguageSelector';

interface LanguageButtonProps {
    compact?: boolean;
    style?: any;
}

export default function LanguageButton({ compact = false, style }: LanguageButtonProps) {
    const { t } = useTranslation();
    const [showSelector, setShowSelector] = useState(false);
    const currentLanguage = getCurrentLanguage();

    const getLanguageFlag = (code: string) => {
        const flags: { [key: string]: string } = {
            es: '🇪🇸',
            qu: '🏔️',
            ay: '🏔️',
        };
        return flags[code] || '🌐';
    };

    if (compact) {
        return (
            <>
                <TouchableOpacity
                    style={[styles.compactButton, style]}
                    onPress={() => setShowSelector(true)}
                >
                    <Text style={styles.compactFlag}>
                        {getLanguageFlag(currentLanguage)}
                    </Text>
                </TouchableOpacity>

                <LanguageSelector
                    visible={showSelector}
                    onClose={() => setShowSelector(false)}
                />
            </>
        );
    }

    return (
        <>
            <TouchableOpacity
                style={[styles.button, style]}
                onPress={() => setShowSelector(true)}
            >
                <View style={styles.buttonContent}>
                    <Text style={styles.flag}>
                        {getLanguageFlag(currentLanguage)}
                    </Text>
                    <Text style={styles.languageText}>
                        {getLanguageName(currentLanguage)}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                </View>
            </TouchableOpacity>

            <LanguageSelector
                visible={showSelector}
                onClose={() => setShowSelector(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        fontSize: 18,
        marginRight: 8,
    },
    languageText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginRight: 4,
    },
    compactButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    compactFlag: {
        fontSize: 20,
    },
}); 