import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField, StyledCheckbox } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createDepartment, updateDepartment, fetchDepartmentById } from '@/db/employee-settings-data';

interface DepartmentModalProps {
    open: boolean;
    handleClose: () => void;
    departmentId?: number;
    loadDepartments: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ open, handleClose, departmentId, loadDepartments }) => {
    const theme = useTheme();

    const emptyDepartmentData = useMemo(() => ({
        name: '',
        active: true,
    }), []);

    const [departmentData, setDepartmentData] = useState(emptyDepartmentData);

    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        if (departmentId) {
            const loadDepartmentData = async () => {
                try {
                    const data = await fetchDepartmentById(departmentId);
                    setDepartmentData(data);
                    console.log("departmentData: ", data);

                } catch (error) {
                    showErrorToast('Failed to load department data');
                }
            };
            loadDepartmentData();
        } else {
            // Reset to empty department data when creating a new department
            setDepartmentData(emptyDepartmentData);

        }
    }, [departmentId, emptyDepartmentData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setDepartmentData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value,
        }));

        // Basic validation
        if (['name'].includes(name)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value.trim() === '',
            }));
        }
    };

    const handleSubmit = async () => {
        const requiredFields = ['name'];

        const hasErrors = requiredFields.some((field) => {
            const value = departmentData[field as keyof typeof departmentData];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: typeof departmentData.name === 'string' && departmentData.name.trim() === '',
            }));
            return;
        }

        try {
            if (departmentId) {
                await updateDepartment(departmentId, departmentData.name, departmentData.active);
                showSuccessToast('Department Updated Successfully');
            } else {
                await createDepartment(departmentData.name, departmentData.active);
                showSuccessToast('Department Created Successfully');
            }
            handleClose();
            loadDepartments();
        } catch (error) {
            showErrorToast('Failed to Save Department');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {departmentId ? 'Edit Department' : 'Create Department'}
                </Typography>

                <StyledTextField
                    label="Name"
                    name="name"
                    value={departmentData.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledSelectField
                    label="Active"
                    name="active"
                    value={(departmentData.active ?? true).toString()}
                    onChange={(e) => setDepartmentData((prev) => ({
                        ...prev,
                        active: e.target.value === 'true',
                    }))}
                    options={[
                        { value: 'true', display: 'True' },
                        { value: 'false', display: 'False' }
                    ]}
                />

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.success.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` },
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` },
                        }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default DepartmentModal;
