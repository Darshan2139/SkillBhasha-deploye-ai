import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"learner" | "trainer">("learner");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signup(email, password, role, name);
    if (role === "trainer") navigate("/trainer");
    else navigate("/learner");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">{t('signup')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">{t('full_name')}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm">{t('email')}</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm">{t('password')}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password')} />
          </div>
          <div>
            <label className="block text-sm">{t('role')}</label>
            <div className="mt-2 flex gap-2">
              <label className={`px-3 py-2 rounded-md border ${role === 'learner' ? 'bg-accent text-accent-foreground' : ''}`}>
                <input type="radio" name="role" checked={role === 'learner'} onChange={() => setRole('learner')} className="sr-only" /> {t('learner')}
              </label>
              <label className={`px-3 py-2 rounded-md border ${role === 'trainer' ? 'bg-accent text-accent-foreground' : ''}`}>
                <input type="radio" name="role" checked={role === 'trainer'} onChange={() => setRole('trainer')} className="sr-only" /> {t('trainer')}
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">{t('signup')}</Button>
            <Link to="/login" className="text-sm text-muted-foreground">{t('login')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
