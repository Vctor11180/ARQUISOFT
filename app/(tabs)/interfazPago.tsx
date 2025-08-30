import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import MapaRuta from './mapa';

// Colores base (consistentes con la app)
const PRIMARY = '#42af56';
const DARK = '#064420';
const BG = '#f6f9f7';

type FlowState = 'idle' | 'scanning' | 'processing' | 'success';

export default function InterfazPago() {
	const [state, setState] = useState<FlowState>('idle');
	const [monto, setMonto] = useState<number | null>(null);
	const pulse = useRef(new Animated.Value(1)).current;
	const rotate = useRef(new Animated.Value(0)).current;
	const progress = useRef(new Animated.Value(0)).current;

	// Pulso para círculo NFC en scanning
	useEffect(()=>{
		if(state === 'scanning') {
			const loop = Animated.loop(
				Animated.sequence([
					Animated.timing(pulse,{ toValue:1.12, duration:900, useNativeDriver:true }),
					Animated.timing(pulse,{ toValue:1.0, duration:900, useNativeDriver:true })
				])
			);
			loop.start();
			return ()=>loop.stop();
		}
	},[state,pulse]);

	// Rotación para procesamiento
	useEffect(()=>{
		if(state === 'processing') {
			const spin = Animated.loop(
				Animated.timing(rotate,{ toValue:1, duration:1400, easing:Easing.linear, useNativeDriver:true })
			);
			spin.start();
			return ()=>spin.stop();
		} else {
			rotate.stopAnimation();
			rotate.setValue(0);
		}
	},[state,rotate]);

	// Simular avance de barra en processing
	useEffect(()=>{
		if(state === 'processing') {
			progress.setValue(0);
			Animated.timing(progress,{ toValue:1, duration:1800, easing:Easing.inOut(Easing.ease), useNativeDriver:false }).start(({ finished })=>{
				if(finished) {
					// Simular resultado y monto
						const fakeAmount = Number((Math.random()*5 + 1).toFixed(2));
						setMonto(fakeAmount);
						setState('success');
				}
			});
		}
	},[state,progress]);

	const startFlow = () => {
		setMonto(null);
		setState('scanning');
		// Luego de detectar (simulado) pasa a processing
		setTimeout(()=> setState('processing'), 1800);
	};

	const reset = () => {
		setMonto(null); setState('idle');
	};

	const spinInterpolate = rotate.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] });
	const progressWidth = progress.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });

	return (
		<View style={styles.root}>
			{state !== 'success' && (
				<LinearGradient colors={[DARK, PRIMARY]} style={styles.header}>
					<ThemedText style={styles.title}>Pago NFC</ThemedText>
					<ThemedText style={styles.subtitle}>Simulación de abordaje y débito</ThemedText>
				</LinearGradient>
			)}
			{state !== 'success' && (
				<View style={styles.content}>
					{state === 'idle' && <IdleState onStart={startFlow} />}
					{state === 'scanning' && <ScanningState pulse={pulse} />}
					{state === 'processing' && <ProcessingState spin={spinInterpolate} progressWidth={progressWidth} />}
				</View>
			)}
			{state === 'success' && <SuccessState monto={monto} onReset={reset} />}
		</View>
	);
}

function IdleState({ onStart }: { onStart:()=>void }) {
	return (
		<View style={styles.stateBox}>
			<View style={styles.iconShellPrimary}>
				<IconSymbol name="wave.3.right" size={46} color={PRIMARY} />
			</View>
			<ThemedText style={styles.stateTitle}>Acerca tu tarjeta o manilla</ThemedText>
			<ThemedText style={styles.stateDesc}>Pulsa iniciar y acerca tu medio de pago al lector virtual</ThemedText>
			<Pressable onPress={onStart} style={styles.primaryBtn}>
				<ThemedText style={styles.primaryBtnTxt}>Iniciar</ThemedText>
			</Pressable>
		</View>
	);
}

function ScanningState({ pulse }: { pulse: Animated.Value }) {
	return (
		<View style={styles.stateBox}>
			<Animated.View style={[styles.scanCircle, { transform:[{ scale: pulse }] }]}>
				<IconSymbol name="wave.3.right" size={54} color={PRIMARY} />
			</Animated.View>
			<ThemedText style={styles.stateTitle}>Escaneando...</ThemedText>
			<ThemedText style={styles.stateDesc}>Detectando medio NFC</ThemedText>
			<ThemedText style={styles.hintText}>Mantén estable tu dispositivo</ThemedText>
		</View>
	);
}

function ProcessingState({ spin, progressWidth }: { spin:string; progressWidth:any }) {
	return (
		<View style={styles.stateBox}>
			<Animated.View style={[styles.processingRing, { transform:[{ rotate: spin }] }]}>
				<View style={styles.processingInner}>
					<IconSymbol name="coloncurrencysign.circle" size={42} color={PRIMARY} />
				</View>
			</Animated.View>
			<ThemedText style={styles.stateTitle}>Procesando pago</ThemedText>
			<ThemedText style={styles.stateDesc}>Aplicando débito y validación</ThemedText>
			<View style={styles.progressBarWrap}>
				<Animated.View style={[styles.progressBarFill,{ width: progressWidth }]} />
			</View>
			<ThemedText style={styles.hintText}>Cifrando y validando...</ThemedText>
		</View>
	);
}

