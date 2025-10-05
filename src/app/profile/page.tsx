'use client';
import { UserProfile } from '@/components/auth/UserProfile';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProfilePageContent() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    if (isUserLoading || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <div className="animate-spin text-4xl">🚀</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <UserProfile />
        </div>
    );
}


export default function ProfilePage() {
    return (
        <FirebaseClientProvider>
            <ProfilePageContent />
        </FirebaseClientProvider>
    )
}