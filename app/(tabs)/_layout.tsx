import { Tabs } from 'expo-router';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function TabLayout() {
  return (
        <AuthProvider>

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="landing" />
      <Tabs.Screen name="passenger" />
      <Tabs.Screen name="chofer" />
      <Tabs.Screen name="dueno" />
      <Tabs.Screen name="sindicato" />
      <Tabs.Screen name="infoTucan" />
      <Tabs.Screen name="interfazPago" />
      <Tabs.Screen name="mapa" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="sesion" />
      <Tabs.Screen name="register" />
    </Tabs>
        </AuthProvider>
  );
}
