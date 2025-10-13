import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { 
  User, 
  Mail, 
  Shield, 
  Award, 
  Settings, 
  Bell, 
  Globe, 
  Palette, 
  Eye, 
  Volume2, 
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  Star,
  Clock,
  BarChart3,
  Languages,
  Headphones,
  Monitor,
  Smartphone
} from "lucide-react";

type UserRole = "learner" | "trainer" | "admin";

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weeklyDigest: boolean;
  };
  accessibility: {
    highContrast: boolean;
    textToSpeech: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
    analytics: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    autoSave: boolean;
  };
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  
  // Basic profile state
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [role, setRole] = useState<UserRole>(user?.role || "learner");
  const [badges, setBadges] = useState<string[]>(user?.badges || []);
  const [newBadge, setNewBadge] = useState("");
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || "#10b981");
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyDigest: true
    },
    accessibility: {
      highContrast: false,
      textToSpeech: true,
      fontSize: 'medium',
      screenReader: false
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: true,
      analytics: true
    },
    preferences: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      theme: 'auto',
      autoSave: true
    }
  });

  // Stats and activity
  const [stats] = useState({
    coursesCompleted: 12,
    translationsCreated: 156,
    hoursSpent: 89,
    streak: 7,
    level: 5,
    xp: 2340,
    nextLevelXp: 3000
  });

  const [recentActivity] = useState([
    { id: 1, action: "Completed course", details: "Advanced Hindi Translation", time: "2 hours ago", icon: Check },
    { id: 2, action: "Earned badge", details: "Translation Master", time: "1 day ago", icon: Award },
    { id: 3, action: "Uploaded content", details: "Technical Manual - Tamil", time: "3 days ago", icon: Upload },
    { id: 4, action: "Joined group", details: "Bengali Language Learners", time: "1 week ago", icon: User },
  ]);

  useEffect(() => {
    setName(user?.name || "");
    setRole(user?.role || "learner");
    setBadges(user?.badges || []);
    setAvatarColor(user?.avatarColor || "#10b981");
  }, [user]);

  async function saveProfile() {
    await updateProfile({ 
      name, 
      role, 
      badges, 
      avatarColor,
      settings 
    });
    alert(t('profile_updated_successfully'));
  }

  function addBadge() {
    if (!newBadge.trim()) return;
    setBadges((s) => [newBadge.trim(), ...s]);
    setNewBadge("");
  }

  function removeBadge(b: string) {
    setBadges((s) => s.filter(x => x !== b));
  }

  function updateSettings(section: keyof UserSettings, key: string, value: any) {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  }

  const avatarColors = [
    "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", 
    "#ef4444", "#06b6d4", "#84cc16", "#f97316"
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8" />
            {t('profile_settings')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('manage_your_profile_and_preferences')}
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('profile')}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('preferences')}
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('accessibility')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t('notifications')}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('activity')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('basic_information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20" style={{ backgroundColor: avatarColor }}>
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl font-bold text-white">
                        {getInitials(name || email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t('avatar_color')}</Label>
                      <div className="flex gap-2">
                        {avatarColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setAvatarColor(color)}
                            className={`w-6 h-6 rounded-full border-2 ${
                              avatarColor === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('full_name')}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('enter_your_name')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('email_cannot_be_changed')}
                      </p>
                    </div>

                    <div>
                      <Label>{t('role')}</Label>
                      <div className="flex gap-2 mt-2">
                        {(['learner', 'trainer', 'admin'] as const).map((r) => (
                          <Button
                            key={r}
                            variant={role === r ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRole(r)}
                            className="flex items-center gap-2"
                          >
                            {r === 'learner' && <User className="h-4 w-4" />}
                            {r === 'trainer' && <Award className="h-4 w-4" />}
                            {r === 'admin' && <Shield className="h-4 w-4" />}
                            {t(r)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('badges_achievements')}
                  </CardTitle>
                  <CardDescription>
                    {t('manage_your_badges_and_achievements')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {badge}
                        <button
                          onClick={() => removeBadge(badge)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder={t('add_new_badge')}
                      onKeyPress={(e) => e.key === 'Enter' && addBadge()}
                    />
                    <Button onClick={addBadge} size="sm">
                      <Award className="h-4 w-4 mr-1" />
                      {t('add')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('your_stats')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.coursesCompleted}</div>
                    <div className="text-sm text-muted-foreground">{t('courses_completed')}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.translationsCreated}</div>
                    <div className="text-sm text-muted-foreground">{t('translations_created')}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.hoursSpent}h</div>
                    <div className="text-sm text-muted-foreground">{t('hours_spent')}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
                    <div className="text-sm text-muted-foreground">{t('day_streak')}</div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{t('level')} {stats.level}</span>
                    <span className="text-sm text-muted-foreground">{stats.xp}/{stats.nextLevelXp} XP</span>
                  </div>
                  <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveProfile} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('save_changes')}
              </Button>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t('language_region')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">{t('preferred_language')}</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => updateSettings('preferences', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">{t('timezone')}</Label>
                    <Select
                      value={settings.preferences.timezone}
                      onValueChange={(value) => updateSettings('preferences', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t('appearance')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">{t('theme')}</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) => updateSettings('preferences', 'theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t('light')}</SelectItem>
                        <SelectItem value="dark">{t('dark')}</SelectItem>
                        <SelectItem value="auto">{t('auto')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">{t('auto_save')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('automatically_save_changes')}
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={settings.preferences.autoSave}
                      onCheckedChange={(checked) => updateSettings('preferences', 'autoSave', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('accessibility_settings')}
                </CardTitle>
                <CardDescription>
                  {t('customize_your_experience_for_better_accessibility')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="high-contrast">{t('high_contrast')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('increase_contrast_for_better_visibility')}
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.accessibility.highContrast}
                        onCheckedChange={(checked) => updateSettings('accessibility', 'highContrast', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="text-to-speech">{t('text_to_speech')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('enable_text_to_speech_for_content')}
                        </p>
                      </div>
                      <Switch
                        id="text-to-speech"
                        checked={settings.accessibility.textToSpeech}
                        onCheckedChange={(checked) => updateSettings('accessibility', 'textToSpeech', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="font-size">{t('font_size')}</Label>
                      <Select
                        value={settings.accessibility.fontSize}
                        onValueChange={(value) => updateSettings('accessibility', 'fontSize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">{t('small')}</SelectItem>
                          <SelectItem value="medium">{t('medium')}</SelectItem>
                          <SelectItem value="large">{t('large')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="screen-reader">{t('screen_reader_support')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t('optimize_for_screen_readers')}
                        </p>
                      </div>
                      <Switch
                        id="screen-reader"
                        checked={settings.accessibility.screenReader}
                        onCheckedChange={(checked) => updateSettings('accessibility', 'screenReader', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t('notification_preferences')}
                </CardTitle>
                <CardDescription>
                  {t('choose_how_you_want_to_be_notified')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">{t('email_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('receive_notifications_via_email')}
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">{t('push_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('receive_push_notifications')}
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSettings('notifications', 'push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">{t('sms_notifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('receive_notifications_via_sms')}
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => updateSettings('notifications', 'sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest">{t('weekly_digest')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('receive_weekly_summary_email')}
                      </p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={settings.notifications.weeklyDigest}
                      onCheckedChange={(checked) => updateSettings('notifications', 'weeklyDigest', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('recent_activity')}
                </CardTitle>
                <CardDescription>
                  {t('your_recent_actions_and_achievements')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
