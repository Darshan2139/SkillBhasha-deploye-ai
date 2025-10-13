import { ReactNode } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Placeholder({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  const { t } = useLanguage();
  
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
        <div className="mt-8">
          {children ?? (
            <div className="rounded-lg border p-8 bg-card text-left">
              <p className="text-sm leading-7">
                {t('placeholder_section')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
