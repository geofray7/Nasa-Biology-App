import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  FlaskConical,
  Globe,
  HeartPulse,
  MessageSquare,
  Orbit,
  Code2,
  BrainCircuit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'AI Research Co-Pilot',
    description: "Ask questions and get summaries of NASA's bioscience papers.",
    href: '/ai-research-copilot',
    icon: MessageSquare,
    image_id: 'dashboard_copilot',
  },
  {
    title: 'Cosmic Research Galaxy',
    description: 'Visualize research papers as an interactive 3D star map.',
    href: '/cosmic-research-galaxy',
    icon: Orbit,
    image_id: 'dashboard_galaxy',
  },
  {
    title: 'DNA Cosmic Explorer',
    description: 'Visualize space-induced mutations on an interactive DNA helix.',
    href: '/dna-cosmic-explorer',
    icon: Code2,
    image_id: 'dashboard_dna',
  },
  {
    title: 'Astro-Genetic Engineering Studio',
    description: 'Design organisms and proteins for space environments.',
    href: '/astro-genetic-engineering-studio',
    icon: BrainCircuit,
    image_id: 'dashboard_engineering',
  },
  {
    title: 'Virtual Space Laboratory',
    description: 'Simulate microgravity experiments and visualize results.',
    href: '/virtual-space-laboratory',
    icon: FlaskConical,
    image_id: 'dashboard_lab',
  },
  {
    title: 'Astronaut Health Dashboard',
    description: 'Assess mission health risks with AI-powered simulations.',
    href: '/astronaut-health-dashboard',
    icon: HeartPulse,
    image_id: 'dashboard_health',
  },
  {
    title: 'Multi-Planet Biology Comparator',
    description: 'Compare biological adaptations on Earth, the Moon, and Mars.',
    href: '/multi-planet-biology-comparator',
    icon: Globe,
    image_id: 'dashboard_comparator',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Welcome, Dr. Reed</h1>
        <p className="text-muted-foreground">
          Explore the frontiers of space biology with the NASA Knowledge Engine.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => {
          const placeholder = PlaceHolderImages.find(
            (p) => p.id === feature.image_id
          );
          return (
            <Link href={feature.href} key={feature.title} className="group">
              <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:border-accent hover:shadow-lg hover:shadow-accent/10">
                <div className="relative h-48 w-full">
                  {placeholder && (
                    <Image
                      src={placeholder.imageUrl}
                      alt={placeholder.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={placeholder.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <feature.icon className="size-8 text-white" />
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="font-headline">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-accent"
                  >
                    <span>Explore</span>
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
