import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t bg-card">
      <div className="container py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <img 
              src="/SkillBhasha.png" 
              alt="SkillBhasha Logo" 
              className="h-8 w-8 rounded-lg object-contain"
            />
            SkillBhasha
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            {t('home_intro')}
          </p>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold">{t('dashboards')}</h4>
          <ul className="mt-3 space-y-1">
            <li><a className="hover:underline" href="/learner">{t('learner_title')}</a></li>
            <li><a className="hover:underline" href="/trainer">{t('trainer_title')}</a></li>
            <li><a className="hover:underline" href="/admin">{t('admin_title')}</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold">{t('compliance')}</h4>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            <li>{t('wcag_aa')}</li>
            <li>{t('oauth_jwt')}</li>
            <li>{t('certin_gdpr')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-xs text-muted-foreground text-center">
        {t('copyright').replace('{year}', new Date().getFullYear().toString())}
      </div>
    </footer>
  );
}
