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
  PieChart,
  Pie,
  Cell,
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
import { Heart, TrendingUp, Activity, Bed, Droplets } from 'lucide-react';

const initialHealthData = {
  heartRate: 72,
  weight: 68.5,
  steps: 8542,
  sleep: 7.2,
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

const activityDistributionData = [
    { name: 'Walking', value: 40 },
    { name: 'Running', value: 25 },
    { name: 'Cycling', value: 15 },
    { name: 'Strength', value: 10 },
    { name: 'Other', value: 10 },
];

const COLORS = ['#2c7be5', '#00d97e', '#39afd1', '#f6c343', '#e63757'];

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
                    <CardTitle>Activity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={activityDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {activityDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        </PieChart>
                    </ResponsiveContainer>
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


export default ProfessionalHealthDashboard;
