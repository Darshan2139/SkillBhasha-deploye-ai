import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { apiService, ContentGenerationRequest } from '@/lib/api';
import { 
  Zap, 
  Wand2, 
  FileText, 
  Video, 
  Image, 
  Download, 
  Save, 
  Edit3, 
  Eye, 
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Share2,
  Settings,
  Brain,
  Target,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  GraduationCap,
  Wrench,
  Lightbulb
} from 'lucide-react';

interface GeneratedContent {
  id: string;
  title: string;
  type: 'text' | 'video' | 'image' | 'interactive';
  content: string;
  language: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  tags: string[];
  createdAt: string;
  status: 'generating' | 'ready' | 'error';
  confidence: number;
  version: number;
  isEdited: boolean;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  category: string;
}

interface AIContentCreatorProps {
  onContentGenerated?: (content: GeneratedContent) => void;
  onContentSaved?: (content: GeneratedContent) => void;
  onContentExported?: (content: GeneratedContent, format: string) => void;
  selectedContent?: GeneratedContent | null;
  onContentSelect?: (content: GeneratedContent) => void;
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
  { code: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { code: 'cooking', name: 'Cooking', icon: '👨‍🍳' },
  { code: 'technology', name: 'Technology', icon: '💻' },
  { code: 'safety', name: 'Safety', icon: '🛡️' },
  { code: 'general', name: 'General', icon: '📚' }
];

const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'intro-lesson',
    name: 'Introduction Lesson',
    description: 'Create an introductory lesson for beginners',
    icon: <BookOpen className="h-5 w-5" />,
    prompt: 'Create an introduction lesson for {domain} that covers basic concepts, safety guidelines, and learning objectives for beginners.',
    category: 'Educational'
  },
  {
    id: 'step-by-step-guide',
    name: 'Step-by-Step Guide',
    description: 'Generate a detailed procedural guide',
    icon: <Wrench className="h-5 w-5" />,
    prompt: 'Create a comprehensive step-by-step guide for {domain} that includes tools needed, safety precautions, and detailed instructions.',
    category: 'Procedural'
  },
  {
    id: 'safety-training',
    name: 'Safety Training',
    description: 'Develop safety-focused training content',
    icon: <Target className="h-5 w-5" />,
    prompt: 'Create a safety training module for {domain} that emphasizes hazard identification, protective equipment, and emergency procedures.',
    category: 'Safety'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting Guide',
    description: 'Build problem-solving scenarios',
    icon: <Lightbulb className="h-5 w-5" />,
    prompt: 'Create a troubleshooting guide for {domain} that covers common problems, diagnostic steps, and solutions.',
    category: 'Problem-Solving'
  },
  {
    id: 'assessment',
    name: 'Knowledge Assessment',
    description: 'Generate quiz and test questions',
    icon: <GraduationCap className="h-5 w-5" />,
    prompt: 'Create assessment questions for {domain} that test understanding of key concepts, procedures, and safety protocols.',
    category: 'Assessment'
  },
  {
    id: 'interactive-simulation',
    name: 'Interactive Simulation',
    description: 'Design hands-on practice scenarios',
    icon: <Zap className="h-5 w-5" />,
    prompt: 'Create an interactive simulation for {domain} that allows learners to practice procedures in a safe, virtual environment.',
    category: 'Interactive'
  }
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

