'use client';

import { useState, useEffect } from 'react';
import { StyledTextField } from '@/styles/StyledTextField';
import { createPermission, getAllPermissions, updatePermission, deletePermission } from '@/db/permissions';
import { Box, Grid, Card, CardContent, Typography, Button, Modal, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material';

const SystemAccess = () => {
    const theme = useTheme();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [area, setArea] = useState('');
    const [subAreas, setSubAreas] = useState('');

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await getAllPermissions();
                setPermissions(data); // Now TypeScript knows this is Permission[]
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    const handleCreatePermission = () => {
        setEditingPermission(null); // Clear any existing editing state
        setArea('');
        setSubAreas('');
        setIsModalOpen(true);
    };

    const handleEditPermission = (permission: Permission) => {
        setEditingPermission(permission);
        setArea(permission.area);
        setSubAreas(permission.sub_areas);
        setIsModalOpen(true);
    };

    const handleSavePermission = async () => {
        try {
            const formattedArea = toPascalCase(area);
            const formattedSubAreas = subAreas.split(',').map(subArea => toPascalCase(subArea.trim())).join(',');

            let updatedPermissions: Permission[] = []; // Explicitly type the array

            if (editingPermission) {
                const updatedPermission = await updatePermission(editingPermission.id, formattedArea, formattedSubAreas) as Permission;
                updatedPermissions = permissions.map((perm) => (perm.id === editingPermission.id ? updatedPermission : perm)) as Permission[];
            } else {
                const newPermission = await createPermission(formattedArea, formattedSubAreas) as Permission;
                updatedPermissions = [...permissions, newPermission] as Permission[];
            }

            setPermissions(updatedPermissions); // Set state with the explicitly typed array
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving permission:', error);
        }
    };


    const toPascalCase = (str: string) => {
        return str
            .replace(/_/g, ' ')  // Replace underscores with spaces (if any)
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) // Convert to Pascal Case
            .replace(/\s+/g, ''); // Remove spaces
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    onClick={handleCreatePermission}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Create Permission
                </Button>
            </Box>
            <Grid container spacing={4}>
                {permissions.map(permission => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={permission.id}>
                        <Card
                            className="cursor-pointer"
                            onClick={() => handleEditPermission(permission)}
                            sx={{
                                backgroundColor: 'secondary.main',
                                color: 'text.primary',
                                '&:hover': { backgroundColor: 'action.hover' },
                            }}
                        >
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                                        {toPascalCase(permission.area)}
                                    </Typography>
                                    {permission.active == 1 ? (
                                        <CheckCircleIcon color="inherit" />
                                    ) : (
                                        <CancelIcon color="inherit" />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Paper style={{ margin: 'auto', marginTop: '10%', padding: 20, maxWidth: 600 }}>
                    <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">
                        {editingPermission ? 'Edit Permission' : 'Create New Permission'}
                    </Typography>
                    <StyledTextField
                        label="Area"
                        value={area}
                        onChange={(e: any) => setArea(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <StyledTextField
                        label="Sub Areas (comma separated)"
                        value={subAreas}
                        onChange={(e: any) => setSubAreas(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={8}
                    />
                    <Button onClick={handleSavePermission} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Save
                    </Button>
                </Paper>
            </Modal>
        </Box>
    );
};

export default SystemAccess;