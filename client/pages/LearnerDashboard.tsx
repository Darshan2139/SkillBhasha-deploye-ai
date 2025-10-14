import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Headphones, 
  Trophy, 
  Languages, 
  Sparkles, 
  Send, 
  Star,
  Play,
  Pause,
  BookOpen,
  Clock,
  Award,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Settings,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  AlertCircle,
  Info,
  Zap,
  Brain,
  Lightbulb,
  FileText,
  Video,
  Image,
  Music,
  Mic,
  MicOff,
  RotateCcw,
  RefreshCw,
  Heart,
  Share,
  Flag,
  HelpCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Plus,
  Minus,
  X,
  Check,
  Edit,
  Trash2,
  Save,
  Upload,
  Download as DownloadIcon,
  ExternalLink,
  Lock,
  Unlock,
  Shield,
  Crown,
  Gem,
  Flame,
  Rocket,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const initialCourses = [
  {
    id: 1,
    title: "Solar Panel Installation Basics",
    lang: "Hindi",
    progress: 72,
    lessons: [
      { id: 1, title: "Introduction to Solar Energy", duration: "15 min", completed: true, type: "video" },
      { id: 2, title: "Tools & Safety Equipment", duration: "20 min", completed: true, type: "interactive" },
      { id: 3, title: "Mounting & Wiring", duration: "25 min", completed: false, type: "video" },
      { id: 4, title: "Maintenance & Troubleshooting", duration: "18 min", completed: false, type: "quiz" }
    ],
    instructor: "Rajesh Kumar",
    rating: 4.8,
    students: 1250,
    duration: "2h 30m",
    level: "Beginner",
    category: "Solar",
    thumbnail: "☀️",
    description: "Learn the fundamentals of solar panel installation with hands-on practice and safety protocols.",
    price: 0,
    certificate: true,
    lastAccessed: "2 hours ago"
  },
  {
    id: 2,
    title: "Healthcare — Patient Care Assistant",
    lang: "Tamil",
    progress: 45,
    lessons: [
      { id: 1, title: "Patient Handling Techniques", duration: "22 min", completed: true, type: "video" },
      { id: 2, title: "Hygiene & Sanitation", duration: "18 min", completed: true, type: "interactive" },
      { id: 3, title: "First Aid Basics", duration: "30 min", completed: false, type: "video" },
      { id: 4, title: "Communication Skills", duration: "15 min", completed: false, type: "quiz" }
    ],
    instructor: "Dr. Priya Sharma",
    rating: 4.9,
    students: 2100,
    duration: "3h 15m",
    level: "Intermediate",
    category: "Healthcare",
    thumbnail: "🏥",
    description: "Comprehensive training for patient care assistants with practical scenarios and case studies.",
    price: 0,
    certificate: true,
    lastAccessed: "1 day ago"
  },
  {
    id: 3,
    title: "Construction Safety Essentials",
    lang: "Bengali",
    progress: 88,
    lessons: [
      { id: 1, title: "PPE and Safety Equipment", duration: "20 min", completed: true, type: "video" },
      { id: 2, title: "Site Safety Protocols", duration: "25 min", completed: true, type: "interactive" },
      { id: 3, title: "Risk Assessment", duration: "30 min", completed: true, type: "video" },
      { id: 4, title: "Emergency Procedures", duration: "15 min", completed: false, type: "quiz" }
    ],
    instructor: "Amit Das",
    rating: 4.7,
    students: 1800,
    duration: "2h 45m",
    level: "Advanced",
    category: "Construction",
    thumbnail: "🏗️",
    description: "Master construction safety with industry-standard protocols and real-world applications.",
    price: 0,
    certificate: true,
    lastAccessed: "3 hours ago"
  },
  {
    id: 4,
    title: "Retail Customer Service",
    lang: "Marathi",
    progress: 16,
    lessons: [
      { id: 1, title: "Customer Interaction Skills", duration: "20 min", completed: true, type: "video" },
      { id: 2, title: "Handling Returns & Exchanges", duration: "15 min", completed: false, type: "interactive" },
      { id: 3, title: "POS System Training", duration: "25 min", completed: false, type: "video" },
      { id: 4, title: "Conflict Resolution", duration: "18 min", completed: false, type: "quiz" }
    ],
    instructor: "Sneha Patil",
    rating: 4.6,
    students: 950,
    duration: "2h 10m",
    level: "Beginner",
    category: "Retail",
    thumbnail: "🛍️",
    description: "Develop excellent customer service skills for retail environments with practical training.",
    price: 0,
    certificate: true,
    lastAccessed: "1 week ago"
  }
];

