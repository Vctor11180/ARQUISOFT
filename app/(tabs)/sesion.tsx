import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// Paleta de marca (coherente con index.tsx)
const BRAND_PRIMARY = '#42af56';
const BRAND_DARK = '#064420';
const BRAND_YELLOW = '#ffd23f';
const BRAND_BG_GLASS = 'rgba(255,255,255,0.10)';

// Imágenes (mismas usadas en index)
const leavesLeft = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi5Hudz9HqNn74JcNFDaC71znohBidf_67i_pP6toPURAwyNziXOUnk-7n18XtAMj4AP-JEEn2F44DmkAESXcEX0Jyb58iBj8mkb0wO9QyAFs5Gec68UTCgEGmK4CGHTL0m5YhLt1fj5sGTKVRp1UkZT1tx6HSuRoofn9HVknFwRkT36cBGcwchldUMBSlv-xNohVvDfFHG_syT7js-tLzr9dcU7dusZ_RaBfsZuAtHerSB-TfUCa46C6pyL4XotOiE-DttP3C';
const leavesRight = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsZkRA4RfxQCu75LonCZyfRSpv_SoxMwzuNc60zc5WwyWpiqHAB5CihIL6kNKQKPsIytnLOtWY64LfKWVTkSVAvmunDiEtlbujjHptn6BZ04Imk13VMv1r9ZyePQBdSUxMUyrIgb5H0myMzTMVcnDAaxW6lbhb6GtuUwcVI_72-UPw0goC7k6AklKW4vpYU0rFbvgDhWoOaEeOS7FEj6n2SH-RQeritEIyLJZROHBHS3oeUPu8GIz9Q1zhlW7oKHAbhshk9Ld2';
const toucanImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzbyTb59rqOn1Hf4zyOCSN558QRJXjdqKQ0I0P1RE9I9cO4ILh_Gm6KI4N68VSjMWglNWXbMvbBlmEK78MvftwbM71sVuIRIJG3oinvTit3y2itd_LdyGxAGo_ZXZo2mkuGax8IzNQbzA-kvxOSvX74ivzTOmMJRa3mUMm5IixTCjvEOSgakHJ2cWV2CS0Fi7JIrfDQ4asJD750z3v7SnbuI5Jwi80gCLcVhuvc2kLgaat6Pe2zXIeZ3-BvRAFu0RmX_dBOmcr';

