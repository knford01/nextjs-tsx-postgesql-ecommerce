// src/components/tasks/SettingsTab.tsx

'use client';

import Link from 'next/link';
import { useTheme } from '@mui/material';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Groups';
import { hasAccess } from '@/utils/permissions2';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const links = [
    { id: 'groups', name: 'Groups', description: 'Create and update groups', icon: <GroupIcon /> },
];

export default function SettingsDashboard() {
    const theme = useTheme();
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'tasks', 'settings')) {
            router.push('/navigation/403'); // Redirect to a 403 error page or any other appropriate route                                                                                            
        }
    }, [combinedPermissions, router]);

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
                {links.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <Link href={`/navigation/tasks/settings/${item.id}`} passHref>
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
                                            {item.icon}
                                        </Box>
                                        <Typography variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                    </Box>
                                    <hr style={{ borderColor: theme.palette.warning.main }} />
                                    <Typography variant="body2" mt={1}>
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
