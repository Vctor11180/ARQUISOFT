import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

const GREEN = '#218838';
const GREEN_DARK = '#145a32';
type SFSymbols6_0 = "person.fill" | "house.fill" | "trash.fill" | "bus.fill" ;


export default function RolFullScreen() {
  // 1. Lee los parámetros de la URL
  const params = useLocalSearchParams<{
    title: string;
    desc: string;
    icon: string;
    points: string; // Se recibe como string
  }>();

  // 2. Construye el objeto 'meta' a partir de los parámetros
  const meta = {
    title: params.title || 'Sin Título',
    desc: params.desc || 'Sin Descripción',
    icon: params.icon || 'questionmark.circle',
    points: [], // Valor por defecto
  };

  // 3. Deserializa los 'points' de forma segura
  try {
    if (params.points) {
      meta.points = JSON.parse(params.points);
    }
  } catch (e) {
    console.error("Error al parsear los points:", e);
  }

  // 4. Ahora puedes usar 'meta' en tu JSX como antes
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ThemedText style={styles.backTxt}>Volver</ThemedText>
        </Pressable>
        {/* El resto de tu JSX funciona sin cambios */}
        <IconSymbol name={meta.icon as SFSymbols6_0} size={56} color={GREEN} />
        <ThemedText type="title" style={styles.title}>{meta.title} </ThemedText>
        <ThemedText style={styles.desc}>{meta.desc}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Funciones previstas</ThemedText>
        {meta.points.map(p => (
          <ThemedText key={p} style={styles.point}>• {p}</ThemedText>
        ))}
      </ThemedView>
      {/* ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5ec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  backTxt: {
    color: GREEN_DARK,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: GREEN_DARK,
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4d6858',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e3efe6',
  },
  sectionTitle: {
    color: GREEN_DARK,
  },
  point: {
    fontSize: 13,
    color: '#2f4a38',
    lineHeight: 18,
  },
});
