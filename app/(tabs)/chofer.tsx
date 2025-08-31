import { ThemedText } from '@/components/ThemedText';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

// --- Constantes y Tipos (Fuera del componente) ---
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

const toucanImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzbyTb59rqOn1Hf4zyOCSN558QRJXjdqKQ0I0P1RE9I9cO4ILh_Gm6KI4N68VSjMWglNWXbMvbBlmEK78MvftwbM71sVuIRIJG3oinvTit3y2itd_LdyGxAGo_ZXZo2mkuGax8IzNQbzA-kvxOSvX74ivzTOmMJRa3mUMm5IixTCjvEOSgakHJ2cWV2CS0Fi7JIrfDQ4asJD750z3v7SnbuI5Jwi80gCLcVhuvc2kLgaat6Pe2zXIeZ3-BvRAFu0RmX_dBOmcr';
const leavesLeft = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi5Hudz9HqNn74JcNFDaC71znohBidf_67i_pP6toPURAwyNziXOUnk-7n18XtAMj4AP-JEEn2F44DmkAESXcEX0Jyb58iBj8mkb0wO9QyAFs5Gec68UTCgEGmK4CGHTL0m5YhLt1fj5sGTKVRp1UkZT1tx6HSuRoofn9HVknFwRkT36cBGcwchldUMBSlv-xNohVvDfFHG_syT7js-tLzr9dcU7dusZ_RaBfsZuAtHerSB-TfUCa46C6pyL4XotOiE-DttP3C';
const leavesRight = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsZkRA4RfxQCu75LonCZyfRSpv_SoxMwzuNc60zc5WwyWpiqHAB5CihIL6kNKQKPsIytnLOtWY64LfKWVTkSVAvmunDiEtlbujjHptn6BZ04Imk13VMv1r9ZyePQBdSUxMUyrIgb5H0myMzTMVcnDAaxW6lbhb6GtuUwcVI_72-UPw0goC7k6AklKW4vpYU0rFbvgDhWoOaEeOS7FEj6n2SH-RQeritEIyLJZROHBHS3oeUPu8GIz9Q1zhlW7oKHAbhshk9Ld2';

