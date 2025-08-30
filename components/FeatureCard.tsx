import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  accent?: string;
  style?: ViewStyle;
}

export function FeatureCard({ title, description, icon, accent = '#218838', style }: FeatureCardProps) {
  return (
    <ThemedView style={[styles.card, style]}> 
      <View style={[styles.iconWrap, { backgroundColor: accent + '15' }]}> 
        <IconSymbol name={icon} size={22} color={accent} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.desc}>{description}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e6efe9',
    shadowColor: '#218838',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
});
