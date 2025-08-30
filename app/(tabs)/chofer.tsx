import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const PRIMARY = '#42af56';
const DARK = '#064420';
const BG = '#f6f9f7';
const BORDER = '#d9e8dd';
const AMBER = '#f59e0b';

interface Passenger {
	id: string;
	name: string;
	cardId: string;
	status: 'a bordo' | 'bajó';
	fare: number;
}

export default function ChoferScreen() {
	const [balance, setBalance] = useState(125.75);
	const [hidden, setHidden] = useState(false);
	const [passengers, setPassengers] = useState<Passenger[]>([
		{ id: '1', name: 'María G.', cardId: 'TUC-2345', status: 'a bordo', fare: 2.5 },
		{ id: '2', name: 'Luis P.', cardId: 'TUC-1881', status: 'a bordo', fare: 2.5 },
		{ id: '3', name: 'Anita R.', cardId: 'TUC-9920', status: 'a bordo', fare: 2.5 },
	]);

	function simulateBoard() {
		const id = Date.now().toString();
		const newP: Passenger = { id, name: 'Pasajero '+id.slice(-3), cardId: 'TUC-'+(1000+Math.floor(Math.random()*9000)), status:'a bordo', fare:2.5 };
		setPassengers(p => [newP, ...p]);
		setBalance(b => b + newP.fare);
	}

	// Estado se recibe automáticamente (simulado aquí sin auto-update manual)

	function settleShift() {
		// Simulación: vacía lista y mantiene saldo
		setPassengers([]);
	}

	const onboardCount = passengers.filter(p=>p.status==='a bordo').length;

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
			<LinearGradient colors={['#064420', PRIMARY]} style={styles.header}>
				<ThemedText style={styles.headerTitle}>Panel Chofer</ThemedText>
				<ThemedText style={styles.headerSubtitle}>Control rápido de viaje</ThemedText>
			</LinearGradient>

			<View style={styles.section}>
				<View style={styles.balanceRow}>
					<View style={{ flex:1 }}>
						<ThemedText style={styles.balanceLabel}>Saldo turno</ThemedText>
						<ThemedText style={styles.balanceValue}>{hidden ? '••••' : balance.toFixed(2)+' Bs'}</ThemedText>
					</View>
					<Pressable style={styles.toggleBtn} onPress={()=>setHidden(h=>!h)}>
						<ThemedText style={styles.toggleTxt}>{hidden? 'Mostrar':'Ocultar'}</ThemedText>
					</Pressable>
				</View>
				<View style={styles.actionsRow}>
					<ActionChip label="Pasajero sube" onPress={simulateBoard} />
					<ActionChip label="Cerrar turno" variant='warn' onPress={settleShift} />
				</View>
			</View>

			<View style={styles.section}>
				<ThemedText style={styles.sectionTitle}>Pasajeros actuales ({onboardCount})</ThemedText>
				{passengers.length===0 && (
					<View style={styles.emptyBox}>
						<ThemedText style={styles.emptyTxt}>Sin pasajeros en este momento.</ThemedText>
					</View>
				)}
				{passengers.map(p => (
					<View key={p.id} style={[styles.passengerCard, p.status==='bajó' && styles.passengerInactive]}>
						<View style={{ flex:1 }}>
							<ThemedText style={styles.passengerName}>{p.name}</ThemedText>
							<ThemedText style={styles.passengerMeta}>{p.cardId} • {p.fare.toFixed(2)} Bs</ThemedText>
							<View style={[styles.statusBadge, p.status==='bajó' && styles.statusBadgeLeft]}>
								<ThemedText style={styles.statusBadgeTxt}>{p.status === 'a bordo' ? 'A bordo' : 'Bajó'}</ThemedText>
							</View>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}

function ActionChip({ label, onPress, variant }: { label: string; onPress: () => void; variant?: 'warn' }) {
	return (
		<Pressable onPress={onPress} style={({pressed})=>[
			styles.actionChip,
			variant==='warn' && styles.actionChipWarn,
			pressed && { opacity:0.85 }
		]}>
			<ThemedText style={[styles.actionChipTxt, variant==='warn' && styles.actionChipTxtWarn]}>{label}</ThemedText>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	screen: { flex:1, backgroundColor: BG },
	header: { paddingTop:68, paddingBottom:48, paddingHorizontal:24, borderBottomLeftRadius:28, borderBottomRightRadius:28, marginBottom:12 },
	headerTitle: { color:'#fff', fontSize:30, fontWeight:'800', letterSpacing:0.5 },
	headerSubtitle: { color:'#e3f6ea', fontSize:13, fontWeight:'500', marginTop:4, letterSpacing:0.4 },
	section: { backgroundColor:'#ffffff', marginHorizontal:16, marginBottom:18, padding:16, borderRadius:20, borderWidth:1, borderColor:BORDER, shadowColor:'#000', shadowOpacity:0.04, shadowRadius:6, elevation:2 },
	balanceRow: { flexDirection:'row', alignItems:'center', marginBottom:14 },
	balanceLabel: { color:DARK, fontSize:13, fontWeight:'600', letterSpacing:0.5 },
	balanceValue: { color:DARK, fontSize:28, fontWeight:'800', marginTop:2, letterSpacing:0.5 },
	toggleBtn: { backgroundColor:PRIMARY, paddingHorizontal:14, paddingVertical:10, borderRadius:14 },
	toggleTxt: { color:'#fff', fontSize:12.5, fontWeight:'700' },
	actionsRow: { flexDirection:'row', gap:12 },
	actionChip: { flex:1, backgroundColor:'#e4f7ea', paddingVertical:12, borderRadius:14, alignItems:'center', borderWidth:1, borderColor:'#c6e9d0' },
	actionChipWarn: { backgroundColor:'#fff4e0', borderColor:'#f7d8a8' },
	actionChipTxt: { color:DARK, fontSize:13, fontWeight:'700', letterSpacing:0.4 },
	actionChipTxtWarn: { color:AMBER },
	sectionTitle: { color:DARK, fontSize:16, fontWeight:'700', marginBottom:12, letterSpacing:0.4 },
	emptyBox: { paddingVertical:32, alignItems:'center' },
	emptyTxt: { color:'#46604f', fontSize:13 },
	passengerCard: { flexDirection:'row', padding:14, borderRadius:16, backgroundColor:'#f0faf3', borderWidth:1, borderColor:'#cfe6d6', marginBottom:12, alignItems:'center' },
	passengerInactive: { backgroundColor:'#f8f9f9', opacity:0.75 },
	passengerName: { color:DARK, fontSize:14.5, fontWeight:'700', letterSpacing:0.3 },
	passengerMeta: { color:'#486250', fontSize:12, marginTop:2 },
	statusBadge: { marginTop:8, alignSelf:'flex-start', paddingHorizontal:12, paddingVertical:5, borderRadius:16, backgroundColor:PRIMARY },
	statusBadgeLeft: { backgroundColor:'#9ca3af' },
	statusBadgeTxt: { color:'#fff', fontSize:11, fontWeight:'700', letterSpacing:0.5, textTransform:'uppercase' },
});

