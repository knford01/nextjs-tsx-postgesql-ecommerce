//src/components/modals/TaskModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { StyledSelectField, StyledTextField } from '@/styles/inputs/StyledTextField';
import { dateToday, formatDate } from '@/functions/common';
import { createTask, updateTask, fetchTaskById } from '@/db/task-data';
import { fetchCustomers } from '@/db/customer-data';
import { fetchProjectsByCustomerId } from '@/db/project-data';

interface TaskModalProps {
    open: boolean;
    handleClose: () => void;
    taskId?: number;
    loadTasks: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, handleClose, taskId, loadTasks }) => {
    const theme = useTheme();
    let date = dateToday();
    const [customers, setCustomers] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    const initialTaskState = {
        customer_id: '',
        project_id: '',
        title: '',
        scope: '',
        original_estimate: '',
        start_date: date,
        end_date: date,
        status_id: '1',
        position: '0',
        active: 'true'
    };

    const [taskInfo, setTaskInfo] = useState<any>(initialTaskState);

    const [errors, setErrors] = useState({
        customer_id: false,
        project_id: false,
        title: false,
        scope: false,
        start_date: false,
        end_date: false,
    });

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data.map((customer: any) => ({ value: customer.id.toString(), display: customer.name })));
            } catch (error) {
                showErrorToast('Failed to load customers');
            }
        };
        loadCustomers();
    }, []);

    useEffect(() => {
        const loadTaskInfo = async () => {
            try {
                if (taskId) {
                    const data = await fetchTaskById(taskId);
                    setTaskInfo({
                        customer_id: data.customer_id || '',
                        project_id: data.project_id || '',
                        title: data.title || '',
                        scope: data.scope || '',
                        original_estimate: data.original_estimate || '',
                        start_date: data.start_date || date,
                        end_date: data.end_date || date,
                        status: data.status || 1,
                        postion: data.postion || 0,
                        active: data.active || 'true',
                    });
                    populateProjects(data.customer_id);
                }
            } catch (error) {
                showErrorToast('Failed to load task data');
            }
        };

        loadTaskInfo();
    }, [taskId, date]);

    const populateProjects = async (customerId: any) => {
        if (customerId) {
            try {
                const projectData = await fetchProjectsByCustomerId(customerId);
                setProjects(projectData.map((project: any) => ({ value: project.id, display: project.name })));
            } catch (error) {
                showErrorToast('Failed to load projects');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const stringValue = typeof value === 'string' ? value.trim() : String(value).trim();

        setTaskInfo((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: stringValue === '',
        }));

        if (name === 'customer_id') {
            populateProjects(parseInt(value as string, 10));
        }
    };

    const resetForm = () => {
        setTaskInfo(initialTaskState);
        setErrors({
            customer_id: false,
            project_id: false,
            title: false,
            scope: false,
            start_date: false,
            end_date: false,
        });
        setProjects([]); // Reset projects when customer changes
    };

    const handleCloseModal = () => {
        resetForm();
        handleClose();
    };

    const handleSubmit = async () => {
        const requiredFields = ['customer_id', 'project_id', 'title', 'scope', 'start_date', 'end_date'];

        const hasErrors = requiredFields.some((field) => {
            const value = taskInfo[field as keyof typeof taskInfo];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                customer_id: typeof taskInfo.customer_id === 'string' && taskInfo.customer_id.trim() === '',
                project_id: typeof taskInfo.project_id === 'string' && taskInfo.project_id.trim() === '',
                title: typeof taskInfo.title === 'string' && taskInfo.title.trim() === '',
                scope: typeof taskInfo.scope === 'string' && taskInfo.scope.trim() === '',
                start_date: typeof taskInfo.start_date === 'string' && taskInfo.start_date.trim() === '',
                end_date: typeof taskInfo.end_date === 'string' && taskInfo.end_date.trim() === '',
            }));
            showErrorToast('Please fill out all required fields');
            return;
        }

        try {
            const session = await fetch('/api/auth/session').then(res => res.json());

            if (!session.user) {
                throw new Error("User is not authenticated");
            }

            if (taskId) {
                await updateTask(taskId, taskInfo, session.user);
                showSuccessToast('Task Updated Successfully');
            } else {
                await createTask(taskInfo, session.user);
                showSuccessToast('Task Created Successfully');
            }
            handleCloseModal();
            loadTasks();
        } catch (error) {
            showErrorToast('Failed to Save Task');
        }
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    p: 2,
                }}
            >
                <Paper
                    style={{
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        width: '100%',
                        maxWidth: 450,
                        padding: 20,
                    }}
                >
                    <Typography
                        sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: theme.palette.primary.main }}
                        variant="h6"
                    >
                        {taskId ? 'Edit Task' : 'Create Task'}
                    </Typography>

                    <StyledSelectField
                        label="Customer"
                        name="customer_id"
                        value={taskInfo.customer_id}
                        onChange={handleInputChange}
                        options={customers}
                        required
                        disabled={taskInfo.customer_id}
                    />

                    <StyledSelectField
                        label="Project"
                        name="project_id"
                        value={taskInfo.project_id}
                        onChange={handleInputChange}
                        options={projects}
                        required
                        disabled={taskInfo.project_id}
                    />

                    <StyledTextField
                        label="Task Title"
                        name="title"
                        value={taskInfo.title}
                        onChange={handleInputChange}
                        required
                        error={errors.title}
                        helperText={errors.title ? 'Title is required' : ''}
                        fullWidth
                        margin="normal"
                    />

                    <StyledTextField
                        label="Scope"
                        name="scope"
                        value={taskInfo.scope}
                        onChange={handleInputChange}
                        required
                        error={errors.scope}
                        fullWidth
                        margin="normal"
                    />

                    <StyledTextField
                        label="Time Estimate"
                        name="original_estimate"
                        type="number"
                        value={taskInfo.original_estimate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        inputProps={{
                            step: "0.01",
                            min: "0",
                        }}
                    />

                    <StyledTextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={formatDate(taskInfo.start_date)}
                        onChange={handleInputChange}
                        required
                        error={errors.start_date}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <StyledTextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={formatDate(taskInfo.end_date)}
                        onChange={handleInputChange}
                        required
                        error={errors.end_date}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <StyledSelectField
                        label="Active"
                        name="active"
                        value={taskInfo.active ?? ''}
                        onChange={handleInputChange}
                        options={[{ value: 'true', display: 'True' }, { value: 'false', display: 'False' }]}
                        required
                        fullWidth
                        margin="normal"
                    />

                    <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.success.main,
                                color: theme.palette.text.primary,
                                '&:hover': { backgroundColor: theme.palette.success.dark },
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.warning.main,
                                color: theme.palette.text.primary,
                                '&:hover': { backgroundColor: theme.palette.warning.dark },
                            }}
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
};

export default TaskModal;


