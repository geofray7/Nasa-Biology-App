'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  Tasks,
  Map,
  Trophy,
  BarChart,
  Book,
  Settings,
  User,
  Star,
  Plus,
  Search,
  Bell,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  List,
  Check,
  Award,
  Crown,
  Gem,
  Camera,
  Compass,
  Users,
  Projector,
  File,
  Calendar,
  Cog,
  ChevronRight,
  ArrowUp,
  X,
  MapMarkerAlt,
  Paw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// --- Backend Simulation Class ---
class DiscoveryBackend {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (typeof window !== 'undefined' && !localStorage.getItem('discoveryData')) {
      const initialData = {
        user: {
          id: 1,
          name: 'Alex Explorer',
          level: 12,
          xp: 4250,
          nextLevelXp: 5000,
          discoveryPoints: 1840,
          rank: 'Seasoned Explorer',
        },
        quests: [
          {
            id: 1,
            name: 'Ancient Ruins Expedition',
            description:
              'Explore the mysterious ancient ruins and document your findings',
            status: 'active',
            type: 'epic',
            difficulty: 4,
            xpReward: 500,
            pointReward: 100,
            requirements: [
              'Navigate through the ruins',
              'Document 5 artifacts',
              'Solve the ancient puzzle',
            ],
            progress: 1,
            maxProgress: 3,
            timeLimit: 72, // hours
            createdAt: new Date('2023-10-15').toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Wildlife Documentation',
            description:
              'Photograph and catalog 10 rare species in the forest biome',
            status: 'active',
            type: 'rare',
            difficulty: 3,
            xpReward: 300,
            pointReward: 75,
            requirements: [
              'Find 10 rare species',
              'Take clear photographs',
              'Record habitat details',
            ],
            progress: 7,
            maxProgress: 10,
            timeLimit: 48,
            createdAt: new Date('2023-10-18').toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'Stellar Observation',
            description:
              'Observe and record celestial events using your telescope',
            status: 'active',
            type: 'common',
            difficulty: 2,
            xpReward: 200,
            pointReward: 50,
            requirements: [
              'Observe 3 planets',
              'Record a meteor shower',
              'Map 5 constellations',
            ],
            progress: 2,
            maxProgress: 3,
            timeLimit: 24,
            createdAt: new Date('2023-10-20').toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 4,
            name: 'Ocean Depths Survey',
            description: 'Dive into the deep ocean and study marine life',
            status: 'completed',
            type: 'legendary',
            difficulty: 5,
            xpReward: 1000,
            pointReward: 200,
            requirements: [
              'Reach 100m depth',
              'Document 15 marine species',
              'Collect 3 samples',
            ],
            progress: 3,
            maxProgress: 3,
            timeLimit: 96,
            createdAt: new Date('2023-10-10').toISOString(),
            updatedAt: new Date('2023-10-14').toISOString(),
            completedAt: new Date('2023-10-14').toISOString(),
          },
          {
            id: 5,
            name: 'Mountain Summit Ascent',
            description:
              'Climb to the summit of Mount Discovery and plant your flag',
            status: 'locked',
            type: 'epic',
            difficulty: 4,
            xpReward: 600,
            pointReward: 120,
            requirements: [
              'Reach base camp',
              'Ascend to summit',
              'Plant explorer flag',
            ],
            progress: 0,
            maxProgress: 3,
            unlockRequirements: ['Level 15', 'Complete 3 epic quests'],
            createdAt: new Date('2023-10-22').toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        achievements: [
          {
            id: 1,
            name: 'First Steps',
            description: 'Complete your first quest',
            icon: 'Footprints',
            type: 'common',
            unlocked: true,
            unlockedAt: new Date('2023-09-05').toISOString(),
            xpReward: 100,
          },
          {
            id: 2,
            name: 'Quest Master',
            description: 'Complete 25 quests',
            icon: 'ListChecks',
            type: 'rare',
            unlocked: true,
            unlockedAt: new Date('2023-10-12').toISOString(),
            xpReward: 300,
            progress: 28,
            maxProgress: 25,
          },
          {
            id: 3,
            name: 'Explorer Legend',
            description: 'Reach level 20',
            icon: 'Crown',
            type: 'epic',
            unlocked: false,
            progress: 12,
            maxProgress: 20,
            xpReward: 500,
          },
          {
            id: 4,
            name: 'Treasure Hunter',
            description: 'Discover 50 hidden artifacts',
            icon: 'Gem',
            type: 'rare',
            unlocked: true,
            unlockedAt: new Date('2023-10-08').toISOString(),
            xpReward: 250,
            progress: 50,
            maxProgress: 50,
          },
          {
            id: 5,
            name: 'Stargazer',
            description: 'Observe 100 celestial bodies',
            icon: 'Star',
            type: 'common',
            unlocked: false,
            progress: 67,
            maxProgress: 100,
            xpReward: 200,
          },
          {
            id: 6,
            name: 'Master Cartographer',
            description: 'Complete all map regions',
            icon: 'Map',
            type: 'legendary',
            unlocked: false,
            progress: 3,
            maxProgress: 8,
            xpReward: 1000,
          },
        ],
        discoveries: [
          {
            id: 1,
            name: 'Ancient Ruins',
            type: 'location',
            rarity: 'epic',
            status: 'active',
            xpValue: 200,
            pointValue: 50,
            position: { x: 30, y: 25 },
          },
          {
            id: 2,
            name: 'Crystal Caves',
            type: 'location',
            rarity: 'rare',
            status: 'completed',
            xpValue: 150,
            pointValue: 35,
            position: { x: 65, y: 40 },
          },
          {
            id: 3,
            name: 'Whispering Forest',
            type: 'location',
            rarity: 'common',
            status: 'completed',
            xpValue: 100,
            pointValue: 25,
            position: { x: 20, y: 60 },
          },
          {
            id: 4,
            name: 'Sunken Temple',
            type: 'location',
            rarity: 'legendary',
            status: 'locked',
            xpValue: 300,
            pointValue: 75,
            position: { x: 75, y: 70 },
          },
          {
            id: 5,
            name: 'Sky Palace',
            type: 'location',
            rarity: 'epic',
            status: 'active',
            xpValue: 250,
            pointValue: 60,
            position: { x: 50, y: 20 },
          },
        ],
        leaderboard: [
          {
            id: 1,
            name: 'Alex Explorer',
            score: 1840,
            rank: 1,
            avatar: 'AE',
            color: '#8b5cf6',
          },
          {
            id: 2,
            name: 'Maya Adventurer',
            score: 1720,
            rank: 2,
            avatar: 'MA',
            color: '#10b981',
          },
          {
            id: 3,
            name: 'Sam Discoverer',
            score: 1650,
            rank: 3,
            avatar: 'SD',
            color: '#3b82f6',
          },
          {
            id: 4,
            name: 'Jordan Pathfinder',
            score: 1580,
            rank: 4,
            avatar: 'JP',
            color: '#f59e0b',
          },
          {
            id: 5,
            name: 'Taylor Navigator',
            score: 1490,
            rank: 5,
            avatar: 'TN',
            color: '#ef4444',
          },
        ],
        notifications: [
          {
            id: 1,
            type: 'quest',
            message: 'New epic quest available: Volcanic Expedition',
            time: new Date(Date.now() - 2 * 3600000).toISOString(),
            read: false,
          },
          {
            id: 2,
            type: 'achievement',
            message: 'You unlocked: Treasure Hunter',
            time: new Date(Date.now() - 5 * 3600000).toISOString(),
            read: false,
          },
          {
            id: 3,
            type: 'level',
            message: "You're close to level 13!",
            time: new Date(Date.now() - 24 * 3600000).toISOString(),
            read: false,
          },
        ],
      };
      this.saveData(initialData);
    }
  }

