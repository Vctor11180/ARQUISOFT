import { supabase } from '@/lib/supabaseClient';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// Modelo de tarjeta. Ajusta campos según tu tabla real en Supabase.
export interface UserCard {
  id: string;
  user_id: string;
  alias: string;
  codigo: string;
  saldo: number;
  activa: boolean;
  tipo: 'FISICA' | 'VIRTUAL';
  colorA?: string | null;
  colorB?: string | null;
  viajesMes?: number | null;
  ultimoAbordaje?: string | null;
  rutaUltima?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface CardContextType {
  cards: UserCard[];
  loadingCards: boolean;
  errorCards: string | null;
  refreshCards: () => Promise<void>;
  createCard: (alias: string, tipo?: 'FISICA' | 'VIRTUAL') => Promise<{ error?: any }>;
  toggleActive: (cardId: string) => Promise<{ error?: any }>;
  deleteCard: (cardId: string) => Promise<{ error?: any }>;
  updating: boolean;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: React.ReactNode }) => {
  const { userProfile } = useAuth();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorCards, setErrorCards] = useState<string | null>(null);

  const refreshCards = useCallback(async () => {
    if (!userProfile) return;
    setLoadingCards(true);
    setErrorCards(null);
    try {
      const { data, error } = await supabase
        .from('Tarjetas')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: true });
      if (error) {
        setErrorCards(error.message);
      } else if (data) {
        setCards(data as UserCard[]);
      }
    } catch (e: any) {
      setErrorCards(e.message);
    } finally {
      setLoadingCards(false);
    }
  }, [userProfile]);

  useEffect(() => {
    refreshCards();
  }, [refreshCards]);

  const createCard = async (alias: string, tipo: 'FISICA' | 'VIRTUAL' = 'VIRTUAL') => {
    if (!userProfile) return { error: 'No user' };
    setUpdating(true);
    try {
      const codigo = 'T-' + Math.floor(Math.random() * 9000 + 1000);
      const colorA = tipo === 'FISICA' ? '#42af56' : '#0d5f2b';
      const colorB = tipo === 'FISICA' ? '#2e8741' : '#064420';
  let insertObj: any = {
        user_id: userProfile.id,
        alias,
        codigo,
        saldo: 0,
        activa: true,
        tipo,
        viajesMes: 0,
      };
  // Intentar incluir colores (si columnas no existen, se capturará el error y se reintenta)
      insertObj.colorA = colorA;
      insertObj.colorB = colorB;
      let { data, error } = await supabase.from('Tarjetas').insert(insertObj).select('*').single();
      if (error && /viajesMes|"viajesMes"/i.test(error.message)) {
        console.warn('[cards] Columna viajesMes no existe, reintento sin ese campo');
        delete insertObj.viajesMes;
        ({ data, error } = await supabase.from('Tarjetas').insert(insertObj).select('*').single());
      }
      if (error && /colorA|ColorA/i.test(error.message)) {
        console.warn('[cards] Column colorA no existe, reintento sin colores');
        delete insertObj.colorA;
        delete insertObj.colorB;
        ({ data, error } = await supabase.from('Tarjetas').insert(insertObj).select('*').single());
      }
      if (error) return { error };
      if (data) setCards(prev => [...prev, data as UserCard]);
      return { error: null };
    } catch (e) {
      return { error: e };
    } finally {
      setUpdating(false);
    }
  };

  const toggleActive = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return { error: 'Card not found' };
    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('Tarjetas')
        .update({ activa: !card.activa })
        .eq('id', cardId)
        .select('*')
        .single();
      if (error) return { error };
      if (data) setCards(prev => prev.map(c => c.id === cardId ? data as UserCard : c));
      return { error: null };
    } catch (e) {
      return { error: e };
    } finally {
      setUpdating(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('Tarjetas')
        .delete()
        .eq('id', cardId);
      if (error) return { error };
      setCards(prev => prev.filter(c => c.id !== cardId));
      return { error: null };
    } catch (e) {
      return { error: e };
    } finally {
      setUpdating(false);
    }
  };

  return (
  <CardContext.Provider value={{ cards, loadingCards, errorCards, refreshCards, createCard, toggleActive, deleteCard, updating }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCards must be used within CardProvider');
  return ctx;
};

/* Nota para la base de datos (crear manualmente en Supabase si aún no existe):
create table public."Tarjetas" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  alias text not null,
  codigo text not null,
  saldo numeric default 0,
  activa boolean default true,
  tipo text check (tipo in ('FISICA','VIRTUAL')) default 'VIRTUAL',
  colorA text,
  colorB text,
  viajesMes int default 0,
  "ultimoAbordaje" text,
  "rutaUltima" text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public."Tarjetas" (user_id);
*/
