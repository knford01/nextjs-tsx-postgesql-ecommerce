// app/navigation/settings/addresses/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';

// Dynamically import AddressDataGrid with SSR disabled
const AddressDataGrid = dynamic(() => import('@/components/datagrid/AddressesDataGrid'), { ssr: false });

export default function Page() {
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'settings', 'addresses')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    return (
        <Container
            maxWidth={false}
            sx={{
                m: 0,
                mt: 5,
                width: 'auto',
                height: 'auto',
                transition: 'all 0.3s',
            }}
        >
            <AddressDataGrid />
        </Container>
    );
}
