import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CardProvider } from '@/contexts/CardContext';
import { Tabs } from 'expo-router';
import React from 'react';

function RoleAwareTabs() {
  const { userProfile } = useAuth();
  const tipo = userProfile?.tipo; // 1: pasajero, 2: chofer, 3: dueño, 4: dirigente
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      {/* Pantalla índice siempre */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="landing" />
      <Tabs.Screen name="sesion" />
      <Tabs.Screen name="register" />
      <Tabs.Screen name="info-inicial" />
      <Tabs.Screen name="infoTucan" />
      <Tabs.Screen name="interfazPago" />
      <Tabs.Screen name="mapa" />
      <Tabs.Screen name="explore" />
      {/* Condicionales por rol */}
      {tipo === 1 && <Tabs.Screen name="passenger" />}
      {tipo === 2 && <Tabs.Screen name="chofer" />}
      {tipo === 3 && <Tabs.Screen name="dueno" />}
      {tipo === 4 && <Tabs.Screen name="sindicato" />}
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <CardProvider>
        <RoleAwareTabs />
      </CardProvider>
    </AuthProvider>
  );
}
