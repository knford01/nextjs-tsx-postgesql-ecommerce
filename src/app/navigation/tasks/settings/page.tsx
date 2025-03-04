// src/app/navigation/tasks/settings/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect users to /navigation/tasks
        router.push('/navigation/tasks');
    }, [router]);

    return null; // The page won't render anything as it redirects immediately
}
