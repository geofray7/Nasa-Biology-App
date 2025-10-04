
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { navItems } from './app-sidebar';
import { SettingsIcon } from 'lucide-react';
import { useSettingsContext } from '@/hooks/use-settings.tsx';


export function AppHeader() {
  const pathname = usePathname();
  const currentPage = navItems.find((item) => pathname.startsWith(item.href));
  const title = currentPage ? currentPage.label : 'SpaceBio Knowledge Engine';
  const { setIsSettingsOpen } = useSettingsContext();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="font-headline text-xl font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="size-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsSettingsOpen(true)}
        >
          <SettingsIcon className="size-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}
