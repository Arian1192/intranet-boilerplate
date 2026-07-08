import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Input } from '@/components/ui';
import { APP_NAME } from '@/lib/constants';
import { useLogin } from './hooks/useLogin';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error is already handled in hook
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">
          {APP_NAME.charAt(0)}
        </div>
        <span className="text-2xl font-bold text-slate-900">{APP_NAME}</span>
      </div>

      <Card className="w-full max-w-md p-8">
        <h1 className="mb-2 text-center text-xl font-semibold text-slate-900">
          Calculadora de liquidaciones de shows
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          ¿Sin cuenta? Pídele a un administrador que te dé de alta.
        </p>
      </Card>
    </div>
  );
}
