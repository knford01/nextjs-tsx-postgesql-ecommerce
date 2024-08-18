'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Modal, Paper, Grid } from '@mui/material';
import { StyledTextField, StyledSelectField } from '@/styles/StyledTextField'; // Adjust the import path as necessary
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material';
import { UserRole } from '@/types/user';
import { fetchUserRoles, createRole, setUserRoles } from '@/db/user-data'; // Assuming these functions are in your data layer
import { showSuccessToast } from '@/components/ui/ButteredToast';
import { useRouter } from 'next/navigation';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';

export default function RolesPage() {
    const theme = useTheme();
    const router = useRouter();
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [formData, setFormData] = useState({ role: '', display: '', active: 1 });
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({ role: false, display: false });

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        const fetchRoles = async () => {
            const rolesData = await fetchUserRoles();
            setRoles(rolesData);
        };
        if (!hasAccess(combinedPermissions, 'settings', 'roles')) {
            router.push('/navigation/403');
        } else {
            fetchRoles();
        }
    }, [combinedPermissions, router]);

    const handleOpenModal = (role: UserRole | null = null) => {
        if (role) {
            setSelectedRole(role);
            setFormData({ role: role.role, display: role.display, active: role.active });
        } else {
            setSelectedRole(null);
            setFormData({ role: '', display: '', active: 1 });
        }
        setIsModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        const newErrors = {
            role: formData.role === '',
            display: formData.display === '',
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            if (selectedRole) {
                // Update existing role
                await setUserRoles(selectedRole.id, formData);
                showSuccessToast('Role Updated');
            } else {
                // Create new role
                await createRole(formData);
                showSuccessToast('Role Created');
            }
            setIsModalOpen(false);
            setFormData({ role: '', display: '', active: 1 });
            const rolesData = await fetchUserRoles(); // Refresh the roles list
            setRoles(rolesData);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setErrors({ role: false, display: false });
    };

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: `${theme.palette.secondary.main} !important`, color: theme.palette.text.primary }} startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    Create Role
                </Button>
            </Box>
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
                            onClick={() => handleOpenModal(role)}
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

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Paper style={{ margin: 'auto', marginTop: '10%', padding: 20, maxWidth: 400 }}>
                    <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">
                        {selectedRole ? 'Update Role' : 'Create New Role'}
                    </Typography>
                    <StyledTextField
                        label="Role Name"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        error={errors.role}
                        helperText={errors.role ? 'Role name is required' : ''}
                    />
                    <StyledTextField
                        label="Display"
                        name="display"
                        value={formData.display}
                        onChange={handleChange}
                        required
                        error={errors.display}
                        helperText={errors.display ? 'Display is required' : ''}
                    />
                    <StyledSelectField
                        label="Active"
                        name="active"
                        value={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: Number(e.target.value) })}
                        options={[
                            { value: 1, display: 'Yes' },
                            { value: 0, display: 'No' }
                        ]}
                    />
                    <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" sx={{ backgroundColor: `${theme.palette.success.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` } }} onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: `${theme.palette.warning.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` } }} onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
}
