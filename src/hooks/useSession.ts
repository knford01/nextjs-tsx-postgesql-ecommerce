// src/hooks/useSession.ts

import { useEffect, useState } from 'react';
import { User } from '@/types/user'; // Import the User type

export default function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const response = await fetch('/api/auth/session');

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }

            setLoading(false);
        };

        fetchSession();
    }, []);

    return { user, loading };
}
