import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';

// Paleta nueva minimal
const BRAND_PRIMARY = '#42af56';
const BRAND_DARK = '#064420';
const BORDER = '#e2e8f0';
const CARD_COUNT = 2; // ficticio
const WEARABLE_COUNT = 2; // ficticio
const CARD_TOTAL = 5; // capacidad ficticia
const WEARABLE_TOTAL = 5; // capacidad ficticia

export default function PassengerPanel() {
	const userName = 'Ronald Augusto';
	const [showNFC, setShowNFC] = React.useState(false);
	const [hideBalance, setHideBalance] = React.useState(false);
	const balance = 35.25; // mock
	const pulse = useRef(new Animated.Value(1)).current;

	React.useEffect(()=>{
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse,{ toValue:1.08, duration:1200, useNativeDriver:true }),
				Animated.timing(pulse,{ toValue:1, duration:1200, useNativeDriver:true })
			])
		);
		loop.start();
		return ()=>loop.stop();
	},[]);

	return (
		<View style={styles.root}>
			<HeaderPattern />
			<LinearGradient colors={[BRAND_DARK, BRAND_PRIMARY]} style={styles.headerGradient}>
				<View style={styles.headerTop}>
					<ThemedText style={styles.greeting}>Hola, {userName}</ThemedText>
					<Pressable style={styles.helpBtn}><IconSymbol name="questionmark.circle" size={22} color="#ffffff" /></Pressable>
				</View>

				<View style={styles.balanceCard}>
					<View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
						<IconSymbol name="coloncurrencysign.circle" size={22} color={BRAND_DARK} />
						<ThemedText style={styles.balanceLabel}>Saldo</ThemedText>
					</View>
					<ThemedText style={styles.balanceValue}>Bs. { hideBalance ? '••••' : balance.toFixed(2) }</ThemedText>
					<Pressable onPress={()=>setHideBalance(b=>!b)} style={styles.hideToggle}>
						<IconSymbol name={hideBalance? 'eye.slash' : 'eye'} size={18} color={BRAND_DARK} />
					</Pressable>
				</View>

				<View style={styles.quickRow}>
					<QuickOption icon="creditcard" label="Tarjetas" />
					<QuickOption icon="watchface" label="Manillas" />
					<QuickOption icon="wave.3.right" label="Pago NFC" onPress={()=>setShowNFC(s=>!s)} active={showNFC} />
				</View>

				{showNFC && (
					<View style={styles.nfcInline}>
						<Animated.View style={[styles.nfcCircleSmall,{ transform:[{ scale: pulse }] }]}>
							<IconSymbol name="wave.3.right" size={34} color={BRAND_PRIMARY} />
						</Animated.View>
						<View style={{ flex:1 }}>
							<ThemedText style={styles.nfcHint}>Acerca para pagar</ThemedText>
							<ThemedText style={styles.lastPay}>Listo para leer</ThemedText>
						</View>
						<Pressable style={styles.nfcBtnSmall}><ThemedText style={styles.nfcBtnTxt}>Pagar</ThemedText></Pressable>
					</View>
				)}
			</LinearGradient>

			{/* Conteo ficticio de tarjetas y manillas */}
			<View style={styles.statsRow}>
				<StatPill icon="creditcard" label="Tarjetas" count={CARD_COUNT} total={CARD_TOTAL} color={BRAND_PRIMARY} />
				<StatPill icon="watchface" label="Manillas" count={WEARABLE_COUNT} total={WEARABLE_TOTAL} color={BRAND_PRIMARY} />
			</View>
		</View>
	);
}

function StatPill({ icon, label, count, total, color }: { icon: any; label: string; count: number; total: number; color: string }) {
	const segments = Array.from({ length: total });
	return (
		<View style={styles.statPill}>
			<View style={styles.statHeader}>        
				<View style={[styles.statIconWrap, { backgroundColor: 'rgba(66,175,86,0.12)' }]}> 
					<IconSymbol name={icon} size={18} color={color} />
				</View>
				<ThemedText style={styles.statLabel}>{label}</ThemedText>
			</View>
			<View style={styles.statCountRow}>
				<ThemedText style={styles.statNumber}>{count}</ThemedText>
				<ThemedText style={styles.statTotal}>/ {total}</ThemedText>
			</View>
			<View style={styles.segmentBar}>
				{segments.map((_,i)=>(
					<View key={i} style={[styles.segment, i < count && styles.segmentActive]} />
				))}
			</View>
		</View>
	);
}

function QuickOption({ icon, label, onPress, active }: { icon: any; label: string; onPress?:()=>void; active?: boolean }) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.quickOption, active && styles.quickOptionActive, pressed && { transform:[{ scale:0.94 }] }]}>
			<IconSymbol name={icon} size={22} color={active ? '#fff':'#ffffff'} />
			<ThemedText style={styles.quickLabel}>{label}</ThemedText>
		</Pressable>
	);
}

