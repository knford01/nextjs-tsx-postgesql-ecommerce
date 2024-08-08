// src/app/navigation/settings/page.tsx

'use client';

import SettingsDashboard from '@/components/cards/SettingsDashboard';
import { Container } from '@mui/material';

export default function Settings() {
    return (
        <Container sx={{ pt: 2 }}>
            <SettingsDashboard />
        </Container>
    );
} 