const seedSummaries: Record<number, string> = {
  1: "यह पाठ सोलर पैनल के प्रकार, इंस्टॉलेशन सुरक्षा और रख-रखाव का संक्षेप है।",
  2: "இப்பாடம் நோயாளி பராமரிப்பு, சுகாதார நடைமுறைகள் மற்றும் முதலுதவி சுருக்கமாக வழங்குகிறது.",
  3: "এই পাঠটি নির্মাণ সাইট নিরাপত্তা ও PPE সংক্রান্ত সংক্ষিপ্ত তথ্য দেয়।",
  4: "हा धडा ग्राहक संवाद व परताव्यावहार यांचे संक्षेप देतो.",
};

const defaultBadges = [
  { id: 1, name: "Course Starter", description: "Started your first course", icon: "🎯", earned: true, date: "2024-01-15" },
  { id: 2, name: "Feedback Champion", description: "Provided 10+ helpful feedback", icon: "💬", earned: true, date: "2024-01-20" },
  { id: 3, name: "Accessibility Ally", description: "Used accessibility features 50+ times", icon: "♿", earned: true, date: "2024-01-25" },
  { id: 4, name: "Language Master", description: "Completed courses in 3+ languages", icon: "🌍", earned: false, date: null },
  { id: 5, name: "Speed Learner", description: "Completed 5 courses in a month", icon: "⚡", earned: false, date: null },
  { id: 6, name: "Quiz Champion", description: "Scored 90%+ in 10 quizzes", icon: "🧠", earned: false, date: null }
];

const defaultLeaderboard = [
  { id: 1, name: "Ananya", score: 1280, avatar: "A", level: 8, streak: 12, courses: 15 },
  { id: 2, name: "Rohit", score: 1105, avatar: "R", level: 7, streak: 8, courses: 12 },
  { id: 3, name: "Fatima", score: 990, avatar: "F", level: 6, streak: 15, courses: 10 },
  { id: 4, name: "Priya", score: 875, avatar: "P", level: 6, streak: 5, courses: 8 },
  { id: 5, name: "Arjun", score: 820, avatar: "A", level: 5, streak: 7, courses: 9 }
];

const achievements = [
  { id: 1, title: "First Course Complete", description: "Completed your first course", points: 100, earned: true },
  { id: 2, title: "Language Explorer", description: "Learned in 2 different languages", points: 200, earned: true },
  { id: 3, title: "Consistent Learner", description: "7-day learning streak", points: 150, earned: true },
  { id: 4, title: "Quiz Master", description: "Perfect score on 5 quizzes", points: 300, earned: false },
  { id: 5, title: "Social Learner", description: "Shared 10 courses with friends", points: 250, earned: false }
];

const recentActivity = [
  { id: 1, type: "course_completed", title: "Completed Solar Panel Installation", time: "2 hours ago", points: 100 },
  { id: 2, type: "badge_earned", title: "Earned 'Course Starter' badge", time: "1 day ago", points: 50 },
  { id: 3, type: "quiz_passed", title: "Passed Safety Equipment Quiz", time: "2 days ago", points: 25 },
  { id: 4, type: "bookmark_added", title: "Bookmarked Healthcare Course", time: "3 days ago", points: 10 },
  { id: 5, type: "feedback_given", title: "Provided course feedback", time: "1 week ago", points: 15 }
];

