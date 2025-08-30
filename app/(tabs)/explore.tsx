import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { StyleSheet } from 'react-native';
import { FeatureCard } from '@/components/FeatureCard';

const GREEN = '#218838';
const GREEN_DARK = '#145a32';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f2fbf5', dark: '#0f1f13' }}
      headerImage={
        <IconSymbol
          size={260}
          color="#ffffff22"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.headerBlock}>
        <ThemedText type="title" style={styles.title}>Sobre la App</ThemedText>
        <ThemedText style={styles.subtitle}>Camballey: movilidad organizada y transparente.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.gridBlock}>
        <FeatureCard title="Rutas" description="Visualiza recorridos y paradas cercanas." icon="paperplane.fill" />
        <FeatureCard title="Flota" description="Estado y disponibilidad de unidades." icon="house.fill" />
        <FeatureCard title="Mantenimiento" description="Alertas de servicio preventivo." icon="chevron.right" />
        <FeatureCard title="Reportes" description="Incidencias y feedback ciudadanos." icon="chevron.left.forwardslash.chevron.right" />
      </ThemedView>

      <Collapsible title="Roadmap visual 2025">
        <ThemedView style={styles.timeline}>
          <ThemedView style={styles.timeItem}>
            <ThemedText style={styles.timeBadge}>Q1</ThemedText>
            <ThemedText style={styles.timeText}>MVP roles + base de datos</ThemedText>
          </ThemedView>
          <ThemedView style={styles.timeItem}>
            <ThemedText style={styles.timeBadge}>Q2</ThemedText>
            <ThemedText style={styles.timeText}>Tracking en tiempo real y métricas</ThemedText>
          </ThemedView>
            <ThemedView style={styles.timeItem}>
            <ThemedText style={styles.timeBadge}>Q3</ThemedText>
            <ThemedText style={styles.timeText}>Optimización flota + IA básica</ThemedText>
          </ThemedView>
          <ThemedView style={styles.timeItem}>
            <ThemedText style={styles.timeBadge}>Q4</ThemedText>
            <ThemedText style={styles.timeText}>Expansión multi-ciudad</ThemedText>
          </ThemedView>
        </ThemedView>
      </Collapsible>

      <Collapsible title="Misión">
        <ThemedText>
          Facilitar la interacción entre pasajeros, choferes y administradores del transporte urbano
          en Santa Cruz, digitalizando procesos y mejorando la seguridad y eficiencia.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Perfiles y valor">
        <ThemedText>
          Pasajero: rastreo básico de rutas, notificaciones y feedback.{"\n"}
          Chofer: registro de recorridos y estado del vehículo.{"\n"}
          Dueño de micro: control de unidades, mantenimiento y rendimiento.{"\n"}
          Sindicato: analítica agregada y monitoreo de operación.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Funciones clave (MVP)">
        <ThemedText>
          1. Selección de rol y personalización básica.{"\n"}
          2. Registro / autenticación (próximo).{"\n"}
          3. Panel de estado para chofer / unidad (próximo).{"\n"}
          4. Métricas operativas para sindicato (planeado).{"\n"}
          5. Notificaciones de eventos (planeado).
        </ThemedText>
      </Collapsible>

      <Collapsible title="Tecnología">
        <ThemedText>
          Construido con Expo + React Native, componentes theming propios y potencial integración
          futura con mapas y servicios en tiempo real.
        </ThemedText>
        <ExternalLink href="https://expo.dev">
          <ThemedText type="link">Expo</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Próximas mejoras">
        <ThemedText>
          • Persistencia local del rol seleccionado.{"\n"}
          • Flujos de autenticación y permisos.{"\n"}
          • Integración GPS y tiempo estimado de llegada.{"\n"}
          • Panel de incidencias y reportes rápidos.{"\n"}
          • Optimización de consumo de batería.
        </ThemedText>
      </Collapsible>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>Versión 0.1.0 • Hackatón</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    position: 'absolute',
    bottom: -60,
    left: -40,
  },
  headerBlock: {
    marginBottom: 20,
    gap: 6,
  },
  title: {
    color: GREEN_DARK,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a6b55',
    lineHeight: 18,
  },
  footer: {
    marginTop: 28,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e1ece5',
  },
  footerText: {
    fontSize: 12,
    color: '#5b6f63',
  },
  gridBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 12,
    marginTop: 8,
    gap: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBadge: {
    backgroundColor: '#218838',
    color: '#fff',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 13,
    color: '#2f4a38',
  },
});