// --- Componente Principal ---
export default function DriverPanelScreen() {
    const { t } = useTranslation();
    const [balance, setBalance] = useState(125.75);
    const [hidden, setHidden] = useState(false);
    const [passengers, setPassengers] = useState<Passenger[]>([
        { id: '1', name: 'María G.', cardId: 'TUC-2345', status: 'a bordo', fare: 2.5 },
        { id: '2', name: 'Luis P.', cardId: 'TUC-1881', status: 'a bordo', fare: 2.5 },
        { id: '3', name: 'Anita R.', cardId: 'TUC-9920', status: 'a bordo', fare: 2.5 },
    ]);
    const [transfiriendo, setTransfiriendo] = useState(false);
    const [recibiendoNFC, setRecibiendoNFC] = useState(false);
    const [showNFCModal, setShowNFCModal] = useState(false);
    const [showPush, setShowPush] = useState(false);

    function simulateBoard() {
        const id = Date.now().toString();
        const newP: Passenger = { id, name: 'Pasajero ' + id.slice(-3), cardId: 'TUC-' + (1000 + Math.floor(Math.random() * 9000)), status: 'a bordo', fare: 2.5 };
        setPassengers(p => [newP, ...p]);
        setBalance(b => b + newP.fare);
    }

    function settleShift() {
        setPassengers([]);
    }

    const handleTransferir = () => {
        if (balance <= 0) return;
        setTransfiriendo(true);
        setTimeout(() => {
            setBalance(0);
            setTransfiriendo(false);
            alert(t('chofer.alerts.transferSuccess'));
        }, 1200);
    };

    const handleRecibirNFC = () => {
        setShowNFCModal(true);
        setRecibiendoNFC(true);
        setTimeout(() => {
            setBalance(b => b + 5);
            setRecibiendoNFC(false);
            setShowNFCModal(false);
            setShowPush(true);
            setTimeout(() => setShowPush(false), 2200);
        }, 1800);
    };

    const onboardCount = passengers.filter(p => p.status === 'a bordo').length;

    return (
        <View style={styles.screen}>
            <LinearGradient colors={[DARK, PRIMARY]} style={styles.header}>
                <View style={styles.decorLayer} pointerEvents="none">
                    <Image source={{ uri: leavesLeft }} style={styles.imgLeft} />
                    <Image source={{ uri: leavesRight }} style={styles.imgRight} />
                </View>
                <View style={styles.headerRow}>
                    <View style={styles.illustrationBox}>
                        <Image source={{ uri: toucanImg }} style={styles.toucan} contentFit="contain" />
                    </View>
                    <View style={styles.headerTextCol}>
                        <ThemedText style={styles.headerTitle}>{t('chofer.title')}</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>{t('chofer.subtitle')}</ThemedText>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, paddingTop: 12 }}>
                {/* --- Sección de Saldo y Acciones --- */}
                <View style={styles.section}>
                    <View style={styles.balanceRow}>
                        <View style={{ flex: 1 }}>
                            <ThemedText style={styles.balanceLabel}>{t('chofer.balanceLabel')}</ThemedText>
                            <ThemedText style={styles.balanceValue}>{hidden ? '••••' : balance.toFixed(2) + ' Bs'}</ThemedText>
                        </View>
                        <Pressable style={styles.toggleBtn} onPress={() => setHidden(h => !h)}>
                            <ThemedText style={styles.toggleTxt}>{hidden ? t('chofer.balance.show') : t('chofer.balance.hide')}</ThemedText>
                        </Pressable>
                    </View>

                    <Pressable style={[styles.transferBtn, balance <= 0 && { opacity: 0.5 }]} onPress={handleTransferir} disabled={balance <= 0 || transfiriendo}>
                        <ThemedText style={styles.transferBtnTxt}>{transfiriendo ? t('chofer.actions.transferring') : t('chofer.actions.transferToAccount')}</ThemedText>
                    </Pressable>

                    <Pressable style={[styles.nfcBtn, recibiendoNFC && { opacity: 0.7 }]} onPress={handleRecibirNFC} disabled={recibiendoNFC}>
                        <ThemedText style={styles.nfcBtnTxt}>{recibiendoNFC ? t('chofer.actions.listeningNFC') : t('chofer.actions.receiveNFC')}</ThemedText>
                    </Pressable>

                    <View style={styles.actionsRow}>
                        <ActionChip label={t('chofer.actions.passengerBoards')} onPress={simulateBoard} />
                        <ActionChip label={t('chofer.actions.closeShift')} variant='warn' onPress={settleShift} />
                    </View>
                </View>

                {/* --- Sección de Pasajeros --- */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>{t('chofer.passengers.currentTitle')} ({onboardCount})</ThemedText>
                    {passengers.length === 0 && (
                        <View style={styles.emptyBox}>
                            <ThemedText style={styles.emptyTxt}>{t('chofer.passengers.emptyMessage')}</ThemedText>
                        </View>
                    )}
                    {passengers.map(p => (
                        <View key={p.id} style={[styles.passengerCard, p.status === 'bajó' && styles.passengerInactive]}>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={styles.passengerName}>{p.name}</ThemedText>
                                <ThemedText style={styles.passengerMeta}>{p.cardId} • {p.fare.toFixed(2)} Bs</ThemedText>
                                <View style={[styles.statusBadge, p.status === 'bajó' && styles.statusBadgeLeft]}>
                                    <ThemedText style={styles.statusBadgeTxt}>{p.status === 'a bordo' ? t('chofer.passengers.onboard') : t('chofer.passengers.offboard')}</ThemedText>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* --- Overlays (se mantienen fuera del ScrollView para posicionarse sobre todo) --- */}
            {showNFCModal && (
                <View style={styles.nfcOverlay}>
                    <View style={styles.nfcAnimCircle}>
                        <Image source={{ uri: toucanImg }} style={{ width: 54, height: 54 }} />
                    </View>
                    <ThemedText style={styles.nfcOverlayTxt}>{t('chofer.nfc.overlayText')}</ThemedText>
                </View>
            )}

            {showPush && (
                <View style={styles.pushNotif}>
                    <ThemedText style={styles.pushNotifTxt}>{t('chofer.nfc.paymentReceived')}</ThemedText>
                </View>
            )}
        </View>
    );
}

// --- Componente Auxiliar ---
function ActionChip({ label, onPress, variant }: { label: string; onPress: () => void; variant?: 'warn' }) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [
            styles.actionChip,
            variant === 'warn' && styles.actionChipWarn,
            pressed && { opacity: 0.85 }
        ]}>
            <ThemedText style={[styles.actionChipTxt, variant === 'warn' && styles.actionChipTxtWarn]}>{label}</ThemedText>
        </Pressable>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: BG },
    header: { paddingTop: 68, paddingBottom: 48, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
    decorLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    imgLeft: { position: 'absolute', left: -20, top: 40, width: 100, height: 100, opacity: 0.1 },
    imgRight: { position: 'absolute', right: -30, top: 10, width: 120, height: 120, opacity: 0.1 },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    illustrationBox: { width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    toucan: { width: 50, height: 50 },
    headerTextCol: { flex: 1 },
    headerTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: 0.5 },
    headerSubtitle: { color: '#e3f6ea', fontSize: 13, fontWeight: '500', marginTop: 4, letterSpacing: 0.4 },
    section: { backgroundColor: '#ffffff', marginHorizontal: 16, marginBottom: 18, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BORDER, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
    balanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    balanceLabel: { color: DARK, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
    balanceValue: { color: DARK, fontSize: 28, fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
    toggleBtn: { backgroundColor: PRIMARY, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
    toggleTxt: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
    actionsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
    actionChip: { flex: 1, backgroundColor: '#e4f7ea', paddingVertical: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#c6e9d0' },
    actionChipWarn: { backgroundColor: '#fff4e0', borderColor: '#f7d8a8' },
    actionChipTxt: { color: DARK, fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
    actionChipTxtWarn: { color: AMBER },
    sectionTitle: { color: DARK, fontSize: 16, fontWeight: '700', marginBottom: 12, letterSpacing: 0.4 },
    emptyBox: { paddingVertical: 32, alignItems: 'center' },
    emptyTxt: { color: '#46604f', fontSize: 13 },
    passengerCard: { flexDirection: 'row', padding: 14, borderRadius: 16, backgroundColor: '#f0faf3', borderWidth: 1, borderColor: '#cfe6d6', marginBottom: 12, alignItems: 'center' },
    passengerInactive: { backgroundColor: '#f8f9f9', opacity: 0.75 },
    passengerName: { color: DARK, fontSize: 14.5, fontWeight: '700', letterSpacing: 0.3 },
    passengerMeta: { color: '#486250', fontSize: 12, marginTop: 2 },
    statusBadge: { marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, backgroundColor: PRIMARY },
    statusBadgeLeft: { backgroundColor: '#9ca3af' },
    statusBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
    transferBtn: { backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 8 },
    transferBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
    nfcBtn: { backgroundColor: DARK, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
    nfcBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
    nfcOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    nfcAnimCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    nfcOverlayTxt: { color: '#fff', marginTop: 16, fontWeight: '600', fontSize: 16 },
    pushNotif: { position: 'absolute', top: 50, left: 16, right: 16, backgroundColor: DARK, padding: 16, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    pushNotifTxt: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});