function HeaderPattern() {
	const dots: number[] = [];
	const { width } = Dimensions.get('window');
	const cols = Math.ceil(width / 40);
	const rows = 9;
	let id=0;
	for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ dots.push(id++);} }
	return (
		<View pointerEvents="none" style={styles.patternLayer}>
			{dots.map(i=> <View key={i} style={styles.dot} />)}
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex:1, backgroundColor:'#ffffff' },
	headerGradient: { height:330, paddingTop:60, paddingHorizontal:20, justifyContent:'flex-start', gap:34, borderBottomLeftRadius:32, borderBottomRightRadius:32 },
	patternLayer: { position:'absolute', inset:0, flexDirection:'row', flexWrap:'wrap', opacity:0.15 },
	dot: { width:4, height:4, borderRadius:2, backgroundColor:'rgba(255,255,255,0.55)', margin:18 },
	headerTop: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
	greeting: { color:'#fff', fontSize:22, fontWeight:'700', letterSpacing:-0.5 },
	helpBtn: { width:46, height:46, borderRadius:23, backgroundColor:'rgba(255,255,255,0.18)', alignItems:'center', justifyContent:'center' },
	quickRow: { flexDirection:'row', gap:14 },
	quickOption: { flex:1, height:94, borderRadius:28, backgroundColor:'rgba(255,255,255,0.22)', alignItems:'center', justifyContent:'center', gap:10, borderWidth:1, borderColor:'rgba(255,255,255,0.3)', paddingHorizontal:4 },
	quickOptionActive: { backgroundColor:'rgba(66,175,86,0.45)', borderColor:'rgba(255,255,255,0.55)' },
	quickLabel: { fontSize:13, fontWeight:'600', color:'#ffffff', letterSpacing:0.3, textAlign:'center' },
	balanceCard: { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.9)', borderRadius:26, paddingHorizontal:18, paddingVertical:14, gap:12, shadowColor:'#000', shadowOpacity:0.15, shadowRadius:10, elevation:4 },
	balanceLabel: { fontSize:13, fontWeight:'600', color:BRAND_DARK, letterSpacing:0.5 },
	balanceValue: { marginLeft:'auto', fontSize:20, fontWeight:'700', color:BRAND_DARK, letterSpacing:-0.3 },
	hideToggle: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(0,0,0,0.06)', alignItems:'center', justifyContent:'center', marginLeft:4 },
	nfcInline: { flexDirection:'row', backgroundColor:'#ffffff', borderRadius:26, borderWidth:1, borderColor:BORDER, padding:14, alignItems:'center', gap:14, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:6, elevation:3 },
	nfcCircleSmall: { width:70, height:70, borderRadius:35, borderWidth:4, borderColor:'rgba(66,175,86,0.35)', backgroundColor:'#ffffff', alignItems:'center', justifyContent:'center' },
	nfcBtnSmall: { backgroundColor:BRAND_PRIMARY, paddingHorizontal:18, paddingVertical:10, borderRadius:22 },
	nfcHint: { fontSize:14, fontWeight:'600', color:BRAND_DARK },
	nfcBtnTxt: { fontSize:14, fontWeight:'700', color:BRAND_DARK, letterSpacing:0.5 },
	lastPay: { fontSize:11, color:'#475569' },
	statsRow: { flexDirection:'row', paddingHorizontal:20, paddingTop:18, paddingBottom:30, gap:14 },
	statPill: { flex:1, backgroundColor:'#ffffff', borderRadius:26, paddingVertical:14, paddingHorizontal:16, gap:10, borderWidth:1, borderColor:'#e2e8f0', shadowColor:'#000', shadowOpacity:0.05, shadowRadius:8, elevation:3 },
	statHeader: { flexDirection:'row', alignItems:'center', gap:8 },
	statIconWrap: { width:34, height:34, borderRadius:17, alignItems:'center', justifyContent:'center' },
	statLabel: { fontSize:13, fontWeight:'600', color:BRAND_DARK, letterSpacing:0.3 },
	statCountRow: { flexDirection:'row', alignItems:'flex-end', gap:4 },
	statNumber: { fontSize:22, fontWeight:'700', color:BRAND_DARK, letterSpacing:-0.8 },
	statTotal: { fontSize:13, fontWeight:'600', color:'#64748b' },
	segmentBar: { flexDirection:'row', gap:4, marginTop:4 },
	segment: { flex:1, height:8, borderRadius:4, backgroundColor:'#e2e8f0' },
	segmentActive: { backgroundColor:BRAND_PRIMARY }
});


