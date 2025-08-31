import { supabase } from '@/lib/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  tipo?: number; // 1: pasajero, 2: chofer, 3: dueño, 4: dirigente
  telefono?: string | null;
  numero_cuenta?: string | null;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  updateUserType: (tipo: number) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSION: '@app_session',
  USER_PROFILE: '@user_profile',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde AsyncStorage al iniciar
  useEffect(() => {
    loadStoredSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listener para cambios de auth en Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (session) {
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user.id);
          await storeSession(session);
        } else {
          setSession(null);
          setUser(null);
          setUserProfile(null);
          await clearStoredSession();
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStoredSession = async () => {
    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      
      if (storedSession && storedProfile) {
        const profileData = JSON.parse(storedProfile);
        
        // Verificar si la sesión sigue siendo válida
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setUserProfile(profileData);
        } else {
          await clearStoredSession();
        }
      }
    } catch (error) {
      console.error('Error loading stored session:', error);
      await clearStoredSession();
    } finally {
      setLoading(false);
    }
  };

  const storeSession = async (session: Session) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      if (userProfile) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Error storing session:', error);
    }
  };

  const clearStoredSession = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.SESSION, STORAGE_KEYS.USER_PROFILE]);
    } catch (error) {
      console.error('Error clearing stored session:', error);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      // Intentar cargar desde la tabla Usuarios personalizada primero
      const { data: customProfile, error: customError } = await supabase
        .from('Usuarios')
        .select('id,email,full_name,tipo,telefono,numero_cuenta,created_at')
        .eq('id', userId)
        .single();

      if (customProfile && !customError) {
        const profile: UserProfile = {
          id: customProfile.id,
          email: customProfile.email,
          full_name: customProfile.full_name,
            tipo: customProfile.tipo,
            telefono: customProfile.telefono,
            numero_cuenta: customProfile.numero_cuenta,
          created_at: customProfile.created_at,
        };
        setUserProfile(profile);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
        return;
      }

      // Si no existe en tabla personalizada, crear desde auth.users
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser.user) {
        const newProfile: UserProfile = {
          id: authUser.user.id,
          email: authUser.user.email || '',
          full_name: authUser.user.user_metadata?.full_name || 'Usuario',
          created_at: authUser.user.created_at,
        };

        // Crear en tabla Usuarios
        const { error: insertError } = await supabase
          .from('Usuarios')
          .insert([{ ...newProfile }]);

        if (!insertError) {
          setUserProfile(newProfile);
          await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateUserType = async (tipo: number) => {
    if (!userProfile) {
      return { error: 'No user profile found' };
    }

    try {
      const { error } = await supabase
        .from('Usuarios')
        .update({ tipo })
        .eq('id', userProfile.id);

      if (error) {
        return { error };
      }

      // Recargar perfil desde Supabase para reflejar el tipo actualizado
      await loadUserProfile(userProfile.id);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await clearStoredSession();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) {
      return { error: 'No user profile found' };
    }

    try {
      const { error } = await supabase
        .from('Usuarios')
        .update(updates)
        .eq('id', userProfile.id);

      if (error) {
        return { error };
      }

      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
