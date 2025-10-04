'use client';
import { useState, useEffect } from 'react';
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
  FilePdf,
  FileText,
  FileCode,
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

// --- Sample Data ---
const teamMembers = [
  { id: 1, name: 'Alex Johnson', role: 'Developer', avatar: 'AJ', color: 'bg-blue-500' },
  { id: 2, name: 'Sarah Miller', role: 'Designer', avatar: 'SM', color: 'bg-red-500' },
  { id: 3, name: 'Michael Chen', role: 'Project Manager', avatar: 'MC', color: 'bg-green-500' },
  { id: 4, name: 'Emma Wilson', role: 'Marketing', avatar: 'EW', color: 'bg-yellow-500' },
  { id: 5, name: 'David Brown', role: 'Developer', avatar: 'DB', color: 'bg-purple-500' },
];

const initialProjects = [
  { id: 1, name: "Website Redesign", description: "Complete overhaul of company website with new UI/UX", status: "In Progress", members: [1, 2, 3] },
  { id: 2, name: "Mobile App Launch", description: "Development and launch of new mobile application", status: "Planning", members: [1, 4, 5] },
  { id: 3, name: "Q3 Marketing Campaign", description: "Social media and email marketing for Q3 product launch", status: "Completed", members: [4, 5] },
  { id: 4, name: "API Integration", description: "Integrate third-party services with our platform", status: "In Progress", members: [1, 5] },
];

const initialActivities = [
  { id: 1, user: 1, action: "completed a task", target: "Homepage Design", time: "10 minutes ago" },
  { id: 2, user: 4, action: "shared a file", target: "Marketing Plan.pdf", time: "1 hour ago" },
  { id: 3, user: 3, action: "commented on", target: "Project Timeline", time: "2 hours ago" },
  { id: 4, user: 2, action: "updated", target: "Style Guide", time: "5 hours ago" },
  { id: 5, user: 5, action: "created a new project", target: "API Documentation", time: "Yesterday" }
];

const initialFiles = [
  { name: "Project Brief.pdf", type: "pdf", size: "2.4 MB", sharedById: 3 },
  { name: "Design Mockups.fig", type: "figma", size: "5.7 MB", sharedById: 2 },
  { name: "Meeting Notes.docx", type: "doc", size: "1.2 MB", sharedById: 1 },
  { name: "Budget.xlsx", type: "sheet", size: "3.1 MB", sharedById: 3 },
  { name: "Roadmap.pptx", type: "ppt", size: "4.5 MB", sharedById: 4 }
];

const initialMessages = [
  { id: 1, userId: 2, text: "Has anyone reviewed the latest design mockups?", time: "10:24 AM" },
  { id: 2, userId: 1, text: "Yes, I looked at them this morning. The homepage looks great!", time: "10:26 AM" },
  { id: 3, userId: 3, text: "We need to schedule a meeting to discuss the timeline for the mobile app launch.", time: "10:30 AM" },
  { id: 4, userId: 4, text: "I can prepare the marketing materials once we have a confirmed launch date.", time: "10:32 AM" },
  { id: 5, userId: 5, text: "The API integration is progressing well. Should be ready for testing by Friday.", time: "10:35 AM" }
];

// --- Sub-components ---

const StatCard = ({ icon: Icon, value, label, iconClass }) => (
  <Card className="bg-card/50 hover:border-primary/50 transition-all duration-300">
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${iconClass}`}>
        <Icon className="size-8" />
      </div>
      <div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

const ProjectCard = ({ project }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-green-500/20 text-green-400';
      case 'Planning': return 'bg-yellow-500/20 text-yellow-400';
      case 'Completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-background/70 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {project.members.map(memberId => {
              const member = teamMembers.find(m => m.id === memberId);
              if (!member) return null;
              return (
                <Avatar key={member.id} className="size-8 border-2 border-card">
                  <AvatarFallback className={member.color}>{member.avatar}</AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(project.status)}`}>
            {project.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ activity }) => {
  const user = teamMembers.find(m => m.id === activity.user);
  if (!user) return null;
  return (
    <div className="flex items-start gap-4 py-3">
      <Avatar className="size-10">
        <AvatarFallback className={user.color}>{user.avatar}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm">
          <span className="font-semibold text-foreground">{user.name}</span>
          <span className="text-muted-foreground"> {activity.action} </span>
          <span className="font-semibold text-primary/80">{activity.target}</span>
        </p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );
};

const FileCard = ({ file }) => {
  const sharedBy = teamMembers.find(m => m.id === file.sharedById);
  let Icon;
  switch (file.type) {
    case 'pdf': Icon = FilePdf; break;
    case 'doc': Icon = FileText; break;
    case 'figma': Icon = FileImage; break;
    default: Icon = File;
  }
  return (
    <Card className="bg-background/70 text-center p-4 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
      <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit mb-3">
        <Icon className="size-8 text-primary" />
      </div>
      <p className="text-sm font-semibold truncate">{file.name}</p>
      <p className="text-xs text-muted-foreground">{file.size} &bull; {sharedBy?.name}</p>
    </Card>
  );
}

// --- Main Component ---

export default function CollaborationHubPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [activities, setActivities] = useState(initialActivities);
  const [messages, setMessages] = useState(initialMessages);
  const [files, setFiles] = useState(initialFiles);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    const newMessage = {
      id: messages.length + 1,
      userId: 1, // Assuming current user is Alex Johnson
      text: messageInput.trim(),
      time: 'Just now'
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Auto-scroll to new message
    setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages');
        if(chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
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
                <AvatarFallback className="bg-purple-500">DR</AvatarFallback>
            </Avatar>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} value={teamMembers.length} label="Team Members" iconClass="bg-blue-500/20 text-blue-400" />
        <StatCard icon={LayoutGrid} value={projects.length} label="Active Projects" iconClass="bg-green-500/20 text-green-400" />
        <StatCard icon={MessageSquare} value={24} label="Unread Messages" iconClass="bg-yellow-500/20 text-yellow-400" />
        <StatCard icon={File} value={files.length} label="Shared Files" iconClass="bg-red-500/20 text-red-400" />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Projects */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Active Projects</CardTitle>
                    <Button size="sm"><Plus className="mr-2 size-4" /> New Project</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => <ProjectCard key={p.id} project={p} />)}
                </CardContent>
            </Card>

            {/* Chat */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Chat</CardTitle>
                    <Button size="sm" variant="outline"><Video className="mr-2 size-4"/> Start Call</Button>
                </CardHeader>
                <CardContent>
                    <div id="chat-messages" className="h-80 overflow-y-auto space-y-4 pr-4 mb-4">
                        {messages.map(msg => {
                            const user = teamMembers.find(m => m.id === msg.userId);
                            const isOwn = msg.userId === 1;
                            if(!user) return null;
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isOwn ? 'justify-end' : ''}`}>
                                    {!isOwn && <Avatar className="size-9"><AvatarFallback className={user.color}>{user.avatar}</AvatarFallback></Avatar>}
                                    <div className={`p-3 rounded-lg max-w-[80%] ${isOwn ? 'bg-primary/90' : 'bg-muted'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
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
                    {activities.map(act => <ActivityItem key={act.id} activity={act} />)}
                </CardContent>
            </Card>
            
            {/* Shared Files */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Shared Files</CardTitle>
                    <Button size="sm" variant="outline">View All</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {files.slice(0, 4).map(f => <FileCard key={f.name} file={f} />)}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
