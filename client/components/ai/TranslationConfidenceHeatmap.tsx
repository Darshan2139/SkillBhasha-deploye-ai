import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Eye, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface TranslationSegment {
  id: string;
  original: string;
  translated: string;
  confidence: number;
  language: string;
  domain: string;
  lastUpdated: string;
  status: 'high' | 'medium' | 'low';
}

interface TranslationConfidenceHeatmapProps {
  segments: TranslationSegment[];
  onSegmentClick?: (segment: TranslationSegment) => void;
  onRetrain?: () => void;
  onEdit?: (segment: TranslationSegment) => void;
}

export default function TranslationConfidenceHeatmap({ 
  segments, 
  onSegmentClick, 
  onRetrain, 
  onEdit 
}: TranslationConfidenceHeatmapProps) {
  const highConfidence = segments.filter(s => s.status === 'high').length;
  const mediumConfidence = segments.filter(s => s.status === 'medium').length;
  const lowConfidence = segments.filter(s => s.status === 'low').length;
  const totalSegments = segments.length;
  
  const averageConfidence = totalSegments > 0 
    ? Math.round(segments.reduce((acc, s) => acc + s.confidence, 0) / totalSegments)
    : 0;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'confidence-high';
    if (confidence >= 70) return 'confidence-medium';
    return 'confidence-low';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'high': return <Badge className="status-success">High</Badge>;
      case 'medium': return <Badge className="status-warning">Medium</Badge>;
      case 'low': return <Badge className="status-error">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="ux4g-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Translation Confidence Heatmap
            </CardTitle>
            <CardDescription>
              Visual representation of translation quality across all segments
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetrain}
              className="ux4g-btn ux4g-btn-secondary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retrain Model
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{highConfidence}</div>
            <div className="text-sm text-muted-foreground">High Confidence</div>
            <div className="text-xs text-muted-foreground">
              {totalSegments > 0 ? Math.round((highConfidence / totalSegments) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{mediumConfidence}</div>
            <div className="text-sm text-muted-foreground">Medium Confidence</div>
            <div className="text-xs text-muted-foreground">
              {totalSegments > 0 ? Math.round((mediumConfidence / totalSegments) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{lowConfidence}</div>
            <div className="text-sm text-muted-foreground">Low Confidence</div>
            <div className="text-xs text-muted-foreground">
              {totalSegments > 0 ? Math.round((lowConfidence / totalSegments) * 100) : 0}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{averageConfidence}%</div>
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="text-xs text-muted-foreground">Overall Quality</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Translation Quality</span>
            <span className="text-sm font-semibold">{averageConfidence}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${averageConfidence}%` }}
            />
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Translation Segments</h3>
          <div className="confidence-heatmap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className={`confidence-cell ${getConfidenceColor(segment.confidence)} cursor-pointer hover:shadow-md transition-all`}
                onClick={() => onSegmentClick?.(segment)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(segment.status)}
                    <span className="font-semibold">{segment.confidence}%</span>
                  </div>
                  {getStatusBadge(segment.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs">
                    <strong>Original:</strong>
                    <p className="truncate" title={segment.original}>
                      {segment.original}
                    </p>
                  </div>
                  
                  <div className="text-xs">
                    <strong>Translated ({segment.language}):</strong>
                    <p className="truncate" title={segment.translated}>
                      {segment.translated}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{segment.domain}</span>
                    <span>{segment.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(segment);
                    }}
                    className="ux4g-btn ux4g-btn-secondary text-xs"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSegmentClick?.(segment);
                    }}
                    className="ux4g-btn ux4g-btn-secondary text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Trends */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quality Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">Improving Segments</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {segments.filter(s => s.confidence > 80).length}
              </div>
              <div className="text-sm text-muted-foreground">
                High-quality translations
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="font-medium">Needs Attention</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {segments.filter(s => s.confidence < 70).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Require review
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button 
            onClick={onRetrain}
            className="ux4g-btn ux4g-btn-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retrain AI Model
          </Button>
          <Button 
            variant="outline"
            className="ux4g-btn ux4g-btn-secondary"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            variant="outline"
            className="ux4g-btn ux4g-btn-secondary"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Bulk Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
