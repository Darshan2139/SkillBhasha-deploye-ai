import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UploadCloud, 
  FileText, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Languages,
  Globe
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'translated' | 'error' | 'ready';
  sourceLanguage: string;
  targetLanguages: string[];
  translationProgress: number;
  uploadedAt: string;
  lastModified: string;
  downloadUrl?: string;
  previewUrl?: string;
}

interface UploadCenterProps {
  onFileUploaded?: (file: UploadedFile) => void;
  onFileProcessed?: (file: UploadedFile) => void;
  onFileDeleted?: (fileId: string) => void;
  onFileRetry?: (fileId: string) => void;
  files?: UploadedFile[];
}

const SUPPORTED_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF', color: 'text-red-600' },
  'application/vnd.ms-powerpoint': { icon: FileText, label: 'PPT', color: 'text-orange-600' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: FileText, label: 'PPTX', color: 'text-orange-600' },
  'application/msword': { icon: FileText, label: 'DOC', color: 'text-blue-600' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'DOCX', color: 'text-blue-600' },
  'video/mp4': { icon: FileVideo, label: 'MP4', color: 'text-purple-600' },
  'audio/mpeg': { icon: FileAudio, label: 'MP3', color: 'text-green-600' },
  'audio/wav': { icon: FileAudio, label: 'WAV', color: 'text-green-600' },
  'image/jpeg': { icon: FileImage, label: 'JPEG', color: 'text-pink-600' },
  'image/png': { icon: FileImage, label: 'PNG', color: 'text-pink-600' }
};

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

