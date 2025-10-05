'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dna, FlaskConical, HeartPulse, Users, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
      router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-4xl">🚀</div>
        <p>Redirecting to Mission Control...</p>
      </div>
    </div>
  );
}
