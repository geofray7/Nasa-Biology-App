'use client';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Orbit, Loader } from 'lucide-react';

const Galaxy = dynamic(
  () => import('./galaxy').then((mod) => mod.Galaxy),
  {
    ssr: false,
    loading: () => (
       <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full">
              <Loader className="size-12 text-primary animate-spin" />
            </div>
            <CardTitle className="mt-4 font-headline text-2xl">
              Loading Cosmic Research Galaxy...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please wait while we render the stars of knowledge.
            </p>
          </CardContent>
        </Card>
      </div>
    ),
  }
);

export default function CosmicResearchGalaxyPage() {
  return (
    <div className="w-full h-full -m-4 sm:-m-6 lg:-m-8 relative">
       <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
          <h1 className="text-2xl font-headline font-bold">Cosmic Research Galaxy</h1>
          <p className="text-muted-foreground text-sm">Explore a 3D force-directed graph of research papers.</p>
       </div>
      <Galaxy />
    </div>
  );
}
