// app/ui/components/modals/UserModals.tsx

import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { setUserStatus, fetchUserRoles, createUser, updateUser } from '@/db/user-data';
import Image from 'next/image';
import { showSuccessToast } from '../ui/ButteredToast';

interface UserModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    id?: string;
    row?: any;
}

export const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSubmit, id, row }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState(row || {});
    const [roles, setRoles] = useState<{ id: number, display: string }[]>([]);
    const [errors, setErrors] = useState({ first_name: false, last_name: false, email: false, password: false, role: false });

    useEffect(() => {
        setFormData(row || {});
    }, [row]);

    useEffect(() => {
        const fetchRoles = async () => {
            const roles = await fetchUserRoles(1);
            setRoles(roles);
        };
        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const commonTextFieldStyles = {
        InputProps: {
            sx: {
                '& .MuiInputBase-input': {
                    bgcolor: `${theme.palette.text.primary} !important`,
                    color: `${theme.palette.primary.main} !important`,
                    height: '2.5em',
                    padding: '10px 14px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                },
            },
        },
        InputLabelProps: {
            sx: {
                '&.MuiInputLabel-shrink': {
                    color: `${theme.palette.primary.main} !important`,
                    transform: 'translate(.5, -2.5px) scale(0.75)',
                },
                '&:not(.MuiInputLabel-shrink)': {
                    transform: 'translate(14px, 10px) scale(1)',
                },
            },
        },
        sx: {
            mt: 2,
            '& .MuiInputLabel-root': {
                color: `${theme.palette.primary.main} !important`,
            },
        },
    };

    const selectTextFieldStyles = {
        ...commonTextFieldStyles,
        SelectProps: {
            MenuProps: {
                PaperProps: {
                    sx: {
                        bgcolor: `${theme.palette.background.paper} !important`,
                        '& .MuiMenuItem-root': {
                            color: `${theme.palette.primary.main} !important`,
                            '&:hover': {
                                bgcolor: `${theme.palette.action.hover} !important`,
                                color: `${theme.palette.text.primary} !important`,
                            },
                        },
                    },
                },
            },
            sx: {
                backgroundColor: `${theme.palette.text.primary} !important`,
                color: `${theme.palette.primary.main} !important`,
                height: '2.5em',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                '& .MuiSelect-select': {
                    color: `${theme.palette.primary.main} !important`,
                },
            },
        },
    };

    const getActiveValue = () => {
        if (formData.active === 'Yes') return '1';
        if (formData.active === 'No') return '0';
        return '';
    };

    const handleSubmit = async () => {
        const newErrors = {
            first_name: !formData.first_name,
            last_name: !formData.last_name,
            email: !formData.email,
            password: !formData.password,
            role: !formData.role,
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            const data = {
                ...formData,
                active: getActiveValue(),
            };

            if (id) {
                await updateUser(id, data);
                showSuccessToast('User Updated');
            } else {
                await createUser(data);
                showSuccessToast('User created');
            }

            onSubmit(data);
            onClose();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: `${theme.palette.background.paper} !important`, margin: 'auto', mt: '6vh', width: 400, borderRadius: 2 }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">{id ? 'Edit User' : 'Add User'}</Typography>

                <TextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    required
                    error={errors.first_name}
                    helperText={errors.first_name ? 'First name is required' : ''}
                    fullWidth
                    {...commonTextFieldStyles}
                />
                <TextField
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name || ''}
                    onChange={handleChange}
                    fullWidth
                    {...commonTextFieldStyles}
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    required
                    error={errors.last_name}
                    helperText={errors.last_name ? 'Last name is required' : ''}
                    fullWidth
                    {...commonTextFieldStyles}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                    error={errors.email}
                    helperText={errors.email ? 'Email is required' : ''}
                    fullWidth
                    {...commonTextFieldStyles}
                />

                <TextField
                    label="Password"
                    name="password"
                    value={id ? 'Enter New Password to Change' : ''}
                    onChange={handleChange}
                    required
                    error={errors.password}
                    helperText={errors.password ? 'Password is required' : ''}
                    fullWidth
                    {...commonTextFieldStyles}
                />

                <TextField
                    select
                    label="Role"
                    name="role"
                    value={formData.role || ''}
                    onChange={handleChange}
                    required
                    error={errors.role}
                    helperText={errors.role ? 'Role is required' : ''}
                    fullWidth
                    {...selectTextFieldStyles}
                >
                    {roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>
                            {role.display}
                        </MenuItem>
                    ))}
                </TextField>

                {formData.avatar && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Image
                            src={formData.avatar}
                            alt="Avatar"
                            width={150}
                            height={150}
                            style={{
                                borderRadius: '50%',
                                border: `2px solid ${theme.palette.primary.main}`,
                                objectFit: 'cover', // Replaces imageRendering: 'auto' 
                            }}
                        />
                    </Box>
                )}

                <Box sx={{ m: 2 }}>
                    <Button variant="contained" component="label" fullWidth sx={{ backgroundColor: `${theme.palette.info.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.info.dark} !important` } }}>
                        Upload New Image
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                </Box>

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: `${theme.palette.success.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` } }} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: `${theme.palette.warning.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` } }} onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

interface UserStatusModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userId: string;
    curStatus: number;
}

export const UserStatusModal: React.FC<UserStatusModalProps> = ({ open, onClose, onConfirm, userId, curStatus }) => {
    const theme = useTheme();

    const handleConfirm = async () => {
        await setUserStatus(userId, curStatus === 1 ? 0 : 1);
        showSuccessToast('User Status Updated');
        onConfirm();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: `${theme.palette.background.paper} !important`, margin: 'auto', mt: '20vh', width: 400, borderRadius: 2 }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">
                    {curStatus === 1 ? 'Confirm Deactivation' : 'Confirm Activation'}
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'center', color: `${theme.palette.primary.main} !important` }}>
                    {curStatus === 1 ? 'Are you sure you want to deactivate this user?' : 'Are you sure you want to activate this user?'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.success.main} !important`, color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.success.dark} !important`,
                            },
                        }} onClick={handleConfirm}>Yes</Button>
                    <Button variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`, color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.warning.dark} !important`,
                            },
                        }} onClick={onClose}>No</Button>
                </Box>
            </Box>
        </Modal>
    );
};
