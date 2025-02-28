// src/app/navigation/employees/settings/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect users to /navigation/employees
        router.push('/navigation/employees');
    }, [router]);

    return null;
}
