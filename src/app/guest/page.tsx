'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInAnonymously } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, Dna, FlaskConical, BarChart } from 'lucide-react';

export default function GuestPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const enterGuestMode = async () => {
    try {
      // Sign in anonymously
      const userCredential = await signInAnonymously(auth);
      
      // Create guest user profile
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: 'Space Explorer',
        email: `guest_${userCredential.user.uid}@example.com`,
        role: 'guest',
        isGuest: true,
        joinedDate: new Date(),
        lastLogin: new Date(),
        isOnline: true
      });

      // Create guest stats
      await setDoc(doc(firestore, 'user_stats', userCredential.user.uid), {
        experimentsCompleted: 0,
        dnaAnalyses: 0,
        badges: ["Guest Explorer"],
        isGuest: true
      });

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Guest mode error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
              <Rocket className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-3xl">Enter Guest Mode</CardTitle>
              <CardDescription>
                  Experience the platform with sample data. You can explore all features 
                  but your progress won't be saved permanently.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 gap-4 my-6 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <FlaskConical className="h-5 w-5 text-accent" />
                      <span>Run virtual experiments</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Dna className="h-5 w-5 text-accent" />
                      <span>Analyze demo DNA</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <BarChart className="h-5 w-5 text-accent" />
                      <span>View simulated health data</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Rocket className="h-5 w-5 text-accent" />
                      <span>Access all core features</span>
                  </div>
              </div>

              <div className="space-y-3">
                  <Button onClick={enterGuestMode} className="w-full" size="lg">
                      Enter Guest Mode
                  </Button>
                  <Button onClick={() => router.push('/signup')} className="w-full" variant="secondary">
                      Create a Free Account
                  </Button>
                  <Button onClick={() => router.push('/')} className="w-full" variant="ghost">
                      Back to Home
                  </Button>
              </div>

              <div className="mt-6 text-center text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  💡 <strong>Tip:</strong> Create an account to save your progress and collaborate with other researchers!
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
