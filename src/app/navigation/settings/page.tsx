// src/pages/dashboard.tsx

'use client';

import useSession from '@/hooks/useSession';
import LogoutButton from '@/components/ui/LogoutButton';

export default function Dashboard() {
    const { user, loading } = useSession();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return (
            <div>
                {/* <LogoutButton /> */}
                <p>Not authenticated</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: 40 }}>
            <h1>Welcome, {user.first_name} {user.last_name}</h1>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role_display}</p>
            <p>Status: {user.active ? 'Active' : 'Inactive'}</p>
            {/* <LogoutButton /> Logout button to log the user out */}
        </div>
    );
}
