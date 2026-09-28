import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '@/lib/mock-api';
interface User { id: string; email: string; name: string; role: string; }
interface AuthContextType { user: User | null; isLoading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; }
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const token = localStorage.getItem('cms_token'); if (!token) { setIsLoading(false); return; } api.get<User>('/auth/me').then(({ data }) => setUser(data)).catch(() => localStorage.removeItem('cms_token')).finally(() => setIsLoading(false)); }, []);
  const login = async (email: string, password: string) => { const { data } = await api.post<{ accessToken: string; user: User }>('/auth/login', { email, password }); localStorage.setItem('cms_token', data.accessToken); setUser(data.user); };
  const logout = async () => { localStorage.removeItem('cms_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const value = useContext(AuthContext); if (!value) throw new Error('useAuth deve estar dentro de AuthProvider'); return value; };
