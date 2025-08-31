import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

/**
 * Pantalla de captura de datos adicionales para el usuario en su primer inicio de sesión.
 * Solicita: teléfono y número de cuenta.
 * Tras guardar, navega a /landing para que elija su tipo (si aún no lo hizo).
 *
 * NOTA: Asegúrate de que en la tabla "Usuarios" existan las columnas:
 *   - telefono (text / varchar)
 *   - numero_cuenta (text / varchar)
 * Si usan otros nombres, ajusta las claves del update.
 */
export default function InfoInicialScreen() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [telefono, setTelefono] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si ya tuviera estos datos podríamos redirigir directamente.
  // (Descomenta si luego amplías el UserProfile con estos campos almacenados en AsyncStorage)
  // useEffect(() => {
  //   if (userProfile && (userProfile as any).telefono && (userProfile as any).numero_cuenta) {
  //     router.replace('/landing');
  //   }
  // }, [userProfile]);

  const validar = () => {
    if (!telefono.trim() || !numeroCuenta.trim()) {
      return t('infoInicial.validation.completeFields');
    }
    if (!/^\+?\d{7,15}$/.test(telefono.trim())) {
      return t('infoInicial.validation.invalidPhone');
    }
    if (numeroCuenta.trim().length < 4) {
      return t('infoInicial.validation.shortAccount');
    }
    return null;
  };

  const onGuardar = async () => {
    setError(null);
    const v = validar();
    if (v) {
      setError(v);
      return;
    }
    if (!userProfile) {
      setError(t('infoInicial.validation.noUser'));
      return;
    }
    try {
      setLoading(true);
      const { error: upErr } = await supabase
        .from('Usuarios')
        .update({ telefono: telefono.trim(), numero_cuenta: numeroCuenta.trim() })
        .eq('id', userProfile.id);
      if (upErr) {
        setError(upErr.message);
        return;
      }
      // Opcional: podrías actualizar el cache local si luego amplías el perfil en AuthContext
      Alert.alert(t('infoInicial.success.title'), t('infoInicial.success.message'));
      router.replace('/landing');
    } catch (e: any) {
      setError(e.message || t('infoInicial.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>{t('infoInicial.title')}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('infoInicial.subtitle')}</ThemedText>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>{t('infoInicial.phone')}</ThemedText>
          <TextInput
            placeholder={t('infoInicial.phonePlaceholder')}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#789"
          />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>{t('infoInicial.ciNumber')}</ThemedText>
          <TextInput
            placeholder={t('infoInicial.ciPlaceholder')}
            value={numeroCuenta}
            onChangeText={setNumeroCuenta}
            keyboardType="number-pad"
            style={styles.input}
            placeholderTextColor="#789"
          />
        </View>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onGuardar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Guardar y continuar</ThemedText>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f3f8f5', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, gap: 18, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: -6 },
  subtitle: { fontSize: 13, color: '#567', letterSpacing: 0.3 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#244a34' },
  input: { backgroundColor: '#f0f5f2', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, fontSize: 15, color: '#123', borderWidth: 1, borderColor: '#d5e5db' },
  button: { backgroundColor: '#42af56', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  error: { color: '#c0392b', fontSize: 13, fontWeight: '600' }
});
