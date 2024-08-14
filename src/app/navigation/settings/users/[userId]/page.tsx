'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Checkbox, FormControlLabel, Button } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { fetchUserById } from '@/db/user-data';
import { getAllActivePermissions, getUserPermissions, saveUserPermission } from '@/db/permissions';
import { useTheme } from '@mui/material';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { User } from '@/types/user';

interface RolePermission {
    role_id: number;
    permission_id: number;
    access: string;
}

interface Permission {
    id: number;
    area: string;
    sub_areas: string[];
    role_id: number;
    permission_id: number;
    access: string;
}

interface Role {
    id: number;
    display: string;
}

const toPascalCase = (str: string) => {
    return str
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const toLowerSnakeCase = (str: string) => {
    return str
        .replace(/\s+/g, '_')
        .toLowerCase();
};

export default function RolePermissionsPage() {
    const theme = useTheme();
    const router = useRouter();
    const { userId } = useParams();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [enabledSubAreas, setEnabledSubAreas] = useState<{ [key: string]: boolean }>({});
    const [selectedSubAreas, setSelectedSubAreas] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const fetchRoleAndPermissions = async () => {
            if (userId) {
                const userResult = await fetchUserById(String(userId));
                const user = userResult.rows[0]; // Extract user data from the QueryResult<User>
                setSelectedUser(user);

                const rolePermissions: RolePermission[] = await getUserPermissions(Number(userId));

                const permissionsData = await getAllActivePermissions();
                console.log(getAllActivePermissions);

                const formattedPermissions = permissionsData.map((permission: any) => {
                    const subAreas = permission.sub_areas.split(',').map((subArea: string) => toPascalCase(subArea.trim()));
                    return {
                        ...permission,
                        area: toPascalCase(permission.area),
                        sub_areas: subAreas,
                    };
                });

                // Initialize selectedSubAreas based on rolePermissions
                const initialSelectedSubAreas: { [key: string]: string[] } = {};
                rolePermissions.forEach(({ permission_id, access }) => {
                    const permission = formattedPermissions.find((perm) => perm.id === permission_id);
                    if (permission) {
                        initialSelectedSubAreas[permission.area] = access.split(',').map((subArea: string) =>
                            toPascalCase(subArea.trim())
                        );
                        setEnabledSubAreas((prev) => ({
                            ...prev,
                            [permission.area]: true,
                        }));
                    }
                });

                setPermissions(formattedPermissions);
                setSelectedSubAreas(initialSelectedSubAreas);
            } else {
                console.log("NO ID");
            }
        };
        fetchRoleAndPermissions();
    }, [userId]);

    const handleAreaCheckboxChange = (area: string) => {
        setEnabledSubAreas((prev) => ({
            ...prev,
            [area]: !prev[area],
        }));

        setSelectedSubAreas((prev) => ({
            ...prev,
            [area]: !enabledSubAreas[area] ? [] : prev[area] || [],
        }));
    };

    const handleSubAreaCheckboxChange = (area: string, subArea: string) => {
        setSelectedSubAreas((prev) => {
            const updatedSubAreas = prev[area] || [];
            if (updatedSubAreas.includes(subArea)) {
                return {
                    ...prev,
                    [area]: updatedSubAreas.filter((sa) => sa !== subArea),
                };
            } else {
                return {
                    ...prev,
                    [area]: [...updatedSubAreas, subArea],
                };
            }
        });
    };

    const handleSave = async () => {
        const selectedPermissions = permissions.map((permission) => ({
            user_id: userId,
            permission_id: permission.id,
            access: selectedSubAreas[permission.area]
                ? selectedSubAreas[permission.area].map((subArea) => toLowerSnakeCase(subArea)).join(',')
                : '',
        }));

        try {
            await saveUserPermission(selectedPermissions);
            // Redirect after 3 seconds
            showSuccessToast('Access Updated');
            router.push('/navigation/settings/users');
        } catch (error) {
            showErrorToast('Access failed to update');
        }
    };

    return (
        <Box p={1}>
            <Typography
                variant="h4"
                sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    color: `${theme.palette.primary.main} !important`,
                    textDecoration: 'underline',
                    textDecorationColor: theme.palette.warning.main,
                }}
            >
                Manage Permissions for User {selectedUser && selectedUser.first_name}
            </Typography>
            <Grid container spacing={2} mt={2}>
                {permissions.map((permission) => (
                    <Grid item xs={12} key={permission.area}>
                        <Paper elevation={3} sx={{ padding: 2, backgroundColor: `${theme.palette.secondary.main} !important`, borderBottom: `1px solid ${theme.palette.text.primary}` }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!enabledSubAreas[permission.area]}
                                        onChange={() => handleAreaCheckboxChange(permission.area)}
                                    />
                                }
                                label={
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: `${theme.palette.text.primary} !important` }}>
                                        {permission.area}
                                    </Typography>
                                }
                            />
                            <Grid container spacing={1} mt={2}>
                                {permission.sub_areas.map((subArea) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        key={subArea}
                                        sx={{
                                            color: `${theme.palette.text.primary} !important`,
                                            borderRight: `1px solid ${theme.palette.text.primary}`,
                                            borderLeft: `1px solid ${theme.palette.text.primary}`,
                                            borderBottom: `1px solid ${theme.palette.text.primary}`,
                                            borderTop: `1px solid ${theme.palette.text.primary}`,
                                        }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={!enabledSubAreas[permission.area]}
                                                    checked={selectedSubAreas[permission.area]?.includes(subArea) || false}
                                                    onChange={() => handleSubAreaCheckboxChange(permission.area, subArea)}
                                                />
                                            }
                                            label={subArea}
                                            sx={{ color: `${theme.palette.text.primary} !important` }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
                <Button
                    sx={{ ml: 2, mt: 3, backgroundColor: `${theme.palette.success.main} !important` }}
                    variant="contained"
                    onClick={handleSave}
                >
                    Save Permissions
                </Button>
            </Grid>
        </Box>
    );
}