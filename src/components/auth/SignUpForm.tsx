'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialSignInButtons } from './SocialSignInButtons';

export function SignUpForm() {
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        role: 'researcher',
        specialization: 'Biology'
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await updateProfile(userCredential.user, {
                displayName: formData.displayName
            });

            await setDoc(doc(firestore, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: formData.email,
                displayName: formData.displayName,
                photoURL: `https://picsum.photos/seed/${userCredential.user.uid}/200/200`,
                role: formData.role,
                specialization: formData.specialization,
                joinedDate: new Date(),
                lastLogin: new Date(),
                isOnline: true
            });

            await setDoc(doc(firestore, 'user_stats', userCredential.user.uid), {
                experimentsCompleted: 0,
                dnaAnalyses: 0,
                healthEntries: 0,
                badges: ["New Explorer"],
                achievements: {}
            });
            
            router.push('/dashboard');

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Join the Space Research Network</CardTitle>
                <CardDescription>Create your account to begin exploring.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Full Name</Label>
                        <Input id="displayName" name="displayName" type="text" placeholder="Dr. Evelyn Reed" value={formData.displayName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="explorer@nasa.gov" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="researcher">Researcher</SelectItem>
                                    <SelectItem value="astronaut">Astronaut</SelectItem>
                                    <SelectItem value="scientist">Scientist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Select name="specialization" value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a field" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Biology">Biology</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Medicine">Medicine</SelectItem>
                                    <SelectItem value="Physics">Physics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
                
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <SocialSignInButtons />
                
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
