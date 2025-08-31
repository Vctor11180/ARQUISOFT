import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const PRIMARY = '#42af56';
const DARK = '#064420';
const BG = '#f6f9f7';
const BORDER = '#d9e8dd';

export default function SindicatoScreen() {
	const { t } = useTranslation();
	const [sindicatos] = useState([
		{ id: 'S1', nombre: 'Sindicato 17 de Mayo', micros: 12, choferes: 26, activos: 10, ingresosHoy: 3200, variacion: +6 },
		{ id: 'S2', nombre: 'Union Línea 38', micros: 18, choferes: 40, activos: 15, ingresosHoy: 5150, variacion: -3 },
		{ id: 'S3', nombre: 'Cooperativa Norte', micros: 9, choferes: 22, activos: 7, ingresosHoy: 2100, variacion: +11 },
	]);

	const totalMicros = sindicatos.reduce((s, x) => s + x.micros, 0);
	const totalChoferes = sindicatos.reduce((s, x) => s + x.choferes, 0);
	const totalActivos = sindicatos.reduce((s, x) => s + x.activos, 0);
	const totalIngresos = sindicatos.reduce((s, x) => s + x.ingresosHoy, 0);

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 50 }}>
			<LinearGradient colors={['#064420', PRIMARY]} style={styles.hero}>
				<ThemedText style={styles.heroTitle}>{t('sindicato.title')}</ThemedText>
				<ThemedText style={styles.heroSubtitle}>{t('sindicato.subtitle')}</ThemedText>
			</LinearGradient>

			<View style={styles.totalsRow}>
				<TotalBox label={t('sindicato.totals.sindicatos')} value={sindicatos.length.toString()} />
				<TotalBox label={t('sindicato.totals.micros')} value={totalMicros.toString()} />
				<TotalBox label={t('sindicato.totals.choferes')} value={totalChoferes.toString()} />
				<TotalBox label={t('sindicato.totals.activos')} value={totalActivos.toString()} />
			</View>

			<View style={styles.ingresosBox}>
				<ThemedText style={styles.ingresosLabel}>{t('sindicato.ingresos.label')}</ThemedText>
				<ThemedText style={styles.ingresosValue}>{totalIngresos} Bs</ThemedText>
			</View>

			<ThemedText style={styles.sectionTitle}>{t('sindicato.ingresos.title')}</ThemedText>
			{sindicatos.map(s => (
				<Pressable key={s.id} style={({ pressed }) => [styles.sindicatoCard, pressed && styles.sindicatoCardPressed]}>
					<ThemedText style={styles.sindicatoName}>{s.nombre}</ThemedText>
					<View style={styles.sRow}>
						<InfoPill label='Micros' value={s.micros} />
						<InfoPill label='Choferes' value={s.choferes} />
						<InfoPill label='Activos' value={s.activos} />
					</View>
					<View style={styles.sBottomRow}>
						<View style={styles.varWrapper}>
							<ThemedText style={[styles.varValue, s.variacion >= 0 ? styles.varUp : styles.varDown]}>
								{s.variacion >= 0 ? '+' + s.variacion : s.variacion}%
							</ThemedText>
							<ThemedText style={styles.varLabel}>{t('sindicato.variation')}</ThemedText>
						</View>
						<ThemedText style={styles.sIngresos}>{s.ingresosHoy} Bs</ThemedText>
					</View>
				</Pressable>
			))}

			<Pressable style={styles.addButton} onPress={() => {/* futuro: agregar sindicato */ }}>
				<ThemedText style={styles.addButtonTxt}>{t('sindicato.addButton')}</ThemedText>
			</Pressable>
		</ScrollView>
	);
}

function TotalBox({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.totalBox}>
			<ThemedText style={styles.totalValue}>{value}</ThemedText>
			<ThemedText style={styles.totalLabel}>{label}</ThemedText>
		</View>
	);
}

function InfoPill({ label, value }: { label: string; value: number }) {
	return (
		<View style={styles.infoPill}>
			<ThemedText style={styles.infoPillValue}>{value}</ThemedText>
			<ThemedText style={styles.infoPillLabel}>{label}</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: BG },
	hero: { paddingTop: 68, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 16 },
	heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
	heroSubtitle: { color: '#e3f6ea', fontSize: 13, fontWeight: '500', marginTop: 4, letterSpacing: 0.4 },
	totalsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
	totalBox: { flexGrow: 1, flexBasis: '22%', minWidth: 80, backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
	totalValue: { fontSize: 17, fontWeight: '800', color: DARK },
	totalLabel: { fontSize: 11, fontWeight: '600', color: '#4d6456', marginTop: 4, letterSpacing: 0.4, textTransform: 'uppercase' },
	ingresosBox: { backgroundColor: '#ffffff', marginHorizontal: 16, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, marginBottom: 14 },
	ingresosLabel: { fontSize: 12, fontWeight: '600', color: '#486250', letterSpacing: 0.4, textTransform: 'uppercase' },
	ingresosValue: { fontSize: 28, fontWeight: '800', color: DARK, marginTop: 6, letterSpacing: 0.5 },
	sectionTitle: { fontSize: 18, fontWeight: '800', color: DARK, paddingHorizontal: 20, marginBottom: 10, letterSpacing: 0.5 },
	sindicatoCard: { backgroundColor: '#ffffff', marginHorizontal: 16, marginBottom: 14, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
	sindicatoCardPressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
	sindicatoName: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 10, letterSpacing: 0.5 },
	sRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
	infoPill: { flex: 1, backgroundColor: '#f0faf3', borderRadius: 14, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#cfe6d6' },
	infoPillValue: { fontSize: 15, fontWeight: '700', color: DARK },
	infoPillLabel: { fontSize: 11, fontWeight: '600', color: '#5b6f63', marginTop: 4, letterSpacing: 0.4 },
	sBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
	varWrapper: { alignItems: 'center' },
	varValue: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
	varUp: { color: '#15803d' },
	varDown: { color: '#b91c1c' },
	varLabel: { fontSize: 11, fontWeight: '600', color: '#586e60', marginTop: 4, letterSpacing: 0.4, textTransform: 'uppercase' },
	sIngresos: { fontSize: 18, fontWeight: '800', color: DARK, letterSpacing: 0.5 },
	addButton: { marginTop: 4, marginHorizontal: 16, marginBottom: 60, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
	addButtonTxt: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});

