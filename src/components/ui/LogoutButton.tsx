// src/components/ui/LogoutButton.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch('/api/auth/logout', {
            method: 'GET',
        });

        console.log(response);

        if (response.ok) {
            router.push('/login'); // Redirect to login page after successful logout
        }
    };

    return (
        <button onClick={handleLogout} className="btn-logout">
            Logout
        </button>
    );
} 
