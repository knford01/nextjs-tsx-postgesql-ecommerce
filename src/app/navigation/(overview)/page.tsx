// src/pages/dashboard.tsx

'use client';

import useSession from '@/hooks/useSession';

export default function Dashboard() {
    const { user } = useSession();
    console.log(user);

    if (!user) {
        return (
            <div>
                {/* <LogoutButton /> */}
                <p>Not authenticated</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: 20 }}>
            <h1>Welcome, {user.first_name} {user.last_name}</h1>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role_display}</p>
            <p>Status: {user.active ? 'Active' : 'Inactive'}</p>
        </div>
    );
} 
