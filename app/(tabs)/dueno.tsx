import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const PRIMARY = '#42af56';
const DARK = '#064420';
const BG = '#f6f9f7';
const BORDER = '#d9e8dd';
const ACCENT = '#1d7f39';

interface Micro {
	id: string;
	placa: string;
	ruta: string;
	estado: 'operativo' | 'mantenimiento' | 'inactivo';
	pasajerosHoy: number;
	ingresosHoy: number; // Bs
	ocupacionPromedio: number; // 0..1
}

export default function DuenoMicroScreen() {
	const { t } = useTranslation();
	const [micros, setMicros] = useState<Micro[]>([
		{ id: 'M1', placa: 'SCZ-1234', ruta: 'Linea 17', estado: 'operativo', pasajerosHoy: 146, ingresosHoy: 365, ocupacionPromedio: 0.78 },
		{ id: 'M2', placa: 'SCZ-4312', ruta: 'Linea 17', estado: 'operativo', pasajerosHoy: 132, ingresosHoy: 330, ocupacionPromedio: 0.72 },
		{ id: 'M3', placa: 'SCZ-9087', ruta: 'Linea 38', estado: 'mantenimiento', pasajerosHoy: 0, ingresosHoy: 0, ocupacionPromedio: 0 },
		{ id: 'M4', placa: 'SCZ-5521', ruta: 'Linea 12', estado: 'inactivo', pasajerosHoy: 0, ingresosHoy: 0, ocupacionPromedio: 0 },
	]);

	const operativos = micros.filter(m => m.estado === 'operativo').length;
	const mantenimiento = micros.filter(m => m.estado === 'mantenimiento').length;
	const inactivos = micros.filter(m => m.estado === 'inactivo').length;
	const ingresosTotales = micros.reduce((s, m) => s + m.ingresosHoy, 0);
	const pasajerosTotales = micros.reduce((s, m) => s + m.pasajerosHoy, 0);

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
			<LinearGradient colors={['#064420', PRIMARY]} style={styles.hero}>
				<ThemedText style={styles.heroTitle}>{t('dueno.title')}</ThemedText>
				<ThemedText style={styles.heroSubtitle}>{t('dueno.subtitle')}</ThemedText>
			</LinearGradient>

			<View style={styles.metricsRow}>
				<MetricCard label={t('dueno.metrics.operativos')} value={operativos.toString()} variant='ok' />
				<MetricCard label={t('dueno.metrics.mantenimiento')} value={mantenimiento.toString()} variant='warn' />
				<MetricCard label={t('dueno.metrics.inactivos')} value={inactivos.toString()} variant='off' />
			</View>

			<View style={styles.summaryBox}>
				<View style={styles.summaryCol}>
					<ThemedText style={styles.summaryLabel}>{t('dueno.summary.passengers')}</ThemedText>
					<ThemedText style={styles.summaryValue}>{pasajerosTotales}</ThemedText>
				</View>
				<View style={styles.divider} />
				<View style={styles.summaryCol}>
					<ThemedText style={styles.summaryLabel}>{t('dueno.summary.income')}</ThemedText>
					<ThemedText style={styles.summaryValue}>{ingresosTotales} Bs</ThemedText>
				</View>
			</View>

			<View style={styles.sectionHeader}>
				<ThemedText style={styles.sectionTitle}>{t('dueno.sectionTitle')}</ThemedText>
			</View>

			{micros.map(m => (
				<Pressable key={m.id} style={({ pressed }) => [styles.microCard, pressed && styles.microCardPressed]}>
					<View style={styles.microTopRow}>
						<ThemedText style={styles.microPlaca}>{m.placa}</ThemedText>
						<StatusPill estado={m.estado} />
					</View>
					<ThemedText style={styles.microRuta}>{m.ruta}</ThemedText>
					<View style={styles.microStatsRow}>
						<Stat label="Pasajeros" value={m.pasajerosHoy.toString()} />
						<Stat label="Ingresos" value={m.ingresosHoy + ' Bs'} />
						<OcupacionBar value={m.ocupacionPromedio} />
					</View>
				</Pressable>
			))}

			<Pressable style={styles.addButton} onPress={() => {/* futuro: agregar micro */ }}>
				<ThemedText style={styles.addButtonTxt}>{t('dueno.addButton')}</ThemedText>
			</Pressable>
		</ScrollView>
	);
}

