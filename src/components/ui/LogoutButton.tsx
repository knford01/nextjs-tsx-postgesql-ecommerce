// src/components/ui/LogoutButton.tsx

'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { userSession } from '@/db/user-data';

export default function LogoutButton({ theme, collapsed }: { theme: any, collapsed: boolean }) {
    const router = useRouter();

    const handleLogout = async () => {
        const sessionCheck = await fetch('/api/auth/session');

        if (sessionCheck.ok) {
            console.log("resonse OK");

            const session = await sessionCheck.json();
            await userSession(session.user.id, 'user_initiated');
        }

        const response = await fetch('/api/auth/logout', {
            method: 'GET',
        });

        if (response.ok) {
            router.push('/login'); // Redirect to login page after successful logout 
        }
    };

    return (
        <Box
            component="button"
            onClick={handleLogout}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: 48,
                textDecoration: 'none',
                fontWeight: 'medium',
                borderColor: 'black',
                backgroundColor: `${theme.palette.warning.main} !important`,
                color: theme.palette.text.primary,
                '&:hover': {
                    backgroundColor: `${theme.palette.warning.dark} !important`,
                    color: theme.palette.text.secondary,
                },
                width: '100%',
                transition: 'background-color 0.3s, color 0.3s',
                borderRadius: 2,
                marginRight: 1,
                marginBottom: 1,
            }}
        >
            <PowerIcon className="w-6 ml-3" />
            {!collapsed && <div>Sign Out</div>}
        </Box>
    );
}
