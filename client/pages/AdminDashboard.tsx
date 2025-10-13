import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { 
  Download, 
  Upload, 
  AlertOctagon, 
  Database, 
  Key, 
  Users, 
  RefreshCw, 
  FileText, 
  ExternalLink, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Shield, 
  Zap,
  Clock,
  Activity,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  X,
  Save,
  Loader2,
  Mail
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Vocab = { id: string; domain: string; language: string; term: string; translation: string; verified: boolean };

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    darkMode: false,
    language: 'en',
    theme: 'default'
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="container py-16">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold">{t('admin_title')}</h1>
          <p className="mt-3 text-muted-foreground">{t('please_login_admin')}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login"><Button>{t('login')}</Button></Link>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">{t('login_demo_note')}</div>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8">
      <div className="container">
      <h1 className="text-2xl font-bold">{t('admin_title')}</h1>
        
        {/* Quick Access Buttons */}
        <div className="mt-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Quick Access</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToSection('ai-performance')}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <Activity className="h-4 w-4 text-blue-600" />
                AI Performance
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToSection('vocabulary-bank')}
                className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <Database className="h-4 w-4 text-green-600" />
                Vocabulary Bank
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToSection('user-feedback')}
                className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <Users className="h-4 w-4 text-purple-600" />
                User & Feedback
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToSection('analytics')}
                className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-orange-600" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToSection('national-repo')}
                className="flex items-center gap-2 hover:bg-teal-50 hover:border-teal-300 transition-colors"
              >
                <Database className="h-4 w-4 text-teal-600" />
                National Repo
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => scrollToSection('integrations')}
                className="flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              >
                <Key className="h-4 w-4 text-indigo-600" />
                Integrations
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-600" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full-width AI Drift & Performance Section */}
      <div id="ai-performance" className="mt-8 bg-muted/30">
        <div className="container py-8">
          <AIPerformance onSettingsClick={() => setShowSettings(true)} />
        </div>
      </div>

      {/* Full-width Vocabulary Bank Section */}
      <div id="vocabulary-bank" className="mt-8">
        <div className="container py-8">
        <VocabularyBank />
        </div>
      </div>

      {/* Other sections in grid layout */}
      <div className="container mt-8">
      <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div id="user-feedback">
        <UserFeedback />
          </div>
          <div id="analytics">
        <Analytics />
          </div>
      </div>

        <div id="national-repo" className="mt-8">
        <NationalRepo />
      </div>

        <div id="integrations" className="mt-8">
          <Integrations />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Settings
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* General Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Auto Refresh</label>
                        <p className="text-xs text-muted-foreground">Automatically refresh dashboard data</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Refresh Interval</label>
                        <p className="text-xs text-muted-foreground">How often to refresh data (seconds)</p>
                      </div>
                      <select
                        value={settings.refreshInterval}
                        onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value={10}>10 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={300}>5 minutes</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Notifications</label>
                        <p className="text-xs text-muted-foreground">Enable system notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Dark Mode</label>
                        <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => setSettings(prev => ({ ...prev, darkMode: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Language</label>
                        <p className="text-xs text-muted-foreground">Interface language</p>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="bn">Bengali</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Theme</label>
                        <p className="text-xs text-muted-foreground">Color theme</p>
                      </div>
                      <select
                        value={settings.theme}
                        onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="default">Default</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* System Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">System</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Cache Management</label>
                        <p className="text-xs text-muted-foreground">Clear cached data</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        localStorage.clear();
                        alert("Cache cleared successfully");
                      }}>
                        Clear Cache
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Export Settings</label>
                        <p className="text-xs text-muted-foreground">Download current settings</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "admin_settings.json";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Reset to Defaults</label>
                        <p className="text-xs text-muted-foreground">Restore default settings</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        if (confirm("Are you sure you want to reset all settings to defaults?")) {
                          setSettings({
                            autoRefresh: true,
                            refreshInterval: 30,
                            notifications: true,
                            darkMode: false,
                            language: 'en',
                            theme: 'default'
                          });
                          alert("Settings reset to defaults");
                        }
                      }}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                localStorage.setItem('admin_settings', JSON.stringify(settings));
                alert("Settings saved successfully");
                setShowSettings(false);
              }}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          <TrendingUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

