'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dna, FlaskConical, HeartPulse, Users, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-4xl">🚀</div>
          <p>Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-1 rounded-full text-sm mb-4">
              <Rocket className="size-4 text-accent" />
              NASA Research Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">
              Explore the Frontiers of
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Space Science</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
              Join astronauts and researchers in groundbreaking experiments. 
              Analyze DNA in space conditions, monitor astronaut health, 
              and contribute to humanity's future in space exploration.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Start Exploring</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/guest">Try Guest Mode</Link>
              </Button>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                  icon={Dna}
                  title="DNA Cosmic Explorer"
                  description="Analyze genetic changes in space conditions with real NASA data."
              />
              <FeatureCard 
                  icon={FlaskConical}
                  title="Space Experiments"
                  description="Run plant growth and radiation studies in different gravity environments."
              />
              <FeatureCard 
                  icon={HeartPulse}
                  title="Health Dashboard"
                  description="Monitor astronaut vitals and mission readiness in real-time."
              />
              <FeatureCard 
                  icon={Users}
                  title="Research Network"
                  description="Collaborate with scientists and astronauts worldwide."
              />
          </div>
        </section>

         {/* Stats Section */}
        <section className="py-16">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <Stat number="50+" label="Active Researchers" />
                <Stat number="1,200+" label="Experiments Run" />
                <Stat number="15" label="Space Missions" />
                <Stat number="100%" label="Real NASA Data" />
            </div>
        </section>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="bg-card p-6 rounded-lg border border-border text-center flex flex-col items-center">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
            <Icon className="size-8 text-primary" />
        </div>
        <h3 className="text-xl font-headline font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm flex-grow">{description}</p>
    </div>
);

const Stat = ({ number, label }: { number: string, label: string }) => (
    <div>
        <p className="text-4xl font-bold text-accent">{number}</p>
        <p className="text-muted-foreground mt-1">{label}</p>
    </div>
);
