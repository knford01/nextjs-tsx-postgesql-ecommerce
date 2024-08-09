// src/components/SettingsDashboard.tsx

'use client';

import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Link from 'next/link';
import { useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';

export default function SettingsDashboard() {
    const theme = useTheme();

    const settingsItems = [
        { id: 'roles_access', name: 'Role Access', description: 'Assign roles their access levels', icon: <SecurityIcon /> },
        { id: 'access', name: 'System Access', description: 'Define system-wide access', icon: <SettingsIcon /> },
        { id: 'users', name: 'Users', description: 'Manage users and their permissions', icon: <PeopleIcon /> },
        { id: 'roles', name: 'User Roles', description: 'Manage user roles', icon: <SecurityIcon /> },
    ];

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
                {settingsItems.map(item => (
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
                                    <hr></hr>
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
