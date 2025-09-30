interface StoredToken {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export async function storeToken(token: string, refreshToken: string, expiresIn: number) {
  const expiresAt = Date.now() + expiresIn * 1000;
  await chrome.storage.local.set({
    authToken: { token, refreshToken, expiresAt }
  });
}

export async function getStoredToken(): Promise<string | null> {
  const data = await chrome.storage.local.get('authToken');
  const storedToken = data.authToken as StoredToken | undefined;

  if (!storedToken) {
    return null;
  }

  if (Date.now() >= storedToken.expiresAt) {
    // Token expired, try to refresh
    return refreshToken();
  }

  return storedToken.token;
}

export async function refreshToken(): Promise<string | null> {
  const data = await chrome.storage.local.get('authToken');
  const storedToken = data.authToken as StoredToken | undefined;
  
  if (!storedToken?.refreshToken) {
    return null;
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: storedToken.refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const { token, refreshToken: newRefreshToken, expiresIn } = await response.json();
    await storeToken(token, newRefreshToken, expiresIn);
    return token;
  } catch (error) {
    console.error('Token refresh error:', error);
    await removeStoredToken();
    return null;
  }
}

export async function removeStoredToken() {
  await chrome.storage.local.remove('authToken');
}