  getData() {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('discoveryData');
    return data ? JSON.parse(data) : null;
  }

  saveData(data: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('discoveryData', JSON.stringify(data));
    }
  }

  getUser() {
    return this.getData()?.user;
  }
  updateUser(updates: any) {
    const data = this.getData();
    if (!data) return null;
    Object.assign(data.user, updates);
    this.saveData(data);
    return data.user;
  }
  addUserXp(xp: number) {
    const data = this.getData();
    if (!data) return null;
    data.user.xp += xp;
    while (data.user.xp >= data.user.nextLevelXp) {
      data.user.level += 1;
      data.user.xp -= data.user.nextLevelXp;
      data.user.nextLevelXp = Math.floor(data.user.nextLevelXp * 1.2);
      this.checkLevelAchievements(data.user.level);
    }
    this.saveData(data);
    return data.user;
  }
  addDiscoveryPoints(points: number) {
    const data = this.getData();
    if (!data) return null;
    data.user.discoveryPoints += points;
    this.saveData(data);
    return data.user;
  }
  getQuests() {
    return this.getData()?.quests || [];
  }
  getQuest(id: number) {
    return this.getQuests().find((quest: any) => quest.id === id);
  }
  updateQuestProgress(questId: number, progress: number) {
    const data = this.getData();
    if (!data) return null;
    const quest = data.quests.find((q: any) => q.id === questId);
    if (quest) {
      quest.progress = progress;
      quest.updatedAt = new Date().toISOString();
      if (quest.progress >= quest.maxProgress && quest.status === 'active') {
        quest.status = 'completed';
        quest.completedAt = new Date().toISOString();
        this.addUserXp(quest.xpReward);
        this.addDiscoveryPoints(quest.pointReward);
        this.checkQuestAchievements();
        this.saveData(data);
        return {
          quest,
          completed: true,
          xp: quest.xpReward,
          points: quest.pointReward,
        };
      }
      this.saveData(data);
      return { quest, completed: false };
    }
    return null;
  }
  getAchievements() {
    return this.getData()?.achievements || [];
  }
  unlockAchievement(achievementId: number) {
    const data = this.getData();
    if (!data) return null;
    const achievement = data.achievements.find(
      (a: any) => a.id === achievementId
    );
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      this.addUserXp(achievement.xpReward);
      this.saveData(data);
      return achievement;
    }
    return null;
  }
  checkLevelAchievements(level: number) {
    const achievements = this.getAchievements();
    const levelAchievements = achievements.filter(
      (a: any) => a.name.includes('Level') || a.name.includes('Legend')
    );
    levelAchievements.forEach((achievement: any) => {
      if (!achievement.unlocked && level >= achievement.maxProgress) {
        this.unlockAchievement(achievement.id);
      }
    });
  }
  checkQuestAchievements() {
    const data = this.getData();
    if (!data) return;
    const completedQuests = data.quests.filter(
      (q: any) => q.status === 'completed'
    ).length;
    const questAchievements = data.achievements.filter(
      (a: any) => a.name.includes('Quest') || a.name.includes('Master')
    );
    questAchievements.forEach((achievement: any) => {
      if (!achievement.unlocked && completedQuests >= achievement.maxProgress) {
        this.unlockAchievement(achievement.id);
      }
    });
  }
  getDiscoveries() {
    return this.getData()?.discoveries || [];
  }
  completeDiscovery(discoveryId: number) {
    const data = this.getData();
    if (!data) return null;
    const discovery = data.discoveries.find((d: any) => d.id === discoveryId);
    if (discovery && discovery.status === 'active') {
      discovery.status = 'completed';
      this.addUserXp(discovery.xpValue);
      this.addDiscoveryPoints(discovery.pointValue);
      this.saveData(data);
      return discovery;
    }
    return null;
  }
  getLeaderboard() {
    return this.getData()?.leaderboard || [];
  }
  getNotifications() {
    return this.getData()?.notifications || [];
  }
  markNotificationAsRead(notificationId: number) {
    const data = this.getData();
    if (!data) return;
    const notification = data.notifications.find(
      (n: any) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;
      this.saveData(data);
    }
  }
}

