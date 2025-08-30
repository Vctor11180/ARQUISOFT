import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { View } from 'react-native';

// Iconos específicos para Tarjetas, Manillas y Pago NFC
// Se exponen como componentes simples para mantener consistencia visual

const baseSize = 28;

export const CardIcon = ({ size=baseSize, color='#42af56' }: { size?:number; color?:string }) => (
  <MaterialIcons name="credit-card" size={size} color={color} />
);

export const WearableIcon = ({ size=baseSize, color='#42af56' }: { size?:number; color?:string }) => (
  <MaterialIcons name="watch" size={size} color={color} />
);

export const NfcPayIcon = ({ size=baseSize, color='#42af56' }: { size?:number; color?:string }) => (
  <MaterialIcons name="nfc" size={size} color={color} />
);

export function IconBadge({ children, bg='rgba(66,175,86,0.12)', size=60 }: { children:React.ReactNode; bg?:string; size?:number }) {
  return (
    <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:bg, alignItems:'center', justifyContent:'center' }}>
      {children}
    </View>
  );
}
