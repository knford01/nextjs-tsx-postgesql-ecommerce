// app/navigation/settings/addresses/page.tsx

import React from 'react';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';

const AddressDataGrid = dynamic(() => import('@/components/datagrid/AddressesDataGrid'), { ssr: false });

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
        <Container
            maxWidth={false}
            sx={{
                m: 0,
                mt: 5,
                width: 'auto', // Ensure it takes full width of the parent container
                height: 'auto',
                transition: 'all 0.3s', // Transition for smooth resizing
            }}
        >
            <AddressDataGrid />
        </Container>
    );
}
