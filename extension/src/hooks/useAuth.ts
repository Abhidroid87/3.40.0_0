import { useEffect, useState } from 'react';
import { authService, type AuthUser } from '../services/authService';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthed = await chrome.runtime.sendMessage({ type: 'AUTH_IS_AUTHENTICATED' });
        setIsAuthenticated(isAuthed);
        setUser(authService.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Check initial auth state
    void checkAuth();

    // Listen for auth state changes
    const listener = (message: any) => {
      if (message.type === 'AUTH_SUCCESS') {
        void checkAuth();
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const login = async () => {
    await chrome.runtime.sendMessage({ type: 'AUTH_REDIRECT_TO_LOGIN' });
  };

  const logout = async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'AUTH_SIGN_OUT' });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
}