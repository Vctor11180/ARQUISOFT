import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function RegisterScreen() {
    const { t } = useTranslation();
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState('');

    const router = useRouter();
    const { signUp, session } = useAuth();

    const toucanImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzbyTb59rqOn1Hf4zyOCSN558QRJXjdqKQ0I0P1RE9I9cO4ILh_Gm6KI4N68VSjMWglNWXbMvbBlmEK78MvftwbM71sVuIRIJG3oinvTit3y2itd_LdyGxAGo_ZXZo2mkuGax8IzNQbzA-kvxOSvX74ivzTOmMJRa3mUMm5IixTCjvEOSgakHJ2cWV2CS0Fi7JIrfDQ4asJD750z3v7SnbuI5Jwi80gCLcVhuvc2kLgaat6Pe2zXIeZ3-BvRAFu0RmX_dBOmcr';

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (session) {
            router.replace('./' as any);
        }
    }, [session, router]);

    async function doRegister() {
        setRegError('');
        if (!regName || !regEmail || !regPassword) {
            setRegError(t('register.errors.completeFields'));
            return;
        }

        setRegLoading(true);
        try {
            const { error } = await signUp(regEmail, regPassword, regName);

            if (error) {
                if (error.message.includes('User already registered')) {
                    setRegError(t('register.errors.userExists'));
                } else {
                    setRegError(error.message || t('register.errors.createError'));
                }
            } else {
                Alert.alert(
                    t('register.success.title'),
                    t('register.success.message'),
                    [{ text: 'OK', onPress: () => router.replace('./sesion' as any) }]
                );
            }
        } catch (e: any) {
            setRegError(e.message || t('register.errors.createError'));
        } finally {
            setRegLoading(false);
        }
    }

    return (
        <LinearGradient colors={['#064420', '#42af56']} style={styles.gradient}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.content}>
                    {/* Header with Tucan */}
                    <View style={styles.header}>
                        <View style={styles.toucanContainer}>
                            <Image source={{ uri: toucanImg }} style={styles.toucan} contentFit="contain" />
                        </View>
                        <ThemedText style={styles.welcomeTitle}>{t('register.welcomeTitle')}</ThemedText>
                        <ThemedText style={styles.welcomeSubtitle}>{t('register.welcomeSubtitle')}</ThemedText>
                    </View>

                    {/* Register Form */}
                    <View style={styles.formCard}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={t('register.placeholders.fullName')}
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                value={regName}
                                onChangeText={setRegName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={t('register.placeholders.email')}
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                                value={regEmail}
                                onChangeText={setRegEmail}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={t('register.placeholders.password')}
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                style={styles.input}
                                value={regPassword}
                                onChangeText={setRegPassword}
                            />
                        </View>

                        {regError ? <ThemedText style={styles.error}>{regError}</ThemedText> : null}

                        <Pressable
                            disabled={regLoading}
                            onPress={doRegister}
                            style={({ pressed }) => [styles.registerBtn, pressed && styles.pressed]}
                        >
                            {regLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <ThemedText style={styles.registerBtnText}>{t('register.buttons.register')}</ThemedText>
                            )}
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <ThemedText style={styles.footerText}>{t('register.buttons.switchToLogin')}</ThemedText>
                        <Pressable onPress={() => router.replace('./sesion' as any)}>
                            <ThemedText style={styles.loginLink}>{t('auth.login')}</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    toucanContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    toucan: {
        width: 80,
        height: 80,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    registerBtn: {
        backgroundColor: '#42af56',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#42af56',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    registerBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    error: {
        color: '#dc2626',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        marginRight: 8,
    },
    loginLink: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

