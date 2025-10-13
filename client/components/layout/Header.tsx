import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, Accessibility, Languages, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Header({ highContrast, onToggleContrast }: { highContrast: boolean; onToggleContrast: () => void }) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const navForRole = (role: string | undefined) => {
    if (role === "trainer") return [
      { to: "/trainer", label: t('trainer_title') },
      { to: "/trainer-module", label: t('trainer_upload') }
    ];
    if (role === "admin") return [
      { to: "/admin", label: t('admin_title') },
      { to: "/admin/vocab", label: t('vocabulary_bank') }
    ];
    if (role === "learner") return [
      { to: "/learner", label: t('learner_title') },
      { to: "/learner/bookmarks", label: t('bookmarks') }
    ];
    return []; // Return empty array when user is not logged in
  };

  const navItems = navForRole(user?.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/SkillBhasha.png" 
              alt="SkillBhasha Logo" 
              className="h-10 w-10 rounded-lg object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight">SkillBhasha</span>
          </Link>
          <span className="ml-3 hidden md:inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> UX4G Compliant
          </span>
        </div>

        {navItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((n) => (
              <Link key={n.to} to={n.to} className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">{n.label}</Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <div>
            <select aria-label="site-language" value={lang} onChange={(e)=>setLang(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="bn">বাংলা</option>
              <option value="mr">मराठी</option>
            </select>
          </div>

          <Button variant="ghost" size="sm" className={cn("rounded-full", highContrast && "bg-yellow-100")} onClick={onToggleContrast}>
            <Accessibility className="mr-2 h-4 w-4" />
            {t('high_contrast')}
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.badges?.slice(0,2).map((b, i) => (
                  <span key={i} className="hidden md:inline-flex text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{b}</span>
                ))}
              </div>
              <Link to="/profile" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full grid place-items-center text-white" style={{ background: user.avatarColor || "#0f172a" }}>{(user.name || user.email || "U").slice(0,1).toUpperCase()}</div>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button size="sm">{t('login')}</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline">{t('signup')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
