import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, MessageSquare, Headphones, Trophy, Languages, Sparkles, Send, Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const initialCourses = [
  {
    id: 1,
    title: "Solar Panel Installation Basics",
    lang: "Hindi",
    progress: 72,
    lessons: ["Introduction", "Tools & Safety", "Mounting & Wiring"],
  },
  {
    id: 2,
    title: "Healthcare — Patient Care Assistant",
    lang: "Tamil",
    progress: 45,
    lessons: ["Patient Handling", "Hygiene", "First Aid"],
  },
  {
    id: 3,
    title: "Construction Safety Essentials",
    lang: "Bengali",
    progress: 88,
    lessons: ["PPE", "Site Safety", "Risk Assessment"],
  },
  { id: 4, title: "Retail Customer Service", lang: "Marathi", progress: 16, lessons: ["Customer Interaction", "Returns", "POS"] },
];

const seedSummaries: Record<number, string> = {
  1: "यह पाठ सोलर पैनल के प्रकार, इंस्टॉलेशन सुरक्षा और रख-रखाव का संक्षेप है।",
  2: "இப்பாடம் நோயாளி பராமரிப்பு, சுகாதார நடைமுறைகள் மற்றும் முதலுதவி சுருக்கமாக வழங்குகிறது.",
  3: "এই পাঠটি নির্মাণ সাইট নিরাপত্তা ও PPE সংক্রান্ত সংক্ষিপ্ত তথ্য দেয়।",
  4: "हा धडा ग्राहक संवाद व परताव्यावहार यांचे संक्षेप देतो.",
};

const defaultBadges = ["Course Starter", "Feedback Champion", "Accessibility Ally"];
const defaultLeaderboard = [
  { name: "Ananya", score: 1280 },
  { name: "Rohit", score: 1105 },
  { name: "Fatima", score: 990 },
];