function SuccessState({ monto, onReset }: { monto:number | null; onReset:()=>void }) {
	return (
		<View style={styles.successFull}>
			<MapaRuta />
			<View style={styles.overlayBanner} pointerEvents="box-none">
				<View style={styles.successBanner}>
					<IconSymbol name="checkmark.circle.fill" size={48} color={PRIMARY} />
					<View style={{ flex:1 }}>
						<ThemedText style={styles.successBannerTitle}>Pago aprobado</ThemedText>
						{monto != null && <ThemedText style={styles.successBannerMonto}>Bs. {monto.toFixed(2)}</ThemedText>}
					</View>
					<Pressable onPress={onReset} style={styles.bannerBtn}> 
						<ThemedText style={styles.bannerBtnTxt}>Nuevo</ThemedText>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root:{ flex:1, backgroundColor:BG },
	header:{ paddingTop:70, paddingBottom:30, paddingHorizontal:24, borderBottomLeftRadius:34, borderBottomRightRadius:34 },
	title:{ color:'#fff', fontSize:28, fontWeight:'800', letterSpacing:-0.5 },
	subtitle:{ color:'rgba(255,255,255,0.85)', fontSize:14, marginTop:4, fontWeight:'500' },
	content:{ flex:1, padding:24 },
	stateBox:{ alignItems:'center', gap:14, marginTop:18 },
	iconShellPrimary:{ width:120, height:120, borderRadius:60, backgroundColor:'rgba(66,175,86,0.15)', alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'rgba(66,175,86,0.25)' },
	stateTitle:{ fontSize:20, fontWeight:'700', color:DARK, textAlign:'center' },
	stateDesc:{ fontSize:13, lineHeight:18, color:'#475569', textAlign:'center', paddingHorizontal:18 },
	primaryBtn:{ marginTop:8, backgroundColor:PRIMARY, paddingHorizontal:34, paddingVertical:14, borderRadius:28, shadowColor:'#000', shadowOpacity:0.15, shadowRadius:12, elevation:5 },
	primaryBtnTxt:{ color:DARK, fontSize:15, fontWeight:'700', letterSpacing:0.5 },
	scanCircle:{ width:170, height:170, borderRadius:85, backgroundColor:'#fff', borderWidth:6, borderColor:'rgba(66,175,86,0.35)', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.10, shadowRadius:16, elevation:6 },
	hintText:{ fontSize:11, color:'#64748b', marginTop:4 },
	processingRing:{ width:170, height:170, borderRadius:85, borderWidth:8, borderColor:'rgba(66,175,86,0.28)', alignItems:'center', justifyContent:'center' },
	processingInner:{ width:130, height:130, borderRadius:65, backgroundColor:'#ffffff', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.08, shadowRadius:10, elevation:4 },
	progressBarWrap:{ width:'80%', height:10, backgroundColor:'#e2e8f0', borderRadius:6, overflow:'hidden', marginTop:4 },
	progressBarFill:{ height:'100%', backgroundColor:PRIMARY },
	successCircle:{ width:170, height:170, borderRadius:85, backgroundColor:'#ffffff', alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.15, shadowRadius:18, elevation:7, borderWidth:6, borderColor:'rgba(66,175,86,0.35)' },
	successTitle:{ fontSize:22, fontWeight:'800', color:DARK, marginTop:4 },
	montoText:{ fontSize:30, fontWeight:'800', color:PRIMARY, letterSpacing:-0.5 },
	secondaryBtn:{ marginTop:10, backgroundColor:'#d9f4e2', paddingHorizontal:26, paddingVertical:12, borderRadius:26 },
	secondaryBtnTxt:{ color:DARK, fontSize:14, fontWeight:'700' },
	successFull:{ flex:1 },
	overlayBanner:{ position:'absolute', top:0, left:0, right:0, paddingTop:50, paddingHorizontal:16 },
	successBanner:{ flexDirection:'row', alignItems:'center', gap:14, backgroundColor:'rgba(255,255,255,0.94)', borderRadius:26, paddingHorizontal:18, paddingVertical:14, shadowColor:'#000', shadowOpacity:0.15, shadowRadius:14, elevation:6, borderWidth:1, borderColor:'rgba(66,175,86,0.35)' },
	successBannerTitle:{ fontSize:16, fontWeight:'700', color:DARK },
	successBannerMonto:{ fontSize:20, fontWeight:'800', color:PRIMARY, letterSpacing:-0.5 },
	bannerBtn:{ backgroundColor:PRIMARY, paddingHorizontal:14, paddingVertical:8, borderRadius:18 },
	bannerBtnTxt:{ fontSize:12, fontWeight:'700', color:DARK }
});


