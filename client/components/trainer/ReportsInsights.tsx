import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  Globe,
  Target,
  Zap,
  BookOpen,
  MessageSquare,
  Star,
  Award,
  Activity,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

interface TranslationMetrics {
  totalTranslations: number;
  averageAccuracy: number;
  languagesSupported: number;
  processingTime: number;
  qualityScore: number;
}

interface ContentMetrics {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  averageEngagement: number;
  completionRate: number;
  userSatisfaction: number;
}

interface UserEngagement {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  averageSessionTime: number;
  courseCompletions: number;
}

interface LanguagePerformance {
  language: string;
  accuracy: number;
  usage: number;
  satisfaction: number;
  trend: 'up' | 'down' | 'stable';
}

interface ContentPerformance {
  title: string;
  views: number;
  completions: number;
  rating: number;
  language: string;
  domain: string;
  createdAt: string;
}

interface ReportsInsightsProps {
  onExportReport?: (format: 'pdf' | 'excel' | 'csv') => void;
  onRefreshData?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }
];

const DOMAINS = [
  { code: 'solar', name: 'Solar Energy', icon: '☀️' },
  { code: 'electrical', name: 'Electrical', icon: '⚡' },
  { code: 'plumbing', name: 'Plumbing', icon: '🔧' },
  { code: 'construction', name: 'Construction', icon: '🏗️' },
  { code: 'automotive', name: 'Automotive', icon: '🚗' },
  { code: 'healthcare', name: 'Healthcare', icon: '🏥' }
];

export default function ReportsInsights({
  onExportReport,
  onRefreshData
}: ReportsInsightsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'translations' | 'content' | 'engagement'>('overview');

  // Mock data - in real app, this would come from API
  const translationMetrics: TranslationMetrics = {
    totalTranslations: 1247,
    averageAccuracy: 94.2,
    languagesSupported: 10,
    processingTime: 2.3,
    qualityScore: 8.7
  };

  const contentMetrics: ContentMetrics = {
    totalContent: 89,
    publishedContent: 67,
    draftContent: 22,
    averageEngagement: 78.5,
    completionRate: 82.3,
    userSatisfaction: 4.6
  };

  const userEngagement: UserEngagement = {
    totalUsers: 1247,
    activeUsers: 892,
    newUsers: 156,
    retentionRate: 73.2,
    averageSessionTime: 24.5,
    courseCompletions: 2341
  };

  const languagePerformance: LanguagePerformance[] = [
    { language: 'Hindi', accuracy: 96.2, usage: 35, satisfaction: 4.8, trend: 'up' },
    { language: 'Spanish', accuracy: 94.1, usage: 28, satisfaction: 4.6, trend: 'up' },
    { language: 'French', accuracy: 92.8, usage: 18, satisfaction: 4.4, trend: 'stable' },
    { language: 'German', accuracy: 91.5, usage: 12, satisfaction: 4.3, trend: 'down' },
    { language: 'Chinese', accuracy: 89.7, usage: 7, satisfaction: 4.1, trend: 'up' }
  ];

  const contentPerformance: ContentPerformance[] = [
    {
      title: 'Solar Panel Installation Basics',
      views: 1247,
      completions: 892,
      rating: 4.8,
      language: 'Hindi',
      domain: 'Solar Energy',
      createdAt: '2024-01-15'
    },
    {
      title: 'Electrical Safety Procedures',
      views: 1089,
      completions: 756,
      rating: 4.6,
      language: 'Spanish',
      domain: 'Electrical',
      createdAt: '2024-01-12'
    },
    {
      title: 'Plumbing Fundamentals',
      views: 923,
      completions: 634,
      rating: 4.4,
      language: 'French',
      domain: 'Plumbing',
      createdAt: '2024-01-10'
    },
    {
      title: 'Construction Site Safety',
      views: 856,
      completions: 567,
      rating: 4.5,
      language: 'German',
      domain: 'Construction',
      createdAt: '2024-01-08'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Translations</p>
                <p className="text-2xl font-bold">{formatNumber(translationMetrics.totalTranslations)}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Accuracy</p>
                <p className="text-2xl font-bold">{translationMetrics.averageAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{formatNumber(userEngagement.activeUsers)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Published</p>
                <p className="text-2xl font-bold">{contentMetrics.publishedContent}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +15.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language Performance
          </CardTitle>
          <CardDescription>
            Translation accuracy and usage across different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {languagePerformance.map((lang, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{LANGUAGES.find(l => l.name === lang.language)?.flag}</div>
                  <div>
                    <div className="font-medium">{lang.language}</div>
                    <div className="text-sm text-gray-500">{lang.usage}% usage</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{lang.accuracy}%</div>
                    <div className="text-sm text-gray-500">accuracy</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{lang.satisfaction}/5</div>
                    <div className="text-sm text-gray-500">rating</div>
                  </div>
                  <div className={`flex items-center ${getTrendColor(lang.trend)}`}>
                    {getTrendIcon(lang.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTranslationsTab = () => (
    <div className="space-y-6">
      {/* Translation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold">{translationMetrics.processingTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Score</p>
                <p className="text-2xl font-bold">{translationMetrics.qualityScore}/10</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Languages</p>
                <p className="text-2xl font-bold">{translationMetrics.languagesSupported}</p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Translation Quality Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Quality Trends</CardTitle>
          <CardDescription>Accuracy improvements over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Quality trends chart would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Most viewed and completed training modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentPerformance.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{DOMAINS.find(d => d.name === content.domain)?.icon}</div>
                  <div>
                    <div className="font-medium">{content.title}</div>
                    <div className="text-sm text-gray-500">
                      {content.language} • {content.domain} • {content.createdAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="font-semibold">{formatNumber(content.views)}</div>
                    <div className="text-sm text-gray-500">views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{formatNumber(content.completions)}</div>
                    <div className="text-sm text-gray-500">completions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {content.rating}
                    </div>
                    <div className="text-sm text-gray-500">rating</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{contentMetrics.averageEngagement}%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{contentMetrics.completionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                <p className="text-2xl font-bold">{contentMetrics.userSatisfaction}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEngagementTab = () => (
    <div className="space-y-6">
      {/* User Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(userEngagement.totalUsers)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-2xl font-bold">{formatNumber(userEngagement.newUsers)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold">{userEngagement.retentionRate}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                <p className="text-2xl font-bold">{userEngagement.averageSessionTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Course Completions</p>
                <p className="text-2xl font-bold">{formatNumber(userEngagement.courseCompletions)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Over Time</CardTitle>
          <CardDescription>Daily active users and course completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Engagement trends chart would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reports & Insights
              </CardTitle>
              <CardDescription>
                Comprehensive analytics for translation accuracy, content performance, and user engagement
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onRefreshData?.()}
                variant="outline"
                className="ux4g-btn ux4g-btn-secondary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => onExportReport?.('pdf')}
                className="ux4g-btn ux4g-btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Period:</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Language:</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Domain:</label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {DOMAINS.map(domain => (
                    <SelectItem key={domain.code} value={domain.code}>
                      {domain.icon} {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'translations', label: 'Translations', icon: <Globe className="h-4 w-4" /> },
          { id: 'content', label: 'Content', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'engagement', label: 'Engagement', icon: <Users className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'translations' && renderTranslationsTab()}
      {activeTab === 'content' && renderContentTab()}
      {activeTab === 'engagement' && renderEngagementTab()}
    </div>
  );
}
