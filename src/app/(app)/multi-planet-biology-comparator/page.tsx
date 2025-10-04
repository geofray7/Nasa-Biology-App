'use client';
import { useState, useEffect } from 'react';
import { comparePlanets } from '@/services/planetComparisonEngine';
import { RealTimePlanetData } from '@/components/RealTimePlanetData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function
const getPlanetEmoji = (planetId: string) => {
  const emojis: { [key: string]: string } = {
    mercury: '☿',
    venus: '♀',
    earth: '🌍',
    mars: '♂',
    jupiter: '♃',
    saturn: '♄',
    uranus: '♅',
    neptune: '♆',
    pluto: '♇',
    europa: '🌕',
    titan: '🪐',
    enceladus: '💫',
  };
  return emojis[planetId] || '🪐';
};

const AdvancedPlanetComparator = () => {
  const [selectedPlanets, setSelectedPlanets] = useState(['earth', 'mars']);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const availablePlanets = [
    { id: 'mercury', name: 'Mercury', type: 'terrestrial' },
    { id: 'venus', name: 'Venus', type: 'terrestrial' },
    { id: 'earth', name: 'Earth', type: 'terrestrial' },
    { id: 'mars', name: 'Mars', type: 'terrestrial' },
    { id: 'jupiter', name: 'Jupiter', type: 'gas_giant' },
    { id: 'saturn', name: 'Saturn', type: 'gas_giant' },
    { id: 'uranus', name: 'Uranus', type: 'ice_giant' },
    { id: 'neptune', name: 'Neptune', type: 'ice_giant' },
    { id: 'pluto', name: 'Pluto', type: 'dwarf' },
    { id: 'europa', name: 'Europa', type: 'moon' },
    { id: 'titan', name: 'Titan', type: 'moon' },
    { id: 'enceladus', name: 'Enceladus', type: 'moon' },
  ];

  useEffect(() => {
    runComparison();
  }, [selectedPlanets]);

  const runComparison = async () => {
    if (selectedPlanets.length === 0) {
      setComparisonResults(null);
      return;
    }
    setLoading(true);
    try {
      const results = await comparePlanets(
        selectedPlanets,
        {}
      );
      setComparisonResults(results);
    } catch (error) {
      console.error('Comparison error:', error);
    }
    setLoading(false);
  };

  const togglePlanet = (planetId: string) => {
    setSelectedPlanets((prev) =>
      prev.includes(planetId)
        ? prev.filter((id) => id !== planetId)
        : [...prev, planetId]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            🌌 Select Celestial Bodies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availablePlanets.map((planet) => (
              <Button
                key={planet.id}
                variant={
                  selectedPlanets.includes(planet.id) ? 'default' : 'outline'
                }
                onClick={() => togglePlanet(planet.id)}
                className={`h-auto flex flex-col items-center justify-center p-3 gap-1 transition-all duration-300 ${
                  selectedPlanets.includes(planet.id)
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
              >
                <div className="text-3xl">{getPlanetEmoji(planet.id)}</div>
                <div className="font-semibold">{planet.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {planet.type.replace('_', ' ')}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-card rounded-lg border">
            <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">
              Analyzing planetary data with NASA algorithms...
            </p>
          </div>
        ) : comparisonResults ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>🛸 Habitability Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparisonResults.habitability.map((result: any) => (
                    <Card key={result.planet} className="bg-muted/50">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium capitalize">
                          {result.planet}
                        </CardTitle>
                        <div className="text-3xl">
                          {getPlanetEmoji(result.planet)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">
                          {result.score}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Habitability Score
                        </p>
                        <div className="mt-4 space-y-1 text-sm">
                          {Object.entries(result.factors).map(
                            ([factor, present]) => (
                              <div
                                key={factor}
                                className={`flex items-center gap-2 ${
                                  present ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                {present ? '✓' : '✗'}{' '}
                                <span className="capitalize text-foreground">
                                  {factor.replace('_', ' ')}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏗️ Terraforming Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparisonResults.terraforming_potential.map(
                    (result: any) => (
                      <Card key={result.planet} className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-base font-medium capitalize">
                            {result.planet}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <div className="text-2xl font-bold text-accent">
                              {result.potential}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Terraforming Potential
                            </p>
                          </div>
                          <div className="mt-4 text-sm">
                            <p className="font-semibold">
                              ⏱️ Est. Time: {result.timeframe}
                            </p>
                            <ul className="mt-2 list-disc list-inside text-muted-foreground text-xs space-y-1">
                              {result.factors.map(
                                (factor: string, idx: number) => (
                                  <li key={idx}>{factor}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔬 NASA Scientific Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisonResults.insights.map(
                  (insight: any, idx: number) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-semibold text-accent">
                        {insight.title}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {insight.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Significance:</strong> {insight.significance}
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          !loading && (
            <Card className="text-center p-10">
              <CardContent>
                <p>Select planets to begin comparison.</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {selectedPlanets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {selectedPlanets.map((planetId) => (
            <RealTimePlanetData key={planetId} planetId={planetId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedPlanetComparator;
