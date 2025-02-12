// app/navigation/settings/users/page.tsx

'use client';

import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';

const UserDataGrid = dynamic(() => import('@/components/datagrid/UserDataGrid'), { ssr: false });

export default function Page() {
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'settings', 'users')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    return (
        <Container
            maxWidth={false}
            sx={{
                p: 0,
                m: 0,
                mt: 2,
                width: 'auto', // Ensure it takes full width of the parent container
                height: 'auto',
                transition: 'all 0.3s', // Transition for smooth resizing
            }}
        >
            <UserDataGrid />
        </Container>
    );
}
