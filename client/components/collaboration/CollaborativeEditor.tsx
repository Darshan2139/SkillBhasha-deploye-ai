import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Save, 
  Send,
  User,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal
} from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'trainer' | 'reviewer' | 'admin';
  isOnline: boolean;
  lastSeen: string;
}

interface Comment {
  id: string;
  author: Collaborator;
  content: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'question';
  status: 'open' | 'resolved' | 'rejected';
  replies: Comment[];
}

interface TranslationDocument {
  id: string;
  title: string;
  originalLanguage: string;
  targetLanguage: string;
  content: string;
  translatedContent: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  collaborators?: Collaborator[];
  comments?: Comment[];
  lastModified: string;
  version: number;
}

interface CollaborativeEditorProps {
  document: TranslationDocument;
  currentUser: Collaborator;
  onSave: (content: string) => void;
  onComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function CollaborativeEditor({
  document,
  currentUser,
  onSave,
  onComment,
  onApprove,
  onReject
}: CollaborativeEditorProps) {
  const [content, setContent] = useState(document.translatedContent);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'suggestion' | 'question'>('comment');
  const [showComments, setShowComments] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    setContent(document.translatedContent);
  }, [document.translatedContent]);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    
    onComment({
      author: currentUser,
      content: newComment,
      type: commentType,
      status: 'open',
      replies: []
    });
    
    setNewComment('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'status-info';
      case 'review': return 'status-warning';
      case 'approved': return 'status-success';
      case 'published': return 'status-success';
      default: return 'status-info';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'reviewer': return 'bg-blue-100 text-blue-800';
      case 'trainer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const onlineCollaborators = document.collaborators?.filter(c => c.isOnline) || [];
  const openComments = document.comments?.filter(c => c.status === 'open') || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        {/* Document Header */}
        <Card className="ux4g-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  {document.title}
                </CardTitle>
                <CardDescription>
                  {document.originalLanguage} → {document.targetLanguage} • Version {document.version}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status.toUpperCase()}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="ux4g-btn ux4g-btn-secondary"
                >
                  {isEditing ? <EyeOff className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                  {isEditing ? 'View' : 'Edit'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Original Content */}
        <Card className="ux4g-card">
          <CardHeader>
            <CardTitle className="text-lg">Original Content ({document.originalLanguage})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {document.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Translation Editor */}
        <Card className="ux4g-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Translation ({document.targetLanguage})</CardTitle>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="ux4g-btn ux4g-btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="ux4g-btn ux4g-btn-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!isEditing}
              className="min-h-[300px] text-sm leading-relaxed"
              placeholder="Enter your translation here..."
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Characters: {content.length}</span>
              <span>Last modified: {document.lastModified}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="ux4g-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onApprove}
                className="ux4g-btn ux4g-btn-primary"
                disabled={document.status === 'approved'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Translation
              </Button>
              <Button
                onClick={onReject}
                variant="outline"
                className="ux4g-btn ux4g-btn-secondary"
                disabled={document.status === 'rejected'}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="outline"
                className="ux4g-btn ux4g-btn-secondary"
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Collaborators */}
        <Card className="ux4g-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaborators ({document.collaborators?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(document.collaborators || []).map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                      {collaborator.name.charAt(0)}
                    </div>
                    {collaborator.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{collaborator.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {collaborator.isOnline ? 'Online' : `Last seen ${collaborator.lastSeen}`}
                    </div>
                  </div>
                  <Badge className={getRoleColor(collaborator.role)}>
                    {collaborator.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="ux4g-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({openComments.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
              >
                {showComments ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {showComments && (
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={commentType}
                    onChange={(e) => setCommentType(e.target.value as any)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="comment">Comment</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="question">Question</option>
                  </select>
                </div>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[80px]"
                />
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="ux4g-btn ux4g-btn-primary w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(document.comments || []).map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                        {comment.author.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{comment.author.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="ghost" className="text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Like
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Document Info */}
        <Card className="ux4g-card">
          <CardHeader>
            <CardTitle className="text-lg">Document Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(document.status)}>
                {document.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version:</span>
              <span className="text-sm font-medium">{document.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Modified:</span>
              <span className="text-sm font-medium">{document.lastModified}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Comments:</span>
              <span className="text-sm font-medium">{document.comments?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
