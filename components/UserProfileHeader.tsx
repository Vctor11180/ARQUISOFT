import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

export function UserProfileHeader() {
  const { userProfile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: signOut },
      ]
    );
  };

  if (!userProfile) return null;

  const getUserTypeInfo = () => {
    switch (userProfile.tipo) {
      case 1: return { icon: 'person.fill', label: 'Pasajero' };
      case 2: return { icon: 'car.fill', label: 'Conductor' };
      case 3: return { icon: 'building.2.fill', label: 'Dueño' };
      case 4: return { icon: 'crown.fill', label: 'Dirigente' };
      default: return { icon: 'person.fill', label: 'Usuario' };
    }
  };

  const userTypeInfo = getUserTypeInfo();

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <IconSymbol 
            name={userTypeInfo.icon as any} 
            size={24} 
            color="#42af56" 
          />
        </View>
        <View style={styles.textInfo}>
          <ThemedText style={styles.name}>{userProfile.full_name}</ThemedText>
          <ThemedText style={styles.type}>
            {userTypeInfo.label}
          </ThemedText>
        </View>
      </View>
      
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#ef4444" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(66,175,86,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInfo: {
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  type: {
    fontSize: 14,
    color: '#64748b',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
