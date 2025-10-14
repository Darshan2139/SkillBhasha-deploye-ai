import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Edit3, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Languages,
  Eye,
  EyeOff,
  Download,
  Share2,
  History,
  Zap,
  BarChart3,
  Settings,
  Maximize2,
  Minimize2,
  UserPlus,
  Mail,
  Copy,
  ExternalLink
} from 'lucide-react';
import TranslationConfidenceHeatmap from '@/components/ai/TranslationConfidenceHeatmap';

interface TranslationSegment {
  id: string;
  original: string;
  translated: string;
  confidence: number;
  status: 'high' | 'medium' | 'low';
  language: string;
  domain: string;
  lastUpdated: string;
  isEdited: boolean;
  version: number;
}

interface TranslationDocument {
  id: string;
  title: string;
  originalLanguage: string;
  targetLanguage: string;
  content: string;
  translatedContent: string;
  segments: TranslationSegment[];
  status: 'draft' | 'review' | 'approved' | 'published';
  lastModified: string;
  version: number;
  wordCount: number;
  characterCount: number;
}

interface TranslationPreviewProps {
  document: TranslationDocument;
  onSave?: (content: string) => void;
  onSegmentEdit?: (segment: TranslationSegment) => void;
  onRetrain?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onVersionHistory?: () => void;
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

const MOCK_COLLABORATORS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Reviewer', avatar: 'SJ' },
  { id: '2', name: 'Michael Chen', email: 'michael@example.com', role: 'Translator', avatar: 'MC' },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@example.com', role: 'Editor', avatar: 'ER' },
  { id: '4', name: 'David Kim', email: 'david@example.com', role: 'Reviewer', avatar: 'DK' },
  { id: '5', name: 'Anna Schmidt', email: 'anna@example.com', role: 'Translator', avatar: 'AS' }
];

