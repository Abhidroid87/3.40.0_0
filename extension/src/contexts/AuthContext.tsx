import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  isInitializing: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsLoading(false);
        setIsInitializing(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error);
        setIsLoading(false);
        setIsInitializing(false);
      }
    );

    // Check if this is first time installation
    chrome.storage.local.get(['isFirstInstall'], (result) => {
      if (result.isFirstInstall === undefined) {
        chrome.storage.local.set({ isFirstInstall: true });
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isInitializing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);