function AIPerformance({ onSettingsClick }: { onSettingsClick: () => void }) {
  const { t } = useLanguage();
  const [langs, setLangs] = useState([
    { code: "hi", name: "Hindi", accuracy: 96, latency: 420, status: "active", retraining: false },
    { code: "bn", name: "Bengali", accuracy: 91, latency: 480, status: "active", retraining: false },
    { code: "ta", name: "Tamil", accuracy: 88, latency: 560, status: "warning", retraining: false },
    { code: "mr", name: "Marathi", accuracy: 94, latency: 430, status: "active", retraining: false },
  ]);

  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const handleRetrainModel = async (langCode: string) => {
    setLangs(prev => prev.map(lang => 
      lang.code === langCode ? { ...lang, retraining: true, status: "retraining" } : lang
    ));
    
    // Simulate retraining process
    setTimeout(() => {
      setLangs(prev => prev.map(lang => 
        lang.code === langCode ? { 
          ...lang, 
          retraining: false, 
          status: "active",
          accuracy: Math.min(100, lang.accuracy + Math.random() * 5)
        } : lang
      ));
      alert(`Model retrained successfully for ${langs.find(l => l.code === langCode)?.name}`);
    }, 3000);
  };

  const handleViewLogs = (langCode: string) => {
    setSelectedLang(langCode);
    setLogs([
      `[${new Date().toISOString()}] Model accuracy: ${langs.find(l => l.code === langCode)?.accuracy}%`,
      `[${new Date().toISOString()}] Processing 1,234 requests`,
      `[${new Date().toISOString()}] Cache hit rate: 87.3%`,
      `[${new Date().toISOString()}] Memory usage: 2.1GB`,
      `[${new Date().toISOString()}] GPU utilization: 45%`
    ]);
    setShowLogs(true);
  };

  const handleExportData = (langCode: string) => {
    const lang = langs.find(l => l.code === langCode);
    const data = {
      language: lang?.name,
      accuracy: lang?.accuracy,
      latency: lang?.latency,
      status: lang?.status,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${langCode}_model_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "retraining": return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getLanguageFlag = (code: string) => {
    const flags: Record<string, string> = {
      hi: "🇮🇳",
      bn: "🇧🇩", 
      ta: "🇮🇳",
      mr: "🇮🇳"
    };
    return flags[code] || "🌐";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('admin_monitoring')}</h2>
            <p className="text-sm text-muted-foreground">AI Model Performance & Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button variant="outline" size="sm" onClick={onSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

    <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead className="w-40">Language</TableHead>
                  <TableHead className="w-48">Accuracy</TableHead>
                  <TableHead className="w-32">Latency</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="w-80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {langs.map((l) => (
                  <TableRow key={l.code} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getLanguageFlag(l.code)}</span>
                        <div>
                          <div className="font-medium">{l.name}</div>
                          <div className="text-xs text-muted-foreground">{l.code.toUpperCase()}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-muted/40 rounded-full h-3 overflow-hidden">
                          <div 
                            style={{ width: `${l.accuracy}%` }} 
                            className={`${
                              l.accuracy > 93 ? "bg-green-400" : 
                              l.accuracy > 89 ? "bg-amber-400" : "bg-red-400"
                            } h-3 rounded-full transition-all duration-500`} 
                          />
                        </div>
                        <div className="text-sm font-medium min-w-[3rem]">{l.accuracy}%</div>
                      </div>
                    </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{l.latency}ms</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        l.status === "active" ? "bg-green-100 text-green-800" : 
                        l.status === "warning" ? "bg-amber-100 text-amber-800" :
                        l.status === "retraining" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {getStatusIcon(l.status)}
                        {l.status === "active" ? "Excellent" : 
                         l.status === "warning" ? "Needs Attention" :
                         l.status === "retraining" ? "Retraining..." : "Error"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleRetrainModel(l.code)}
                          disabled={l.retraining}
                        >
                          {l.retraining ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <RotateCcw className="h-3 w-3 mr-1" />
                          )}
                          Retrain
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleViewLogs(l.code)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Logs
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleExportData(l.code)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs - {langs.find(l => l.code === selectedLang)?.name}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowLogs(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function VocabularyBank() {
  const { t } = useLanguage();
  const [vocab, setVocab] = useState<Vocab[]>(() => {
    const seed: Vocab[] = [
      { id: "1", domain: "Solar", language: "Hindi", term: "Solar Panel", translation: "सौर पैनल", verified: true },
      { id: "2", domain: "Healthcare", language: "Tamil", term: "Patient", translation: "பயனர்", verified: false },
      { id: "3", domain: "Construction", language: "Bengali", term: "Helmet", translation: "হেলমেট", verified: true },
      { id: "4", domain: "Agriculture", language: "Marathi", term: "Irrigation", translation: "सिंचन", verified: false },
      { id: "5", domain: "Technology", language: "Hindi", term: "Algorithm", translation: "अल्गोरिदम", verified: true },
    ];
    return seed;
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Vocab>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");

  const domains = [...new Set(vocab.map(v => v.domain))];
  const languages = [...new Set(vocab.map(v => v.language))];

  const filteredVocab = vocab.filter(v => {
    const matchesSearch = v.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.translation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === "all" || v.domain === filterDomain;
    const matchesLanguage = filterLanguage === "all" || v.language === filterLanguage;
    return matchesSearch && matchesDomain && matchesLanguage;
  });

  function exportCSV() {
    const rows = [["id", "domain", "language", "term", "translation", "verified"], ...filteredVocab.map((v) => [v.id, v.domain, v.language, v.term, v.translation, String(v.verified)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vocabulary_bank_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const data = lines.slice(1).map((ln) => {
        const cols = ln.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, ""));
        return { id: cols[0] || String(Date.now()), domain: cols[1] || "General", language: cols[2] || "", term: cols[3] || "", translation: cols[4] || "", verified: cols[5] === "true" } as Vocab;
      });
      setVocab((s) => [...data, ...s]);
      alert(`Successfully imported ${data.length} vocabulary entries`);
    };
    reader.readAsText(f);
  }

  function handleEdit(v: Vocab) {
    setEditingId(v.id);
    setEditForm(v);
  }

  function handleSaveEdit() {
    if (editingId && editForm.term && editForm.translation) {
      setVocab(prev => prev.map(v => v.id === editingId ? { ...v, ...editForm } as Vocab : v));
      setEditingId(null);
      setEditForm({});
    }
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this vocabulary entry?")) {
      setVocab(prev => prev.filter(v => v.id !== id));
    }
  }

  function handleVerify(id: string) {
    setVocab(prev => prev.map(v => v.id === id ? { ...v, verified: !v.verified } : v));
  }

  function getDomainIcon(domain: string) {
    const icons: Record<string, string> = {
      Solar: "☀️",
      Healthcare: "🏥",
      Construction: "🏗️",
      Agriculture: "🌾",
      Technology: "💻",
      General: "📚"
    };
    return icons[domain] || "📚";
  }

  function getLanguageFlag(lang: string) {
    const flags: Record<string, string> = {
      Hindi: "🇮🇳",
      Tamil: "🇮🇳",
      Bengali: "🇧🇩",
      Marathi: "🇮🇳",
      English: "🇺🇸"
    };
    return flags[lang] || "🌐";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('vocabulary_bank')}</h2>
            <p className="text-sm text-muted-foreground">Manage multilingual vocabulary database</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="file" accept=".csv" onChange={(e) => e.target.files && importCSV(e.target.files[0])} className="hidden" />
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" /> 
              Import CSV
            </Button>
          </label>
          <Button size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" /> 
            Export CSV
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
        </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms or translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Domains</option>
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Languages</option>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
                  <TableHead className="w-32">Domain</TableHead>
                  <TableHead className="w-32">Language</TableHead>
                  <TableHead className="w-48">English Term</TableHead>
                  <TableHead className="w-48">Translation</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                {filteredVocab.map((v) => (
                  <TableRow key={v.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getDomainIcon(v.domain)}</span>
                        <div>
                          <div className="text-sm font-medium">{v.domain}</div>
                          <div className={`w-2 h-2 rounded-full ${
                            v.domain === 'Solar' ? 'bg-yellow-400' :
                            v.domain === 'Healthcare' ? 'bg-blue-400' :
                            v.domain === 'Construction' ? 'bg-orange-400' :
                            v.domain === 'Agriculture' ? 'bg-green-400' :
                            v.domain === 'Technology' ? 'bg-purple-400' :
                            'bg-gray-400'
                          }`} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getLanguageFlag(v.language)}</span>
                        <span className="text-sm">{v.language}</span>
                      </div>
                    </TableCell>
                <TableCell className="font-medium">{v.term}</TableCell>
                    <TableCell className="font-mono text-sm">{v.translation}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        v.verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {v.verified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {v.verified ? "Verified" : "Pending"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 px-2"
                          onClick={() => handleEdit(v)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 px-2"
                          onClick={() => handleVerify(v.id)}
                        >
                          {v.verified ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 px-2 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(v.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          </div>
      </CardContent>
    </Card>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Vocabulary Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Domain</label>
                <select
                  value={editForm.domain || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                >
                  <option value="Solar">Solar</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Construction">Construction</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Technology">Technology</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Language</label>
                <select
                  value={editForm.language || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                >
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">English Term</label>
                <Input
                  value={editForm.term || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, term: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Translation</label>
                <Input
                  value={editForm.translation || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, translation: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={editForm.verified || false}
                  onChange={(e) => setEditForm(prev => ({ ...prev, verified: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="verified" className="text-sm">Verified</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
      </CardContent>
    </Card>
        </div>
      )}
    </div>
  );
}

function Integrations() {
  const integrations = [
    { 
      name: "Bhashini", 
      logo: "🌐", 
      description: "AI Translation Platform",
      status: "connected",
      color: "bg-blue-500"
    },
    { 
      name: "NCVET", 
      logo: "🎓", 
      description: "National Council for Vocational Education",
      status: "disconnected",
      color: "bg-green-500"
    },
    { 
      name: "Skill India Digital", 
      logo: "💼", 
      description: "Digital Skills Platform",
      status: "connected",
      color: "bg-orange-500"
    },
    { 
      name: "LMS", 
      logo: "📚", 
      description: "Learning Management System",
      status: "pending",
      color: "bg-purple-500"
    }
  ];
  
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_integrations") || "{}");
    } catch {
      return {};
    }
  });

  const [connectionStatus, setConnectionStatus] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_connection_status") || "{}");
    } catch {
      return {};
    }
  });

  function saveKey(name: string, key: string) {
    const next = { ...keys, [name]: key };
    setKeys(next);
    localStorage.setItem("sb_integrations", JSON.stringify(next));
    alert(`API key saved for ${name}`);
  }

  function testConnection(name: string) {
    setConnectionStatus(prev => ({ ...prev, [name]: "testing" }));
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      setConnectionStatus(prev => ({ 
        ...prev, 
        [name]: success ? "connected" : "failed" 
      }));
      localStorage.setItem("sb_connection_status", JSON.stringify({
        ...connectionStatus,
        [name]: success ? "connected" : "failed"
      }));
      alert(success ? `Connection successful for ${name}` : `Connection failed for ${name}`);
    }, 2000);
  }

  function disconnect(name: string) {
    setConnectionStatus(prev => ({ ...prev, [name]: "disconnected" }));
    localStorage.setItem("sb_connection_status", JSON.stringify({
      ...connectionStatus,
      [name]: "disconnected"
    }));
    alert(`Disconnected from ${name}`);
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "connected": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected": return <XCircle className="h-4 w-4 text-red-500" />;
      case "testing": return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "connected": return "Connected";
      case "disconnected": return "Disconnected";
      case "testing": return "Testing...";
      case "pending": return "Pending";
      case "failed": return "Failed";
      default: return "Unknown";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Key className="h-5 w-5 text-white" />
          </div>
          Integration Center
        </CardTitle>
        <p className="text-sm text-muted-foreground">Manage API connections and integrations</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => {
            const currentStatus = connectionStatus[integration.name] || integration.status;
            const hasKey = keys[integration.name] && keys[integration.name].length > 0;
            
            return (
              <div key={integration.name} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center text-white text-lg`}>
                      {integration.logo}
            </div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentStatus)}
                    <span className="text-sm font-medium">{getStatusText(currentStatus)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input 
                    value={keys[integration.name] || ""} 
                    onChange={(e) => setKeys((s) => ({ ...s, [integration.name]: e.target.value }))} 
                    placeholder="Enter API Key" 
                    type="password"
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => saveKey(integration.name, keys[integration.name] || "")}
                    disabled={!keys[integration.name] || keys[integration.name].length === 0}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  {hasKey && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testConnection(integration.name)}
                        disabled={currentStatus === "testing"}
                      >
                        {currentStatus === "testing" ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4 mr-1" />
                        )}
                        Test
                      </Button>
                      {currentStatus === "connected" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => disconnect(integration.name)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Disconnect
                        </Button>
                      )}
                    </>
                  )}
                </div>
            </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function UserFeedback() {
  const [users, setUsers] = useState(() => [
    { id: "u1", name: "Ananya", role: "learner", email: "ananya@example.com", status: "active", lastActive: "2 hours ago" },
    { id: "u2", name: "Rohit", role: "trainer", email: "rohit@trainer.com", status: "active", lastActive: "1 day ago" },
    { id: "u3", name: "Fatima", role: "learner", email: "fatima@example.com", status: "inactive", lastActive: "1 week ago" },
    { id: "u4", name: "Priya", role: "admin", email: "priya@admin.com", status: "active", lastActive: "30 minutes ago" },
  ]);
  
  const [feedback, setFeedback] = useState(() => [
    { id: "f1", user: "Ananya", message: "Translation for Module 2 in Tamil is inaccurate in section 3.", status: "open", priority: "high", date: "2 hours ago" },
    { id: "f2", user: "Rohit", message: "Auto-subtitle timing off by 0.5s", status: "resolved", priority: "medium", date: "1 day ago" },
    { id: "f3", user: "Fatima", message: "Need more examples in Bengali translation course", status: "open", priority: "low", date: "3 days ago" },
    { id: "f4", user: "Priya", message: "System performance is slow during peak hours", status: "in_progress", priority: "high", date: "5 hours ago" },
  ]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  function handleUserAction(userId: string, action: string) {
    const user = users.find(u => u.id === userId);
    switch (action) {
      case "view":
        setSelectedUser(userId);
        break;
      case "message":
        alert(`Sending message to ${user?.name}...`);
        break;
      case "suspend":
        if (confirm(`Are you sure you want to suspend ${user?.name}?`)) {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "suspended" } : u));
          alert(`${user?.name} has been suspended`);
        }
        break;
      case "activate":
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "active" } : u));
        alert(`${user?.name} has been activated`);
        break;
    }
  }

  function handleFeedbackAction(feedbackId: string, action: string) {
    const feedbackItem = feedback.find(f => f.id === feedbackId);
    switch (action) {
      case "view":
        setSelectedFeedback(feedbackId);
        break;
      case "resolve":
        setFeedback(prev => prev.map(f => f.id === feedbackId ? { ...f, status: "resolved" } : f));
        alert(`Feedback from ${feedbackItem?.user} has been resolved`);
        break;
      case "reopen":
        setFeedback(prev => prev.map(f => f.id === feedbackId ? { ...f, status: "open" } : f));
        alert(`Feedback from ${feedbackItem?.user} has been reopened`);
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this feedback?")) {
          setFeedback(prev => prev.filter(f => f.id !== feedbackId));
          alert("Feedback deleted");
        }
        break;
    }
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case "learner": return "👨‍🎓";
      case "trainer": return "👨‍🏫";
      case "admin": return "👨‍💼";
      default: return "👤";
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          User & Feedback Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">Manage users and review feedback</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Users Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Users ({users.length})</h4>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
        </div>
            <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
                    <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
                    <TableRow key={u.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getRoleIcon(u.role)}</span>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-sm text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{u.role}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(u.status)}`}>
                          {u.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {u.status === "inactive" && <Clock className="h-3 w-3 mr-1" />}
                          {u.status === "suspended" && <XCircle className="h-3 w-3 mr-1" />}
                          {u.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleUserAction(u.id, "view")}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleUserAction(u.id, "message")}>
                            <Mail className="h-3 w-3" />
                          </Button>
                          {u.status === "active" ? (
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-red-600" onClick={() => handleUserAction(u.id, "suspend")}>
                              <X className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-green-600" onClick={() => handleUserAction(u.id, "activate")}>
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Recent Feedback ({feedback.length})</h4>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="space-y-3">
            {feedback.map((f) => (
                <div key={f.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{f.user}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(f.priority)}`}>
                          {f.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          f.status === "open" ? "bg-blue-100 text-blue-800" :
                          f.status === "resolved" ? "bg-green-100 text-green-800" :
                          f.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {f.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{f.message}</p>
                      <div className="text-xs text-muted-foreground">{f.date}</div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleFeedbackAction(f.id, "view")}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      {f.status === "open" ? (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-green-600" onClick={() => handleFeedbackAction(f.id, "resolve")}>
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      ) : f.status === "resolved" ? (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-600" onClick={() => handleFeedbackAction(f.id, "reopen")}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-red-600" onClick={() => handleFeedbackAction(f.id, "delete")}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Analytics() {
  const stats = useMemo(() => ({ translated: 12450, users: 5230, costPerThousand: "$2.10" }), []);
  
  // Chart data
  const translationTrends = [
    { month: 'Jan', translations: 1200 },
    { month: 'Feb', translations: 1900 },
    { month: 'Mar', translations: 2100 },
    { month: 'Apr', translations: 1800 },
    { month: 'May', translations: 2400 },
    { month: 'Jun', translations: 2200 },
    { month: 'Jul', translations: 2800 },
    { month: 'Aug', translations: 2600 },
    { month: 'Sep', translations: 3000 },
    { month: 'Oct', translations: 3200 },
    { month: 'Nov', translations: 2900 },
    { month: 'Dec', translations: 3500 }
  ];

  const languageDistribution = [
    { language: 'Hindi', count: 4500, color: 'bg-blue-500' },
    { language: 'Tamil', count: 3200, color: 'bg-green-500' },
    { language: 'Bengali', count: 2800, color: 'bg-orange-500' },
    { language: 'Marathi', count: 1950, color: 'bg-purple-500' }
  ];

  const maxTranslations = Math.max(...translationTrends.map(t => t.translations));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Analytics Dashboard
          <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.translated.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Translated items</div>
            <div className="text-xs text-green-600 mt-1">+12% from last month</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.users.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active users</div>
            <div className="text-xs text-green-600 mt-1">+8% from last month</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.costPerThousand}</div>
            <div className="text-sm text-muted-foreground">Cost / 1000 words</div>
            <div className="text-xs text-red-600 mt-1">-5% from last month</div>
          </div>
        </div>

        {/* Translation Trends Chart */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Translation Trends (Last 12 Months)</h4>
          <div className="h-48 bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-full space-x-1">
              {translationTrends.map((trend, index) => (
                <div key={trend.month} className="flex flex-col items-center space-y-2">
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm w-6 transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                    style={{ 
                      height: `${(trend.translations / maxTranslations) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`${trend.month}: ${trend.translations.toLocaleString()} translations`}
                  />
                  <span className="text-xs text-muted-foreground">{trend.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Language Distribution</h4>
          <div className="space-y-3">
            {languageDistribution.map((lang) => {
              const percentage = (lang.count / stats.translated) * 100;
              return (
                <div key={lang.language} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-muted-foreground">{lang.count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${lang.color} transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">98.2%</div>
            <div className="text-sm text-muted-foreground">Translation Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">2.3s</div>
            <div className="text-sm text-muted-foreground">Avg. Processing Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NationalRepo() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<Array<{
    id: string;
    domain: string;
    term: string;
    translations: Record<string, string>;
    verified: boolean;
    addedBy: string;
    date: string;
  }>>(() => [
    { id: "r1", domain: "Solar", term: "Inverter", translations: { Hindi: "इन्वर्टर" }, verified: true, addedBy: "Admin", date: "2 hours ago" },
    { id: "r2", domain: "Healthcare", term: "Vaccine", translations: { Tamil: "தடுப்பூசி", Hindi: "टीका" }, verified: true, addedBy: "Expert", date: "1 day ago" },
    { id: "r3", domain: "Construction", term: "Foundation", translations: { Bengali: "ভিত্তি", Marathi: "पाया" }, verified: false, addedBy: "User", date: "3 days ago" },
  ]);
  const [term, setTerm] = useState("");
  const [translation, setTranslation] = useState("");
  const [lang, setLang] = useState("Hindi");
  const [domain, setDomain] = useState("General");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");

  const domains = [...new Set(entries.map(e => e.domain))];
  const languages = [...new Set(entries.flatMap(e => Object.keys(e.translations)))];

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         Object.values(e.translations).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = filterDomain === "all" || e.domain === filterDomain;
    const matchesLanguage = filterLanguage === "all" || Object.keys(e.translations).includes(filterLanguage);
    return matchesSearch && matchesDomain && matchesLanguage;
  });

  function addEntry() {
    if (!term || !translation || !lang) {
      alert("Please fill in all fields");
      return;
    }
    
    const newEntry = {
      id: String(Date.now()),
      domain,
      term,
      translations: { [lang]: translation },
      verified: false,
      addedBy: "Admin",
      date: "Just now"
    };
    
    setEntries((s) => [newEntry, ...s]);
    setTerm("");
    setTranslation("");
    alert("Translation entry added successfully");
  }

  function verifyEntry(id: string) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, verified: true } : e));
    alert("Entry verified successfully");
  }

  function deleteEntry(id: string) {
    if (confirm("Are you sure you want to delete this entry?")) {
      setEntries(prev => prev.filter(e => e.id !== id));
      alert("Entry deleted successfully");
    }
  }

  function exportRepo() {
    const data = filteredEntries.map(e => ({
      term: e.term,
      domain: e.domain,
      translations: e.translations,
      verified: e.verified,
      addedBy: e.addedBy,
      date: e.date
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `national_repo_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getDomainIcon(domain: string) {
    const icons: Record<string, string> = {
      Solar: "☀️",
      Healthcare: "🏥",
      Construction: "🏗️",
      Agriculture: "🌾",
      Technology: "💻",
      General: "📚"
    };
    return icons[domain] || "📚";
  }

  function getLanguageFlag(lang: string) {
    const flags: Record<string, string> = {
      Hindi: "🇮🇳",
      Tamil: "🇮🇳",
      Bengali: "🇧🇩",
      Marathi: "🇮🇳",
      English: "🇺🇸"
    };
    return flags[lang] || "🌐";
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <Database className="h-5 w-5 text-white" />
          </div>
          {t('national_repo')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">National Language Repository - Verified translations</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Entry */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('add_verified_translation')}
            </h4>
        <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
          <div>
                  <label className="text-sm font-medium">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                  >
                    <option value="General">General</option>
                    <option value="Solar">Solar</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Construction">Construction</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Technology">Technology</option>
                  </select>
              </div>
                <div>
                  <label className="text-sm font-medium">English Term</label>
                  <Input 
                    value={term} 
                    onChange={(e) => setTerm(e.target.value)} 
                    placeholder={t('term_in_english')} 
                  />
              </div>
            </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="English">English</option>
                  </select>
          </div>
          <div>
                  <label className="text-sm font-medium">Translation</label>
                  <Input 
                    value={translation} 
                    onChange={(e) => setTranslation(e.target.value)} 
                    placeholder={t('translation')} 
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addEntry} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Entry
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms or translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Domains</option>
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Languages</option>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <Button size="sm" variant="outline" onClick={exportRepo}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Entries List */}
          <div className="space-y-3">
            <h4 className="font-semibold">Repository Entries ({filteredEntries.length})</h4>
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getDomainIcon(entry.domain)}</span>
                      <div>
                        <div className="font-medium">{entry.term}</div>
                        <div className="text-sm text-muted-foreground">{entry.domain}</div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        entry.verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {entry.verified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {entry.verified ? "Verified" : "Pending"}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(entry.translations).map(([lang, translation]) => (
                        <div key={lang} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                          <span>{getLanguageFlag(lang)}</span>
                          <span className="font-medium">{lang}:</span>
                          <span className="font-mono">{translation}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Added by {entry.addedBy} • {entry.date}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    {!entry.verified && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-2 text-green-600" 
                        onClick={() => verifyEntry(entry.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-red-600" 
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
