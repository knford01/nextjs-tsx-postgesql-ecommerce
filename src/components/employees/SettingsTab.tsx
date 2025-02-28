// src/components/employees/SettingsTab.tsx

'use client';

import Link from 'next/link';
import { useTheme } from '@mui/material';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { hasAccess } from '@/utils/permissions2';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const links = [
    { id: 'departments', name: 'Departments', description: 'Manage Departments', icon: <BuildingOfficeIcon className="w-6 h-6 text-white" /> },
];

export default function SettingsDashboard() {
    const theme = useTheme();
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'employees', 'settings')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
                {links.map((setting) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={setting.id}>
                        <Link href={`/navigation/employees/settings/${setting.id}`} passHref>
                            <Card
                                className="cursor-pointer"
                                sx={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.text.primary,
                                    '&:hover': { backgroundColor: theme.palette.action.hover },
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Box mr={2}>
                                            {setting.icon}
                                        </Box>
                                        <Typography variant="h5" component="div">
                                            {setting.name}
                                        </Typography>
                                    </Box>
                                    <hr style={{ borderColor: theme.palette.warning.main }} />
                                    <Typography variant="body2" mt={1}>
                                        {setting.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
