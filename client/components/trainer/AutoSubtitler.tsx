import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Download,
  Upload,
  Settings,
  Languages,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit3,
  Save,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

interface SubtitleSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  language: string;
  confidence: number;
  isEdited: boolean;
  speaker?: string;
  emotions?: string[];
}

interface VoiceSettings {
  pitch: number;
  speed: number;
  volume: number;
  accent: string;
  gender: 'male' | 'female' | 'neutral';
  voiceId: string;
}

interface AudioFile {
  id: string;
  name: string;
  duration: number;
  url: string;
  language: string;
  status: 'processing' | 'ready' | 'error';
  subtitles: SubtitleSegment[];
  voiceSettings: VoiceSettings;
}

interface AutoSubtitlerProps {
  audioFile?: AudioFile;
  onSubtitleGenerated?: (subtitles: SubtitleSegment[]) => void;
  onVoiceGenerated?: (audioUrl: string) => void;
  onExport?: (format: 'srt' | 'vtt' | 'ass') => void;
}

const VOICE_ACCENTS = [
  { code: 'us', name: 'American English', flag: '🇺🇸' },
  { code: 'uk', name: 'British English', flag: '🇬🇧' },
  { code: 'au', name: 'Australian English', flag: '🇦🇺' },
  { code: 'in', name: 'Indian English', flag: '🇮🇳' },
  { code: 'ca', name: 'Canadian English', flag: '🇨🇦' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
];

const VOICE_GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'neutral', label: 'Neutral' }
];

