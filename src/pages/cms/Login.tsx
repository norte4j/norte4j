import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from '@/assets/norte4j-logo.png';

const Login = () => {
  const { login } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); setLoading(true); try { await login(email, password); navigate('/cms'); } catch { setError('Não foi possível autenticar. Verifique suas credenciais.'); } finally { setLoading(false); } };
  return <div className="min-h-screen gradient-hero flex items-center justify-center p-6"><div className="bg-card rounded-2xl shadow-elevated p-8 w-full max-w-md border"><div className="text-center mb-8"><img src={logo} alt="Norte4j" className="w-16 h-16 mx-auto mb-4" /><h1 className="font-display text-2xl font-bold">CMS Norte4j</h1><p className="text-sm text-muted-foreground mt-1">Acesse o painel administrativo</p></div><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className="space-y-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>{error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}<Button type="submit" className="w-full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button></form></div></div>;
};
export default Login;
