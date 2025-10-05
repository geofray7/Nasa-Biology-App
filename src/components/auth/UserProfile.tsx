'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export function UserProfile() {
    const firestore = useFirestore();
    const auth = useAuth();
    const [user, loadingAuth] = useAuthState(auth);
    const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
    const [profileData, loadingProfile] = useDocumentData(userDocRef);
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        specialization: ''
    });

    useEffect(() => {
        if (profileData) {
            setFormData({
                displayName: profileData.displayName || '',
                bio: profileData.bio || '',
                specialization: profileData.specialization || 'Biology'
            });
        }
    }, [profileData]);

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            await updateProfile(user, {
                displayName: formData.displayName
            });

            await updateDoc(doc(firestore, 'users', user.uid), {
                displayName: formData.displayName,
                bio: formData.bio,
                specialization: formData.specialization
            });

            toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
            setIsEditing(false);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Update Error", description: error.message });
            console.error('Profile update error:', error);
        }
    };
    
    if (loadingAuth || loadingProfile) {
        return <div className="text-center p-10">Loading Profile...</div>;
    }

    if (!user || !profileData) {
        return <div className="text-center p-10">User not found.</div>;
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 text-4xl">
                        <AvatarImage src={user.photoURL || profileData.photoURL} />
                        <AvatarFallback>{formData.displayName?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        {isEditing ? (
                            <Input 
                                className="text-3xl font-bold"
                                value={formData.displayName}
                                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            />
                        ) : (
                            <CardTitle className="text-3xl">{formData.displayName}</CardTitle>
                        )}
                        <CardDescription className="text-lg">{profileData.role}</CardDescription>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                         <div>
                            <Label htmlFor="bio">Biography</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about your research..."
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="specialization">Specialization</Label>
                            <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
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
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleUpdateProfile}>Save Changes</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-primary">Biography</h3>
                            <p className="text-muted-foreground mt-1">{formData.bio || "No biography provided."}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Specialization</h3>
                            <p className="text-muted-foreground mt-1">{formData.specialization}</p>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
