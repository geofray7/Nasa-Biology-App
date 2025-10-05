'use client';
import { useState, useEffect } from 'react';
import { useUser, useAuth, useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  displayName: string;
  bio: string;
  role: string;
  specialization: string;
  mission?: string;
  joinedDate?: any;
}

function ProfilePageContent() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const [profile, setProfile] = useState<UserProfileData>({
        displayName: '',
        bio: '',
        role: 'researcher',
        specialization: 'Biology'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    useEffect(() => {
        const loadProfile = async () => {
          if (!user) return;
          
          try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              setProfile({
                displayName: userData.displayName || user.displayName || '',
                bio: userData.bio || '',
                role: userData.role || 'researcher',
                specialization: userData.specialization || 'Biology',
                mission: userData.mission,
                joinedDate: userData.joinedDate
              });
            } else {
              // If no doc, set defaults from auth user
              setProfile({
                displayName: user.displayName || '',
                bio: '',
                role: 'researcher',
                specialization: 'Biology'
              });
            }
          } catch (error) {
            console.error('Error loading profile:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load user profile.' });
          } finally {
            setIsLoading(false);
          }
        };
    
        if(user) {
            loadProfile();
        }
      }, [user, firestore, toast]);

      const handleSaveProfile = async () => {
        if (!user) return;
    
        const profileUpdates = {
            displayName: profile.displayName,
            bio: profile.bio,
            role: profile.role,
            specialization: profile.specialization,
            lastUpdated: new Date()
        };

        if(auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: profile.displayName
            }).catch(authError => {
                console.error("Failed to update auth profile:", authError);
                toast({ variant: 'destructive', title: 'Auth Error', description: 'Could not update display name.' });
            });
        }

        const userDocRef = doc(firestore, 'users', user.uid);
        
        updateDoc(userDocRef, profileUpdates)
        .then(() => {
            setIsEditing(false);
            toast({ title: 'Success', description: 'Profile updated successfully!' });
        })
        .catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: profileUpdates,
            }));
        });
      };
    
    if (isUserLoading || isLoading || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin text-4xl">🚀</div>
                    <p>Loading Profile...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">My Profile</CardTitle>
                    <CardDescription>Manage your account and research preferences.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <Avatar className="w-32 h-32 text-5xl mb-4">
                            <AvatarImage src={user.photoURL ?? ''} />
                            <AvatarFallback>{profile.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">Change Photo</Button>
                        <p className="text-xs text-muted-foreground mt-2">Max file size: 5MB</p>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="displayName">Display Name</Label>
                                {isEditing ? (
                                    <Input id="displayName" value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} />
                                ) : (
                                    <p className="text-lg text-muted-foreground">{profile.displayName}</p>
                                )}
                            </div>
                             <div>
                                <Label>Email</Label>
                                <p className="text-lg text-muted-foreground">{user.email}</p>
                            </div>
                             <div>
                                <Label htmlFor="role">Role</Label>
                                 {isEditing ? (
                                    <Select value={profile.role} onValueChange={(value) => setProfile({...profile, role: value})}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="researcher">Researcher</SelectItem>
                                            <SelectItem value="astronaut">Astronaut</SelectItem>
                                            <SelectItem value="scientist">Scientist</SelectItem>
                                            <SelectItem value="student">Student</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-lg text-muted-foreground">{profile.role}</p>
                                )}
                            </div>
                             <div>
                                <Label htmlFor="specialization">Specialization</Label>
                                 {isEditing ? (
                                    <Select value={profile.specialization} onValueChange={(value) => setProfile({...profile, specialization: value})}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Biology">Biology</SelectItem>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Medicine">Medicine</SelectItem>
                                            <SelectItem value="Physics">Physics</SelectItem>
                                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-lg text-muted-foreground">{profile.specialization}</p>
                                )}
                            </div>
                             <div>
                                <Label htmlFor="bio">Bio</Label>
                                {isEditing ? (
                                    <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Tell us about your research..."/>
                                ) : (
                                    <p className="text-muted-foreground min-h-[60px]">{profile.bio || 'No bio provided.'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            {isEditing ? (
                                <>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
             {user?.isAnonymous && (
                <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                    <CardHeader>
                        <CardTitle>✨ Upgrade to a Full Account</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Guest mode is great for exploring, but create an account to save your experiments and collaborate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" onClick={() => router.push('/signup')}>Create Free Account</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


export default function ProfilePage() {
    return <ProfilePageContent />;
}
