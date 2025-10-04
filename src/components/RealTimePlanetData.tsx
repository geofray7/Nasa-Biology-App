'use client';
import { useState, useEffect } from 'react';
import { fetchRealTimeData, getMissionUpdates } from '@/services/planetComparisonEngine';
import { Satellite, Thermometer, Gauge, Wind, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const RealTimePlanetData = ({ planetId }: { planetId: string }) => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      setLoading(true);
      try {
        const data = await fetchRealTimeData(planetId);
        const missions = await getMissionUpdates(planetId);
        setRealTimeData(data);
        setActiveMissions(missions);
      } catch (error) {
        console.error(`Failed to fetch real-time data for ${planetId}:`, error);
      }
      setLoading(false);
    };

    fetchAndUpdateData();
    const interval = setInterval(fetchAndUpdateData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [planetId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!realTimeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="text-accent" />
            Live Data for {planetId.charAt(0).toUpperCase() + planetId.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">
            🛰️ Acquiring live data from NASA Deep Space Network...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="text-accent" />
          Live Data: {planetId.charAt(0).toUpperCase() + planetId.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Weather</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Thermometer className="text-red-400" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Surface Temp</div>
                <div className="font-mono">{realTimeData.weather.temperature}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Gauge className="text-blue-400" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Pressure</div>
                <div className="font-mono">{realTimeData.weather.pressure} hPa</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Wind className="text-green-400" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Wind</div>
                <div className="font-mono">{realTimeData.weather.wind_speed} km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="text-yellow-400" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Season</div>
                <div className="font-mono capitalize">{realTimeData.weather.season}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Active Missions</h4>
          <div className="space-y-2">
            {activeMissions.length > 0 ? (
              activeMissions.map((mission) => (
                <div key={mission.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{mission.name}</span>
                    <Badge variant="outline" className={mission.status === 'active' ? 'text-green-400 border-green-400' : ''}>
                      {mission.status}
                    </Badge>
                  </div>
                   {mission.latest_findings && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Latest:</strong> {mission.latest_findings}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active missions reporting.</p>
            )}
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Current Distance from Earth</div>
            <div className="font-mono text-lg">
              {Math.round(realTimeData.orbital_position.distance_from_earth_km / 1000000)} million km
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Signal delay: {Math.round(realTimeData.orbital_position.distance_from_earth_km / 299792)} seconds
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
