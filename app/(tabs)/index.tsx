import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BRAND_PRIMARY = '#42af56';
const BRAND_DARK = '#064420';
const BRAND_YELLOW = '#ffd23f';

const leavesLeft = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi5Hudz9HqNn74JcNFDaC71znohBidf_67i_pP6toPURAwyNziXOUnk-7n18XtAMj4AP-JEEn2F44DmkAESXcEX0Jyb58iBj8mkb0wO9QyAFs5Gec68UTCgEGmK4CGHTL0m5YhLt1fj5sGTKVRp1UkZT1tx6HSuRoofn9HVknFwRkT36cBGcwchldUMBSlv-xNohVvDfFHG_syT7js-tLzr9dcU7dusZ_RaBfsZuAtHerSB-TfUCa46C6pyL4XotOiE-DttP3C';
const leavesRight = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsZkRA4RfxQCu75LonCZyfRSpv_SoxMwzuNc60zc5WwyWpiqHAB5CihIL6kNKQKPsIytnLOtWY64LfKWVTkSVAvmunEtlbujjHptn6BZ04Imk13VMv1r9ZyePQBdSUxMUyrIgb5H0myMzTMVcnDAaxW6lbhb6GtuUwcVI_72-UPw0goC7k6AklKW4vpYU0rFbvgDhWoOaEeOS7FEj6n2SH-RQeritEIyLJZROHBHS3oeUPu8GIz9Q1zhlW7oKHAbhshk9Ld2';

// Componente de mini tucanes de fondo
const BackgroundToucans = () => (
  <View style={styles.backgroundToucans} pointerEvents="none">
    {/* Mini tucán 1 - Esquina superior izquierda */}
    <View style={[styles.miniToucan, { top: '15%', left: '8%', transform: [{ rotate: '-15deg' }] }]}>
      <Svg width={40} height={40} viewBox="0 0 200 200">
        <Path
          d="M 40 120 Q 40 80 60 60 Q 80 40 120 40 Q 160 40 180 60 Q 200 80 200 120 Q 200 160 180 180 Q 160 200 120 200 Q 80 200 60 180 Q 40 160 40 120"
          fill="rgba(255, 210, 63, 0.15)"
          stroke="rgba(6, 68, 32, 0.2)"
          strokeWidth="1"
        />
        <Path
          d="M 120 60 Q 140 50 160 60 Q 170 70 170 80 Q 170 90 160 100 Q 150 110 140 100 Q 130 90 120 80 Q 120 70 120 60"
          fill="rgba(255, 107, 53, 0.15)"
        />
      </Svg>
    </View>

    {/* Mini tucán 2 - Esquina superior derecha */}
    <View style={[styles.miniToucan, { top: '12%', right: '5%', transform: [{ rotate: '20deg' }] }]}>
      <Svg width={35} height={35} viewBox="0 0 200 200">
        <Path
          d="M 40 120 Q 40 80 60 60 Q 80 40 120 40 Q 160 40 180 60 Q 200 80 200 120 Q 200 160 180 180 Q 160 200 120 200 Q 80 200 60 180 Q 40 160 40 120"
          fill="rgba(66, 175, 86, 0.12)"
          stroke="rgba(6, 68, 32, 0.15)"
          strokeWidth="1"
        />
        <Path
          d="M 120 60 Q 140 50 160 60 Q 170 70 170 80 Q 170 90 160 100 Q 150 110 140 100 Q 130 90 120 80 Q 120 70 120 60"
          fill="rgba(255, 107, 53, 0.12)"
        />
      </Svg>
    </View>

    {/* Mini tucán 3 - Centro izquierda */}
    <View style={[styles.miniToucan, { top: '45%', left: '3%', transform: [{ rotate: '-25deg' }] }]}>
      <Svg width={30} height={30} viewBox="0 0 200 200">
        <Path
          d="M 40 120 Q 40 80 60 60 Q 80 40 120 40 Q 160 40 180 60 Q 200 80 200 120 Q 200 160 180 180 Q 160 200 120 200 Q 80 200 60 180 Q 40 160 40 120"
          fill="rgba(255, 210, 63, 0.1)"
          stroke="rgba(6, 68, 32, 0.1)"
          strokeWidth="1"
        />
      </Svg>
    </View>

    {/* Mini tucán 4 - Centro derecha */}
    <View style={[styles.miniToucan, { top: '55%', right: '2%', transform: [{ rotate: '30deg' }] }]}>
      <Svg width={32} height={32} viewBox="0 0 200 200">
        <Path
          d="M 40 120 Q 40 80 60 60 Q 80 40 120 40 Q 160 40 180 60 Q 200 80 200 120 Q 200 160 180 180 Q 160 200 120 200 Q 80 200 60 180 Q 40 160 40 120"
          fill="rgba(66, 175, 86, 0.08)"
          stroke="rgba(6, 68, 32, 0.08)"
          strokeWidth="1"
        />
      </Svg>
    </View>

    {/* Mini tucán 5 - Abajo izquierda */}
    <View style={[styles.miniToucan, { bottom: '20%', left: '10%', transform: [{ rotate: '-10deg' }] }]}>
      <Svg width={28} height={28} viewBox="0 0 200 200">
        <Path
          d="M 40 120 Q 40 80 60 60 Q 80 40 120 40 Q 160 40 180 60 Q 200 80 200 120 Q 200 160 180 180 Q 160 200 120 200 Q 80 200 60 180 Q 40 160 40 120"
          fill="rgba(255, 210, 63, 0.08)"
          stroke="rgba(6, 68, 32, 0.06)"
          strokeWidth="1"
        />
      </Svg>
    </View>

    {/* Mini tucán 6 - Abajo derecha */}
    <View style={[styles.miniToucan, { bottom: '25%', right: '8%', transform: [{ rotate: '15deg' }] }]}>
      <Svg width={25} height={25} viewBox="0 0 200 200">
        <Path
          d="M 40 120 Q 40 80 60 60 Q 80 40 120 40 Q 160 40 180 60 Q 200 80 200 120 Q 200 160 180 180 Q 160 200 120 200 Q 80 200 60 180 Q 40 160 40 120"
          fill="rgba(66, 175, 86, 0.06)"
          stroke="rgba(6, 68, 32, 0.05)"
          strokeWidth="1"
        />
      </Svg>
    </View>
  </View>
);

