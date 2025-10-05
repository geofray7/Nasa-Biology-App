'use client';

import { 
    GoogleAuthProvider, 
    signInWithPopup,
    linkWithPopup,
    UserCredential
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SocialSignInButtons() {
    const auth = useAuth();
    const { user: currentUser } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            let userCredential;
            if (currentUser && currentUser.isAnonymous) {
                // Link anonymous account with Google
                userCredential = await linkWithPopup(currentUser, provider);
            } else {
                // Standard Google sign-in
                userCredential = await signInWithPopup(auth, provider);
            }
            await checkAndCreateUser(userCredential);
            router.push('/dashboard');
        } catch (error) {
            console.error("Google sign in error", error);
        }
    };
    
    const checkAndCreateUser = async (userCredential: UserCredential) => {
        const user = userCredential.user;
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const userProfileData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'researcher',
                specialization: 'Biology',
                joinedDate: new Date(),
                lastLogin: new Date(),
                isOnline: true,
                isGuest: false,
            };
            setDocumentNonBlocking(userDocRef, userProfileData, { merge: false });

            const userStatsRef = doc(firestore, 'user_stats', user.uid);
            const userStatsData = {
                experimentsCompleted: 0,
                dnaAnalyses: 0,
                healthEntries: 0,
                badges: ["New Explorer"],
                achievements: {}
            };
            setDocumentNonBlocking(userStatsRef, userStatsData, { merge: false });
        } else {
             const updateData = {
                lastLogin: new Date(),
                isOnline: true,
                isGuest: false,
                displayName: user.displayName,
                photoURL: user.photoURL,
             };
             setDocumentNonBlocking(userDocRef, updateData, { merge: true });
        }
    };

    return (
        <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                Sign In with Google
            </Button>
            {/* Add other social providers here */}
        </div>
    );
}