export default function LearnerDashboard() {
  const { user } = useAuth();
  const [courses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<number>(courses[0].id);

  // Preferences persisted
  const [language, setLanguage] = useState<string>(() => localStorage.getItem("sb_lang") || "Hindi");
  const [tts, setTts] = useState<boolean>(() => localStorage.getItem("sb_tts") !== "false");
  const [speed, setSpeed] = useState<number>(() => Number(localStorage.getItem("sb_speed") || 1));
  const [subtitleSize, setSubtitleSize] = useState<number>(() => Number(localStorage.getItem("sb_sub_size") || 16));
  const [subtitleColor, setSubtitleColor] = useState<string>(() => localStorage.getItem("sb_sub_color") || "#FFFFFF");

  // AI tutor
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([
    { role: "assistant", content: "नमस्ते! How can I help you learn today?" },
  ]);
  const [prompt, setPrompt] = useState("");

  // Feedback
  const [thumbs, setThumbs] = useState<Record<number, "up" | "down" | null>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_thumbs") || "{}");
    } catch {
      return {};
    }
  });
  const [comments, setComments] = useState<Record<number, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_comments") || "{}");
    } catch {
      return {};
    }
  });

  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    localStorage.setItem("sb_lang", language);
  }, [language]);
  useEffect(() => {
    localStorage.setItem("sb_tts", String(tts));
  }, [tts]);
  useEffect(() => {
    localStorage.setItem("sb_speed", String(speed));
  }, [speed]);
  useEffect(() => {
    localStorage.setItem("sb_sub_size", String(subtitleSize));
    localStorage.setItem("sb_sub_color", subtitleColor);
  }, [subtitleSize, subtitleColor]);

  useEffect(() => {
    localStorage.setItem("sb_thumbs", JSON.stringify(thumbs));
  }, [thumbs]);
  useEffect(() => {
    localStorage.setItem("sb_comments", JSON.stringify(comments));
  }, [comments]);

  const course = useMemo(() => courses.find((c) => c.id === selectedCourse)!, [courses, selectedCourse]);

  function speak(text: string) {
    if (!tts || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language === "Hindi" ? "hi-IN" : language === "Tamil" ? "ta-IN" : "en-US";
    u.rate = speed;
    ttsRef.current = u;
    window.speechSynthesis.speak(u);
  }

  function handleGenerateSummary() {
    const txt = seedSummaries[course.id] || "Summary not available.";
    if (tts) speak(txt);
    // show a temporary assistant message
    setMessages((m) => [...m, { role: "assistant", content: txt }]);
  }

  function handleAsk() {
    if (!prompt.trim()) return;
    const userMsg = prompt.trim();
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setPrompt("");
    // simulate AI response
    setTimeout(() => {
      const resp = `${userMsg} — Here is a short explanation in ${language}. (demo)`;
      setMessages((m) => [...m, { role: "assistant", content: resp }]);
      if (tts) speak(resp);
    }, 800 + Math.random() * 800);
  }

  function handleThumb(courseId: number, val: "up" | "down") {
    setThumbs((s) => ({ ...s, [courseId]: s[courseId] === val ? null : val }));
  }

  function handleCommentSave(courseId: number, text: string) {
    setComments((s) => ({ ...s, [courseId]: text }));
  }

  // Extra: Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_bookmarks") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => localStorage.setItem("sb_bookmarks", JSON.stringify(bookmarks)), [bookmarks]);

  const { t } = useLanguage();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('learner_title')}</h1>
          <p className="text-sm text-muted-foreground">{t('welcome_personalized').replace('{user}', user ? `, ${user.name ?? user.email}` : "")}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <select aria-label={t('preferred_language')} value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border px-2 py-1">
              {["Hindi", "Tamil", "Bengali", "Marathi", "English"].map((l) => (
                <option key={l} value={l}>{t(l.toLowerCase())}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={tts} onChange={(e) => setTts(e.target.checked)} />
              {t('text_to_speech')}
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm">{t('speed')}</label>
              <input type="range" min={0.75} max={1.5} step={0.05} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      <section aria-label={t('my_courses')} className="grid gap-6 lg:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.id} className={`p-0 ${c.id === selectedCourse ? "ring-1 ring-primary/30" : ""}`}>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">{c.title}</CardTitle>
                  <CardDescription className="text-xs">Language: {c.lang}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{c.progress}%</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={c.progress} />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setSelectedCourse(c.id)}>Open</Button>
                  <Button size="sm" variant="ghost" onClick={() => setBookmarks((s) => s.includes(c.id) ? s.filter(x => x!==c.id) : [c.id,...s])}>
                    {bookmarks.includes(c.id) ? t('bookmarked') : t('bookmark')}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{c.lang}</Badge>
                  <Badge>{c.lessons.length} lessons</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> {t('ai_summary')}</CardTitle>
              <CardDescription>{t('ai_summary')} — Short summaries in your chosen language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Selected course: <strong>{course.title}</strong></div>
            <div className="mt-3 text-sm leading-6">{seedSummaries[course.id]}</div>
            <div className="mt-4 flex items-center gap-2">
              <Button onClick={handleGenerateSummary}>Generate summary</Button>
              <Button variant="outline" onClick={() => speak(seedSummaries[course.id])}>Play audio</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> AI Tutor Assistant</CardTitle>
            <CardDescription>Interactive assistant available via the chat widget (bottom‑right).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Open the AI Assistant (chat) in the bottom-right corner to ask questions and translate snippets across the site.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Headphones className="h-4 w-4" /> {t('accessibility')}</CardTitle>
            <CardDescription>Subtitles, TTS and reading preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">Subtitles font size</div>
                <input type="range" min={12} max={24} value={subtitleSize} onChange={(e) => setSubtitleSize(Number(e.target.value))} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Subtitle color</div>
                <input type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={tts} onChange={(e)=>setTts(e.target.checked)} /> Enable TTS</label>
                <div className="ml-auto text-sm text-muted-foreground">Voice speed: {speed}x</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-4 w-4" /> {t('gamification')}</CardTitle>
            <CardDescription>Earn badges and climb the leaderboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {defaultBadges.map((b) => (
                <span key={b} className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800"><Star className="h-3 w-3" /> {b}</span>
              ))}
            </div>
            <div>
              {defaultLeaderboard.map((u, i) => (
                <div key={u.name} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-muted grid place-items-center">{String(i + 1)}</div><div>{u.name}</div></div>
                  <div className="font-semibold">{u.score}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('feedback')}</CardTitle>
            <CardDescription>Was this translation helpful?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button variant={thumbs[course.id] === "up" ? "default" : "outline"} size="sm" onClick={() => handleThumb(course.id, "up")}>
                <ThumbsUp className="h-4 w-4 mr-1" /> Yes
              </Button>
              <Button variant={thumbs[course.id] === "down" ? "default" : "outline"} size="sm" onClick={() => handleThumb(course.id, "down")}>
                <ThumbsDown className="h-4 w-4 mr-1" /> No
              </Button>
            </div>
            <div className="mt-3">
              <Textarea value={comments[course.id] || ""} onChange={(e) => handleCommentSave(course.id, e.target.value)} placeholder={t('add_comment')} />
            </div>
            <div className="mt-3 text-right">
              <Button size="sm" onClick={() => alert("Feedback submitted (demo)")}>Submit</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmarks & Saved</CardTitle>
            <CardDescription>Your saved modules for quick access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p>Bookmarked courses are shown here for quick access.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function cnCard(active: boolean) {
  return active ? "border-primary/40 ring-1 ring-primary/20" : "";
}

function speak(_: string) {
  // placeholder to satisfy TS when speak used in some inline handlers from older code paths
}