export default function LearnerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [courses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<number>(courses[0].id);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("progress");

  // User stats
  const [userStats] = useState({
    totalCourses: 4,
    completedCourses: 1,
    totalHours: 8.5,
    currentStreak: 7,
    longestStreak: 15,
    totalPoints: 1250,
    level: 3,
    nextLevelPoints: 500,
    certificates: 1
  });

  // Preferences persisted
  const [language, setLanguage] = useState<string>(() => localStorage.getItem("sb_lang") || "Hindi");
  const [tts, setTts] = useState<boolean>(() => localStorage.getItem("sb_tts") !== "false");
  const [speed, setSpeed] = useState<number>(() => Number(localStorage.getItem("sb_speed") || 1));
  const [subtitleSize, setSubtitleSize] = useState<number>(() => Number(localStorage.getItem("sb_sub_size") || 16));
  const [subtitleColor, setSubtitleColor] = useState<string>(() => localStorage.getItem("sb_sub_color") || "#FFFFFF");
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("sb_dark_mode") === "true");
  const [autoPlay, setAutoPlay] = useState<boolean>(() => localStorage.getItem("sb_auto_play") !== "false");
  const [notifications, setNotifications] = useState<boolean>(() => localStorage.getItem("sb_notifications") !== "false");

  // AI tutor
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string; timestamp: Date }[]>([
    { role: "assistant", content: "नमस्ते! How can I help you learn today?", timestamp: new Date() },
  ]);
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

  // Course player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
    localStorage.setItem("sb_dark_mode", String(darkMode));
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem("sb_auto_play", String(autoPlay));
  }, [autoPlay]);
  useEffect(() => {
    localStorage.setItem("sb_notifications", String(notifications));
  }, [notifications]);

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
    setMessages((m) => [...m, { role: "assistant", content: txt, timestamp: new Date() }]);
  }

  function handleAsk() {
    if (!prompt.trim()) return;
    const userMsg = prompt.trim();
    setMessages((m) => [...m, { role: "user", content: userMsg, timestamp: new Date() }]);
    setPrompt("");
    setIsTyping(true);
    
    // simulate AI response
    setTimeout(() => {
      const responses = [
        `Great question! In ${language}, this concept is explained as...`,
        `Let me help you understand this in ${language}. The key points are...`,
        `Excellent! Here's a detailed explanation in ${language}:`,
        `I'd be happy to clarify this for you in ${language}. The answer is...`,
        `This is a common question! In ${language}, we say...`
      ];
      const resp = responses[Math.floor(Math.random() * responses.length)] + ` (${userMsg})`;
      setMessages((m) => [...m, { role: "assistant", content: resp, timestamp: new Date() }]);
      setIsTyping(false);
      if (tts) speak(resp);
    }, 800 + Math.random() * 1200);
  }

  function handleThumb(courseId: number, val: "up" | "down") {
    setThumbs((s) => ({ ...s, [courseId]: s[courseId] === val ? null : val }));
  }

  function handleCommentSave(courseId: number, text: string) {
    setComments((s) => ({ ...s, [courseId]: text }));
  }

  // New utility functions
  function togglePlayPause() {
    setIsPlaying(!isPlaying);
  }

  function nextLesson() {
    const course = courses.find(c => c.id === selectedCourse);
    if (course && currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  }

  function previousLesson() {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  }

  function handleCourseSelect(courseId: number) {
    setSelectedCourse(courseId);
    setCurrentLesson(0);
    setIsPlaying(false);
    setShowCourseModal(true);
  }

  function handleLessonComplete(lessonId: number) {
    // Simulate lesson completion
    alert(`Lesson ${lessonId} completed! +25 points`);
  }

  function handleShareCourse(courseId: number) {
    setShowShareModal(true);
    // In real app, would generate shareable link
  }

  function handleDownloadCertificate(courseId: number) {
    setShowCertificateModal(true);
    // In real app, would generate and download PDF
  }

  function filteredCourses() {
    let filtered = courses;
    
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(course => course.category === filterCategory);
    }
    
    if (sortBy === "progress") {
      filtered = filtered.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
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

  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              {t('learner_title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('welcome_personalized').replace('{user}', user ? `, ${user.name ?? user.email}` : "")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2 text-sm">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <select 
              aria-label={t('preferred_language')} 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              className="rounded-md border px-3 py-2 text-sm"
            >
              {["Hindi", "Tamil", "Bengali", "Marathi", "English"].map((l) => (
                <option key={l} value={l}>{t(l.toLowerCase())}</option>
              ))}
            </select>
          </div>

          {/* Quick Settings */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.totalCourses}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.completedCourses}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats.totalHours}h</p>
              <p className="text-sm text-muted-foreground">Hours Learned</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Flame className="h-5 w-5 text-purple-600" />
            </div>
                <div>
              <p className="text-2xl font-bold">{userStats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="tutor" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Tutor
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* AI Summary Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Summary Generator
              </CardTitle>
              <CardDescription>
                Get instant summaries of your courses in your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                  <Button onClick={handleGenerateSummary} className="ux4g-btn ux4g-btn-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Summary
                  </Button>
                  {tts && (
                    <Button 
                      variant="outline" 
                      onClick={() => speak(seedSummaries[selectedCourse] || "Summary not available.")}
                      className="ux4g-btn ux4g-btn-secondary"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen
                    </Button>
                  )}
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">Course Summary</h4>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {seedSummaries[selectedCourse] || "Select a course and click 'Generate Summary' to get an AI-powered summary in your preferred language."}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-blue-600">
                        <Languages className="h-3 w-3" />
                        <span>Generated in {language}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <div className="text-sm font-semibold text-green-600">+{activity.points}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab("courses")}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs">Continue Learning</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab("courses")}
                  >
                    <Search className="h-6 w-6" />
                    <span className="text-xs">Find Courses</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab("achievements")}
                  >
                    <Trophy className="h-6 w-6" />
                    <span className="text-xs">View Achievements</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">AI Tutor</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
              </div>

          {/* Featured Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Featured Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {courses.slice(0, 2).map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="text-3xl">{course.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        <Badge variant="outline">{course.lang}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleCourseSelect(course.id)}>
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Solar">Solar</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Construction">Construction</option>
                    <option value="Retail">Retail</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="progress">Progress</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid/List */}
          <div className={viewMode === "grid" ? "grid gap-6 lg:grid-cols-3" : "space-y-4"}>
            {filteredCourses().map((course) => (
              <Card key={course.id} className={`${course.id === selectedCourse ? "ring-2 ring-primary" : ""}`}>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{course.thumbnail}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="mt-1">
                          by {course.instructor} • {course.duration}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge variant="outline">{course.lang}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{course.progress}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Progress value={course.progress} className="mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  
                  {/* Lessons List */}
                  <div className="space-y-2 mb-4">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleCourseSelect(course.id)}>
                        {course.progress > 0 ? "Continue" : "Start"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setBookmarks(prev => 
                          prev.includes(course.id) 
                            ? prev.filter(id => id !== course.id)
                            : [...prev, course.id]
                        )}
                      >
                        {bookmarks.includes(course.id) ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleShareCourse(course.id)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      {course.certificate && course.progress === 100 && (
                        <Button size="sm" variant="outline" onClick={() => handleDownloadCertificate(course.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Was this translation helpful?</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={thumbs[course.id] === 'up' ? 'default' : 'outline'}
                      onClick={() => handleThumb(course.id, 'up')}
                      className="h-8 px-3"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Yes
                    </Button>
                    <Button
                      size="sm"
                      variant={thumbs[course.id] === 'down' ? 'default' : 'outline'}
                      onClick={() => handleThumb(course.id, 'down')}
                      className="h-8 px-3"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      No
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your feedback about this course translation..."
                    value={comments[course.id] || ''}
                    onChange={(e) => handleCommentSave(course.id, e.target.value)}
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Help us improve the learning experience
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCommentSave(course.id, comments[course.id] || '')}
                      className="text-xs"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Save Feedback
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Learning Progress Chart */}
        <Card>
          <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-2xl font-bold">{Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%</span>
                  </div>
                  <Progress value={Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userStats.totalHours}h</div>
                      <div className="text-sm text-muted-foreground">Total Time</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{userStats.currentStreak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
            </div>
          </CardContent>
        </Card>

            {/* Course Progress Details */}
        <Card>
          <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Progress
                </CardTitle>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{course.title}</span>
                        <span className="text-sm font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.lang}</span>
                        <span>{course.lessons.filter(l => l.completed).length}/{course.lessons.length} lessons</span>
                      </div>
                    </div>
                  ))}
                </div>
          </CardContent>
        </Card>
          </div>

          {/* Learning Analytics */}
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Learning Analytics
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{userStats.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                  <div className="text-xs text-muted-foreground mt-1">Level {userStats.level}</div>
              </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{userStats.certificates}</div>
                  <div className="text-sm text-muted-foreground">Certificates</div>
                  <div className="text-xs text-muted-foreground mt-1">Earned</div>
              </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{userStats.longestStreak}</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                  <div className="text-xs text-muted-foreground mt-1">Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Badges */}
        <Card>
          <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Badges & Achievements
                </CardTitle>
          </CardHeader>
          <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {defaultBadges.map((badge) => (
                    <div key={badge.id} className={`p-4 rounded-lg border-2 ${badge.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h3 className="font-semibold text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        {badge.earned && badge.date && (
                          <p className="text-xs text-green-600 mt-2">Earned {badge.date}</p>
                        )}
            </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {defaultLeaderboard.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">Level {user.level} • {user.courses} courses</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{user.score}</div>
                        <div className="text-xs text-muted-foreground">{user.streak} day streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements List */}
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                All Achievements
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`flex items-center gap-4 p-4 rounded-lg border ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex-shrink-0">
                      {achievement.earned ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">+{achievement.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tutor Assistant Tab */}
        <TabsContent value="tutor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Tutor Assistant
              </CardTitle>
              <CardDescription>
                Get instant help and explanations in your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Interface */}
                <div className="h-96 border rounded-lg p-4 bg-gray-50">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border shadow-sm'
                          }`}>
                            <div className="text-xs opacity-70 mb-1">
                              {msg.role === 'user' ? 'You' : 'AI Tutor'}
                            </div>
                            <div className="text-sm">{msg.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                            <div className="text-xs opacity-70 mb-1">AI Tutor</div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask me anything about your courses..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                        className="flex-1"
                      />
                      <Button onClick={handleAsk} disabled={!prompt.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Questions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    "What is solar energy?",
                    "Explain safety procedures",
                    "How to use tools?",
                    "What are the steps?"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(question)}
                      className="text-xs text-left justify-start"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Learning Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Learning Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Preferred Language</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    {["Hindi", "Tamil", "Bengali", "Marathi", "English"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Text-to-Speech</label>
                    <p className="text-xs text-muted-foreground">Enable voice narration</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tts} 
                    onChange={(e) => setTts(e.target.checked)} 
                    className="rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Playback Speed: {speed}x</label>
                  <input 
                    type="range" 
                    min={0.5} 
                    max={2} 
                    step={0.1} 
                    value={speed} 
                    onChange={(e) => setSpeed(Number(e.target.value))} 
                    className="w-full mt-1"
                  />
            </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto-play</label>
                    <p className="text-xs text-muted-foreground">Automatically play next lesson</p>
            </div>
                  <input 
                    type="checkbox" 
                    checked={autoPlay} 
                    onChange={(e) => setAutoPlay(e.target.checked)} 
                    className="rounded"
                  />
            </div>
          </CardContent>
        </Card>

            {/* Accessibility Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subtitle Size: {subtitleSize}px</label>
                  <input 
                    type="range" 
                    min={12} 
                    max={24} 
                    value={subtitleSize} 
                    onChange={(e) => setSubtitleSize(Number(e.target.value))} 
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Subtitle Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="color" 
                      value={subtitleColor} 
                      onChange={(e) => setSubtitleColor(e.target.value)} 
                      className="w-12 h-8 rounded border"
                    />
                    <span className="text-sm text-muted-foreground">{subtitleColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Dark Mode</label>
                    <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={(e) => setDarkMode(e.target.checked)} 
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive learning reminders</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications} 
                    onChange={(e) => setNotifications(e.target.checked)} 
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Tutor Settings */}
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Tutor Assistant
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Chat with AI Assistant</h3>
                  <div className="space-y-3">
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded-lg text-sm ${
                          msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
                        }`}>
                          <div className="font-medium text-xs mb-1">
                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                          </div>
                          <div>{msg.content}</div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="bg-gray-100 mr-8 p-2 rounded-lg text-sm">
                          <div className="font-medium text-xs mb-1">AI Assistant</div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                        className="flex-1"
                      />
                      <Button onClick={handleAsk} disabled={!prompt.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>

      {/* Course Player Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {course.title}
                </CardTitle>
                <CardDescription>
                  Lesson {currentLesson + 1} of {course.lessons.length}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCourseModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Player Area */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">{course.thumbnail}</div>
                  <div className="text-lg font-semibold mb-2">{course.lessons[currentLesson]?.title}</div>
                  <div className="text-sm opacity-75">{course.lessons[currentLesson]?.duration}</div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlayPause}
                    className="ux4g-btn ux4g-btn-primary"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentLesson === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSubtitles(!showSubtitles)}
                    >
                      {showSubtitles ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleLessonComplete(course.lessons[currentLesson]?.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={nextLesson}
                    disabled={currentLesson === course.lessons.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Subtitles */}
                {showSubtitles && (
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <div className="text-lg font-medium">
                      {course.lessons[currentLesson]?.title} - Sample subtitle text
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      This is a sample subtitle that would appear during the lesson
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Settings are already available in the Settings tab above.</p>
            </CardContent>
            <div className="flex justify-end p-6 border-t">
              <Button onClick={() => setShowSettingsModal(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Share Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Share this course with others:</p>
              <div className="flex gap-2">
                <Input value="https://skillbhasha.com/course/123" readOnly />
                <Button size="sm">Copy</Button>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 border-t">
              <Button onClick={() => setShowShareModal(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}

      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificate Ready!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Congratulations! You've completed the course and earned a certificate.
              </p>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </CardContent>
            <div className="flex justify-end p-6 border-t">
              <Button variant="outline" onClick={() => setShowCertificateModal(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

