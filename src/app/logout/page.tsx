// src/app/logout/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    console.log('LogoutPage');

    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
            });

            if (response.ok) {
                router.push('/login'); // Redirect to login page after successful logout
            }
        };

        handleLogout();
    }, [router]);

    return null; // Optionally, you can return a loading spinner or any other UI here
}
