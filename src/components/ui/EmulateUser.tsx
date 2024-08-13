'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import useSession from '@/hooks/useSession';

interface EmulateUserProps {
    row: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        role_display: string;
        avatar: string;
        active: string;
    };
}

const EmulateUser: React.FC<EmulateUserProps> = ({ row }) => {
    const theme = useTheme();
    const router = useRouter();
    const session = useSession();
    const [isEmulating, setIsEmulating] = useState(false);

    console.log(session);


    useEffect(() => {
        if (session.user && session?.user.emulating_user_id && session.user.id === row.id) {
            setIsEmulating(true);
        }
    }, [session, row.id]);

    const handleEmulateClick = async () => {
        if (isEmulating) {
            // Stop emulating
            await fetch('/api/auth/emulate', {
                method: 'POST',
                body: JSON.stringify({
                    emulate: false,
                    emulating_user: session.user,
                    emulated_user: [],
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsEmulating(false);
        } else {
            // Start emulating
            await fetch('/api/auth/emulate', {
                method: 'POST',
                body: JSON.stringify({
                    emulate: true,
                    emulating_user: session.user,
                    emulated_user: row
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsEmulating(true);
        }
        router.refresh(); // Refresh the page to reflect session changes
    };

    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={handleEmulateClick}
            startIcon={isEmulating ? <CancelIcon /> : <PersonIcon />}
            sx={{
                p: 1, pr: 0, mr: 1,
                backgroundColor: `${theme.palette.info.dark} !important`,
                color: `${theme.palette.text.secondary} !important`,
                borderColor: `${theme.palette.text.primary} !important`,
                '&:hover': {
                    backgroundColor: `${theme.palette.info.main} !important`,
                    color: `${theme.palette.text.primary} !important`,
                },
            }}
        >
        </Button>
    );
};

export default EmulateUser;
