import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      // redirect to role dashboard
      if (/admin@gmail.com/i.test(email)) navigate('/admin');
      else if (/trainer/i.test(email)) navigate('/trainer');
      else navigate('/learner');
    } else setError(t('invalid_credentials'));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">{t('login')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">{t('email')}</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm">{t('password')}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password')} />
          </div>
          {error ? <div className="text-sm text-destructive">{t('invalid_credentials')}</div> : null}
          <div className="flex items-center justify-between">
            <Button type="submit">{t('login')}</Button>
            <Link to="/signup" className="text-sm text-muted-foreground">{t('signup')}</Link>
          </div>
        </form>
        <div className="mt-6 text-xs text-muted-foreground">{t('login_demo_note')}</div>
      </div>
    </div>
  );
}
