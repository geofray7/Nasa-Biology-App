'use client';
import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SettingsProvider, useSettingsContext } from '@/hooks/use-settings.tsx';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedContent({ children }: { children: ReactNode }) {
  const { isLoaded, settings } = useSettingsContext();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (!isLoaded || isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-4xl">🚀</div>
          <p>Authenticating & Initializing NASA Systems...</p>
        </div>
      </div>
    );
  }
  
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
    <FirebaseClientProvider>
      <SettingsProvider>
        <ProtectedContent>{children}</ProtectedContent>
      </SettingsProvider>
    </FirebaseClientProvider>
  );
}
