import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

// Nueva paleta unificada
const PRIMARY = '#42af56';
const DARK = '#064420';
const BG_CARD = '#f6f9f7';
const BORDER = '#d9e8dd';
const SLATE600 = '#385442';

const LOGO_URL = 'https://res.cloudinary.com/dsqmynhve/image/upload/v1756544811/IMAGOTIPO_z3lcp9.png';

interface RoleDef { label: string; desc: string; key: string; iconBg: string; icon: string; tipo:number; target:string }
const roles: RoleDef[] = [
  { key: 'pasajero', label: 'Pasajero', desc: 'Viaja y paga fácil', iconBg: '#e3f9ec', icon:'👤', tipo:1, target:'/passenger' },
  { key: 'chofer', label: 'Chofer', desc: 'Registra tus viajes', iconBg: '#e3f9ec', icon:'🚌', tipo:2, target:'/chofer' },
  { key: 'dueno_micro', label: 'Dueño de micro', desc: 'Gestiona tu flota', iconBg: '#e3f9ec', icon:'🚐', tipo:3, target:'/dueno' },
  { key: 'dueno_sindicato', label: 'Sindicato', desc: 'Estadísticas y control', iconBg: '#e3f9ec', icon:'📊', tipo:4, target:'/sindicato' },
];

// Mapeo helper para reutilizar rutas según tipo de usuario
function pathForTipo(tipo?: number) {
  switch (tipo) {
    case 1: return '/passenger';
    case 2: return '/chofer';
    case 3: return '/dueno';
    case 4: return '/sindicato';
    default: return null;
  }
}

export default function TucanLanding() {
  const [activeTab, setActiveTab] = React.useState<'home' | 'more'>('home');
  const router = useRouter();
  const { userProfile, loading, updateUserType } = useAuth();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (redirectedRef.current) return; // evitar múltiples replaces
    if (loading) return;
    if (!userProfile) return; // usuario no autenticado aún

    // Falta info adicional -> ir a info-inicial
    if (!userProfile.telefono || !userProfile.numero_cuenta) {
      redirectedRef.current = true;
      router.replace('/info-inicial');
      return;
    }

    // Ya tiene tipo definido -> saltar landing y enviar directo
    if (userProfile.tipo) {
      const target = pathForTipo(userProfile.tipo);
      if (target) {
        redirectedRef.current = true;
        router.replace(target);
      }
    }
  }, [userProfile, loading, router]);
  return (
    <View style={styles.screen}>      
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>      
        <View style={styles.headerWrapper}>
          <LinearGradient colors={['#064420', PRIMARY]} style={StyleSheet.absoluteFill} />
          <Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit="contain" />
          <View style={styles.heroContent}>            
            <ThemedText type="title" style={styles.heroTitle}>Elige tu perfil</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Movilidad simple y unificada</ThemedText>
          </View>
        </View>

        <View style={styles.rolesContainer}>
      {roles.map(r => (
            <Pressable
              key={r.key}
              style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
              onPress={async () => {
                // Si cambia de tipo, actualizar; luego redirigir al nuevo destino
                if (userProfile?.tipo !== r.tipo) {
                  await updateUserType(r.tipo);
                }
        router.replace(r.target as any);
              }}
            >
              <View style={[styles.iconCircle, { backgroundColor: r.iconBg }]}>
                <ThemedText style={styles.iconEmoji}>{r.icon}</ThemedText>
              </View>
              <View style={styles.roleTexts}>                
                <ThemedText style={styles.roleLabel}>{r.label}</ThemedText>
                <ThemedText style={styles.roleDesc}>{r.desc}</ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>        
        <NavItem label="Home" active={activeTab==='home'} onPress={()=>setActiveTab('home')} />
        <NavItem label="Más" active={activeTab==='more'} onPress={()=>setActiveTab('more')} />
      </View>
    </View>
  );
}

function NavItem({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      <View style={[styles.navIconShell, active && styles.navIconShellActive]} />
      <ThemedText style={[styles.navLabel, active && styles.navLabelActive]}>{label}</ThemedText>
    </Pressable>
  );
}

// Pattern eliminado para un look más limpio

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  headerWrapper: { height: 270, backgroundColor: PRIMARY, overflow: 'hidden', borderBottomLeftRadius:28, borderBottomRightRadius:28, gap:20 },
  heroContent: { position: 'absolute', bottom: 34, left: 0, right: 0, paddingHorizontal: 32, maxWidth: '100%' },
  heroTitle: { color: '#fff', fontSize: 30, lineHeight: 34, fontWeight: '800', letterSpacing:0.6, marginBottom: 14 },
  heroSubtitle: { color:'#dff5e6', fontSize:13, fontWeight:'500', letterSpacing:0.5 },
  logo: { position: 'absolute', top: 25, alignSelf:'center', height: 180, width: 220, opacity: 0.18 },
  rolesContainer: { marginTop: -46, paddingHorizontal: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 18, justifyContent: 'center' },
  roleCard: { width: '44%', aspectRatio: 1, backgroundColor: BG_CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 18, padding: 14, alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor:'#000', shadowOpacity:0.04, shadowRadius:6, elevation:2, marginHorizontal:6, marginBottom:16, marginTop:80 },
  roleCardPressed: { opacity: 0.9, transform: [{ scale: 0.97 }], backgroundColor:'#eef7f0' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, borderWidth:1, borderColor:'#b9dcc5' },
  iconEmoji: { fontSize: 30, textAlign:'center', lineHeight:60 },
  roleTexts: { alignItems: 'center' },
  roleLabel: { fontWeight: '700', fontSize: 15, color: DARK, letterSpacing:0.2 },
  roleDesc: { fontSize: 12, color: SLATE600, textAlign: 'center', lineHeight:16 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#dbe7dd', gap: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconShell: { width: 64, height: 32, borderRadius: 20, backgroundColor: '#d7f2e2' },
  navIconShellActive: { backgroundColor: PRIMARY },
  navLabel: { fontSize: 12, color: '#5b6f63', fontWeight: '500' },
  navLabelActive: { color: DARK, fontWeight: '700' },
  
});
