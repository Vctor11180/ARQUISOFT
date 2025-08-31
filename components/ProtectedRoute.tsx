import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireUserType?: number; // 1: pasajero, 2: chofer, 3: dueño, 4: dirigente
}

export function ProtectedRoute({ children, fallback, requireUserType }: ProtectedRouteProps) {
  const { session, userProfile, loading } = useAuth();

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <LinearGradient 
        colors={['#42af56', '#2d8b3d']} 
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <ThemedText style={styles.loadingText}>Verificando sesión...</ThemedText>
      </LinearGradient>
    );
  }

  // Si no hay sesión, mostrar fallback (pantalla de login)
  if (!session || !userProfile) {
    return fallback ? <>{fallback}</> : null;
  }

  // Si se requiere un tipo de usuario específico
  if (requireUserType && userProfile.tipo !== requireUserType) {
    const getUserTypeName = (tipo?: number) => {
      switch (tipo) {
        case 1: return 'pasajeros';
        case 2: return 'conductores';
        case 3: return 'dueños de micro';
        case 4: return 'dirigentes';
        default: return 'usuarios autorizados';
      }
    };

    return (
      <LinearGradient 
        colors={['#ef4444', '#dc2626']} 
        style={styles.errorContainer}
      >
        <ThemedText style={styles.errorTitle}>Acceso Denegado</ThemedText>
        <ThemedText style={styles.errorText}>
          Esta sección es solo para {getUserTypeName(requireUserType)}
        </ThemedText>
      </LinearGradient>
    );
  }

  // Todo ok, mostrar contenido protegido
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
});