export default function SesionScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const scaleCTA = useRef(new Animated.Value(1)).current;
  const { signIn, signUp, userProfile } = useAuth();

  const validateBasics = () => {
    if (!email || !password || (mode === 'register' && !name)) {
      Alert.alert('Campos incompletos', 'Completa todos los campos.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'Mínimo 6 caracteres.');
      return false;
    }
    return true;
  };

  const animateCTA = () => {
    Animated.sequence([
      Animated.timing(scaleCTA, { toValue: 0.92, duration: 90, useNativeDriver: true }),
      Animated.spring(scaleCTA, { toValue: 1, useNativeDriver: true })
    ]).start();
  };

  function pathForTipo(tipo?: number) {
    switch (tipo) {
      case 1: return '/passenger';
      case 2: return '/chofer';
      case 3: return '/dueno';
      case 4: return '/sindicato';
      default: return '/landing';
    }
  }

  const doAction = async () => {
    if (!validateBasics()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        // Esperar a que el AuthContext cargue el perfil (pequeño delay)
        setTimeout(()=>{
          const perfil = userProfile; // puede ser null inmediatamente tras login la primera vez
          // Si todavía no está, enviamos al index que ahora autoredirige.
          if (!perfil) {
            router.replace('/');
            return;
          }
          if (!perfil.telefono || !perfil.numero_cuenta) {
            router.replace('/info-inicial');
            return;
          }
            if (perfil.tipo) {
              router.replace(pathForTipo(perfil.tipo) as any);
            } else {
              router.replace('/landing');
            }
        }, 350);
      } else {
        await signUp(email, password, name);
        Alert.alert('Registro exitoso', 'Ahora inicia sesión.');
        setMode('login');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Acción fallida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[BRAND_DARK, BRAND_PRIMARY]} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.safe}>
        {/* Capa decorativa */}
        <View style={styles.decorLayer} pointerEvents="none">
          <Image source={{ uri: leavesLeft }} style={styles.imgLeft} />
          <Image source={{ uri: leavesRight }} style={styles.imgRight} />
        </View>

        <View style={styles.contentWrapper}>
          {/* Ilustración */}
            <View style={styles.illustrationBox}>
              <Image source={{ uri: toucanImg }} style={styles.toucan} contentFit="contain" />
            </View>
            <ThemedText style={styles.heroHeading}>{mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}</ThemedText>
            <ThemedText style={styles.heroParagraph}>
              {mode === 'login'
                ? 'Accede para continuar con tus viajes y pagos NFC.'
                : 'Regístrate para empezar a usar el ecosistema Tucán.'}
            </ThemedText>

            {/* Toggle Login / Register */}
            <View style={styles.modeSwitch}>
              <Pressable onPress={() => setMode('login')} style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}>
                <Text style={[styles.modeBtnText, mode === 'login' && styles.modeBtnTextActive]}>Iniciar Sesión</Text>
              </Pressable>
              <Pressable onPress={() => setMode('register')} style={[styles.modeBtn, mode === 'register' && styles.modeBtnActive]}>
                <Text style={[styles.modeBtnText, mode === 'register' && styles.modeBtnTextActive]}>Registrarme</Text>
              </Pressable>
            </View>

            <View style={styles.formCard}>
              {mode === 'register' && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Nombre completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="correo@dominio.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secure}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setSecure(s => !s)} style={styles.showBtn}>
                    <Text style={styles.showBtnText}>{secure ? 'Ver' : 'Ocultar'}</Text>
                  </Pressable>
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleCTA }] }}>
                <Pressable disabled={loading} onPress={() => { animateCTA(); doAction(); }} style={styles.ctaBtn}>
                  {loading ? (
                    <ActivityIndicator color={BRAND_DARK} />
                  ) : (
                    <Text style={styles.ctaBtnText}>{mode === 'login' ? 'Entrar' : 'Crear Cuenta'}</Text>
                  )}
                </Pressable>
              </Animated.View>

              {mode === 'login' && (
                <Pressable style={styles.altLink} onPress={() => setMode('register')}>
                  <Text style={styles.altLinkText}>¿No tienes cuenta? Regístrate</Text>
                </Pressable>
              )}
              {mode === 'register' && (
                <Pressable style={styles.altLink} onPress={() => setMode('login')}>
                  <Text style={styles.altLinkText}>¿Ya tienes cuenta? Inicia sesión</Text>
                </Pressable>
              )}

              <Text style={styles.helperText}>Tras el registro podrás elegir tu tipo de usuario.</Text>
            </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, justifyContent: 'center' },
  decorLayer: { position: 'absolute', inset: 0 },
  imgLeft: { position: 'absolute', top: 0, left: 0, width: 140, height: 140, opacity: 0.18 },
  imgRight: { position: 'absolute', bottom: '20%', right: 0, width: 130, height: 130, opacity: 0.18 },
  contentWrapper: { paddingHorizontal: 28, alignItems: 'center' },
  illustrationBox: { width: 200, height: 200, marginBottom: 8 },
  toucan: { width: '100%', height: '100%' },
  heroHeading: { color: '#fff', fontSize: 26, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  heroParagraph: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 6, marginBottom: 18, maxWidth: 320 },
  modeSwitch: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 40, padding: 4, marginBottom: 18 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 36, alignItems: 'center' },
  modeBtnActive: { backgroundColor: '#fff' },
  modeBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  modeBtnTextActive: { color: BRAND_DARK },
  formCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 28, padding: 24, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: BRAND_DARK, letterSpacing: 0.4 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: '#e2e8f0', color: '#0f172a' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  showBtn: { marginLeft: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#eef2ff', borderRadius: 12 },
  showBtnText: { fontSize: 12, fontWeight: '600', color: BRAND_DARK },
  ctaBtn: { marginTop: 4, backgroundColor: BRAND_YELLOW, borderRadius: 24, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  ctaBtnText: { color: BRAND_DARK, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  altLink: { marginTop: 14 },
  altLinkText: { textAlign: 'center', fontSize: 13, color: BRAND_PRIMARY, fontWeight: '600' },
  helperText: { marginTop: 18, textAlign: 'center', fontSize: 11, color: '#64748b' }
});