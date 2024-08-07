// src/pages/dashboard.tsx

'use client';

import useSession from '@/hooks/useSession';

export default function Dashboard() {
    const { user, loading } = useSession();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Not authenticated</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.first_name} {user.last_name}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role_display}</p>
            <p>Status: {user.active ? 'Active' : 'Inactive'}</p>
        </div>
    );
}
