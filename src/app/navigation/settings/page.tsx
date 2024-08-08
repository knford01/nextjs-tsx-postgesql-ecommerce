// src/app/navigation/settings/page.tsx

'use client';

import SettingsDashboard from '@/components/cards/SettingsDashboard';
import useSession from '@/hooks/useSession';
import { Container } from '@mui/material';

export default function Settings() {
    const { user, loading } = useSession();

    if (loading) return <div>Loading...</div>;

    return (
        <Container sx={{ pt: 6 }}>
            <SettingsDashboard />
        </Container>
    );
}
