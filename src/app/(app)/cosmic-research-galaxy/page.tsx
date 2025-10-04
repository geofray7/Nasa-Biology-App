import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Orbit } from 'lucide-react';

export default function CosmicResearchGalaxyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Orbit className="size-12 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            Cosmic Research Galaxy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under construction. Soon, you'll be able to explore
            a 3D force-directed graph of research papers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