export default function TucanScreen() {
  const scheme = useColorScheme();
  const { t, i18n } = useTranslation();
  const [active, setActive] = React.useState<'inicio' | 'beneficios' | 'recargar'>('inicio');
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const [lang, setLang] = React.useState(i18n.language);
  const [imageLoaded, setImageLoaded] = useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const { userProfile, loading } = useAuth();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (redirectedRef.current) return;
    if (loading) return;
    if (!userProfile) return; // no autenticado aún
    // Si falta info adicional -> ir a info-inicial
    if (!userProfile.telefono || !userProfile.numero_cuenta) {
      redirectedRef.current = true;
      router.replace('/info-inicial');
      return;
    }
    // Si ya tiene tipo definido -> saltar a su panel
    if (userProfile.tipo) {
      const path = userProfile.tipo === 1 ? '/passenger'
        : userProfile.tipo === 2 ? '/chofer'
          : userProfile.tipo === 3 ? '/dueno'
            : userProfile.tipo === 4 ? '/sindicato'
              : null;
      if (path) {
        redirectedRef.current = true;
        router.replace(path as any);
      }
    }
  }, [userProfile, loading, router]);

  const onPressCTA = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    setActive('beneficios');
    router.replace("/sesion");
  };

  return (
    <LinearGradient colors={[BRAND_DARK, BRAND_PRIMARY]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        {/* Mini tucanes de fondo */}
        <BackgroundToucans />

        <View style={styles.decorLayer} pointerEvents="none">
          <Image source={{ uri: leavesLeft }} style={styles.imgLeft} />
          <Image source={{ uri: leavesRight }} style={styles.imgRight} />
        </View>

        <View style={styles.header}>
          <View style={{ width: 48 }} />
          <ThemedText type="title" style={styles.headerTitle}>{t('index.title')}</ThemedText>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconBtn} onPress={() => setShowLangMenu(m => !m)}>
              <ThemedText style={styles.iconBtnText}>🌐</ThemedText>
            </Pressable>
            {showLangMenu && (
              <View style={styles.langMenu}>
                <Pressable style={styles.langOption} onPress={() => { i18n.changeLanguage('es'); setLang('es'); setShowLangMenu(false); }}>
                  <ThemedText style={[styles.langOptionTxt, lang === 'es' && styles.langOptionActive]}>Español 🇪🇸</ThemedText>
                </Pressable>
                <Pressable style={styles.langOption} onPress={() => { i18n.changeLanguage('qu'); setLang('qu'); setShowLangMenu(false); }}>
                  <ThemedText style={[styles.langOptionTxt, lang === 'qu' && styles.langOptionActive]}>Quechua 🇵🇪</ThemedText>
                </Pressable>
                <Pressable style={styles.langOption} onPress={() => { i18n.changeLanguage('ay'); setLang('ay'); setShowLangMenu(false); }}>
                  <ThemedText style={[styles.langOptionTxt, lang === 'ay' && styles.langOptionActive]}>Aymara 🇧🇴</ThemedText>
                </Pressable>
                <Pressable style={styles.langOption} onPress={() => { i18n.changeLanguage('gn'); setLang('gn'); setShowLangMenu(false); }}>
                  <ThemedText style={[styles.langOptionTxt, lang === 'gn' && styles.langOptionActive]}>Guaraní 🇵🇾</ThemedText>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.illustrationBox}>
            {!imageLoaded && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BRAND_YELLOW} />
              </View>
            )}
            <Image
              source={require('../../assets/images/logo-tucan.jpg')}
              style={[styles.logo, { opacity: imageLoaded ? 1 : 0 }]}
              contentFit="contain"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Fallback si hay error
            />
          </View>
          <ThemedText style={styles.heroHeading}>{t('index.heroTitle')}</ThemedText>
          <ThemedText style={styles.heroParagraph}>
            {t('index.heroSubtitle')}
          </ThemedText>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable onPress={onPressCTA} style={styles.ctaBtn} android_ripple={{ color: '#00000022', borderless: false }}>
              <ThemedText style={styles.ctaTxt}>{t('index.ctaButton')}</ThemedText>
            </Pressable>
          </Animated.View>

          {/* Opciones rápidas */}
          <View style={styles.optionsRow}>
            <Pressable style={styles.optionPill} onPress={() => router.push('/(tabs)/mapa')}>
              <ThemedText style={styles.optionPillTxt}>{t('index.quickOptions.map')}</ThemedText>
            </Pressable>
            <Pressable style={styles.optionPill} onPress={() => router.push('/(tabs)/landing')}>
              <ThemedText style={styles.optionPillTxt}>{t('index.quickOptions.roles')}</ThemedText>
            </Pressable>
            <Pressable style={styles.optionPill} onPress={() => router.push('/(tabs)/interfazPago')}>
              <ThemedText style={styles.optionPillTxt}>{t('index.quickOptions.nfc')}</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerGlass}>
          <View style={styles.tabsRow}>
            <TabIcon label="Inicio" active={active === 'inicio'} onPress={() => {
              setActive('inicio');
            }} />
            <TabIcon label="Mas sobre tucan" active={active === 'recargar'} onPress={() => {
              setActive('recargar');
              router.push("/infoTucan")
            }} />
          </View>
          <View style={{ height: 20 }} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function TabIcon({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabItem, active && styles.tabItemActive]}>
      <View style={[styles.tabIconCircle, active && styles.tabIconCircleActive]} />
      <ThemedText style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between' },
  decorLayer: { position: 'absolute', inset: 0 },
  imgLeft: { position: 'absolute', top: 0, left: 0, width: 120, height: 120, opacity: 0.2 },
  imgRight: { position: 'absolute', bottom: '25%', right: 0, width: 110, height: 110, opacity: 0.2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20 },
  headerTitle: { textAlign: 'center', flex: 1, color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  headerRight: { position: 'relative' },
  iconBtn: { height: 48, width: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { color: '#fff', fontWeight: '700' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  illustrationBox: { width: 220, height: 220, marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '100%', height: '100%', borderRadius: 20 },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20
  },
  heroHeading: { color: '#fff', fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  heroParagraph: { color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 22, textAlign: 'center', marginBottom: 28, maxWidth: 320 },
  ctaBtn: { minWidth: 160, height: 56, paddingHorizontal: 32, borderRadius: 32, backgroundColor: BRAND_YELLOW, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  langMenu: { position: 'absolute', top: 110, right: 0, backgroundColor: '#fff', borderRadius: 14, padding: 10, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 8, zIndex: 99, minWidth: 150 },
  langOption: { paddingVertical: 8, paddingHorizontal: 16 },
  langOptionTxt: { fontSize: 15, color: '#064420', fontWeight: '600' },
  langOptionActive: { color: '#42af56', fontWeight: '800' },
  ctaTxt: { color: BRAND_DARK, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  optionsRow: { flexDirection: 'row', gap: 10, marginTop: 32 },
  optionPill: { flex: 1, height: 46, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  optionPillTxt: { color: '#fff', fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
  footerGlass: { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(14px)', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 8 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 6 },
  tabItemActive: {},
  tabIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.35)' },
  tabIconCircleActive: { backgroundColor: '#fff' },
  tabLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  tabLabelActive: { color: '#fff' },
  backgroundToucans: { position: 'absolute', inset: 0, zIndex: -1 },
  miniToucan: { position: 'absolute' },
});
