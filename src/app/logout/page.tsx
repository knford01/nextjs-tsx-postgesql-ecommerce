// src/app/logout/page.tsx

'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userSession } from '@/db/user-data';

export default function LogoutPage() {
    // console.log('LogoutPage');

    const router = useRouter();

    useEffect(() => {

        const checkSession = async () => {
            const response = await fetch('/api/auth/session');

            if (response.ok) {
                console.log("resonse OK");

                const session = await response.json();
                await userSession(session.user.id, 'user_initiated');
            }
        };
        checkSession();

        const handleLogout = async () => {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
            });

            if (response.ok) {
                router.push('/login');
            }
        };

        handleLogout();
    }, [router]);

    return null;
} 
