import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
const BRAND_PRIMARY = '#42af56';
const BRAND_DARK = '#064420';
const BRAND_YELLOW = '#ffd23f';

const leavesLeft = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi5Hudz9HqNn74JcNFDaC71znohBidf_67i_pP6toPURAwyNziXOUnk-7n18XtAMj4AP-JEEn2F44DmkAESXcEX0Jyb58iBj8mkb0wO9QyAFs5Gec68UTCgEGmK4CGHTL0m5YhLt1fj5sGTKVRp1UkZT1tx6HSuRoofn9HVknFwRkT36cBGcwchldUMBSlv-xNohVvDfFHG_syT7js-tLzr9dcU7dusZ_RaBfsZuAtHerSB-TfUCa46C6pyL4XotOiE-DttP3C';
const leavesRight = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsZkRA4RfxQCu75LonCZyfRSpv_SoxMwzuNc60zc5WwyWpiqHAB5CihIL6kNKQKPsIytnLOtWY64LfKWVTkSVAvmunDiEtlbujjHptn6BZ04Imk13VMv1r9ZyePQBdSUxMUyrIgb5H0myMzTMVcnDAaxW6lbhb6GtuUwcVI_72-UPw0goC7k6AklKW4vpYU0rFbvgDhWoOaEeOS7FEj6n2SH-RQeritEIyLJZROHBHS3oeUPu8GIz9Q1zhlW7oKHAbhshk9Ld2';
const toucanImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzbyTb59rqOn1Hf4zyOCSN558QRJXjdqKQ0I0P1RE9I9cO4ILh_Gm6KI4N68VSjMWglNWXbMvbBlmEK78MvftwbM71sVuIRIJG3oinvTit3y2itd_LdyGxAGo_ZXZo2mkuGax8IzNQbzA-kvxOSvX74ivzTOmMJRa3mUMm5IixTCjvEOSgakHJ2cWV2CS0Fi7JIrfDQ4asJD750z3v7SnbuI5Jwi80gCLcVhuvc2kLgaat6Pe2zXIeZ3-BvRAFu0RmX_dBOmcr';

export default function TucanScreen() {
  const scheme = useColorScheme();
  const [active, setActive] = React.useState<'inicio' | 'beneficios' | 'recargar'>('inicio');
  const scale = React.useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const onPressCTA = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient colors={[BRAND_DARK, BRAND_PRIMARY]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.decorLayer} pointerEvents="none">
          <Image source={{ uri: leavesLeft }} style={styles.imgLeft} />
          <Image source={{ uri: leavesRight }} style={styles.imgRight} />
        </View>

        <View style={styles.header}> 
          <View style={{ width: 48 }} />
          <ThemedText type="title" style={styles.headerTitle}>Tucan</ThemedText>
          <Pressable style={styles.iconBtn}>
            <ThemedText style={styles.iconBtnText}>?</ThemedText>
          </Pressable>
        </View>

        <View style={styles.main}>
          <View style={styles.illustrationBox}>
            <Image source={{ uri: toucanImg }} style={styles.toucan} contentFit="contain" />
          </View>
          <ThemedText style={styles.heroHeading}>¡Paga al toque con Tucan!</ThemedText>
          <ThemedText style={styles.heroParagraph}>
            Usa tu cel o tu wearable para pagar sin contacto. Rápido, fácil y seguro.
          </ThemedText>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable onPress={onPressCTA} style={styles.ctaBtn} android_ripple={{ color: '#00000022', borderless: false }}>
              <ThemedText style={styles.ctaTxt}>Descubre más</ThemedText>
            </Pressable>
          </Animated.View>

          {/* Opciones rápidas */}
          <View style={styles.optionsRow}>
            <Pressable style={styles.optionPill} onPress={() => router.push('/(tabs)/mapa')}>
              <ThemedText style={styles.optionPillTxt}>🗺️ Mapa</ThemedText>
            </Pressable>
            <Pressable style={styles.optionPill} onPress={() => router.push('/(tabs)/landing')}>
              <ThemedText style={styles.optionPillTxt}>🚀 Roles</ThemedText>
            </Pressable>
            <Pressable style={styles.optionPill} onPress={() => router.push('/(tabs)/interfazPago')}>
              <ThemedText style={styles.optionPillTxt}>💳 Pago NFC</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerGlass}>
          <View style={styles.tabsRow}>
            <TabIcon label="Inicio" active={active==='inicio'} onPress={()=>setActive('inicio')} />
            <TabIcon label="Comenzar" active={active==='beneficios'} onPress={()=>{setActive('beneficios');
              router.push("/landing")
             } } />
            <TabIcon label="Mas sobre tucan" active={active==='recargar'} onPress={()=>{setActive('recargar');
                            router.push("/infoTucan")                

            } } />
          </View>
          <View style={{ height: 20 }} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function TabIcon({ label, active, onPress }: { label: string; active: boolean; onPress: ()=>void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabItem, active && styles.tabItemActive]}>
      <View style={[styles.tabIconCircle, active && styles.tabIconCircleActive]} />
      <ThemedText style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

function OptionPill({ label }: { label: string }) {
  return (
    <View style={styles.optionPill}>
      <ThemedText style={styles.optionPillTxt}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between' },
  decorLayer: { position: 'absolute', inset: 0 },
  imgLeft: { position: 'absolute', top: 0, left: 0, width: 120, height: 120, opacity: 0.2 },
  imgRight: { position: 'absolute', bottom: '25%', right: 0, width: 110, height: 110, opacity: 0.2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  headerTitle: { textAlign: 'center', flex: 1, color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  iconBtn: { height: 48, width: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { color: '#fff', fontWeight: '700' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  illustrationBox: { width: 220, height: 220, marginBottom: 24 },
  toucan: { width: '100%', height: '100%' },
  heroHeading: { color: '#fff', fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  heroParagraph: { color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 22, textAlign: 'center', marginBottom: 28, maxWidth: 320 },
  ctaBtn: { minWidth: 160, height: 56, paddingHorizontal: 32, borderRadius: 32, backgroundColor: BRAND_YELLOW, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  ctaTxt: { color: BRAND_DARK, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  optionsRow: { flexDirection: 'row', gap: 10, marginTop: 32 },
  optionPill: { flex:1, height:46, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 28, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(255,255,255,0.4)' },
  optionPillTxt: { color: '#fff', fontSize: 13, fontWeight:'600', letterSpacing:0.2 },
  footerGlass: { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(14px)', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 8 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 6 },
  tabItemActive: {},
  tabIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.35)' },
  tabIconCircleActive: { backgroundColor: '#fff' },
  tabLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  tabLabelActive: { color: '#fff' },
});
