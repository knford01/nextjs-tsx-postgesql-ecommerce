// src/components/SettingsDashboard.tsx

'use client';

import Link from 'next/link';
import { useTheme } from '@mui/material';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { hasAccess } from '@/utils/permissions2';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const links = [
    { id: 'addresses', name: 'Addresses', description: 'Create and update system addresses', icon: <LocationOnIcon /> },
    { id: 'access', name: 'Role Access', description: 'Assign roles their access levels', icon: <LockOutlinedIcon /> },
    { id: 'permissions', name: 'System Permissions', description: 'Define system-wide permissions', icon: <SettingsIcon /> },
    { id: 'users', name: 'Users', description: 'Manage users and their individual permissions', icon: <PeopleIcon /> },
    { id: 'roles', name: 'User Roles', description: 'Manage user roles', icon: <SecurityIcon /> },
];

export default function SettingsDashboard() {
    const theme = useTheme();
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();
    const [accessibleLinks, setAccessibleLinks] = useState<any>([]);

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'settings')) {
            router.push('/navigation/403'); // Redirect to a 403 error page or any other appropriate route                                                                                            
        } else {
            const accessibleLinks = links.filter((link) => {
                return link.id === '' || hasAccess(combinedPermissions, 'settings', link.id);
            });
            setAccessibleLinks(accessibleLinks);
        }
        const accessibleLinks = links.filter((link) => {
            return link.id === '' || hasAccess(combinedPermissions, 'settings', link.id);
        });
        setAccessibleLinks(accessibleLinks);
    }, [combinedPermissions, router]);

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
                {accessibleLinks.map((item: any) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <Link href={`/navigation/settings/${item.id}`} passHref>
                            <Card
                                className="cursor-pointer"
                                sx={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.text.primary,
                                    '&:hover': { backgroundColor: theme.palette.action.hover },
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" color={theme.palette.text.primary} alignItems="center" mb={1}>
                                        <Box mr={2}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                    </Box>
                                    <hr style={{ borderColor: theme.palette.warning.main }}></hr>
                                    <Typography variant="body2" color={theme.palette.text.primary} mt={1}>
                                        {item.description}
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