export default function TranslationPreview({
  document,
  onSave,
  onSegmentEdit,
  onRetrain,
  onExport,
  onShare,
  onVersionHistory
}: TranslationPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(document.translatedContent);
  const [selectedSegment, setSelectedSegment] = useState<TranslationSegment | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'overlay'>('split');
  const [showOriginal, setShowOriginal] = useState(true);
  const [showTranslated, setShowTranslated] = useState(true);
  
  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showRetrainModal, setShowRetrainModal] = useState(false);
  
  // Share modal states
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [shareLink, setShareLink] = useState('');
  
  // Retrain states
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [isRetraining, setIsRetraining] = useState(false);
  
  const originalRef = useRef<HTMLDivElement>(null);
  const translatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedContent(document.translatedContent);
  }, [document.translatedContent]);

  // Sync scrolling between original and translated content
  useEffect(() => {
    const originalElement = originalRef.current;
    const translatedElement = translatedRef.current;
    
    if (!originalElement || !translatedElement) return;

    let isScrolling = false;

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (isScrolling) return;
      isScrolling = true;
      
      const scrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);
      const targetScrollTop = scrollRatio * (target.scrollHeight - target.clientHeight);
      
      target.scrollTop = targetScrollTop;
      
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    };

    const handleOriginalScroll = () => syncScroll(originalElement, translatedElement);
    const handleTranslatedScroll = () => syncScroll(translatedElement, originalElement);

    originalElement.addEventListener('scroll', handleOriginalScroll);
    translatedElement.addEventListener('scroll', handleTranslatedScroll);

    return () => {
      originalElement.removeEventListener('scroll', handleOriginalScroll);
      translatedElement.removeEventListener('scroll', handleTranslatedScroll);
    };
  }, [showOriginal, showTranslated]);

  const handleSave = () => {
    onSave?.(editedContent);
    setIsEditing(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
    // Generate share link
    const link = `${window.location.origin}/review/${document.id}`;
    setShareLink(link);
  };

  const handleShareSubmit = () => {
    const shareData = {
      documentId: document.id,
      title: document.title,
      link: shareLink,
      email: shareEmail,
      message: shareMessage,
      collaborators: selectedCollaborators,
      sharedAt: new Date().toISOString()
    };
    
    console.log('Sharing document:', shareData);
    onShare?.();
    setShowShareModal(false);
    
    // Reset form
    setShareEmail('');
    setShareMessage('');
    setSelectedCollaborators([]);
  };

  const handleRetrain = () => {
    setShowRetrainModal(true);
    setIsRetraining(true);
    setRetrainProgress(0);
    
    // Simulate retraining process
    const interval = setInterval(() => {
      setRetrainProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          onRetrain?.();
          setTimeout(() => setShowRetrainModal(false), 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleVersionHistory = () => {
    setShowVersionModal(true);
    onVersionHistory?.();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleSegmentClick = (segment: TranslationSegment) => {
    setSelectedSegment(segment);
    // Scroll to segment in both views
    const element = window.document.querySelector(`[data-segment-id="${segment.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Highlight the segment temporarily
    if (element) {
      element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  const handleSegmentEdit = (segment: TranslationSegment, newTranslation: string) => {
    const updatedSegment = {
      ...segment,
      translated: newTranslation,
      isEdited: true,
      lastUpdated: new Date().toISOString(),
      version: segment.version + 1
    };
    
    onSegmentEdit?.(updatedSegment);
    
    // Update the main content
    const updatedContent = document.translatedContent.replace(segment.translated, newTranslation);
    setEditedContent(updatedContent);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 85) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (confidence >= 70) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const filteredSegments = document.segments.filter(segment => {
    const confidenceMatch = segment.confidence >= confidenceThreshold[0];
    const languageMatch = filterLanguage === 'all' || segment.language === filterLanguage;
    return confidenceMatch && languageMatch;
  });

  const renderContentWithHighlights = (content: string, isOriginal: boolean) => {
    if (isOriginal) {
      return (
        <div className="space-y-2">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }

    // For translated content, highlight segments based on confidence
    let highlightedContent = content;
    document.segments.forEach(segment => {
      const confidenceClass = getConfidenceColor(segment.confidence);
      const highlight = `<span class="confidence-highlight ${confidenceClass}" data-segment-id="${segment.id}" data-confidence="${segment.confidence}">${segment.translated}</span>`;
      highlightedContent = highlightedContent.replace(segment.translated, highlight);
    });

    return (
      <div 
        className="space-y-2"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('confidence-highlight')) {
            const segmentId = target.getAttribute('data-segment-id');
            const segment = document.segments.find(s => s.id === segmentId);
            if (segment) handleSegmentClick(segment);
          }
        }}
      />
    );
  };

  const renderSegmentEditor = () => {
    if (!selectedSegment) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Segment
          </CardTitle>
          <CardDescription>
            Confidence: {selectedSegment.confidence}% • Language: {selectedSegment.language}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Original Text</label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              {selectedSegment.original}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Translation</label>
            <Textarea
              value={selectedSegment.translated}
              onChange={(e) => {
                const updatedSegment = { ...selectedSegment, translated: e.target.value };
                setSelectedSegment(updatedSegment);
              }}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getConfidenceIcon(selectedSegment.confidence)}
              <span className="text-sm">
                Confidence: {selectedSegment.confidence}%
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedSegment(null)}
                className="ux4g-btn ux4g-btn-secondary"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleSegmentEdit(selectedSegment, selectedSegment.translated);
                  setSelectedSegment(null);
                }}
                className="ux4g-btn ux4g-btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Translation Preview
              </CardTitle>
              <CardDescription>
                {document.originalLanguage} → {document.targetLanguage} • {document.wordCount} words • Version {document.version}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="ux4g-btn ux4g-btn-secondary"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="ux4g-btn ux4g-btn-secondary"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showHeatmap ? 'Hide' : 'Show'} Heatmap
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">View Mode:</label>
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="split">Split View</SelectItem>
                  <SelectItem value="side-by-side">Side by Side</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Confidence:</label>
              <div className="flex items-center gap-2 w-40">
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={100}
                  min={0}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm w-8">{confidenceThreshold[0]}%</span>
              </div>
              <div className="text-xs text-gray-500">
                ({filteredSegments.length} segments)
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Language:</label>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Original Content */}
        {showOriginal && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Original Content ({document.originalLanguage})
                  </CardTitle>
                  <CardDescription>
                    Source material • {document.characterCount} characters
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowOriginal(false)}
                    className="ux4g-btn ux4g-btn-secondary"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                ref={originalRef}
                className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-md border"
              >
                {renderContentWithHighlights(document.content, true)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Translated Content */}
        {showTranslated && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Translation ({document.targetLanguage})
                  </CardTitle>
                  <CardDescription>
                    AI-generated translation • {document.wordCount} words
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="ux4g-btn ux4g-btn-secondary"
                  >
                    {isEditing ? <EyeOff className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                    {isEditing ? 'View' : 'Edit'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!isEditing}
                    className="ux4g-btn ux4g-btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTranslated(false)}
                    className="ux4g-btn ux4g-btn-secondary"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[300px] text-sm leading-relaxed"
                  placeholder="Enter your translation here..."
                />
              ) : (
                <div 
                  ref={translatedRef}
                  className="max-h-96 overflow-y-auto p-4 bg-white rounded-md border"
                >
                  {renderContentWithHighlights(editedContent, false)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Show/Hide Controls when content is hidden */}
        {(!showOriginal || !showTranslated) && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4">
                {!showOriginal && (
                  <Button
                    variant="outline"
                    onClick={() => setShowOriginal(true)}
                    className="ux4g-btn ux4g-btn-secondary"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Show Original Content
                  </Button>
                )}
                {!showTranslated && (
                  <Button
                    variant="outline"
                    onClick={() => setShowTranslated(true)}
                    className="ux4g-btn ux4g-btn-secondary"
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    Show Translation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Translation Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Translation Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {document.segments.filter(s => s.confidence >= 85).length}
              </div>
              <div className="text-sm text-gray-600">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {document.segments.filter(s => s.confidence >= 70 && s.confidence < 85).length}
              </div>
              <div className="text-sm text-gray-600">Medium Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {document.segments.filter(s => s.confidence < 70).length}
              </div>
              <div className="text-sm text-gray-600">Low Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(document.segments.reduce((acc, s) => acc + s.confidence, 0) / document.segments.length)}%
              </div>
              <div className="text-sm text-gray-600">Average Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Heatmap */}
      {showHeatmap && (
        <TranslationConfidenceHeatmap
          segments={filteredSegments}
          onSegmentClick={handleSegmentClick}
          onRetrain={onRetrain}
          onEdit={handleSegmentClick}
        />
      )}

      {/* Segment Editor */}
      {renderSegmentEditor()}

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => onExport?.()}
              className="ux4g-btn ux4g-btn-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Translation
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="ux4g-btn ux4g-btn-secondary"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share for Review
            </Button>
            <Button
              onClick={handleRetrain}
              variant="outline"
              className="ux4g-btn ux4g-btn-secondary"
            >
              <Zap className="h-4 w-4 mr-2" />
              Retrain AI Model
            </Button>
            <Button
              variant="outline"
              onClick={handleVersionHistory}
              className="ux4g-btn ux4g-btn-secondary"
            >
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share for Review
            </DialogTitle>
            <DialogDescription>
              Share this translation with collaborators for review and feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-email">Email Address</Label>
              <Input
                id="share-email"
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="share-message">Message (Optional)</Label>
              <Textarea
                id="share-message"
                placeholder="Add a message for reviewers..."
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label>Select Collaborators</Label>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                {MOCK_COLLABORATORS.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`collab-${collaborator.id}`}
                      checked={selectedCollaborators.includes(collaborator.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCollaborators([...selectedCollaborators, collaborator.id]);
                        } else {
                          setSelectedCollaborators(selectedCollaborators.filter(id => id !== collaborator.id));
                        }
                      }}
                    />
                    <Label htmlFor={`collab-${collaborator.id}`} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {collaborator.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{collaborator.name}</div>
                        <div className="text-xs text-gray-500">{collaborator.role}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="text-xs" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(shareLink)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleShareSubmit}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Retrain AI Modal */}
      <Dialog open={showRetrainModal} onOpenChange={setShowRetrainModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Retrain AI Model
            </DialogTitle>
            <DialogDescription>
              Retraining the AI model with your feedback to improve translation quality.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isRetraining ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Retraining AI Model...</div>
                  <Progress value={retrainProgress} className="w-full" />
                  <div className="text-xs text-gray-500 mt-2">{Math.round(retrainProgress)}% Complete</div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• Analyzing translation patterns</div>
                  <div>• Updating confidence scores</div>
                  <div>• Optimizing segment quality</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  This will improve the AI model's translation quality based on your edits and feedback.
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="text-sm font-medium text-blue-900">Expected Improvements:</div>
                  <div className="text-xs text-blue-700 mt-1">
                    • Higher confidence scores for similar content<br/>
                    • Better context understanding<br/>
                    • Improved terminology consistency
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRetrainModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleRetrain}>
                    <Zap className="h-4 w-4 mr-2" />
                    Start Retraining
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History Modal */}
      <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and compare different versions of this translation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Current Version */}
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-900">Version {document.version} (Current)</div>
                    <div className="text-sm text-green-700">
                      {new Date(document.lastModified).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 mt-1">Current version</div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Current</Badge>
                </div>
              </div>

              {/* Previous Versions */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Version {document.version - 1}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(Date.now() - 86400000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Updated translation segments</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Version {document.version - 2}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(Date.now() - 172800000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Initial translation</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowVersionModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