// --- Helper Functions ---
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / (3600000 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const calculateTimeRemaining = (createdAt: string, timeLimitHours: number) => {
  const now = new Date();
  const created = new Date(createdAt);
  const deadline = new Date(created.getTime() + timeLimitHours * 60 * 60 * 1000);

  if (now > deadline) {
    return 'Expired';
  }

  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h left`;
  } else {
    return `${diffHours}h left`;
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'hsl(var(--muted-foreground))';
    case 'rare':
      return 'hsl(var(--primary))';
    case 'epic':
      return 'hsl(var(--accent))';
    case 'legendary':
      return 'hsl(var(--destructive))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ElementType } = {
    Footprints: Users,
    ListChecks: Tasks,
    Crown: Crown,
    Gem: Gem,
    Star: Star,
    Map: Map,
  };
  return icons[iconName] || Star;
};

// --- Main Component ---
export default function GamifiedDiscoveryPage() {
  const [backend, setBackend] = useState<DiscoveryBackend | null>(null);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const be = new DiscoveryBackend();
    setBackend(be);
    setData(be.getData());
  }, []);

  const refreshData = useCallback(() => {
    if (backend) {
      setData(backend.getData());
    }
  }, [backend]);

  if (!backend || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin text-4xl">🚀</div>
      </div>
    );
  }

  const {
    user,
    quests,
    achievements,
    discoveries,
    leaderboard,
    notifications,
  } = data;
  const activeQuests = quests.filter((q: any) => q.status === 'active');
  const unlockedAchievements = achievements.filter((a: any) => a.unlocked);

  const handleQuestClick = (questId: number) => {
    const quest = backend.getQuest(questId);
    if (!quest) return;

    if (quest.status === 'active') {
      const newProgress = Math.min(quest.progress + 1, quest.maxProgress);
      const result = backend.updateQuestProgress(questId, newProgress);
      if (result?.completed) {
        alert(
          `Quest completed! You earned ${result.xp} XP and ${result.points} points!`
        );
      } else {
        alert('Quest progress updated!');
      }
      refreshData();
    } else {
      alert(`Quest status: ${quest.status}`);
    }
  };

  const handleDiscoveryClick = (discoveryId: number) => {
    const discovery = discoveries.find((d: any) => d.id === discoveryId);
    if (!discovery) return;

    if (discovery.status === 'locked') {
      alert('This discovery is locked.');
    } else if (discovery.status === 'active') {
      const completed = backend.completeDiscovery(discoveryId);
      if (completed) {
        alert(
          `Discovery completed! You earned ${completed.xpValue} XP and ${completed.pointValue} points.`
        );
        refreshData();
      }
    } else {
      alert('You have already completed this discovery.');
    }
  };
  const xpPercentage = (user.xp / user.nextLevelXp) * 100;
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-headline text-primary">
              Discovery Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search quests..."
                  className="bg-background pl-10 pr-4 py-2 border rounded-md w-64"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.filter((n: any) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                  {user.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.rank}</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Tasks className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeQuests.length}</p>
                <p className="text-sm text-muted-foreground">Active Quests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-400/20">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {unlockedAchievements.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Achievements Unlocked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Star className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {user.discoveryPoints.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Discovery Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/20">
                <ArrowUp className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.level}</p>
                <p className="text-sm text-muted-foreground">Explorer Level</p>
              </div>
            </div>
            <div className="mt-2">
                <Progress value={xpPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{user.xp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP</span>
                    <span>{xpPercentage.toFixed(0)}%</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Quests</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQuests.slice(0, 4).map((quest: any) => (
              <Card
                key={quest.id}
                className={cn(
                  'cursor-pointer hover:border-primary',
                  `border-l-4`,
                  {
                    'border-l-gray-500': quest.type === 'common',
                    'border-l-blue-500': quest.type === 'rare',
                    'border-l-purple-500': quest.type === 'epic',
                    'border-l-yellow-500': quest.type === 'legendary',
                  }
                )}
                onClick={() => handleQuestClick(quest.id)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{quest.name}</CardTitle>
                  <p
                    className={cn('text-xs font-bold', {
                      'text-gray-400': quest.type === 'common',
                      'text-blue-400': quest.type === 'rare',
                      'text-purple-400': quest.type === 'epic',
                      'text-yellow-400': quest.type === 'legendary',
                    })}
                  >
                    {quest.type.toUpperCase()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {quest.description}
                  </p>
                  <Progress
                    value={(quest.progress / quest.maxProgress) * 100}
                    className="h-2 mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {quest.progress} / {quest.maxProgress}
                    </span>
                    <span>
                      {quest.xpReward} XP | {quest.pointReward} Points
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement: any) => {
              const Icon = getIcon(achievement.icon);
              return (
                <TooltipProvider key={achievement.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          'flex flex-col items-center gap-2 p-2 rounded-md',
                          achievement.unlocked
                            ? 'bg-primary/10'
                            : 'bg-muted opacity-50'
                        )}
                      >
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            achievement.unlocked
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted-foreground/20 text-muted-foreground'
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{achievement.name}</p>
                      <p>{achievement.description}</p>
                      {achievement.unlocked && <p className='text-xs text-muted-foreground'>Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </CardContent>
        </Card>
      </div>

       {/* Discovery Map */}
      <Card>
          <CardHeader>
              <CardTitle>Exploration Map</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-md overflow-hidden">
                  {discoveries.map((discovery: any, i: number) => {
                      const prevDiscovery = discoveries[i-1];
                      const showLine = i > 0 && (discovery.status !== 'locked' || prevDiscovery.status !== 'locked');
                      const x1 = prevDiscovery ? prevDiscovery.position.x : 0;
                      const y1 = prevDiscovery ? prevDiscovery.position.y : 0;
                      const x2 = discovery.position.x;
                      const y2 = discovery.position.y;
                      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                      return (
                        <React.Fragment key={discovery.id}>
                          {showLine && (
                              <div
                                  className="absolute h-0.5 bg-white/30"
                                  style={{
                                      width: `${length}%`,
                                      left: `${x1}%`,
                                      top: `${y1}%`,
                                      transformOrigin: 'left center',
                                      transform: `translate(15px, 15px) rotate(${angle}deg)`
                                  }}
                              />
                          )}
                          <div
                              className={cn(
                                  "absolute w-14 h-14 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 border-2",
                                  {
                                      "bg-green-500 border-green-400 shadow-lg shadow-green-500/50": discovery.status === 'completed',
                                      "bg-primary border-primary-light animate-pulse": discovery.status === 'active',
                                      "bg-secondary border-gray-500": discovery.status === 'locked',
                                  }
                              )}
                              style={{ left: `${discovery.position.x}%`, top: `${discovery.position.y}%` }}
                              onClick={() => handleDiscoveryClick(discovery.id)}
                          >
                            <Trophy className="w-6 h-6" />
                          </div>
                        </React.Fragment>
                      )
                  })}
              </div>
          </CardContent>
      </Card>
      
      {/* Leaderboard */}
      <Card>
          <CardHeader>
              <CardTitle>Top Explorers</CardTitle>
          </CardHeader>
          <CardContent>
              <ul className="space-y-2">
                  {leaderboard.map((player: any) => (
                      <li key={player.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                          <span className="font-bold text-lg w-8 text-center">{player.rank}</span>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{backgroundColor: player.color}}>{player.avatar}</div>
                          <div className="flex-1">
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-sm text-muted-foreground">{player.score.toLocaleString()} Points</p>
                          </div>
                          {player.id === user.id && <span className="text-xs font-bold text-primary">YOU</span>}
                      </li>
                  ))}
              </ul>
          </CardContent>
      </Card>
    </div>
  );
}
