'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dna, Atom, Biohazard, Rocket, FlaskConical } from 'lucide-react';

// --- Types from user prompt ---
interface SpaceGeneDesign {
  targetOrganism: 'Arabidopsis' | 'E. coli' | 'Human cells' | 'Algae';
  desiredTrait:
    | 'Radiation Resistance'
    | 'Zero-G Growth'
    | 'Low Nutrient Efficiency';
  environment: 'Mars Surface' | 'ISS' | 'Deep Space' | 'Europa Ocean';
}

interface ProteinDesigner {
  baseProtein:
    | 'Hemoglobin'
    | 'Chlorophyll'
    | 'DNA Polymerase'
    | 'Antibody';
  optimizationFor:
    | 'Microgravity Folding'
    | 'Radiation Stability'
    | 'Low Temperature';
  efficiency: 'Earth Baseline' | '10% Better' | '50% Better' | '100% Better';
}

interface SyntheticEcosystem {
  primaryProducers: string[];
  decomposers: string[];
  consumers: string[];
  wasteRecyclers: string[];
}

// --- Mock Functions from user prompt ---
const designSpaceOrganism = (blueprint: SpaceGeneDesign) => {
  return `🧬 Designed ${blueprint.targetOrganism} with enhanced ${blueprint.desiredTrait} for ${blueprint.environment}`;
};

const optimizeProtein = (design: ProteinDesigner) => {
  return `🔬 Created ${design.baseProtein} variant with ${design.efficiency} efficiency in ${design.optimizationFor}`;
};

const calculateOxygen = (ecosystem: SyntheticEcosystem) =>
  ecosystem.primaryProducers.length * 150;
const calculateCrew = (ecosystem: SyntheticEcosystem) =>
  Math.floor(ecosystem.consumers.length * 2);

const simulateEcosystem = (ecosystem: SyntheticEcosystem) => {
  return `🌍 Ecosystem produces ${calculateOxygen(
    ecosystem
  )} units of oxygen/day and can sustain ${calculateCrew(ecosystem)} astronauts.`;
};

