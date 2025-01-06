// src/components/inventory/ManufacturerTab.tsx

'use client';

import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';

const EmployeesDataGrid = dynamic(() => import('@/components/datagrid/EmployeesDataGrid'), { ssr: false });

export default function EmployeesTab() {
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'employees', 'employees')) {
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
            <EmployeesDataGrid />
        </Container>
    );
}