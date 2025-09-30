import { getStoredToken, removeStoredToken } from '../utils/tokenStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:4000';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthService {
  user: AuthUser | null;
  isAuthenticated: () => Promise<boolean>;
  redirectToLogin: () => Promise<void>;
  handleAuthCallback: (params: URLSearchParams) => Promise<string>;
  signOut: () => Promise<void>;
}

class WebAuthService implements AuthService {
  private static instance: WebAuthService;
  private _user: AuthUser | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): WebAuthService {
    if (!WebAuthService.instance) {
      WebAuthService.instance = new WebAuthService();
    }
    return WebAuthService.instance;
  }

  get user() {
    return this._user;
  }

  private async init() {
    const token = await getStoredToken();
    if (token) {
      try {
        await this.validateToken(token);
      } catch (error) {
        await this.signOut();
      }
    }
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const userData = await response.json();
      this._user = userData.user;
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this._user = null;
      return false;
    }
  }

  async redirectToLogin() {
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(7);
    
    // Store state in local storage for verification
    await chrome.storage.local.set({ authState: state });
    
    // Redirect to landing page login
    const loginUrl = new URL(`${WEBSITE_URL}/login`);
    loginUrl.searchParams.set('state', state);
    loginUrl.searchParams.set('extension', 'true');
    loginUrl.searchParams.set('version', chrome.runtime.getManifest().version);
    
    chrome.tabs.create({ url: loginUrl.toString() });
  }

  async handleAuthCallback(params: URLSearchParams): Promise<string> {
    const token = params.get('token');
    const state = params.get('state');
    
    // Verify state parameter
    const { authState } = await chrome.storage.local.get('authState');
    if (state !== authState) {
      throw new Error('Invalid state parameter');
    }
    
    // Clear stored state
    await chrome.storage.local.remove('authState');
    
    if (!token) {
      throw new Error('No token received');
    }
    
    // Validate and store token
    const isValid = await this.validateToken(token);
    if (!isValid) {
      throw new Error('Token validation failed');
    }
    
    return token;
  }

  async signOut(): Promise<void> {
    this._user = null;
    await removeStoredToken();
    await chrome.storage.local.remove(['authState']);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await getStoredToken();
    if (!token) return false;
    return this.validateToken(token);
  }
}

// Create and export a single instance of the auth service
export const authService = WebAuthService.getInstance();