export default function AutoSubtitler({
  audioFile,
  onSubtitleGenerated,
  onVoiceGenerated,
  onExport
}: AutoSubtitlerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [subtitles, setSubtitles] = useState<SubtitleSegment[]>([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState<SubtitleSegment | null>(null);
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    pitch: 0,
    speed: 1.0,
    volume: 0.8,
    accent: 'us',
    gender: 'neutral',
    voiceId: 'default'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState<AudioFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Generation progress states
  const [subtitleProgress, setSubtitleProgress] = useState(0);
  const [voiceProgress, setVoiceProgress] = useState(0);
  
  // Demo files for quick testing
  const [demoFiles] = useState([
    { name: 'solar-installation-demo.mp4', type: 'video/mp4', size: '2.5 MB' },
    { name: 'electrical-safety-training.mp3', type: 'audio/mpeg', size: '1.8 MB' },
    { name: 'plumbing-basics.wav', type: 'audio/wav', size: '3.2 MB' }
  ]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioFile) {
      setDuration(audioFile.duration);
      setSubtitles(audioFile.subtitles);
      setVoiceSettings(audioFile.voiceSettings);
    }
  }, [audioFile]);

  // File upload handlers
  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create audio file object
          const newAudioFile: AudioFile = {
            id: `audio-${Date.now()}`,
            name: file.name,
            duration: 120, // Simulate 2 minutes
            url: URL.createObjectURL(file),
            language: 'en',
            status: 'ready',
            subtitles: [],
            voiceSettings: voiceSettings
          };
          
          setUploadedFile(newAudioFile);
          setDuration(newAudioFile.duration);
          
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDemoFileUpload = (demoFile: typeof demoFiles[0]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create demo audio file
          const newAudioFile: AudioFile = {
            id: `demo-${Date.now()}`,
            name: demoFile.name,
            duration: 120,
            url: `#demo-${demoFile.name}`,
            language: 'en',
            status: 'ready',
            subtitles: [],
            voiceSettings: voiceSettings
          };
          
          setUploadedFile(newAudioFile);
          setDuration(newAudioFile.duration);
          
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 150);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };


  const generateSubtitles = async () => {
    setIsGeneratingSubtitles(true);
    setSubtitleProgress(0);
    
    // Simulate subtitle generation with progress
    const interval = setInterval(() => {
      setSubtitleProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const generatedSubtitles: SubtitleSegment[] = [
            {
              id: '1',
              startTime: 0,
              endTime: 3,
              text: 'Welcome to our training module on solar panel installation.',
              language: 'en',
              confidence: 95,
              isEdited: false,
              speaker: 'Trainer',
              emotions: ['confident', 'professional']
            },
            {
              id: '2',
              startTime: 3,
              endTime: 7,
              text: 'Today we will cover the essential safety procedures and step-by-step installation process.',
              language: 'en',
              confidence: 92,
              isEdited: false,
              speaker: 'Trainer',
              emotions: ['informative', 'serious']
            },
            {
              id: '3',
              startTime: 7,
              endTime: 12,
              text: 'First, let\'s discuss the required tools and personal protective equipment.',
              language: 'en',
              confidence: 88,
              isEdited: false,
              speaker: 'Trainer',
              emotions: ['instructional', 'clear']
            },
            {
              id: '4',
              startTime: 12,
              endTime: 18,
              text: 'You will need a drill, measuring tape, level, and safety harness for this installation.',
              language: 'en',
              confidence: 90,
              isEdited: false,
              speaker: 'Trainer',
              emotions: ['instructional', 'detailed']
            },
            {
              id: '5',
              startTime: 18,
              endTime: 25,
              text: 'Always wear your hard hat, safety glasses, and work gloves before starting any electrical work.',
              language: 'en',
              confidence: 94,
              isEdited: false,
              speaker: 'Trainer',
              emotions: ['serious', 'safety-focused']
            }
          ];
          
          setSubtitles(generatedSubtitles);
          onSubtitleGenerated?.(generatedSubtitles);
          setIsGeneratingSubtitles(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const generateVoiceDubbing = async () => {
    setIsGeneratingVoice(true);
    setVoiceProgress(0);
    
    // Simulate voice generation with progress
    const interval = setInterval(() => {
      setVoiceProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const audioUrl = `#generated-audio-${Date.now()}`;
          onVoiceGenerated?.(audioUrl);
          setIsGeneratingVoice(false);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 400);
  };

  const handleSubtitleEdit = (subtitleId: string, newText: string) => {
    setSubtitles(prev => prev.map(sub => 
      sub.id === subtitleId 
        ? { ...sub, text: newText, isEdited: true }
        : sub
    ));
  };

  const handleSubtitleTimeEdit = (subtitleId: string, field: 'startTime' | 'endTime', value: number) => {
    setSubtitles(prev => prev.map(sub => 
      sub.id === subtitleId 
        ? { ...sub, [field]: value, isEdited: true }
        : sub
    ));
  };

  const handleDeleteSubtitle = (subtitleId: string) => {
    setSubtitles(prev => prev.filter(sub => sub.id !== subtitleId));
  };

  const handleAddSubtitle = () => {
    const newSubtitle: SubtitleSegment = {
      id: `subtitle-${Date.now()}`,
      startTime: currentTime,
      endTime: currentTime + 3,
      text: '',
      language: 'en',
      confidence: 0,
      isEdited: true
    };
    setSubtitles(prev => [...prev, newSubtitle].sort((a, b) => a.startTime - b.startTime));
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(sub => 
      currentTime >= sub.startTime && currentTime <= sub.endTime
    );
  };

  const exportSubtitles = (format: 'srt' | 'vtt' | 'ass') => {
    if (subtitles.length === 0) {
      console.log('No subtitles to export');
      return;
    }

    let content = '';
    const fileName = `subtitles-${Date.now()}.${format}`;

    if (format === 'srt') {
      content = subtitles.map((sub, index) => 
        `${index + 1}\n${formatTime(sub.startTime, true)} --> ${formatTime(sub.endTime, true)}\n${sub.text}\n`
      ).join('\n');
    } else if (format === 'vtt') {
      content = `WEBVTT\n\n${subtitles.map(sub => 
        `${formatTime(sub.startTime, true)} --> ${formatTime(sub.endTime, true)}\n${sub.text}\n`
      ).join('\n')}`;
    } else if (format === 'ass') {
      content = `[Script Info]\nTitle: Generated Subtitles\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${subtitles.map(sub => 
        `Dialogue: 0,${formatTime(sub.startTime, true)},${formatTime(sub.endTime, true)},Default,,0,0,0,,${sub.text}`
      ).join('\n')}`;
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onExport?.(format);
  };

  const exportAudio = () => {
    if (!uploadedFile) {
      console.log('No audio file to export');
      return;
    }

    // Create a demo audio file for export
    const audioData = {
      fileName: uploadedFile.name,
      duration: uploadedFile.duration,
      voiceSettings: voiceSettings,
      subtitles: subtitles,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(audioData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onVoiceGenerated?.('export-audio');
  };

  const formatTime = (seconds: number, withMs = false) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    if (withMs) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSubtitle = getCurrentSubtitle();

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio/Video Player
          </CardTitle>
          <CardDescription>
            Upload audio or video files for automatic subtitle generation and voice dubbing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : uploadedFile 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="space-y-4">
                <RefreshCw className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
                <div className="text-lg font-semibold text-blue-700">Uploading...</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-sm text-blue-600">{Math.round(uploadProgress)}% Complete</div>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <div className="text-lg font-semibold text-green-700">File Uploaded Successfully!</div>
                <div className="text-sm text-green-600">{uploadedFile.name}</div>
                <div className="text-xs text-gray-500">Duration: {formatTime(uploadedFile.duration)}</div>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setSubtitles([]);
                    setCurrentTime(0);
                  }}
                  className="ux4g-btn ux4g-btn-secondary"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div className="text-lg font-semibold mb-2">Upload Audio/Video File</div>
                <div className="text-sm text-gray-500 mb-4">
                  Supported: MP4, MP3, WAV, AVI, MOV
                </div>
                <Button className="ux4g-btn ux4g-btn-primary">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                
                {/* Demo Files */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Or try demo files:</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {demoFiles.map((demoFile, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDemoFileUpload(demoFile);
                        }}
                        className="ux4g-btn ux4g-btn-secondary"
                      >
                        {demoFile.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audio Controls */}
          {(audioFile || uploadedFile) && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  className="ux4g-btn ux4g-btn-primary"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{formatTime(currentTime)}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-sm font-medium">{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Speed:</label>
                  <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Current Subtitle Display */}
              {currentSubtitle && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-medium mb-1">{currentSubtitle.text}</div>
                    <div className="text-sm text-gray-600">
                      {formatTime(currentSubtitle.startTime)} - {formatTime(currentSubtitle.endTime)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <audio
            ref={audioRef}
            src={uploadedFile?.url || audioFile?.url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Subtitle Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Auto Subtitle Generation
          </CardTitle>
          <CardDescription>
            Generate accurate subtitles with speaker identification and emotion detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={generateSubtitles}
              disabled={isGeneratingSubtitles || !uploadedFile}
              className="ux4g-btn ux4g-btn-primary"
            >
              {isGeneratingSubtitles ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mic className="h-4 w-4 mr-2" />
              )}
              {isGeneratingSubtitles ? 'Generating...' : 'Generate Subtitles'}
            </Button>
            
            <Button
              onClick={handleAddSubtitle}
              disabled={!uploadedFile}
              className="ux4g-btn ux4g-btn-secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Manual Subtitle
            </Button>
          </div>

          {/* Subtitle Generation Progress */}
          {isGeneratingSubtitles && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Generating subtitles...</span>
                <span className="text-gray-500">{Math.round(subtitleProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subtitleProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Analyzing audio content</div>
                <div>• Detecting speech patterns</div>
                <div>• Generating timestamp markers</div>
                <div>• Applying confidence scoring</div>
              </div>
            </div>
          )}

          {/* Subtitle List */}
          {subtitles.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {subtitles.map((subtitle) => (
                <div
                  key={subtitle.id}
                  className={`p-3 border rounded-lg ${
                    subtitle.id === selectedSubtitle?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedSubtitle(subtitle)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                      </Badge>
                      <Badge className={subtitle.confidence >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {subtitle.confidence}%
                      </Badge>
                      {subtitle.isEdited && (
                        <Badge className="bg-blue-100 text-blue-800">Edited</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeek(subtitle.startTime);
                        }}
                        className="ux4g-btn ux4g-btn-secondary"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubtitle(subtitle.id);
                        }}
                        className="ux4g-btn ux4g-btn-secondary text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {selectedSubtitle?.id === subtitle.id ? (
                      <Textarea
                        value={subtitle.text}
                        onChange={(e) => handleSubtitleEdit(subtitle.id, e.target.value)}
                        className="min-h-[60px]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div>{subtitle.text}</div>
                    )}
                  </div>
                  
                  {subtitle.speaker && (
                    <div className="text-xs text-gray-500 mt-1">
                      Speaker: {subtitle.speaker}
                      {subtitle.emotions && subtitle.emotions.length > 0 && (
                        <span> • Emotions: {subtitle.emotions.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Dubbing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            AI Voice Dubbing
          </CardTitle>
          <CardDescription>
            Generate natural-sounding voice-overs in multiple languages and accents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Accent & Language</label>
                <Select value={voiceSettings.accent} onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, accent: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_ACCENTS.map(accent => (
                      <SelectItem key={accent.code} value={accent.code}>
                        <div className="flex items-center gap-2">
                          <span>{accent.flag}</span>
                          <span>{accent.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Gender</label>
                <Select value={voiceSettings.gender} onValueChange={(value: any) => setVoiceSettings(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_GENDERS.map(gender => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Pitch: {voiceSettings.pitch}</label>
                <Slider
                  value={[voiceSettings.pitch]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, pitch: value[0] }))}
                  min={-20}
                  max={20}
                  step={1}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Speed: {voiceSettings.speed}x</label>
                <Slider
                  value={[voiceSettings.speed]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, speed: value[0] }))}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Volume: {Math.round(voiceSettings.volume * 100)}%</label>
                <Slider
                  value={[voiceSettings.volume]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, volume: value[0] }))}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={generateVoiceDubbing}
              disabled={isGeneratingVoice || !uploadedFile}
              className="ux4g-btn ux4g-btn-primary"
            >
              {isGeneratingVoice ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4 mr-2" />
              )}
              {isGeneratingVoice ? 'Generating Voice...' : 'Generate Voice Dubbing'}
            </Button>
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="ux4g-btn ux4g-btn-secondary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </Button>
          </div>

          {/* Voice Generation Progress */}
          {isGeneratingVoice && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Generating voice dubbing...</span>
                <span className="text-gray-500">{Math.round(voiceProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${voiceProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Processing voice settings ({voiceSettings.accent} accent, {voiceSettings.gender})</div>
                <div>• Synthesizing speech patterns</div>
                <div>• Applying pitch and speed adjustments</div>
                <div>• Generating final audio output</div>
              </div>
            </div>
          )}

          {/* Voice Preview */}
          {isGeneratingVoice && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Generating voice dubbing with {voiceSettings.accent} accent...
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
          <CardDescription>
            Export subtitles and voice dubbing in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => exportSubtitles('srt')}
                disabled={subtitles.length === 0}
                className="ux4g-btn ux4g-btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                Export SRT
              </Button>
              <Button
                onClick={() => exportSubtitles('vtt')}
                disabled={subtitles.length === 0}
                variant="outline"
                className="ux4g-btn ux4g-btn-secondary"
              >
                <Download className="h-4 w-4 mr-2" />
                Export VTT
              </Button>
              <Button
                onClick={() => exportSubtitles('ass')}
                disabled={subtitles.length === 0}
                variant="outline"
                className="ux4g-btn ux4g-btn-secondary"
              >
                <Download className="h-4 w-4 mr-2" />
                Export ASS
              </Button>
              <Button
                onClick={() => exportAudio()}
                disabled={!uploadedFile}
                variant="outline"
                className="ux4g-btn ux4g-btn-secondary"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Export Audio
              </Button>
            </div>
            
            {/* Export Status */}
            <div className="text-sm text-gray-600">
              {subtitles.length > 0 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ready to export {subtitles.length} subtitle segments</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Generate subtitles first to enable export</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
