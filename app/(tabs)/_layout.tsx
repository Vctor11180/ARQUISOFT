import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="beneficios" />
      <Tabs.Screen name="recargar" />
    </Tabs>
  );
}