function MetricCard({ label, value, variant }: { label: string; value: string; variant?: 'ok' | 'warn' | 'off' }) {
	return (
		<View style={[styles.metricCard, variant === 'ok' && styles.metricOk, variant === 'warn' && styles.metricWarn, variant === 'off' && styles.metricOff]}>
			<ThemedText style={styles.metricValue}>{value}</ThemedText>
			<ThemedText style={styles.metricLabel}>{label}</ThemedText>
		</View>
	);
}

function StatusPill({ estado }: { estado: Micro['estado'] }) {
	const map: { [k in Micro['estado']]: { bg: string; txt: string; label: string } } = {
		operativo: { bg: '#e2f7ea', txt: ACCENT, label: 'Operativo' },
		mantenimiento: { bg: '#fff4e0', txt: '#b45309', label: 'Mantenimiento' },
		inactivo: { bg: '#e5e7eb', txt: '#374151', label: 'Inactivo' },
	};
	const cfg = map[estado];
	return (
		<View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
			<ThemedText style={[styles.statusPillTxt, { color: cfg.txt }]}>{cfg.label}</ThemedText>
		</View>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.statBlock}>
			<ThemedText style={styles.statValue}>{value}</ThemedText>
			<ThemedText style={styles.statLabel}>{label}</ThemedText>
		</View>
	);
}

function OcupacionBar({ value }: { value: number }) {
	const pct = Math.round(value * 100);
	return (
		<View style={styles.ocupWrapper}>
			<View style={styles.ocupBarBg}>
				<View style={[styles.ocupBarFill, { width: pct + '%' }]} />
			</View>
			<ThemedText style={styles.ocupText}>{pct}%</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: BG },
	hero: { paddingTop: 68, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 14 },
	heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
	heroSubtitle: { color: '#e3f6ea', fontSize: 13, fontWeight: '500', marginTop: 4, letterSpacing: 0.4 },
	metricsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 14 },
	metricCard: { flex: 1, marginHorizontal: 4, backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
	metricValue: { fontSize: 18, fontWeight: '800', color: DARK, letterSpacing: 0.5 },
	metricLabel: { fontSize: 11, fontWeight: '600', color: '#486250', marginTop: 4, letterSpacing: 0.4, textTransform: 'uppercase' },
	metricOk: { backgroundColor: '#e4f7ea' },
	metricWarn: { backgroundColor: '#fff7ec' },
	metricOff: { backgroundColor: '#f0f2f1' },
	summaryBox: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: BORDER, padding: 16, alignItems: 'stretch', marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
	summaryCol: { flex: 1, alignItems: 'center' },
	summaryLabel: { fontSize: 12, color: '#4b6254', fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' },
	summaryValue: { fontSize: 22, color: DARK, fontWeight: '800', marginTop: 6, letterSpacing: 0.5 },
	divider: { width: 1, backgroundColor: '#d2e3d7', marginHorizontal: 12 },
	sectionHeader: { paddingHorizontal: 20, marginBottom: 8 },
	sectionTitle: { fontSize: 18, fontWeight: '800', color: DARK, letterSpacing: 0.5 },
	microCard: { backgroundColor: '#ffffff', marginHorizontal: 16, marginBottom: 14, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
	microCardPressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
	microTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
	microPlaca: { fontSize: 16, fontWeight: '800', color: DARK, letterSpacing: 0.5 },
	statusPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
	statusPillTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
	microRuta: { fontSize: 13, fontWeight: '600', color: '#486250', marginBottom: 10 },
	microStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	statBlock: { alignItems: 'center', minWidth: 70 },
	statValue: { fontSize: 15, fontWeight: '700', color: DARK },
	statLabel: { fontSize: 11, fontWeight: '600', color: '#586e60', marginTop: 2, letterSpacing: 0.4 },
	ocupWrapper: { alignItems: 'center', minWidth: 80 },
	ocupBarBg: { width: 68, height: 10, borderRadius: 6, backgroundColor: '#d8e7dd', overflow: 'hidden', marginBottom: 4 },
	ocupBarFill: { height: 10, backgroundColor: PRIMARY, borderRadius: 6 },
	ocupText: { fontSize: 11, fontWeight: '700', color: '#355040', letterSpacing: 0.4 },
	addButton: { marginTop: 4, marginHorizontal: 16, marginBottom: 60, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 22, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
	addButtonTxt: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }
});