export default function UploadCenter({ 
  onFileUploaded, 
  onFileProcessed, 
  onFileDeleted, 
  onFileRetry,
  files = []
}: UploadCenterProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('auto');
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState<string[]>(['hi', 'es']);
  const [localFiles, setLocalFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with parent files
  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [selectedSourceLanguage, selectedTargetLanguages]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, [selectedSourceLanguage, selectedTargetLanguages]);

  const handleFiles = useCallback((fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
      sourceLanguage: selectedSourceLanguage,
      targetLanguages: selectedTargetLanguages,
      translationProgress: 0,
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }));

    // Add files to local state immediately
    setLocalFiles(prev => [...newFiles, ...prev]);

    // Notify parent component about new files
    newFiles.forEach(file => {
      onFileUploaded?.(file);
      simulateUpload(file.id);
    });
  }, [selectedSourceLanguage, selectedTargetLanguages, onFileUploaded]);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(100, progress + Math.floor(Math.random() * 20) + 10);
      const newStatus = progress >= 100 ? 'processing' : 'uploading';
      
      // Update local files state
      setLocalFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const updatedFile = {
            ...file,
            progress: progress,
            status: newStatus as 'uploading' | 'processing' | 'translated' | 'error' | 'ready'
          };
          
          // Notify parent component about progress update
          if (progress >= 100) {
            const processedFile = {
              ...updatedFile,
              progress: 100,
              status: 'ready' as const,
              translationProgress: 0,
              downloadUrl: `#download-${fileId}`,
              previewUrl: `#preview-${fileId}`
            };
            onFileProcessed?.(processedFile);
          }
          
          return updatedFile;
        }
        return file;
      }));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
    }, 3000 + Math.random() * 2000);
  };

  const simulateTranslation = (fileId: string) => {
    let translationProgress = 0;
    const interval = setInterval(() => {
      translationProgress = Math.min(100, translationProgress + Math.floor(Math.random() * 15) + 5);
      const newStatus = translationProgress >= 100 ? 'translated' : 'processing';
      
      // Update local files state
      setLocalFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const updatedFile = {
            ...file,
            translationProgress: translationProgress,
            status: newStatus as 'uploading' | 'processing' | 'translated' | 'error' | 'ready'
          };
          
          if (translationProgress >= 100) {
            onFileProcessed?.(updatedFile);
          }
          
          return updatedFile;
        }
        return file;
      }));
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
    }, 5000 + Math.random() * 3000);
  };

  const handleDeleteFile = (fileId: string) => {
    setLocalFiles(prev => prev.filter(f => f.id !== fileId));
    onFileDeleted?.(fileId);
  };

  const handleRetryFile = (fileId: string) => {
    setLocalFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, translationProgress: 0 }
        : f
    ));
    onFileRetry?.(fileId);
    simulateUpload(fileId);
  };

  const handleStartTranslation = (fileId: string) => {
    // Update local state and start translation
    setLocalFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        const fileWithProcessing = {
          ...file,
          status: 'processing' as const,
          translationProgress: 0
        };
        onFileProcessed?.(fileWithProcessing);
        simulateTranslation(fileId);
        return fileWithProcessing;
      }
      return file;
    }));
  };

  const getFileIcon = (type: string) => {
    const fileType = SUPPORTED_TYPES[type as keyof typeof SUPPORTED_TYPES];
    if (fileType) {
      const IconComponent = fileType.icon;
      return <IconComponent className={`h-5 w-5 ${fileType.color}`} />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'translated': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading': return <Badge variant="outline" className="text-blue-600">Uploading</Badge>;
      case 'processing': return <Badge variant="outline" className="text-yellow-600">Processing</Badge>;
      case 'ready': return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'translated': return <Badge className="bg-green-100 text-green-800">Translated</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTargetLanguageToggle = (languageCode: string) => {
    setSelectedTargetLanguages(prev => 
      prev.includes(languageCode)
        ? prev.filter(lang => lang !== languageCode)
        : [...prev, languageCode]
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5" />
            Upload Center
          </CardTitle>
          <CardDescription>
            Upload training materials and automatically detect source language for multi-language translation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Language</label>
              <Select value={selectedSourceLanguage} onValueChange={setSelectedSourceLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Auto-detect
                    </div>
                  </SelectItem>
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Languages</label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                {LANGUAGES.map(lang => (
                  <div key={lang.code} className="flex items-center gap-1">
                    <Checkbox
                      id={`target-${lang.code}`}
                      checked={selectedTargetLanguages.includes(lang.code)}
                      onCheckedChange={() => handleTargetLanguageToggle(lang.code)}
                    />
                    <label 
                      htmlFor={`target-${lang.code}`}
                      className="text-sm cursor-pointer flex items-center gap-1"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.mp3,.wav,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <UploadCloud className="h-12 w-12 text-gray-400" />
              <div>
                <div className="text-lg font-semibold">Drop files here or click to upload</div>
                <div className="text-sm text-gray-500">
                  Supported: PDF, PPT, PPTX, DOC, DOCX, MP4, MP3, WAV, JPG, PNG
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  // Create demo files for testing
                  const demoFiles = [
                    new File(['Solar Panel Installation Guide - Complete manual covering all aspects of solar panel installation including safety procedures, tools required, step-by-step installation process, and maintenance guidelines.'], 'solar-installation-guide.pdf', { type: 'application/pdf' }),
                    new File(['Electrical Safety Training - Comprehensive presentation covering electrical safety protocols, PPE requirements, hazard identification, and emergency procedures for electrical work.'], 'electrical-safety-training.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }),
                    new File(['Plumbing Fundamentals Video - Step-by-step video tutorial covering basic plumbing techniques, tool usage, pipe installation, and common repairs.'], 'plumbing-fundamentals.mp4', { type: 'video/mp4' }),
                    new File(['Construction Safety Manual - Detailed safety guidelines for construction sites including fall protection, equipment safety, and emergency response procedures.'], 'construction-safety-manual.pdf', { type: 'application/pdf' }),
                    new File(['Automotive Repair Guide - Comprehensive guide covering common automotive repairs, diagnostic procedures, and maintenance schedules.'], 'automotive-repair-guide.pdf', { type: 'application/pdf' })
                  ];
                  handleFiles(demoFiles);
                }}
                className="mt-2"
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Demo Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files ({localFiles.length})
            </CardTitle>
          <CardDescription>
            Track upload progress and translation status for all files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {localFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No files uploaded yet. Upload some training materials to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {localFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      {getStatusBadge(file.status)}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {file.status === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} />
                    </div>
                  )}

                  {/* Translation Progress */}
                  {file.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Translating to {file.targetLanguages.length} languages...</span>
                        <span>{file.translationProgress}%</span>
                      </div>
                      <Progress value={file.translationProgress} />
                    </div>
                  )}

                  {/* File Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Languages className="h-4 w-4" />
                      <span>
                        {file.sourceLanguage === 'auto' ? 'Auto-detect' : LANGUAGES.find(l => l.code === file.sourceLanguage)?.name} → 
                        {file.targetLanguages.map(lang => LANGUAGES.find(l => l.code === lang)?.name).join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartTranslation(file.id)}
                          className="ux4g-btn ux4g-btn-primary"
                        >
                          <Languages className="h-4 w-4 mr-2" />
                          Start Translation
                        </Button>
                      )}
                      
                      {file.status === 'translated' && (
                        <>
                          <Button size="sm" variant="outline" className="ux4g-btn ux4g-btn-secondary">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="ux4g-btn ux4g-btn-secondary">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      )}
                      
                      {file.status === 'error' && (
                        <Button
                          size="sm"
                          onClick={() => handleRetryFile(file.id)}
                          className="ux4g-btn ux4g-btn-primary"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFile(file.id)}
                        className="ux4g-btn ux4g-btn-secondary text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
