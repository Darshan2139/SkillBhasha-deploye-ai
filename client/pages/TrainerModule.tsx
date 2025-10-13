import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, Zap, Edit3 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type FileItem = { id: string; name: string; size: number; progress: number; status: "uploading" | "processing" | "done" };

export default function TrainerModule() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>([]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const incoming = Array.from(e.dataTransfer.files).slice(0, 6);
    const items = incoming.map((f, i) => ({ id: String(Date.now() + i), name: f.name, size: f.size, progress: 20, status: "uploading" as const }));
    setFiles((s) => [...items, ...s]);
    // simulate progress
    items.forEach((it) => simulateProgress(it.id));
  }

  function simulateProgress(id: string) {
    const interval = setInterval(() => {
      setFiles((s) => {
        return s.map((f) => {
          if (f.id !== id) return f;
          const next = Math.min(100, f.progress + Math.floor(Math.random() * 20) + 10);
          return { ...f, progress: next, status: next >= 100 ? "processing" : "uploading" };
        });
      });
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setFiles((s) => s.map((f) => (f.id === id ? { ...f, progress: 100, status: "done" } : f)));
    }, 4000 + Math.random() * 3000);
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">{t('trainer_title')}</h1>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UploadCloud className="h-5 w-5" /> {t('trainer_upload')}</CardTitle>
              <CardDescription>{t('trainer_upload_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="border-dashed border-2 border-muted rounded-md p-8 text-center">
                <div className="flex items-center justify-center gap-3">
                  <UploadCloud className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">{t('trainer_upload_label')}</div>
                    <div className="text-sm text-muted-foreground">Supported: PDF, PPTX, DOCX, MP4, MP3</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {files.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No files uploaded yet. Try dropping a sample file.</div>
                ) : (
                  files.map((f) => (
                    <div key={f.id} className="rounded-md border p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{f.name}</div>
                            <div className="text-xs text-muted-foreground">{Math.round(f.size / 1024)} KB</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{t(f.status)}</div>
                      </div>
                      <Progress value={f.progress} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Edit3 className="h-4 w-4" /> Translation Preview</CardTitle>
                <CardDescription>Split-screen original (left) → AI translation (right) with confidence highlights.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 h-40 overflow-auto">{sampleOriginal()}</div>
                  <div className="border rounded-md p-4 h-40 overflow-auto">{sampleTranslation()}</div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">Confidence heatmap: green = high, amber = medium, red = low.</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>{t('trainer_tools')}</CardTitle>
              <CardDescription>Auto subtitler, dubbing, prompt generator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Button size="sm">Auto‑subtitle</Button>
                <Button size="sm" variant="outline">Neural dub</Button>
                <Button size="sm" variant="ghost">Generate from prompt</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t('reports_insights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Translation accuracy (demo): 94%</div>
              <div className="mt-3">Recent activity</div>
              <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Uploaded solar_manual.pdf (92% coverage)</li>
                <li>Generated Hindi dub for module 3</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function sampleOriginal() {
  return (
    <div className="space-y-2 text-sm">
      <p>Introduction to solar panel installation: Types of panels, tools, safety equipment, step‑by‑step mounting and wiring.</p>
      <p>Safety checks: always wear PPE, isolate circuits before work, test connections.</p>
    </div>
  );
}

function sampleTranslation() {
  return (
    <div className="space-y-2 text-sm">
      <p><span className="bg-green-100">परिचय: सौर पैनल स्थापना के प्रकार, उपकरण, सुरक्षा</span></p>
      <p><span className="bg-amber-100">सुरक्षा जाँच: PPE पहनें, सर्किट अलग करें</span></p>
    </div>
  );
}
