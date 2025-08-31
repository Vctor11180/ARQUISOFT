import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useCards } from '@/contexts/CardContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';

// Paleta nueva minimal
const BRAND_PRIMARY = '#42af56';
const BRAND_DARK = '#064420';
const BORDER = '#e2e8f0';
interface PaymentCard { id:string; alias:string; codigo:string; saldo:number; activa:boolean; tipo:'VIRTUAL'|'FISICA'; colorA?:string; colorB?:string; viajesMes?:number; ultimoAbordaje?:string; rutaUltima?:string }
interface Wearable { id:string; alias:string; activa:boolean; bateria:number; ultima?:string; viajesMes:number; ultimoAbordaje?:string; rutaUltima?:string }

export default function PassengerPanel() {
	// ...existing code...
	const [recargando, setRecargando] = React.useState(false);
	// Simulación de vinculación y recarga
	const handleVincularCuenta = async () => {
		setRecargando(true);
		setTimeout(() => {
			if (cards.length > 0) {
				cards[0].saldo += 50;
				Alert.alert('Recarga exitosa', 'Se han recargado 50 Bs a tu tarjeta principal.');
			} else {
				Alert.alert('Sin tarjetas', 'Agrega una tarjeta para recargar saldo.');
			}
			setRecargando(false);
		}, 1200);
	};
	const router = useRouter();
	const { userProfile } = useAuth();
	const userName = userProfile?.full_name || 'Pasajero';
	const { cards, loadingCards, createCard, toggleActive, deleteCard, updating } = useCards();
	const [showNFC, setShowNFC] = React.useState(false);
	const [hideBalance, setHideBalance] = React.useState(false);
	// TODO: Persistir wearables en otra tabla similar si se requiere.
	const [wearables, setWearables] = React.useState<Wearable[]>([]);
	const balance = cards.reduce((acc,c)=>acc+(c.saldo||0),0);
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
		<ScrollView style={styles.root} contentContainerStyle={{ paddingBottom:60 }}>
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
							<QuickOption icon="wave.3.right" label={recargando ? "Conectando..." : "Vincular"} onPress={handleVincularCuenta} active={recargando} />
						</View>

				{/* Botón acceso directo a pantalla completa de pago NFC */}
				<Pressable onPress={()=>router.push('/interfazPago')} style={({pressed})=>[styles.payNfcBtn, pressed && { transform:[{scale:0.97}] }]}>
					<View style={styles.payNfcIconShell}>
						<IconSymbol name="wave.3.right" size={24} color={BRAND_PRIMARY} />
					</View>
					<ThemedText style={styles.payNfcText}>Pagar por NFC</ThemedText>
					<IconSymbol name="chevron.right" size={20} color={'#064420'} />
				</Pressable>
				

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

			{/* Resumen y capacidad */}
			<View style={styles.statsRow}>
				<StatPill icon="creditcard" label="Tarjetas" count={cards.length} total={5} color={BRAND_PRIMARY} />
				<StatPill icon="watchface" label="Manillas" count={wearables.length} total={5} color={BRAND_PRIMARY} />
			</View>

			{/* Tarjetas */}
			<SectionHeader title="Tarjetas de transporte" actionLabel="Agregar" onAction={async ()=>{
				if(cards.length>=5) { Alert.alert('Límite','Máximo 5 tarjetas'); return; }
				const { error } = await createCard('Nueva Tarjeta');
				if (error) Alert.alert('Error', error.message || 'No se pudo crear');
			}} disabled={cards.length>=5 || updating} />
			{loadingCards && <ActivityIndicator style={{ marginVertical:12 }} color={BRAND_PRIMARY} />}
			<View style={styles.cardList}>
				{cards.map(c=> <PaymentCardItem key={c.id} card={c as any} onToggle={()=>toggleActive(c.id)} onDelete={()=>{
					Alert.alert('Eliminar tarjeta', '¿Seguro que deseas eliminar esta tarjeta?', [
						{ text:'Cancelar', style:'cancel' },
						{ text:'Eliminar', style:'destructive', onPress: async ()=>{
							const { error } = await deleteCard(c.id);
							if (error) Alert.alert('Error', error.message || 'No se pudo eliminar');
						}}
					]);
				}} />)}
			</View>

			{/* Manillas */}
			<SectionHeader title="Manillas de transporte" actionLabel="Agregar" onAction={()=>{
				if(wearables.length>=5) return;
				const id='w'+(wearables.length+1);
				setWearables(prev=>[...prev,{ id, alias:'Manilla '+id, activa:true, bateria:100, viajesMes:0 }]);
			}} disabled={wearables.length>=5} />
			<View style={styles.wearableList}>
				{wearables.map(w=> <WearableItem key={w.id} item={w} onToggle={()=>setWearables(prev=>prev.map(p=>p.id===w.id?{...p,activa:!p.activa}:p))} onDelete={()=>{
					Alert.alert('Eliminar manilla', '¿Eliminar este dispositivo?', [
						{ text:'Cancelar', style:'cancel' },
						{ text:'Eliminar', style:'destructive', onPress:()=> setWearables(prev=>prev.filter(p=>p.id!==w.id)) }
					]);
				}} />)}
			</View>
		</ScrollView>
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

function SectionHeader({ title, actionLabel, onAction, disabled }: { title:string; actionLabel?:string; onAction?:()=>void; disabled?:boolean }) {
	return (
		<View style={styles.sectionHeader}>
			<ThemedText style={styles.sectionTitle}>{title}</ThemedText>
			{actionLabel && (
				<Pressable disabled={disabled} onPress={onAction} style={[styles.addBtn, disabled && { opacity:0.35 }]}> 
					<IconSymbol name="plus" size={16} color={BRAND_DARK} />
					<ThemedText style={styles.addBtnTxt}>{actionLabel}</ThemedText>
				</Pressable>
			)}
		</View>
	);
}

function PaymentCardItem({ card, onToggle, onDelete }: { card:PaymentCard; onToggle:()=>void; onDelete:()=>void }) {
	return (
		<Pressable onLongPress={onToggle} style={({pressed})=>[styles.payCard, pressed && { transform:[{scale:0.97}] }]}>
			<LinearGradient colors={[card.colorA || '#42af56', card.colorB || '#2e8741']} style={styles.payCardGradient}>
				<View style={styles.payCardTopRow}>
					<View style={styles.transitIconCircle}>
						<IconSymbol name="bus" size={18} color="#ffffff" />
					</View>
					<View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
						<Pressable onPress={onToggle} style={[styles.statusBadge, card.activa? styles.badgeActiva : styles.badgeInactiva]}>
							<ThemedText style={styles.badgeText}>{card.activa? 'Activa':'Bloqueada'}</ThemedText>
						</Pressable>
						<Pressable onPress={onDelete} style={styles.deleteBadge}>
							<IconSymbol name="trash" size={14} color="#fff" />
						</Pressable>
					</View>
				</View>
				<ThemedText style={styles.payAlias}>{card.alias}</ThemedText>
				<ThemedText style={styles.payNumber}>{card.codigo}</ThemedText>
				<View style={styles.payFooterRow}>
					<ThemedText style={styles.paySaldo}>Crédito Bs. {card.saldo.toFixed(2)}</ThemedText>
					<ThemedText style={styles.payTipo}>{card.tipo === 'FISICA' ? 'Plástica':'Virtual / QR'}</ThemedText>
				</View>
				<View style={styles.payStatsRow}>
					<ThemedText style={styles.payViajes}>{card.viajesMes} viajes este mes</ThemedText>
					{card.ultimoAbordaje && <ThemedText style={styles.payUltUso}>{card.ultimoAbordaje}</ThemedText>}
				</View>
				{card.rutaUltima && <ThemedText style={styles.payRuta}>Última ruta: {card.rutaUltima}</ThemedText>}
			</LinearGradient>
		</Pressable>
	);
}

function WearableItem({ item, onToggle, onDelete }: { item:Wearable; onToggle:()=>void; onDelete:()=>void }) {
	return (
		<Pressable onLongPress={onToggle} style={({pressed})=>[styles.wearableCard, pressed && { transform:[{scale:0.97}] }]}>
			<View style={styles.wearableTop}>
				<IconSymbol name="watchface" size={22} color={BRAND_PRIMARY} />
				<View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
					<View style={[styles.statusDot, { backgroundColor: item.activa? '#16a34a':'#dc2626' }]} />
					<Pressable onPress={onDelete} style={styles.deleteBadgeSmall}>
						<IconSymbol name="trash" size={14} color={BRAND_DARK} />
					</Pressable>
				</View>
			</View>
			<ThemedText style={styles.wearAlias}>{item.alias}</ThemedText>
			<View style={styles.wearRow}>
				<ThemedText style={styles.wearBattery}>{item.bateria}% batería</ThemedText>
				<ThemedText style={styles.wearEstado}>{item.activa? 'Activa':'Inactiva'}</ThemedText>
			</View>
			<View style={styles.wearRow}>
				<ThemedText style={styles.wearViajes}>{item.viajesMes} viajes mes</ThemedText>
				{item.ultimoAbordaje && <ThemedText style={styles.wearUltUso}>{item.ultimoAbordaje}</ThemedText>}
			</View>
			{item.rutaUltima && <ThemedText style={styles.wearRuta}>Ruta: {item.rutaUltima}</ThemedText>}
			{item.ultima && <ThemedText style={styles.wearUltima}>Sincronizó: {item.ultima}</ThemedText>}
			<ThemedText style={styles.wearHint}>Mantén presionado para {item.activa? 'bloquear':'activar'}</ThemedText>
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
	statsRow: { flexDirection:'row', paddingHorizontal:20, paddingTop:18, paddingBottom:30, gap:14, marginTop: 120 },
	statPill: { flex:1, backgroundColor:'#ffffff', borderRadius:26, paddingVertical:14, paddingHorizontal:16, gap:10, borderWidth:1, borderColor:'#e2e8f0', shadowColor:'#000', shadowOpacity:0.05, shadowRadius:8, elevation:3 },
	statHeader: { flexDirection:'row', alignItems:'center', gap:8 },
	statIconWrap: { width:34, height:34, borderRadius:17, alignItems:'center', justifyContent:'center' },
	statLabel: { fontSize:13, fontWeight:'600', color:BRAND_DARK, letterSpacing:0.3 },
	statCountRow: { flexDirection:'row', alignItems:'flex-end', gap:4 },
	statNumber: { fontSize:22, fontWeight:'700', color:BRAND_DARK, letterSpacing:-0.8 },
	statTotal: { fontSize:13, fontWeight:'600', color:'#64748b' },
	segmentBar: { flexDirection:'row', gap:4, marginTop:4 },
	segment: { flex:1, height:8, borderRadius:4, backgroundColor:'#e2e8f0' },
	segmentActive: { backgroundColor:BRAND_PRIMARY },
	sectionHeader:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, marginTop:4, marginBottom:6 },
	sectionTitle:{ fontSize:18, fontWeight:'700', color:BRAND_DARK, letterSpacing:-0.5 },
	addBtn:{ flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'#d7f2e2', paddingHorizontal:14, paddingVertical:8, borderRadius:22 },
	addBtnTxt:{ fontSize:13, fontWeight:'600', color:BRAND_DARK },
	cardList:{ paddingHorizontal:16, gap:14 },
	payCard:{ borderRadius:22, overflow:'hidden', shadowColor:'#000', shadowOpacity:0.10, shadowRadius:10, elevation:4 },
	payCardGradient:{ padding:18, gap:8 },
	payCardTopRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
	payChip:{ width:30, height:22, borderRadius:6, backgroundColor:'rgba(255,255,255,0.6)' },
	transitIconCircle:{ width:32, height:32, borderRadius:16, backgroundColor:'rgba(255,255,255,0.25)', alignItems:'center', justifyContent:'center' },
	statusBadge:{ paddingHorizontal:10, paddingVertical:4, borderRadius:14 },
	badgeActiva:{ backgroundColor:'rgba(255,255,255,0.28)' },
	badgeInactiva:{ backgroundColor:'rgba(0,0,0,0.35)' },
	badgeText:{ fontSize:11, fontWeight:'600', color:'#ffffff' },
	payAlias:{ fontSize:16, fontWeight:'700', color:'#ffffff', letterSpacing:0.4 },
	payNumber:{ fontSize:15, fontWeight:'600', color:'#ffffff', letterSpacing:1, marginTop:2 },
	payFooterRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginTop:2 },
	paySaldo:{ fontSize:16, fontWeight:'700', color:'#ffffff' },
	payTipo:{ fontSize:11, fontWeight:'600', color:'rgba(255,255,255,0.85)', letterSpacing:0.5 },
	payStatsRow:{ flexDirection:'row', justifyContent:'space-between', marginTop:6 },
	payViajes:{ fontSize:11, fontWeight:'600', color:'rgba(255,255,255,0.9)' },
	payUltUso:{ fontSize:11, color:'rgba(255,255,255,0.85)' },
	payRuta:{ fontSize:11, color:'rgba(255,255,255,0.85)', marginTop:4 },
	wearableList:{ paddingHorizontal:16, paddingTop:4, gap:14, paddingBottom:30 },
	wearableCard:{ backgroundColor:'#ffffff', borderRadius:22, padding:16, gap:6, borderWidth:1, borderColor:'#e2e8f0', shadowColor:'#000', shadowOpacity:0.05, shadowRadius:6, elevation:3 },
	wearableTop:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
	statusDot:{ width:12, height:12, borderRadius:6 },
	wearAlias:{ fontSize:15, fontWeight:'700', color:BRAND_DARK },
	wearRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
	wearBattery:{ fontSize:12, fontWeight:'600', color:'#475569' },
	wearEstado:{ fontSize:12, fontWeight:'700', color:BRAND_PRIMARY },
	wearUltima:{ fontSize:11, color:'#64748b', marginTop:2 },
	wearViajes:{ fontSize:11, fontWeight:'600', color:'#475569' },
	wearUltUso:{ fontSize:11, color:'#475569' },
	wearRuta:{ fontSize:11, color:'#475569', marginTop:2 },
	wearHint:{ fontSize:10, color:'#94a3b8', marginTop:4 },
	payNfcBtn:{ marginTop:8, flexDirection:'row', alignItems:'center', gap:14, backgroundColor:'rgba(255,255,255,0.9)', borderRadius:26, paddingVertical:12, paddingHorizontal:18, shadowColor:'#000', shadowOpacity:0.12, shadowRadius:8, elevation:4, borderWidth:1, borderColor:'rgba(255,255,255,0.4)' },
	payNfcIconShell:{ width:44, height:44, borderRadius:22, backgroundColor:'rgba(66,175,86,0.15)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(66,175,86,0.35)' },
	payNfcText:{ fontSize:16, fontWeight:'700', color:BRAND_DARK, flex:1 }
});

// Estilos adicionales para botones de borrado
Object.assign(styles, {
	deleteBadge: { paddingHorizontal:10, paddingVertical:4, borderRadius:14, backgroundColor:'rgba(0,0,0,0.25)' },
	deleteBadgeSmall: { width:32, height:32, borderRadius:16, backgroundColor:'#d7f2e2', alignItems:'center', justifyContent:'center' }
});
 

