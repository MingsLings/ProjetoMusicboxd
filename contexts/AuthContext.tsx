import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stopListening = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return stopListening;
  }, []);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function signUp(name: string, email: string, password: string) {
    const account = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const displayName = name.trim();

    if (displayName) {
      await updateProfile(account.user, { displayName });
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth requer um AuthProvider ativo.');
  }
  return value;
}

export function getAuthErrorMessage(error: unknown) {
  const errorCode = (error as { code?: string })?.code ?? '';
  const messagesByCode: Record<string, string> = {
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  };

  return messagesByCode[errorCode] ?? 'Não foi possível concluir a operação. Tente novamente.';
}
