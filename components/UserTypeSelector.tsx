import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface UserTypeSelectorProps {
  onComplete?: () => void;
}

export function UserTypeSelector({ onComplete }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUserType } = useAuth();

  const userTypes = [
    { id: 1, title: 'Pasajero', description: 'Viajo en micros y pago por el transporte', icon: '🚶‍♂️' },
    { id: 2, title: 'Conductor', description: 'Manejo un micro y cobro pasajes', icon: '🚗' },
    { id: 3, title: 'Dueño de Micro', description: 'Soy propietario de uno o más micros', icon: '🚌' },
    { id: 4, title: 'Dirigente', description: 'Dirijo un sindicato o asociación', icon: '👔' },
  ];

  const handleSelectType = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Por favor selecciona un tipo de usuario');
      return;
    }

    setLoading(true);
    try {
      await updateUserType(selectedType);
      Alert.alert(
        'Éxito', 
        'Tipo de usuario configurado correctamente',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al configurar tipo de usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#42af56', '#2d8b3d']} 
      style={styles.container}
    >
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Selecciona tu rol</ThemedText>
        <ThemedText style={styles.subtitle}>
          Elige cómo vas a usar CamballeyApp
        </ThemedText>

        <View style={styles.optionsContainer}>
          {userTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.option,
                selectedType === type.id && styles.selectedOption
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text style={styles.icon}>{type.icon}</Text>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  selectedType === type.id && styles.selectedText
                ]}>
                  {type.title}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedType === type.id && styles.selectedDescription
                ]}>
                  {type.description}
                </Text>
              </View>
              <View style={[
                styles.radio,
                selectedType === type.id && styles.radioSelected
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedType && styles.disabledButton
          ]}
          onPress={handleSelectType}
          disabled={!selectedType || loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Selección</Text>
          )}
        </TouchableOpacity>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2d8b3d',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedOption: {
    backgroundColor: '#e8f5e8',
    borderColor: '#2d8b3d',
  },
  icon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  selectedText: {
    color: '#2d8b3d',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedDescription: {
    color: '#2d8b3d',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  radioSelected: {
    borderColor: '#2d8b3d',
    backgroundColor: '#2d8b3d',
  },
  confirmButton: {
    backgroundColor: '#2d8b3d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