// --- Main Component ---
export default function AstroGeneticEngineeringStudioPage() {
  // State for Cosmic Gene Editor
  const [geneDesign, setGeneDesign] = useState<SpaceGeneDesign>({
    targetOrganism: 'Arabidopsis',
    desiredTrait: 'Radiation Resistance',
    environment: 'Mars Surface',
  });
  const [geneResult, setGeneResult] = useState('');

  // State for Protein Optimizer
  const [proteinDesign, setProteinDesign] = useState<ProteinDesigner>({
    baseProtein: 'Hemoglobin',
    optimizationFor: 'Microgravity Folding',
    efficiency: '10% Better',
  });
  const [proteinResult, setProteinResult] = useState('');

  // State for Ecosystem Creator
  const [ecosystem, setEcosystem] = useState<SyntheticEcosystem>({
    primaryProducers: ['Engineered Algae'],
    decomposers: ['Modified Bacteria'],
    consumers: ['Lab-grown Meat'],
    wasteRecyclers: ['CO2-fixers'],
  });
  const [ecosystemResult, setEcosystemResult] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold mb-2">
          Astro-Genetic Engineering Studio
        </h1>
        <p className="text-muted-foreground">
          Design organisms and biological systems for the future of space
          exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cosmic Gene Editor */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="text-primary" />
              Cosmic Gene Editor
            </CardTitle>
            <CardDescription>
              Design genes for specific space conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Target Organism</label>
              <Select
                value={geneDesign.targetOrganism}
                onValueChange={(v) =>
                  setGeneDesign({ ...geneDesign, targetOrganism: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an organism" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arabidopsis">Arabidopsis</SelectItem>
                  <SelectItem value="E. coli">E. coli</SelectItem>
                  <SelectItem value="Human cells">Human cells</SelectItem>
                  <SelectItem value="Algae">Algae</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Desired Trait</label>
              <Select
                value={geneDesign.desiredTrait}
                onValueChange={(v) =>
                  setGeneDesign({ ...geneDesign, desiredTrait: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a trait" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Radiation Resistance">
                    Radiation Resistance
                  </SelectItem>
                  <SelectItem value="Zero-G Growth">Zero-G Growth</SelectItem>
                  <SelectItem value="Low Nutrient Efficiency">
                    Low Nutrient Efficiency
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Target Environment</label>
              <Select
                value={geneDesign.environment}
                onValueChange={(v) =>
                  setGeneDesign({ ...geneDesign, environment: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mars Surface">Mars Surface</SelectItem>
                  <SelectItem value="ISS">ISS</SelectItem>
                  <SelectItem value="Deep Space">Deep Space</SelectItem>
                  <SelectItem value="Europa Ocean">Europa Ocean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => setGeneResult(designSpaceOrganism(geneDesign))}
            >
              Design Gene
            </Button>
            {geneResult && (
              <div className="p-3 bg-muted rounded-md text-sm text-foreground">
                <strong>Result:</strong> {geneResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Protein Optimizer */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Atom className="text-accent" />
              Protein Optimizer
            </CardTitle>
            <CardDescription>
              Create proteins that function in extreme environments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Base Protein</label>
              <Select
                value={proteinDesign.baseProtein}
                onValueChange={(v) =>
                  setProteinDesign({ ...proteinDesign, baseProtein: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a protein" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hemoglobin">Hemoglobin</SelectItem>
                  <SelectItem value="Chlorophyll">Chlorophyll</SelectItem>
                  <SelectItem value="DNA Polymerase">DNA Polymerase</SelectItem>
                  <SelectItem value="Antibody">Antibody</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Optimize For</label>
              <Select
                value={proteinDesign.optimizationFor}
                onValueChange={(v) =>
                  setProteinDesign({
                    ...proteinDesign,
                    optimizationFor: v as any,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Microgravity Folding">
                    Microgravity Folding
                  </SelectItem>
                  <SelectItem value="Radiation Stability">
                    Radiation Stability
                  </SelectItem>
                  <SelectItem value="Low Temperature">
                    Low Temperature
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Efficiency Goal</label>
              <Select
                value={proteinDesign.efficiency}
                onValueChange={(v) =>
                  setProteinDesign({ ...proteinDesign, efficiency: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select efficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Earth Baseline">Earth Baseline</SelectItem>
                  <SelectItem value="10% Better">10% Better</SelectItem>
                  <SelectItem value="50% Better">50% Better</SelectItem>
                  <SelectItem value="100% Better">100% Better</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => setProteinResult(optimizeProtein(proteinDesign))}
            >
              Optimize Protein
            </Button>
            {proteinResult && (
              <div className="p-3 bg-muted rounded-md text-sm text-foreground">
                <strong>Result:</strong> {proteinResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Synthetic Biology Ecosystem Creator */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Biohazard className="text-destructive" />
              Ecosystem Creator
            </CardTitle>
            <CardDescription>
              Design a complete biological system for a space habitat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary Producers</label>
              <p className="text-xs text-muted-foreground p-2 bg-muted rounded">
                {ecosystem.primaryProducers.join(', ')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Decomposers</label>
              <p className="text-xs text-muted-foreground p-2 bg-muted rounded">
                {ecosystem.decomposers.join(', ')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Consumers</label>
              <p className="text-xs text-muted-foreground p-2 bg-muted rounded">
                {ecosystem.consumers.join(', ')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Waste Recyclers</label>
              <p className="text-xs text-muted-foreground p-2 bg-muted rounded">
                {ecosystem.wasteRecyclers.join(', ')}
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => setEcosystemResult(simulateEcosystem(ecosystem))}
            >
              Simulate Ecosystem
            </Button>
            {ecosystemResult && (
              <div className="p-3 bg-muted rounded-md text-sm text-foreground">
                <strong>Result:</strong> {ecosystemResult}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket />
            Real NASA Research Integration
          </CardTitle>
          <CardDescription>
            These tools are inspired by actual NASA-funded research into space
            biology and synthetic life.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <FlaskConical className="mt-1 h-5 w-5 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold">Gene Editing for Radiation Resistance</h4>
              <p className="text-muted-foreground">
                Scientists are exploring genes from extremophiles (like tardigrades) to enhance radiation tolerance in other organisms, crucial for long-duration missions.
              </p>
            </div>
          </div>
           <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <FlaskConical className="mt-1 h-5 w-5 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold">Synthetic Photosynthesis</h4>
              <p className="text-muted-foreground">
                Research into creating artificial or enhanced photosynthetic systems to maximize oxygen and biomass production in closed environments like a Mars habitat.
              </p>
            </div>
          </div>
           <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <FlaskConical className="mt-1 h-5 w-5 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold">Extremophile Gene Insertion</h4>
              <p className="text-muted-foreground">
                Identifying and transferring genes from organisms that thrive in extreme cold, heat, or radiation into crops or microbes for space applications.
              </p>
            </div>
          </div>
           <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <FlaskConical className="mt-1 h-5 w-5 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold">Biological Mining (Biomining)</h4>
              <p className="text-muted-foreground">
                Engineering microbes that can extract valuable minerals and metals from regolith on the Moon or Mars, reducing reliance on Earth-based resources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
