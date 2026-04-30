import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setLoading(false); return; }
    let cancelled = false;
    api.get('/users/me/')
      .then(({ data }) => { if (!cancelled) setUser(data); })
      .catch(() => localStorage.clear())
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const _storeTokens = useCallback((access, refresh, userData) => {
    localStorage.setItem('access_token',  access);
    localStorage.setItem('refresh_token', refresh);
    setUser(userData);
  }, []);

  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/users/login/', { username, password });
    _storeTokens(data.access, data.refresh, data.user);
    return data.user;
  }, [_storeTokens]);

  const loginWithGoogle = useCallback(async (googleAccessToken) => {
    const { data } = await api.post('/users/social/google/', {
      access_token: googleAccessToken,
    });
    _storeTokens(data.access, data.refresh, data.user);
    return data.user;
  }, [_storeTokens]);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}