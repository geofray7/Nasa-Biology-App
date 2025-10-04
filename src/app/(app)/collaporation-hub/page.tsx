'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Users,
  LayoutGrid,
  MessageSquare,
  File,
  Search,
  Bell,
  Plus,
  Video,
  Send,
  FileText,
  FileImage,
  MoreVertical,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// --- Helper Functions from original script ---
const getTimeAgo = (date: string | Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / (3600000 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const formatTime = (date: string | Date): string => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


// --- Main Component ---
export default function CollaborationHubPage() {
  // --- Backend Simulation using localStorage and React State ---
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [messageInput, setMessageInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const initialData = {
        users: [
            { id: 1, name: "Alex Johnson", role: "Developer", avatar: "AJ", color: "bg-blue-500", status: "online", lastActive: new Date() },
            { id: 2, name: "Sarah Miller", role: "Designer", avatar: "SM", color: "bg-red-500", status: "online", lastActive: new Date() },
            { id: 3, name: "Michael Chen", role: "Project Manager", avatar: "MC", color: "bg-green-500", status: "online", lastActive: new Date() },
            { id: 4, name: "Emma Wilson", role: "Marketing", avatar: "EW", color: "bg-yellow-500", status: "away", lastActive: new Date(Date.now() - 15 * 60000) },
            { id: 5, name: "David Brown", role: "Developer", avatar: "DB", color: "bg-purple-500", status: "busy", lastActive: new Date(Date.now() - 5 * 60000) },
            { id: 6, name: "Dr. Reed", role: "Team Lead", avatar: "DR", color: "bg-purple-500", status: "online", lastActive: new Date() }
        ],
        projects: [
            { id: 1, name: "Website Redesign", description: "Complete overhaul of company website with new UI/UX", status: "In Progress", members: [1, 2, 3, 6] },
            { id: 2, name: "Mobile App Launch", description: "Development and launch of new mobile application", status: "Planning", members: [1, 4, 5, 6] },
            { id: 3, name: "Q3 Marketing Campaign", description: "Social media and email marketing for Q3 product launch", status: "Completed", members: [4, 5, 6] },
            { id: 4, name: "API Integration", description: "Integrate third-party services with our platform", status: "In Progress", members: [1, 5, 6] },
        ],
        messages: [
            { id: 1, userId: 2, text: "Has anyone reviewed the latest design mockups?", time: new Date(Date.now() - 45 * 60000) },
            { id: 2, userId: 1, text: "Yes, I looked at them this morning. The homepage looks great!", time: new Date(Date.now() - 43 * 60000) },
            { id: 3, userId: 3, text: "We need to schedule a meeting to discuss the timeline for the mobile app launch.", time: new Date(Date.now() - 39 * 60000) },
            { id: 4, userId: 4, text: "I can prepare the marketing materials once we have a confirmed launch date.", time: new Date(Date.now() - 37 * 60000) },
            { id: 5, userId: 5, text: "The API integration is progressing well. Should be ready for testing by Friday.", time: new Date(Date.now() - 34 * 60000) }
        ],
        files: [
            { id: 1, name: "Project Brief.pdf", type: "pdf", size: "2.4 MB", sharedById: 3 },
            { id: 2, name: "Design Mockups.fig", type: "figma", size: "5.7 MB", sharedById: 2 },
            { id: 3, name: "Meeting Notes.docx", type: "doc", size: "1.2 MB", sharedById: 1 },
            { id: 4, name: "Budget.xlsx", type: "sheet", size: "3.1 MB", sharedById: 3 },
            { id: 5, name: "Roadmap.pptx", type: "ppt", size: "4.5 MB", sharedById: 4 }
        ],
        activities: [
            { id: 1, user: 1, action: "completed a task", target: "Homepage Design", time: new Date(Date.now() - 10 * 60000)},
            { id: 2, user: 4, action: "shared a file", target: "Marketing Plan.pdf", time: new Date(Date.now() - 60 * 60000)},
            { id: 3, user: 3, action: "commented on", target: "Project Timeline", time: new Date(Date.now() - 120 * 60000)},
            { id: 4, user: 2, action: "updated", target: "Style Guide", time: new Date(Date.now() - 300 * 60000)},
            { id: 5, user: 5, action: "created a new project", target: "API Documentation", time: new Date(Date.now() - 1440 * 60000) }
        ],
        currentUserId: 6
    };
    
    try {
        const savedData = localStorage.getItem('collabHubData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setUsers(parsed.users || initialData.users);
            setProjects(parsed.projects || initialData.projects);
            setMessages(parsed.messages.map((m: any) => ({...m, time: new Date(m.time)})) || initialData.messages);
            setFiles(parsed.files || initialData.files);
            setActivities(parsed.activities.map((a: any) => ({...a, time: new Date(a.time)})) || initialData.activities);
            setCurrentUser(parsed.users.find((u: any) => u.id === parsed.currentUserId) || initialData.users.find(u => u.id === initialData.currentUserId));
        } else {
             setUsers(initialData.users);
             setProjects(initialData.projects);
             setMessages(initialData.messages);
             setFiles(initialData.files);
             setActivities(initialData.activities);
             setCurrentUser(initialData.users.find(u => u.id === initialData.currentUserId));
        }
    } catch (e) {
        console.error("Failed to parse localStorage data, resetting.", e);
        setUsers(initialData.users);
        setProjects(initialData.projects);
        setMessages(initialData.messages);
        setFiles(initialData.files);
        setActivities(initialData.activities);
        setCurrentUser(initialData.users.find(u => u.id === initialData.currentUserId));
    }
    setIsMounted(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      const dataToSave = {
          users,
          projects,
          messages,
          files,
          activities,
          currentUserId: currentUser?.id
      };
      localStorage.setItem('collabHubData', JSON.stringify(dataToSave));
    }
  }, [users, projects, messages, files, activities, currentUser, isMounted]);

  // Scroll to new message
  useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [messages]);

  // --- Functions to modify state ---

  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !currentUser) return;
    
    const newMessage = {
      id: Date.now(),
      userId: currentUser.id,
      text: messageInput.trim(),
      time: new Date()
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setMessageInput('');

    // Simulate bot response
    setTimeout(() => {
        const otherUsers = users.filter(u => u.id !== currentUser.id);
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const responses = [
            "Thanks for the update!",
            "I'll review that and get back to you.",
            "Great, let me know if you need any help with that."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const responseMessage = {
            id: Date.now() + 1,
            userId: randomUser.id,
            text: randomResponse,
            time: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };
  
  const handleCreateNewProject = () => {
      const name = prompt("Enter new project name:");
      if (!name) return;
      const description = prompt("Enter project description:");
      if(!description) return;

      const newProject = {
          id: Date.now(),
          name,
          description,
          status: "Planning",
          members: [currentUser.id]
      };
      setProjects(prev => [newProject, ...prev]);

      const newActivity = {
          id: Date.now(),
          user: currentUser.id,
          action: "created a new project",
          target: name,
          time: new Date()
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
  };
  
  if (!isMounted || !currentUser) {
      return (
          <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  // --- Render logic ---
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-green-500/20 text-green-400';
      case 'Planning': return 'bg-yellow-500/20 text-yellow-400';
      case 'Completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold">Collaboration Hub</h1>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input placeholder="Search projects, files..." className="pl-10 w-48 md:w-64" />
            </div>
            <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="size-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
            </Button>
            <Avatar>
                <AvatarFallback className={currentUser.color}>{currentUser.avatar}</AvatarFallback>
            </Avatar>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-4 flex items-center gap-4">
            <div className="p-4 rounded-lg bg-blue-500/20 text-blue-400"><Users className="size-8" /></div>
            <div>
                <p className="text-3xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
            </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-4 rounded-lg bg-green-500/20 text-green-400"><LayoutGrid className="size-8" /></div>
                <div>
                    <p className="text-3xl font-bold">{projects.length}</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-4 rounded-lg bg-yellow-500/20 text-yellow-400"><MessageSquare className="size-8" /></div>
                <div>
                    <p className="text-3xl font-bold">{messages.length}</p>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-4 rounded-lg bg-red-500/20 text-red-400"><File className="size-8" /></div>
                <div>
                    <p className="text-3xl font-bold">{files.length}</p>
                    <p className="text-sm text-muted-foreground">Shared Files</p>
                </div>
            </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Projects */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Active Projects</CardTitle>
                    <Button size="sm" onClick={handleCreateNewProject}><Plus className="mr-2 size-4" /> New Project</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => {
                        const projectMembers = p.members.map((id: number) => users.find(u => u.id === id)).filter(Boolean);
                        return (
                            <Card key={p.id} className="bg-background/70 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{p.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                                    <div className="flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {projectMembers.map((member: any) => (
                                            <Avatar key={member.id} className="size-8 border-2 border-card">
                                                <AvatarFallback className={member.color}>{member.avatar}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(p.status)}`}>
                                        {p.status}
                                    </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Chat */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Chat</CardTitle>
                    <Button size="sm" variant="outline"><Video className="mr-2 size-4"/> Start Call</Button>
                </CardHeader>
                <CardContent>
                    <div ref={chatContainerRef} className="h-80 overflow-y-auto space-y-4 pr-4 mb-4">
                        {messages.map(msg => {
                            const user = users.find(m => m.id === msg.userId);
                            const isOwn = msg.userId === currentUser.id;
                            if(!user) return null;
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isOwn ? 'justify-end' : ''}`}>
                                    {!isOwn && <Avatar className="size-9"><AvatarFallback className={user.color}>{user.avatar}</AvatarFallback></Avatar>}
                                    <div className={`p-3 rounded-lg max-w-[80%] ${isOwn ? 'bg-primary/90' : 'bg-muted'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(msg.time)}</p>
                                    </div>
                                    {isOwn && <Avatar className="size-9"><AvatarFallback className={user.color}>{user.avatar}</AvatarFallback></Avatar>}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-2">
                        <Input 
                          placeholder="Type a message..." 
                          value={messageInput} 
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="icon" onClick={handleSendMessage}><Send className="size-5"/></Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            {/* Activity Feed */}
            <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent className="divide-y divide-border -mt-4">
                    {activities.map(act => {
                        const user = users.find(m => m.id === act.user);
                        if (!user) return null;
                        return (
                            <div key={act.id} className="flex items-start gap-4 py-3">
                                <Avatar className="size-10">
                                    <AvatarFallback className={user.color}>{user.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm">
                                    <span className="font-semibold text-foreground">{user.name}</span>
                                    <span className="text-muted-foreground"> {act.action} </span>
                                    <span className="font-semibold text-primary/80">{act.target}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{getTimeAgo(act.time)}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
            
            {/* Shared Files */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Shared Files</CardTitle>
                    <Button size="sm" variant="outline">View All</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {files.slice(0, 4).map(f => {
                         const sharedBy = users.find(m => m.id === f.sharedById);
                         let Icon;
                         switch (f.type) {
                           case 'pdf': Icon = FileText; break;
                           case 'doc': Icon = FileText; break;
                           case 'figma': Icon = FileImage; break;
                           default: Icon = File;
                         }
                         return (
                            <Card key={f.name} className="bg-background/70 text-center p-4 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                                <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit mb-3">
                                <Icon className="size-8 text-primary" />
                                </div>
                                <p className="text-sm font-semibold truncate">{f.name}</p>
                                <p className="text-xs text-muted-foreground">{f.size} &bull; {sharedBy?.name}</p>
                            </Card>
                         )
                    })}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
