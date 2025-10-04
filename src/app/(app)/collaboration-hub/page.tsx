import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CollaborationHubPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Users className="size-12 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            Real-Time Collaboration Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under construction. Soon, you'll be able to
            annotate papers and collaborate with your team in real-time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
