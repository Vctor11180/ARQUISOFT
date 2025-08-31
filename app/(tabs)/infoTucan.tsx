import { ThemedText } from '@/components/ThemedText';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const PRIMARY = '#42af56';
const DARK = '#064420';
const BG = '#f6f9f7';
const BORDER = '#d9e8dd';
const LOGO_URL = 'https://res.cloudinary.com/dsqmynhve/image/upload/v1756544811/IMAGOTIPO_z3lcp9.png';

export default function InfoTucan() {
	const router = useRouter();
	const { t } = useTranslation();
	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 48 }}>
			<LinearGradient colors={['#064420', PRIMARY]} style={styles.hero}>
				<Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit='contain' />
				<ThemedText style={styles.heroTitle}>{t('infoTucan.title')}</ThemedText>
				<ThemedText style={styles.heroSubtitle}>{t('infoTucan.subtitle')}</ThemedText>
			</LinearGradient>

			<Section title={t('infoTucan.sections.mission')}>
				<ThemedText style={styles.p}>Simplificar la experiencia de transporte urbano conectando pasajeros, choferes, dueños de micros y sindicatos en un ecosistema digital transparente.</ThemedText>
			</Section>

			<Section title={t('infoTucan.sections.problems')}>
				<Bullet>Pagos fragmentados y poco claros.</Bullet>
				<Bullet>Falta de visibilidad de recorridos y rendimiento.</Bullet>
				<Bullet>Control manual de tarjetas y manillas.</Bullet>
				<Bullet>Escasa trazabilidad para flotas y sindicatos.</Bullet>
				<Bullet>Experiencia de usuario poco moderna.</Bullet>
			</Section>

			<Section title={t('infoTucan.sections.components')}>
				<Bullet>Tarjetas y manillas inteligentes para pagos ágiles.</Bullet>
				<Bullet>Panel del pasajero estilo banca para gestión de saldo.</Bullet>
				<Bullet>Registro de viajes y operación del chofer.</Bullet>
				<Bullet>Módulo de análisis para dueños de micro y sindicatos.</Bullet>
				<Bullet>Pagos NFC y soporte futuro para QR.</Bullet>
			</Section>

			<Section title={t('infoTucan.sections.benefits')}>
				<CardGrid>
					<BenefitCard title="Pasajero" points={['Recarga simple', 'Historial claro', 'Pagos rápidos']} />
					<BenefitCard title="Chofer" points={['Registro fácil', 'Menos efectivo', 'Flujo ordenado']} />
					<BenefitCard title="Dueño Micro" points={['Rendimiento', 'Control activos', 'Alertas']} />
					<BenefitCard title="Sindicato" points={['Visión global', 'Indicadores', 'Optimización']} />
				</CardGrid>
			</Section>

			<Section title={t('infoTucan.sections.security')}>
				<Bullet>Cifrado de transacciones y tokenización de medios de pago.</Bullet>
				<Bullet>Capas antifraude y validaciones en tiempo real.</Bullet>
				<Bullet>Diseño centrado en privacidad y mínimos datos.</Bullet>
			</Section>

			<Section title={t('infoTucan.sections.roadmap')}>
				<Bullet>Integración de tracking en tiempo real de unidades.</Bullet>
				<Bullet>Notificaciones inteligentes de saldo y viajes.</Bullet>
				<Bullet>Reportes avanzados y analítica predictiva.</Bullet>
				<Bullet>Marketplace de recargas y beneficios.</Bullet>
			</Section>

			<Pressable style={styles.cta} onPress={() => router.back()}>
				<ThemedText style={styles.ctaTxt}>{t('infoTucan.backButton')}</ThemedText>
			</Pressable>
		</ScrollView>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<View style={styles.section}>
			<ThemedText style={styles.sectionTitle}>{title}</ThemedText>
			{children}
		</View>
	);
}

function Bullet({ children }: { children: React.ReactNode }) {
	return (
		<View style={styles.bulletRow}>
			<View style={styles.bulletDot} />
			<ThemedText style={styles.bulletTxt}>{children}</ThemedText>
		</View>
	);
}

function CardGrid({ children }: { children: React.ReactNode }) {
	return <View style={styles.grid}>{children}</View>;
}

function BenefitCard({ title, points }: { title: string; points: string[] }) {
	return (
		<View style={styles.benefitCard}>
			<ThemedText style={styles.cardTitle}>{title}</ThemedText>
			{points.map(p => (
				<View key={p} style={styles.cardPointRow}>
					<View style={styles.cardPointDot} />
					<ThemedText style={styles.cardPointTxt}>{p}</ThemedText>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: BG },
	hero: { paddingTop: 72, paddingBottom: 56, paddingHorizontal: 24, alignItems: 'flex-start', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 12 },
	logo: { position: 'absolute', right: 10, top: 18, width: 130, height: 100, opacity: 0.18 },
	heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
	heroSubtitle: { color: '#e2f7ea', fontSize: 13, lineHeight: 18, maxWidth: 260, fontWeight: '500' },
	section: { paddingHorizontal: 20, paddingVertical: 12 },
	sectionTitle: { color: DARK, fontSize: 17, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },
	p: { color: '#274332', fontSize: 14, lineHeight: 20, fontWeight: '500' },
	bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
	bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY, marginTop: 6 },
	bulletTxt: { flex: 1, color: '#2d4a39', fontSize: 13.5, lineHeight: 19 },
	grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', paddingTop: 4 },
	benefitCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
	cardTitle: { color: DARK, fontSize: 14, fontWeight: '700', marginBottom: 6 },
	cardPointRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
	cardPointDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: PRIMARY },
	cardPointTxt: { color: '#365541', fontSize: 12.5, lineHeight: 16, fontWeight: '500' },
	cta: { marginTop: 12, alignSelf: 'center', backgroundColor: PRIMARY, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 28, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
	ctaTxt: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 }
});

