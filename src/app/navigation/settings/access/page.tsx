// src/app/navigation/settings/access/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { fetchUserRoles } from '@/db/user-data';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';

export default function RolesPage() {
    const theme = useTheme();
    const router = useRouter();
    const [roles, setRoles] = useState<UserRole[]>([]);
    const combinedPermissions = useCombinedPermissions();

    const fetchRoles = async () => {
        const rolesData = await fetchUserRoles();
        setRoles(rolesData);
    };

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'settings', 'access')) {
            router.push('/navigation/403');
        } else {
            fetchRoles();
        }
    }, [combinedPermissions, router]);

    const openPage = (role: UserRole) => {
        router.push(`/navigation/settings/access/${role.id}`);
    };

    return (
        <Box p={4}>
            <Grid container spacing={2}>
                {roles.map(role => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={role.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: 2,
                                backgroundColor: role.active
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    backgroundColor: role.active
                                        ? theme.palette.success.dark
                                        : theme.palette.warning.dark,
                                },
                                cursor: 'pointer'
                            }}
                            onClick={() => openPage(role)}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" style={{ flexGrow: 1 }}>
                                    {role.display}
                                </Typography>
                                {role.active == 1 ? (
                                    <CheckCircleIcon color="inherit" />
                                ) : (
                                    <CancelIcon color="inherit" />
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
