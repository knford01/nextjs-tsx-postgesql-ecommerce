'use client';

import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import useSession from '@/hooks/useSession';
import { useCheckSession } from '../../layout/checksession';

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
    loadUsers: () => void;
}

const EmulateUser: React.FC<EmulateUserProps> = ({ row, loadUsers }) => {
    const theme = useTheme();
    const router = useRouter();
    const session = useSession();
    const checkSession = useCheckSession();
    const [isEmulating, setIsEmulating] = useState(false);

    useEffect(() => {
        if (session.user && session?.user.emulating_user_id && session.user.id === row.id) {
            setIsEmulating(true);
        }
    }, [session, row.id]);

    const handleEmulateClick = async () => {
        if (isEmulating) {
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
            loadUsers();
            setIsEmulating(false);
            checkSession();
            router.refresh();
        } else {
            window.location.href = '/navigation';

            fetch('/api/auth/emulate', {
                method: 'POST',
                body: JSON.stringify({
                    emulate: true,
                    emulating_user: session.user,
                    emulated_user: row
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(() => {
                loadUsers();
                setIsEmulating(true);
                checkSession();
            }).catch(error => console.error('Error starting emulation:', error));
        }
    };

    return (
        <Tooltip title={isEmulating ? 'Stop Emulation' : 'Emulate User'} placement="top">
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
        </Tooltip>
    );
};

export default EmulateUser;
