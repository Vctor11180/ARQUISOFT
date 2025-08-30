import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const PRIMARY = '#42af56';
const DARK = '#064420';

// Ruta ficticia (coordenadas aproximadas de una ciudad cualquiera)
const RUTA_FICTICIA = [
  { latitude: -17.7805, longitude: -63.1821 },
  { latitude: -17.7812, longitude: -63.1800 },
  { latitude: -17.7820, longitude: -63.1778 },
  { latitude: -17.7835, longitude: -63.1760 },
  { latitude: -17.7850, longitude: -63.1752 },
  { latitude: -17.7864, longitude: -63.1739 },
  { latitude: -17.7872, longitude: -63.1715 },
  { latitude: -17.7880, longitude: -63.1692 }
];

export default function MapaRuta() {
  const spinAnim = useRef(new Animated.Value(0)).current; // 0 -> 1
  const scaleBus = useRef(new Animated.Value(0)).current; // aparece
  const fadeBus = useRef(new Animated.Value(1)).current; // se desvanece al terminar
  const fadeCheck = useRef(new Animated.Value(0)).current; // aparece check
  const [done, setDone] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(()=>{
    // Secuencia: 1) Aparece micro 2) Gira 3) Se desvanece y aparece check
    Animated.sequence([
      Animated.spring(scaleBus,{ toValue:1, useNativeDriver:true, friction:6, tension:120 }),
      Animated.timing(spinAnim,{ toValue:1, duration:1400, easing:Easing.inOut(Easing.ease), useNativeDriver:true }),
      Animated.parallel([
        Animated.timing(fadeBus,{ toValue:0, duration:350, useNativeDriver:true }),
        Animated.timing(fadeCheck,{ toValue:1, delay:120, duration:450, useNativeDriver:true })
      ])
    ]).start(()=> setDone(true));
  },[spinAnim, scaleBus, fadeBus, fadeCheck]);

  const rotate = spinAnim.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] });

  const initialRegion = {
    latitude: RUTA_FICTICIA[0].latitude,
    longitude: RUTA_FICTICIA[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={[DARK, PRIMARY]} style={styles.header}>
        <ThemedText style={styles.title}>Ruta del micro</ThemedText>
        <ThemedText style={styles.subtitle}>Animación + trazado ficticio</ThemedText>
        <View style={styles.animWrapper}>
          <Animated.View style={[styles.circle, { transform:[{ scale: scaleBus }, { rotate }], opacity: fadeBus }]}> 
            <IconSymbol name="bus" size={46} color="#ffffff" />
          </Animated.View>
          <Animated.View style={[styles.circleCheck, { opacity: fadeCheck, position:'absolute' }]}> 
            <IconSymbol name="checkmark.circle.fill" size={70} color={PRIMARY} />
          </Animated.View>
        </View>
      </LinearGradient>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onMapReady={() => {
            console.log('✅ MapaRuta: onMapReady disparado');
            setMapReady(true);
          }}
          onError={(error) => {
            console.error('❌ MapaRuta Error:', error);
          }}
          showsCompass={true}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsBuildings={false}
          showsTraffic={false}
        >
          <Polyline
            coordinates={RUTA_FICTICIA}
            strokeColor={PRIMARY}
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
          />
          <Marker coordinate={RUTA_FICTICIA[0]} title="Inicio" description="Punto de partida" />
          <Marker coordinate={RUTA_FICTICIA[RUTA_FICTICIA.length-1]} title="Destino" description="Fin de la ruta" />
          <Marker coordinate={RUTA_FICTICIA[Math.min(3, RUTA_FICTICIA.length-1)]}>
            <View style={styles.liveMarker}>
              <IconSymbol name={done ? 'checkmark.circle.fill':'bus'} size={done ? 34 : 28} color={done ? PRIMARY : '#ffffff'} />
            </View>
          </Marker>
        </MapView>
        
        {!mapReady && (
          <View style={styles.mapLoadingOverlay} pointerEvents="none">
            <ThemedText style={styles.mapLoadingText}>Cargando mapa...</ThemedText>
            <ThemedText style={styles.mapLoadingSub}>
              {mapReady ? 'Mapa listo ✅' : 'Inicializando react-native-maps...'}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#ffffff' },
  header:{ paddingTop:70, paddingBottom:24, paddingHorizontal:24, borderBottomLeftRadius:34, borderBottomRightRadius:34 },
  title:{ color:'#fff', fontSize:26, fontWeight:'800', letterSpacing:-0.5 },
  subtitle:{ color:'rgba(255,255,255,0.85)', fontSize:13, marginTop:4 },
  animWrapper:{ marginTop:22, height:120, alignItems:'center', justifyContent:'center' },
  circle:{ width:120, height:120, borderRadius:60, backgroundColor:'rgba(255,255,255,0.25)', alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:'rgba(255,255,255,0.35)' },
  circleCheck:{ width:120, height:120, borderRadius:60, backgroundColor:'#ffffff', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.15, shadowRadius:14, elevation:5 },
  mapContainer:{ flex:1, marginTop:-10 },
  map:{ ...StyleSheet.absoluteFillObject },
  mapLoadingOverlay:{ position:'absolute', top:0, left:0, right:0, bottom:0, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(255,255,255,0.85)', padding:20 },
  mapLoadingText:{ fontSize:16, fontWeight:'700', color:'#334155', textAlign:'center' },
  mapLoadingSub:{ fontSize:11, color:'#64748b', marginTop:6, textAlign:'center' },
  liveMarker:{ backgroundColor:'rgba(66,175,86,0.9)', padding:6, borderRadius:22, borderWidth:2, borderColor:'#ffffff', shadowColor:'#000', shadowOpacity:0.25, shadowRadius:6, ...Platform.select({ android:{ elevation:6 }}) }
});
