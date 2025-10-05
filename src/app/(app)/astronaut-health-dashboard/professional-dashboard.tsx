'use client';
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, TrendingUp, Activity, Bed, Droplets, ShieldCheck, Dumbbell, Zap, GlassWater } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const initialHealthData = {
  heartRate: 72,
  weight: 68.5,
  steps: 8542,
  sleep: 7.2,
  waterIntake: 1800,
};

const initialChartData = [
  { name: 'Mon', heartRate: 72, steps: 8.0 },
  { name: 'Tue', heartRate: 71, steps: 7.5 },
  { name: 'Wed', heartRate: 73, steps: 9.0 },
  { name: 'Thu', heartRate: 70, steps: 8.2 },
  { name: 'Fri', heartRate: 69, steps: 8.5 },
  { name: 'Sat', heartRate: 68, steps: 7.0 },
  { name: 'Sun', heartRate: 72, steps: 8.5 },
];

const ProfessionalHealthDashboard = () => {
  const [healthData, setHealthData] = useState(initialHealthData);
  const [chartData, setChartData] = useState(initialChartData);
  const [activities, setActivities] = useState([
    { icon: Heart, title: 'Heart Rate Recorded', value: '72 BPM - Within normal range', time: '2 hours ago', color: 'bg-destructive' },
    { icon: TrendingUp, title: 'Weight Updated', value: '68.5 kg - 0.2 kg decrease', time: '5 hours ago', color: 'bg-primary' },
    { icon: Droplets, title: 'Water Intake', value: '1,800 ml - 80% of daily goal', time: '8 hours ago', color: 'bg-sky-500'},
    { icon: Activity, title: 'Morning Walk', value: '4,200 steps - 30 minutes', time: 'Today, 7:30 AM', color: 'bg-green-500' },
  ]);

  const [formData, setFormData] = useState({
    heartRate: '',
    bloodPressure: '',
    weight: '',
    steps: '',
    sleepHours: '',
    waterIntake: '',
  });

  const [readinessScore, setReadinessScore] = useState({
    current_score: 0,
    factors: {
      cardiovascular: 0,
      stamina: 0,
      recovery: 0,
      nutrition: 0,
    },
    recommendations: ['Enter health data to calculate your score.'],
  });

  useEffect(() => {
    calculateReadinessScore();
  }, [healthData]);


  const calculateReadinessScore = () => {
    // Cardiovascular (30%) - lower resting heart rate is better
    const idealHr = 60;
    const hrScore = Math.max(0, 100 - (Math.abs(healthData.heartRate - idealHr) * 5));
    const cardiovascular = Math.min(100, hrScore);

    // Stamina (30%) - based on steps
    const idealSteps = 10000;
    const stamina = Math.min(100, (healthData.steps / idealSteps) * 100);

    // Recovery (25%) - based on sleep
    const idealSleep = 8;
    const recovery = Math.min(100, (healthData.sleep / idealSleep) * 100);

    // Nutrition (15%) - based on water intake
    const idealWater = 2500;
    const nutrition = Math.min(100, (healthData.waterIntake / idealWater) * 100);

    const totalScore = 
        (cardiovascular * 0.3) + 
        (stamina * 0.3) +
        (recovery * 0.25) +
        (nutrition * 0.15);

    const recommendations = [];
    if (cardiovascular < 80) recommendations.push("Consider light cardio to improve resting heart rate.");
    if (stamina < 75) recommendations.push("Increase daily activity to improve stamina.");
    if (recovery < 85) recommendations.push("Aim for 8 hours of sleep for better recovery.");
    if (nutrition < 90) recommendations.push("Increase water intake by at least 500ml daily.");
    if (recommendations.length === 0) recommendations.push("Excellent work. All metrics are within optimal range!");

    setReadinessScore({
        current_score: Math.round(totalScore),
        factors: {
            cardiovascular: Math.round(cardiovascular),
            stamina: Math.round(stamina),
            recovery: Math.round(recovery),
            nutrition: Math.round(nutrition),
        },
        recommendations,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newHealthData = { ...healthData };
    const newActivities = [...activities];

    if (!formData.heartRate && !formData.bloodPressure && !formData.weight && !formData.steps && !formData.sleepHours && !formData.waterIntake) {
        alert('Please enter at least one health metric');
        return;
    }

    if (formData.heartRate) {
        newHealthData.heartRate = Number(formData.heartRate);
        newActivities.unshift({ icon: Heart, title: 'Heart Rate Updated', value: `${formData.heartRate} BPM`, time: 'Just now', color: 'bg-destructive' });
    }
    if (formData.weight) {
        newHealthData.weight = Number(formData.weight);
        newActivities.unshift({ icon: TrendingUp, title: 'Weight Updated', value: `${formData.weight} kg`, time: 'Just now', color: 'bg-primary' });
    }
    if (formData.steps) {
        newHealthData.steps = Number(formData.steps);
        newActivities.unshift({ icon: Activity, title: 'Steps Updated', value: `${formData.steps} steps`, time: 'Just now', color: 'bg-green-500' });
    }
    if (formData.sleepHours) {
        newHealthData.sleep = Number(formData.sleepHours);
        newActivities.unshift({ icon: Bed, title: 'Sleep Updated', value: `${formData.sleepHours} hours`, time: 'Just now', color: 'bg-purple-500' });
    }
    if (formData.waterIntake) {
        newHealthData.waterIntake = Number(formData.waterIntake);
        newActivities.unshift({ icon: Droplets, title: 'Water Intake', value: `${formData.waterIntake} ml`, time: 'Just now', color: 'bg-sky-500' });
    }

    setHealthData(newHealthData);
    setActivities(newActivities.slice(0, 4));

    // Update chart data - for simplicity, we'll update the last entry
    const newChartData = [...chartData];
    const lastEntry = newChartData[newChartData.length - 1];
    if(formData.heartRate) lastEntry.heartRate = Number(formData.heartRate);
    if(formData.steps) lastEntry.steps = Number(formData.steps) / 1000;
    setChartData(newChartData);

    setFormData({ heartRate: '', bloodPressure: '', weight: '', steps: '', sleepHours: '', waterIntake: '' });

    alert('Health data saved successfully!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline mb-2">Astronaut Health Dashboard</h1>
            <p className="text-muted-foreground">Real-time health monitoring for <span className="font-semibold text-accent">Dr. Reed</span></p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Heart} label="Heart Rate" value={`${healthData.heartRate} BPM`} color="bg-red-500/10" iconColor="text-red-500" />
            <StatCard icon={TrendingUp} label="Weight" value={`${healthData.weight} kg`} color="bg-blue-500/10" iconColor="text-blue-500" />
            <StatCard icon={Activity} label="Steps Today" value={healthData.steps.toLocaleString()} color="bg-green-500/10" iconColor="text-green-500" />
            <StatCard icon={Bed} label="Sleep Last Night" value={`${healthData.sleep} hrs`} color="bg-purple-500/10" iconColor="text-purple-500" />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Health Metrics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))"/>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                            <Legend />
                            <Line type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#e63757" fill="rgba(230, 55, 87, 0.1)" />
                            <Line type="monotone" dataKey="steps" name="Steps (thousands)" stroke="#00d97e" fill="rgba(0, 217, 126, 0.1)"/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="text-primary"/>
                        Mission Readiness
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="text-center">
                        <p className="text-5xl font-bold text-foreground">{readinessScore.current_score}%</p>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    <div className="space-y-3">
                        <FactorBar icon={Heart} label="Cardiovascular" value={readinessScore.factors.cardiovascular} color="bg-red-500" />
                        <FactorBar icon={Dumbbell} label="Stamina" value={readinessScore.factors.stamina} color="bg-green-500" />
                        <FactorBar icon={Zap} label="Recovery" value={readinessScore.factors.recovery} color="bg-purple-500" />
                        <FactorBar icon={GlassWater} label="Nutrition" value={readinessScore.factors.nutrition} color="bg-sky-500" />
                    </div>
                     <div className="pt-4 border-t border-border">
                        <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {readinessScore.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Data Entry & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add Health Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                                <Input id="heartRate" type="number" placeholder="Enter heart rate" value={formData.heartRate} onChange={handleInputChange}/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                                <Input id="bloodPressure" type="text" placeholder="e.g., 120/80" value={formData.bloodPressure} onChange={handleInputChange}/>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input id="weight" type="number" step="0.1" placeholder="Enter weight" value={formData.weight} onChange={handleInputChange}/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="steps">Steps</Label>
                                <Input id="steps" type="number" placeholder="Enter step count" value={formData.steps} onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="sleepHours">Sleep (hours)</Label>
                                <Input id="sleepHours" type="number" step="0.1" placeholder="Enter sleep duration" value={formData.sleepHours} onChange={handleInputChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="waterIntake">Water Intake (ml)</Label>
                                <Input id="waterIntake" type="number" placeholder="Enter water intake" value={formData.waterIntake} onChange={handleInputChange}/>
                            </div>
                        </div>
                        <Button type="submit">Save Health Data</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {activities.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <li key={index} className="flex items-start gap-4">
                                    <div className={`mt-1 p-2 rounded-full ${activity.color}`}>
                                        <Icon className="size-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground">{activity.value}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, iconColor }: {icon: React.ElementType, label: string, value: string, color: string, iconColor: string}) => (
    <Card className="hover:translate-y-[-5px] transition-transform duration-300">
        <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className={`size-8 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const FactorBar = ({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: number, color: string }) => (
    <div>
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
                <Icon className={`size-4 ${color.replace('bg-', 'text-')}`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-sm font-bold">{value}%</span>
        </div>
        <Progress value={value} indicatorClassName={color} />
    </div>
);

export default ProfessionalHealthDashboard;

// Add this to progress.tsx to allow custom colors
// In Progress component:
// <ProgressPrimitive.Indicator
//   className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
// ...
//
// In Progress props:
// React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
//
// In Progress forwardRef:
// ({ className, value, indicatorClassName, ...props }, ref) => (

