'use client';
import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SettingsProvider } from '@/hooks/use-settings.tsx';


function AppContent({ children }: { children: ReactNode }) {
  const { settings } = useSettingsContext();

  return (
    <div className={`theme-${settings.theme} font-${settings.fontSize}`}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen">
              <AppHeader />
              <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
      <SettingsProvider>
        <AppContent>{children}</AppContent>
      </SettingsProvider>
  );
}
