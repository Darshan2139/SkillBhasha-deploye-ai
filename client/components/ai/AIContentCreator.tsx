import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  FileText, 
  Video, 
  Image, 
  Music, 
  Download,
  Copy,
  RefreshCw,
  Save,
  Eye,
  Edit3,
  Languages,
  Target,
  Clock,
  Zap,
  Lightbulb,
  BookOpen,
  Presentation,
  Mic,
  Camera
} from 'lucide-react';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'text' | 'video' | 'audio' | 'presentation' | 'interactive';
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  language: string;
  type: string;
  timestamp: string;
  status: 'draft' | 'review' | 'approved';
}

interface AIContentCreatorProps {
  onContentGenerated?: (content: GeneratedContent) => void;
  onSave?: (content: GeneratedContent) => void;
}

export default function AIContentCreator({ onContentGenerated, onSave }: AIContentCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [prompt, setPrompt] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [domain, setDomain] = useState('general');
  const [difficulty, setDifficulty] = useState('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const templates: ContentTemplate[] = [
    {
      id: 'course-intro',
      name: 'Course Introduction',
      description: 'Generate engaging course introductions with learning objectives',
      icon: BookOpen,
      category: 'text',
      estimatedTime: '2-3 min',
      difficulty: 'beginner'
    },
    {
      id: 'lesson-content',
      name: 'Lesson Content',
      description: 'Create detailed lesson content with examples and explanations',
      icon: FileText,
      category: 'text',
      estimatedTime: '5-10 min',
      difficulty: 'intermediate'
    },
    {
      id: 'quiz-questions',
      name: 'Quiz Questions',
      description: 'Generate multiple choice and open-ended quiz questions',
      icon: Target,
      category: 'interactive',
      estimatedTime: '3-5 min',
      difficulty: 'intermediate'
    },
    {
      id: 'video-script',
      name: 'Video Script',
      description: 'Create video scripts with timing and visual cues',
      icon: Video,
      category: 'video',
      estimatedTime: '10-15 min',
      difficulty: 'advanced'
    },
    {
      id: 'presentation',
      name: 'Presentation Slides',
      description: 'Generate presentation content with key points and structure',
      icon: Presentation,
      category: 'presentation',
      estimatedTime: '8-12 min',
      difficulty: 'intermediate'
    },
    {
      id: 'audio-script',
      name: 'Audio Script',
      description: 'Create audio narration scripts for podcasts or lectures',
      icon: Mic,
      category: 'audio',
      estimatedTime: '5-8 min',
      difficulty: 'beginner'
    }
  ];

  const languages = [
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const domains = [
    'General', 'Healthcare', 'Construction', 'Solar Energy', 'Retail', 
    'Agriculture', 'Manufacturing', 'IT', 'Finance', 'Education'
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
  ];

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const content: GeneratedContent = {
        id: Date.now().toString(),
        title: `Generated ${selectedTemplate.name}`,
        content: `This is AI-generated content for: "${prompt}"\n\nIn ${languages.find(l => l.code === targetLanguage)?.name} language.\n\nDomain: ${domain}\nDifficulty: ${difficulty}\n\n[Generated content would appear here with proper AI translation and localization]`,
        language: targetLanguage,
        type: selectedTemplate.category,
        timestamp: new Date().toISOString(),
        status: 'draft'
      };
      
      setGeneratedContent(content);
      setIsGenerating(false);
      onContentGenerated?.(content);
    }, 2000 + Math.random() * 3000);
  };

  const handleSave = () => {
    if (generatedContent) {
      onSave?.(generatedContent);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const diff = difficulties.find(d => d.value === difficulty);
    return diff?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'text': FileText,
      'video': Video,
      'audio': Music,
      'presentation': Presentation,
      'interactive': Target
    };
    const IconComponent = iconMap[category] || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="ux4g-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI-Powered Content Creation
          </CardTitle>
          <CardDescription>
            Generate localized training content using AI. Select a template and provide your requirements.
          </CardDescription>
        </CardHeader>
      </CardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card className="ux4g-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Content Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">{template.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {template.estimatedTime}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="ux4g-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target Language */}
              <div>
                <label className="text-sm font-medium mb-2 block">Target Language</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="ux4g-input"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain */}
              <div>
                <label className="text-sm font-medium mb-2 block">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="ux4g-input"
                >
                  {domains.map((d) => (
                    <option key={d} value={d.toLowerCase()}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        difficulty === diff.value
                          ? diff.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card className="ux4g-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Content Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what content you want to generate. Be specific about the topic, key points, and any special requirements..."
                className="min-h-[120px]"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {prompt.length}/500 characters
                </span>
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate || !prompt.trim() || isGenerating}
                  className="ux4g-btn ux4g-btn-primary"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <div className="space-y-6">
          {generatedContent ? (
            <Card className="ux4g-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Content
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(generatedContent.content)}
                      className="ux4g-btn ux4g-btn-secondary"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="ux4g-btn ux4g-btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Languages className="h-4 w-4" />
                      {languages.find(l => l.code === generatedContent.language)?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(generatedContent.type)}
                      {generatedContent.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(generatedContent.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedContent.content}
                    </pre>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="status-info">Draft</Badge>
                    <span className="text-sm text-muted-foreground">
                      Ready for review and editing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="ux4g-card">
              <CardContent className="p-12 text-center">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Content Generated Yet</h3>
                <p className="text-muted-foreground">
                  Select a template and provide your requirements to generate AI-powered content.
                </p>
              </CardContent>
            </Card>
          )}

          {/* AI Features Info */}
          <Card className="ux4g-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">IndicTrans2 Integration</div>
                    <div className="text-sm text-muted-foreground">Advanced AI translation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Languages className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Cultural Adaptation</div>
                    <div className="text-sm text-muted-foreground">Context-aware localization</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Wand2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Content Generation</div>
                    <div className="text-sm text-muted-foreground">AI-powered content creation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
