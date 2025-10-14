import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award, 
  Crown, 
  Flame, 
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
  Edit3,
  CheckCircle,
  Clock,
  Gift,
  Medal,
  Gem,
  Rocket,
  Heart
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  totalPoints: number;
  rank: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  points: number;
  category: 'translation' | 'feedback' | 'collaboration' | 'achievement';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
  rank: number;
  isCurrentUser: boolean;
}

interface TranslationGamificationProps {
  user: User;
  badges: Badge[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  onBadgeEarned?: (badge: Badge) => void;
  onLevelUp?: (newLevel: number) => void;
}

export default function TranslationGamification({
  user,
  badges,
  achievements,
  leaderboard,
  onBadgeEarned,
  onLevelUp
}: TranslationGamificationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'achievements' | 'leaderboard'>('overview');
  const [showCelebration, setShowCelebration] = useState(false);

  const earnedBadges = badges.filter(b => b.earned);
  const availableBadges = badges.filter(b => !b.earned);
  const completedAchievements = achievements.filter(a => a.completed);
  const inProgressAchievements = achievements.filter(a => !a.completed);

  const getLevelProgress = () => {
    return (user.xp / user.nextLevelXp) * 100;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  const getBadgeIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'trophy': Trophy,
      'star': Star,
      'target': Target,
      'zap': Zap,
      'award': Award,
      'crown': Crown,
      'flame': Flame,
      'gift': Gift,
      'medal': Medal,
      'gem': Gem,
      'rocket': Rocket,
      'heart': Heart
    };
    const IconComponent = iconMap[iconName] || Star;
    return <IconComponent className="h-6 w-6" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'translation': return 'bg-blue-100 text-blue-800';
      case 'feedback': return 'bg-green-100 text-green-800';
      case 'collaboration': return 'bg-purple-100 text-purple-800';
      case 'achievement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="ux4g-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Translation Gamification
              </CardTitle>
              <CardDescription>
                Earn points, badges, and climb the leaderboard by contributing to translations
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{user.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
      </CardHeader>

      {/* User Stats Overview */}
      <Card className="ux4g-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Level Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Level {user.level}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{user.xp}/{user.nextLevelXp} XP</span>
                </div>
                <Progress value={getLevelProgress()} className="h-2" />
              </div>
            </div>

            {/* Streak */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">{user.streak} Day Streak</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Keep contributing daily!
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                <span className="font-semibold">{earnedBadges.length} Badges</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {availableBadges.length} more available
              </div>
            </div>

            {/* Rank */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getRankIcon(user.rank)}
                <span className="font-semibold">Rank #{user.rank}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Out of {leaderboard.length} users
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: 'badges', label: 'Badges', icon: Award },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'leaderboard', label: 'Leaderboard', icon: Users }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Badges */}
          <Card className="ux4g-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {earnedBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl">{getBadgeIcon(badge.icon)}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                      <div className="text-xs text-green-600">+{badge.points} points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* In Progress Achievements */}
          <Card className="ux4g-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inProgressAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getBadgeIcon(achievement.icon)}</span>
                      <span className="font-semibold">{achievement.title}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                        <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className={`ux4g-card ${badge.earned ? 'ring-2 ring-green-200' : ''}`}>
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3">
                  {getBadgeIcon(badge.icon)}
                </div>
                <h3 className="font-semibold mb-2">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(badge.category)}>
                    {badge.category}
                  </Badge>
                  <span className="text-sm font-semibold text-green-600">
                    +{badge.points} pts
                  </span>
                </div>
                {badge.earned && badge.earnedDate && (
                  <div className="mt-2 text-xs text-green-600">
                    Earned {badge.earnedDate}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`ux4g-card ${achievement.completed ? 'ring-2 ring-green-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {getBadgeIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      {achievement.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge className={getCategoryColor(achievement.category)}>
                        {achievement.category}
                      </Badge>
                      <span className="text-sm font-semibold text-green-600">
                        +{achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card className="ux4g-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    entry.isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                    {entry.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Level {entry.level} • {entry.streak} day streak
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{entry.points}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
