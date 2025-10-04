'use server';
import { initializeFirebase } from '@/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

const { firestore } = initializeFirebase();

async function fetchPlanetData(planetId: string) {
    const docRef = doc(firestore, 'planets', planetId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    // Return a default structure if planet data doesn't exist to avoid errors
    return { 
        id: planetId, 
        name: planetId.charAt(0).toUpperCase() + planetId.slice(1),
        nasa_missions: [],
        habitability_score: 0,
        gravity_ms2: 0,
        surface_temp_min: 0,
        surface_temp_max: 0,
        atmospheric_composition: { o2: 0, co2: 0 },
        magnetic_field: false,
        water_presence: 'none',
    };
}


function calculateHabitabilityScores(planets: any[]) {
    return planets.map(planet => {
      const score = (
        (planet.gravity_ms2 > 0.8 && planet.gravity_ms2 < 1.2 ? 0.3 : 0) +
        (planet.surface_temp_min > -50 && planet.surface_temp_max < 50 ? 0.3 : 0) +
        (planet.atmospheric_composition?.o2 > 15 ? 0.2 : 0) +
        (planet.magnetic_field ? 0.1 : 0) +
        (planet.water_presence !== 'none' ? 0.1 : 0)
      );
      return {
        planet: planet.id,
        score: Math.round(score * 100) / 100,
        factors: {
          gravity: planet.gravity_ms2 > 0.8 && planet.gravity_ms2 < 1.2,
          temperature: planet.surface_temp_min > -50 && planet.surface_temp_max < 50,
          atmosphere: planet.atmospheric_composition?.o2 > 15,
          magnetic_field: planet.magnetic_field,
          water: planet.water_presence !== 'none'
        }
      };
    });
}
    
function calculateMissionDensity(planets: any[]) {
    return planets.map(p => ({ planet: p.id, mission_count: p.nasa_missions?.length || 0 }));
}

function calculateResearchPriority(planets: any[]) {
     return planets.map(p => ({ planet: p.id, priority: p.habitability_score * (p.nasa_missions?.length || 1) }));
}


function calculateTerraformingPotential(planets: any[]) {
    return planets.map(planet => {
      let potential = 0;
      const factors = [];
      
      if (planet.atmospheric_composition?.co2) {
        potential += (planet.atmospheric_composition.co2 / 100) * 0.3;
        factors.push(`High CO2 for greenhouse effect`);
      }
      
      if (planet.water_presence === 'surface_liquid') potential += 0.3;
      else if (planet.water_presence === 'subsurface_ice') potential += 0.2;
      else if (planet.water_presence === 'polar_ice') potential += 0.1;
      
      if (planet.surface_temp_max > -50) potential += 0.2;
      
      if (!planet.magnetic_field) {
        potential -= 0.1;
        factors.push(`No magnetic field - radiation shielding needed`);
      }
      
      return {
        planet: planet.id,
        potential: Math.max(0, Math.round(potential * 100) / 100),
        timeframe: estimateTerraformingTimeframe(potential),
        factors
      };
    });
}

function estimateTerraformingTimeframe(potential: number) {
    if (potential > 0.7) return "200-500 years";
    if (potential > 0.5) return "500-1000 years";
    if (potential > 0.3) return "1000-5000 years";
    return "Not feasible with current technology";
}

function generateScientificInsights(planets: any[], comparisons: any) {
    const insights = [];
    if (!comparisons.habitability || comparisons.habitability.length === 0) return insights;
    
    const maxHabitability = Math.max(...comparisons.habitability.map((h: any) => h.score));
    const mostHabitable = comparisons.habitability.find((h: any) => h.score === maxHabitability);
    
    if (mostHabitable) {
        insights.push({
          type: "habitability_ranking",
          title: "Most Earth-like Environment",
          content: `${mostHabitable.planet} shows the highest habitability potential with a score of ${mostHabitable.score}`,
          significance: "Primary candidate for human colonization"
        });
    }


    const missionCounts = planets.map(p => p.nasa_missions?.length || 0);
    const maxMissions = Math.max(...missionCounts);
    const mostResearched = planets.find(p => (p.nasa_missions?.length || 0) === maxMissions);
    
    if (mostResearched) {
        insights.push({
          type: "research_focus",
          title: "Most Studied Planet",
          content: `${mostResearched.name} has been visited by ${maxMissions} NASA missions`,
          significance: "Well-characterized for future exploration"
        });
    }


    return insights;
}

export async function comparePlanets(planetIds: string[], comparisonMetrics: any) {
    const planets = await Promise.all(planetIds.map(id => fetchPlanetData(id)));
    const comparisons: any = {};

    comparisons.habitability = calculateHabitabilityScores(planets);
    comparisons.mission_density = calculateMissionDensity(planets);
    comparisons.research_priority = calculateResearchPriority(planets);
    comparisons.terraforming_potential = calculateTerraformingPotential(planets);
    
    comparisons.insights = generateScientificInsights(planets, comparisons);
    
    return comparisons;
}

export async function fetchRealTimeData(planetId: string) {
    const docRef = doc(firestore, 'real_time_data', planetId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export async function getMissionUpdates(planetId: string) {
    const q = query(collection(firestore, 'missions'), where('target_planet', '==', planetId), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}

// Keep a class for structure but don't export it
class PlanetComparisonEngine {
    static comparePlanets = comparePlanets;
    static fetchRealTimeData = fetchRealTimeData;
    static getMissionUpdates = getMissionUpdates;
}
