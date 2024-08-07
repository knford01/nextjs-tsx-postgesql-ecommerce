// app/navigation/settings/users/page.tsx

import React from 'react';
import Container from '@mui/material/Container';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the UserDataGrid component
const UserDataGrid = dynamic(() => import('@/components/datagrid/UserDataGrid'), { ssr: false });

export const metadata: Metadata = {
    title: 'Users',
};

export default function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
        id?: string;
    };
}) {
    return (
        <Container maxWidth="xl" sx={{ m: 0, mt: 5, width: '100%', height: '85%' }}>
            <UserDataGrid filterId={searchParams?.id} />
        </Container>
    );
} 
