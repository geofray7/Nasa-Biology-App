'use client'
import { SignUpForm } from '@/components/auth/SignUpForm';
import { FirebaseClientProvider } from '@/firebase';

export default function SignUpPage() {
    return (
        <FirebaseClientProvider>
            <div className="min-h-screen flex items-center justify-center bg-background">
                <SignUpForm />
            </div>
        </FirebaseClientProvider>
    )
}
