import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Languages, Sparkles, Headphones, Library, BookOpenCheck, Gauge, ShieldCheck, Cpu } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Index() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="container grid lg:grid-cols-2 items-center gap-10 py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground mb-4">
              <ShieldCheck className="h-3.5 w-3.5" /> UX4G • WCAG 2.1 AA • Secure by design
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {t('home_title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              {t('home_intro')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/learner">{t('explore_learner')}</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/trainer">{t('trainer_demo')}</Link></Button>
              <Button asChild size="lg" variant="ghost"><Link to="/admin">{t('admin_demo')}</Link></Button>
            </div>
            <div id="languages" className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {"हिन्दी বাংলা தமிழ் తెలుగు मराठी ਪੰਜਾਬੀ اُردُو ગુજરાતી ಕನ್ನಡ অসমীয়া ଓଡ଼ିଆ संस्कृत English".split(" ").map((l) => (
                <span key={l} className="px-2 py-1 rounded-md bg-accent">{l}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /><span className="font-semibold">{t('ai_summary')}</span></div>
                  <Badge variant="secondary">{t('adaptive')}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t('ai_summary')} — {t('home_intro')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Headphones className="h-4 w-4" /><span className="font-semibold">{t('accessibility')}</span></div>
                  <Badge variant="secondary">{t('inclusive')}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{t('accessibility_desc')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Languages className="h-4 w-4" /><span className="font-semibold">{t('twenty_two_languages')}</span></div>
                  <Badge variant="secondary">{t('bhashini')}</Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1"><span>{t('coverage')}</span><span>92%</span></div>
                  <Progress value={92} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-2xl font-bold tracking-tight">{t('dashboards')}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Feature icon={<BookOpenCheck className="h-5 w-5" />} title={t('learner_title')} desc={t('learner_desc')} cta={{ href: "/learner", label: t('open_demo') }} />
          <Feature icon={<Library className="h-5 w-5" />} title={t('trainer_title')} desc={t('trainer_desc')} cta={{ href: "/trainer", label: t('preview') }} />
          <Feature icon={<Gauge className="h-5 w-5" />} title={t('admin_title')} desc={t('admin_desc')} cta={{ href: "/admin", label: t('preview') }} />
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-2xl font-bold tracking-tight">{t('core_capabilities')}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Capability title={t('translation_workspace')} text={t('translation_workspace_desc')} />
            <Capability title={t('vocabulary_bank')} text={t('vocabulary_bank_desc')} />
            <Capability title={t('content_library')} text={t('content_library_desc')} />
            <Capability title={t('auto_subtitler')} text={t('auto_subtitler_desc')} />
            <Capability title={t('ai_drift_monitor')} text={t('ai_drift_monitor_desc')} />
            <Capability title={t('ai_content_creation')} text={t('ai_content_creation_desc')} />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2"><Cpu className="h-4 w-4" /><span className="font-semibold">{t('secure_compliant')}</span></div>
                <div className="text-xs text-muted-foreground">{t('secure_compliant_desc')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /><span className="font-semibold">{t('gov_grade_ux')}</span></div>
                <div className="text-xs text-muted-foreground">{t('gov_grade_ux_desc')}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc, cta }: { icon: JSX.Element; title: string; desc: string; cta: { href: string; label: string } }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md grid place-items-center bg-gradient-to-br from-brand-saffron to-brand-green text-white">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button asChild size="sm"><Link to={cta.href}>{cta.label}</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Capability({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{text}</p>
      </CardContent>
    </Card>
  );
}
