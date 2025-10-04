'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Rocket,
  LayoutDashboard,
  Orbit,
  FlaskConical,
  HeartPulse,
  Globe,
  MessageSquare,
  Users,
  Trophy,
  Code2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from './ui/separator';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/ai-research-copilot',
    label: 'AI Co-Pilot',
    icon: MessageSquare,
  },
  {
    href: '/cosmic-research-galaxy',
    label: 'Research Galaxy',
    icon: Orbit,
  },
  { href: '/dna-cosmic-explorer', label: 'DNA Explorer', icon: Code2 },
  { href: '/virtual-space-laboratory', label: 'Virtual Lab', icon: FlaskConical },
  {
    href: '/astronaut-health-dashboard',
    label: 'Health Dashboard',
    icon: HeartPulse,
  },
  {
    href: '/multi-planet-biology-comparator',
    label: 'Planet Comparator',
    icon: Globe,
  },
  { href: '/collaboration-hub', label: 'Collaboration Hub', icon: Users },
  { href: '/gamified-discovery', label: 'Discovery System', icon: Trophy },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Rocket className="size-8 text-accent" />
          <h1 className="font-headline text-xl font-bold">SpaceBio</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              as={Link}
              href={item.href}
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <Separator className="my-2" />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage
              src="https://picsum.photos/seed/user/40/40"
              data-ai-hint="profile picture"
            />
            <AvatarFallback>RD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold">Dr. Reed</span>
            <span className="truncate text-xs text-muted-foreground">
              Researcher
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
