import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2 } from 'lucide-react';

export default function DnaCosmicExplorerPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Code2 className="size-12 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            DNA Cosmic Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under construction. Soon, you'll be able to
            visualize space-induced mutations on an interactive DNA helix.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