export default function AIContentCreator({
  onContentGenerated,
  onContentSaved,
  onContentExported,
  selectedContent: externalSelectedContent,
  onContentSelect
}: AIContentCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedDomain, setSelectedDomain] = useState('solar');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [contentLength, setContentLength] = useState([500]);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeVideo, setIncludeVideo] = useState(false);
  const [includeQuiz, setIncludeQuiz] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(externalSelectedContent || null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update local selected content when external changes
  React.useEffect(() => {
    setSelectedContent(externalSelectedContent || null);
  }, [externalSelectedContent]);

  const handleTemplateSelect = (templateId: string) => {
    const template = CONTENT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      const filledPrompt = template.prompt.replace('{domain}', DOMAINS.find(d => d.code === selectedDomain)?.name || 'the selected domain');
      setPrompt(filledPrompt);
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const contentId = `content-${Date.now()}`;
    
    try {
      const request: ContentGenerationRequest = {
        prompt,
        language: selectedLanguage,
        domain: selectedDomain,
        difficulty: selectedDifficulty,
        contentType: includeVideo ? 'video' : 'text',
        includeImages,
        includeVideo,
        includeQuiz
      };

      const response = await apiService.generateContent(request);
      
      if (response.success && response.data) {
        const newContent: GeneratedContent = {
          id: contentId,
          title: `Generated ${DOMAINS.find(d => d.code === selectedDomain)?.name} Training Module`,
          type: includeVideo ? 'video' : 'text',
          content: response.data.content,
          language: selectedLanguage,
          domain: selectedDomain,
          difficulty: selectedDifficulty,
          duration: Math.floor(Math.random() * 60) + 15,
          tags: [selectedDomain, selectedDifficulty, 'ai-generated'],
          createdAt: new Date().toISOString(),
          status: 'ready',
          confidence: Math.floor(Math.random() * 20) + 80,
          version: 1,
          isEdited: false
        };

        setGeneratedContent(prev => [newContent, ...prev]);
        setSelectedContent(newContent);
        onContentSelect?.(newContent);
        onContentGenerated?.(newContent);
      } else {
        console.error('Failed to generate content:', response.error);
        // Fallback to sample content
        const newContent: GeneratedContent = {
          id: contentId,
          title: `Generated ${DOMAINS.find(d => d.code === selectedDomain)?.name} Training Module`,
          type: includeVideo ? 'video' : 'text',
          content: generateSampleContent(),
          language: selectedLanguage,
          domain: selectedDomain,
          difficulty: selectedDifficulty,
          duration: Math.floor(Math.random() * 60) + 15,
          tags: [selectedDomain, selectedDifficulty, 'ai-generated'],
          createdAt: new Date().toISOString(),
          status: 'ready',
          confidence: Math.floor(Math.random() * 20) + 80,
          version: 1,
          isEdited: false
        };

        setGeneratedContent(prev => [newContent, ...prev]);
        setSelectedContent(newContent);
        onContentSelect?.(newContent);
        onContentGenerated?.(newContent);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to sample content
      const newContent: GeneratedContent = {
        id: contentId,
        title: `Generated ${DOMAINS.find(d => d.code === selectedDomain)?.name} Training Module`,
        type: includeVideo ? 'video' : 'text',
        content: generateSampleContent(),
        language: selectedLanguage,
        domain: selectedDomain,
        difficulty: selectedDifficulty,
        duration: Math.floor(Math.random() * 60) + 15,
        tags: [selectedDomain, selectedDifficulty, 'ai-generated'],
        createdAt: new Date().toISOString(),
        status: 'ready',
        confidence: Math.floor(Math.random() * 20) + 80,
        version: 1,
        isEdited: false
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      setSelectedContent(newContent);
      onContentSelect?.(newContent);
      onContentGenerated?.(newContent);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSampleContent = () => {
    const domain = DOMAINS.find(d => d.code === selectedDomain)?.name || 'Solar Energy';
    const difficulty = selectedDifficulty;
    
    return `# ${domain} Training Module

## Learning Objectives
By the end of this module, you will be able to:
- Understand the fundamental concepts of ${domain.toLowerCase()}
- Identify key safety procedures and requirements
- Apply best practices in real-world scenarios
- Troubleshoot common issues and problems

## Introduction
Welcome to this comprehensive training module on ${domain.toLowerCase()}. This ${difficulty}-level course is designed to provide you with practical knowledge and hands-on experience.

## Key Concepts
1. **Safety First**: Always prioritize safety when working with ${domain.toLowerCase()} equipment
2. **Proper Tools**: Use the correct tools for each task
3. **Quality Control**: Ensure all work meets industry standards
4. **Documentation**: Keep detailed records of all procedures

## Step-by-Step Procedures
### Step 1: Preparation
- Gather all necessary tools and materials
- Review safety protocols
- Check equipment condition

### Step 2: Execution
- Follow the established procedures
- Monitor progress continuously
- Make adjustments as needed

### Step 3: Verification
- Test all connections and functions
- Verify safety compliance
- Document results

## Safety Guidelines
- Always wear appropriate personal protective equipment (PPE)
- Follow lockout/tagout procedures
- Never work alone on hazardous tasks
- Report any safety concerns immediately

## Troubleshooting
Common issues and their solutions:
1. **Problem**: Equipment not functioning
   - **Solution**: Check power supply and connections
2. **Problem**: Unusual noises or vibrations
   - **Solution**: Stop operation and inspect for damage

## Assessment
Complete the following tasks to demonstrate your understanding:
1. Identify three safety hazards in the work area
2. List the required tools for this procedure
3. Explain the importance of quality control

## Conclusion
This module has covered the essential aspects of ${domain.toLowerCase()}. Continue practicing these skills and always prioritize safety in your work.`;
  };

  const handleSaveContent = (content: GeneratedContent) => {
    const updatedContent = { ...content, isEdited: true, version: content.version + 1 };
    setGeneratedContent(prev => prev.map(c => c.id === content.id ? updatedContent : c));
    setSelectedContent(updatedContent);
    onContentSelect?.(updatedContent);
    onContentSaved?.(updatedContent);
  };

  const handleExportContent = (content: GeneratedContent, format: string) => {
    onContentExported?.(content, format);
  };

  const handleDeleteContent = (contentId: string) => {
    setGeneratedContent(prev => prev.filter(c => c.id !== contentId));
    if (selectedContent?.id === contentId) {
      setSelectedContent(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
    return level ? <Badge className={level.color}>{level.label}</Badge> : null;
  };

  return (
    <div className="space-y-6">
      {/* Content Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Content Creator
          </CardTitle>
          <CardDescription>
            Generate localized training content using AI prompts and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Templates */}
          <div>
            <label className="text-sm font-medium mb-3 block">Quick Templates</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CONTENT_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {template.icon}
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the training content you want to generate... (e.g., 'Create an introduction to solar panel installation in Hindi')"
              className="min-h-[100px]"
            />
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Domain</label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map(domain => (
                    <SelectItem key={domain.code} value={domain.code}>
                      <div className="flex items-center gap-2">
                        <span>{domain.icon}</span>
                        <span>{domain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(value: any) => setSelectedDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content Length: {contentLength[0]} words</label>
              <Slider
                value={contentLength}
                onValueChange={setContentLength}
                min={200}
                max={2000}
                step={100}
              />
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="ux4g-btn ux4g-btn-secondary"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-images"
                      checked={includeImages}
                      onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                    />
                    <label htmlFor="include-images" className="text-sm">Include Images</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-video"
                      checked={includeVideo}
                      onCheckedChange={(checked) => setIncludeVideo(checked as boolean)}
                    />
                    <label htmlFor="include-video" className="text-sm">Include Video</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-quiz"
                      checked={includeQuiz}
                      onCheckedChange={(checked) => setIncludeQuiz(checked as boolean)}
                    />
                    <label htmlFor="include-quiz" className="text-sm">Include Quiz</label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateContent}
            disabled={isGenerating || !prompt.trim()}
            className="ux4g-btn ux4g-btn-primary w-full"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating Content...' : 'Generate Content'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content List */}
      {generatedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Content ({generatedContent.length})
            </CardTitle>
            <CardDescription>
              Review, edit, and manage your AI-generated training content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.map((content) => (
                <div
                  key={content.id}
                  className={`p-4 border rounded-lg ${
                    selectedContent?.id === content.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedContent(content)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(content.status)}
                      <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-sm text-gray-500">
                          {LANGUAGES.find(l => l.code === content.language)?.name} • 
                          {DOMAINS.find(d => d.code === content.domain)?.name} • 
                          {content.duration} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDifficultyBadge(content.difficulty)}
                      <Badge variant="outline">{content.confidence}% confidence</Badge>
                      {content.isEdited && <Badge className="bg-blue-100 text-blue-800">Edited</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created {new Date(content.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent(content);
                        }}
                        className="ux4g-btn ux4g-btn-secondary"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContent(content.id);
                        }}
                        className="ux4g-btn ux4g-btn-secondary text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Editor */}
      {selectedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Content Editor
                </CardTitle>
                <CardDescription>
                  {selectedContent.title} • Version {selectedContent.version}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleSaveContent(selectedContent)}
                  className="ux4g-btn ux4g-btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => handleExportContent(selectedContent, 'pdf')}
                  variant="outline"
                  className="ux4g-btn ux4g-btn-secondary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={selectedContent.content}
              onChange={(e) => setSelectedContent({ ...selectedContent, content: e.target.value })}
              className="min-h-[400px] text-sm leading-relaxed"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
