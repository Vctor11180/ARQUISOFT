import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

interface PaymentNotification {
  id: string;
  type: 'payment_request' | 'payment_completed' | 'payment_failed';
  amount: number;
  cardId: string;
  passengerName: string;
  timestamp: string;
}

interface PaymentContextType {
  isDriverWaitingForPayment: boolean;
  isPassengerPaymentActive: boolean;
  notifications: PaymentNotification[];
  startPaymentRequest: () => void;
  processPassengerPayment: (amount: number, cardId: string, passengerName: string) => void;
  clearNotifications: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isDriverWaitingForPayment, setIsDriverWaitingForPayment] = useState(false);
  const [isPassengerPaymentActive, setIsPassengerPaymentActive] = useState(false);
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);

  const startPaymentRequest = useCallback(() => {
    setIsDriverWaitingForPayment(true);
    setIsPassengerPaymentActive(true);
    
    // Simular timeout de 30 segundos
    setTimeout(() => {
      setIsDriverWaitingForPayment(false);
      setIsPassengerPaymentActive(false);
    }, 30000);
  }, []);

  const processPassengerPayment = useCallback((amount: number, cardId: string, passengerName: string) => {
    const notification: PaymentNotification = {
      id: Date.now().toString(),
      type: 'payment_completed',
      amount,
      cardId,
      passengerName,
      timestamp: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    };

    setNotifications(prev => [notification, ...prev]);
    setIsDriverWaitingForPayment(false);
    setIsPassengerPaymentActive(false);

    // Mostrar notificación push simulada
    Alert.alert(
      '💰 Pago Recibido',
      `${passengerName} pagó ${amount.toFixed(2)} Bs\nTarjeta: ${cardId}`,
      [{ text: 'OK' }]
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <PaymentContext.Provider value={{
      isDriverWaitingForPayment,
      isPassengerPaymentActive,
      notifications,
      startPaymentRequest,
      processPassengerPayment,
      clearNotifications
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
