import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { fetchEmployeeByUserId, fetchEmployeeById, createEmployee, updateEmployee, fetchDepartments } from '@/db/employee-data';
import { fetchUsers, updateUser } from '@/db/user-data';

interface EmployeeModalProps {
    open: boolean;
    handleClose: () => void;
    employeeId?: any;
    loadEmployees: any;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ open, handleClose, employeeId, loadEmployees }) => {
    const theme = useTheme();

    const emptyEmployeeData = useMemo(() => ({
        user_id: '',
        department_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        avatar: '',
        role_display: '',
        email: '',
        dob: '',
        social_number: '',
        phone_number: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        personal_email: '',
        employment_type: '',
        start_date: '',
        end_date: '',
        date_created: '',
        active: true,
    }), []);

    const sanitizeEmployeeData = (data: any) => ({
        user_id: data.user_id ?? '',
        department_id: data.department_id ?? '',
        first_name: data.first_name ?? '',
        middle_name: data.middle_name ?? '',
        last_name: data.last_name ?? '',
        avatar: data.avatar ?? '',
        role_display: data.role_display ?? '',
        email: data.email ?? '',
        dob: data.dob ?? '',
        social_number: data.social_number ?? '',
        phone_number: data.phone_number ?? '',
        address1: data.address1 ?? '',
        address2: data.address2 ?? '',
        city: data.city ?? '',
        state: data.state ?? '',
        zip: data.zip ?? '',
        personal_email: data.personal_email ?? '',
        employment_type: data.employment_type ?? '',
        start_date: data.start_date ?? '',
        end_date: data.end_date ?? '',
        date_created: data.date_created ?? '',
        active: data.active ?? true,
    });

    const [employeeData, setEmployeeData] = useState<any>(emptyEmployeeData);
    const [errors, setErrors] = useState<any>({ user_id: false, department_id: false });
    const [users, setUsers] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const onClose = () => {
        setEmployeeData(emptyEmployeeData);
        handleClose();
    };

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                showErrorToast('Failed to load users.');
            }
        };
        const loadDepartments = async () => {
            try {
                const fetchedDepartments = await fetchDepartments();
                setDepartments(fetchedDepartments);
            } catch (error) {
                showErrorToast('Failed to load departments.');
            }
        };

        loadUsers();
        loadDepartments();
    }, []);

    useEffect(() => {
        if (employeeId) {
            const loadEmployeeData = async () => {
                try {
                    const result = await fetchEmployeeById(employeeId);
                    const sanitizedData = sanitizeEmployeeData(result);
                    setEmployeeData(sanitizedData);
                    // Reset user_id error if valid user_id is fetched
                    if (sanitizedData.user_id) {
                        setErrors((prevErrors: any) => ({ ...prevErrors, user_id: false }));
                    }
                } catch (error) {
                    showErrorToast('Failed to load employee data.');
                }
            };
            loadEmployeeData();
        } else {
            setEmployeeData(emptyEmployeeData);
        }
    }, [employeeId, emptyEmployeeData]);

    const handleUserChange = async (e: any) => {
        const userId = e.target.value;
        setEmployeeData((prev: any) => ({ ...prev, user_id: userId }));

        if (userId) {
            try {
                const result = await fetchEmployeeByUserId(userId);
                const sanitizedData = sanitizeEmployeeData(result);
                const { user_id, ...restSanitizedData } = sanitizedData;

                setEmployeeData((prev: any) => ({ ...prev, ...restSanitizedData }));
            } catch (error) {
                showErrorToast('Failed to load employee user data.');
            }
        }
    };


    const handleInputChange = (e: any) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'checkbox' && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value;

        setEmployeeData((prev: any) => ({
            ...prev,
            [name]: parsedValue,
        }));

        if (['user_id', 'department_id'].includes(name)) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [name]: !value || (typeof value === 'string' && value.trim() === ''),
            }));
        }
    };


    const handleSubmit = async () => {
        console.log('handleSubmit employeeData:', employeeData);

        const requiredFields = ['user_id', 'department_id'];
        const hasErrors = requiredFields.some(
            (field) => !employeeData[field] || (typeof employeeData[field] === 'string' && employeeData[field].trim() === '')
        );

        if (hasErrors) {
            setErrors((prevErrors: any) => {
                const updatedErrors = { ...prevErrors };
                requiredFields.forEach((field) => {
                    updatedErrors[field] = !employeeData[field] || (typeof employeeData[field] === 'string' && employeeData[field].trim() === '');
                });
                return updatedErrors;
            });
            return;
        }

        try {
            const session = await fetch('/api/auth/session').then(res => res.json());

            if (!session.user) {
                throw new Error("User is not authenticated");
            }

            if (employeeId) {
                await updateEmployee(employeeId, employeeData, session.user);
                showSuccessToast('Employee Updated Successfully');
            } else {
                await createEmployee(employeeData, session.user);
                showSuccessToast('Employee Created Successfully');
            }
            handleClose();
            await loadEmployees();
        } catch (error) {
            showErrorToast('Failed to save employee.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 600 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {employeeId ? 'Edit Employee' : 'Create Employee'}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Personal Details
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <StyledSelectField
                                label="User"
                                name="user_id"
                                value={employeeData.user_id ?? ''}
                                onChange={handleUserChange}
                                options={users.map((user: any) => ({ value: user.id, display: `${user.first_name} ${user.last_name}` }))}
                                required
                                error={errors.user_id}
                                helperText={errors.user_id ? 'User is required' : ''}
                                disabled={!!employeeId}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="First Name"
                                name="first_name"
                                value={employeeData.first_name ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <StyledTextField
                                label="Middle Name"
                                name="middle_name"
                                value={employeeData.middle_name ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="Last Name"
                                name="last_name"
                                value={employeeData.last_name ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <StyledTextField
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={employeeData.dob ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="Social Security Number"
                                name="social_number"
                                value={employeeData.social_number ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                placeholder="XXX-XX-XXXX"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledTextField
                                label="Email"
                                name="personal_email"
                                type="email"
                                value={employeeData.personal_email ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Employee Details
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <StyledTextField
                                label="Company Email"
                                name="email"
                                value={employeeData.email ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="Role"
                                name="role_display" // Updated field
                                value={employeeData.role_display ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Department"
                                name="department_id"
                                value={employeeData.department_id ?? ''}
                                onChange={handleInputChange}
                                options={departments.map((department: any) => ({ value: department.id, display: department.name }))}
                                required
                                error={errors.department_id}
                                helperText={errors.department_id ? 'Department is required' : ''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="Start Date"
                                name="start_date"
                                type="date"
                                value={employeeData.start_date ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <StyledTextField
                                label="End Date"
                                name="end_date"
                                type="date"
                                value={employeeData.end_date ?? ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Active"
                                name="active"
                                value={employeeData.active ?? ''}
                                onChange={handleInputChange}
                                options={[{ value: 'true', display: 'True' }, { value: 'false', display: 'False' }]}
                                required
                                fullWidth
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={6}></Grid>
                    </Grid>
                </Box>

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
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal >
    );
};

export default EmployeeModal;
