'use client'
import { LoginForm } from '@/components/auth/LoginForm';
import { FirebaseClientProvider } from '@/firebase';

export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoginForm />
            </div>
        </FirebaseClientProvider>
    )
}
