//src/components/modals/ProjectModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createProject, updateProject, fetchProjectByID, fetchProjectStatuses } from '@/db/project-data';
import { useRouter } from 'next/navigation';
import { StyledSelectField, StyledTextField } from '@/styles/inputs/StyledTextField';
import { dateToday, formatDate } from '@/functions/common';

interface ProjectModalProps {
    open: boolean;
    handleClose: () => void;
    projectId?: number;
    customerId: number;
    onSave: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ open, handleClose, projectId, customerId, onSave }) => {
    const theme = useTheme();
    const router = useRouter();
    let date = dateToday();

    const [projectInfo, setProjectInfo] = useState<any>({
        name: '',
        start_date: date,
        end_date: date,
        status: '1',
        color: theme.palette.primary.main,
        logo: '',
        scope: '',
        description: '',
    });

    const [errors, setErrors] = useState({
        name: false,
        start_date: false,
        end_date: false,
        status: false,
        color: false,
        scope: false,
        description: false,
    });

    const [statuses, setStatuses] = useState<any[]>([]);

    useEffect(() => {
        const loadProjectInfo = async () => {
            try {
                if (projectId) {
                    const data = await fetchProjectByID(projectId);
                    setProjectInfo({
                        name: data.name || '',
                        start_date: data.start_date || date,
                        end_date: data.end_date || date,
                        status: data.status || 1,
                        color: data.color || '#057dff',
                        logo: data.logo || '',
                        scope: data.scope || '',
                        description: data.description || '',
                    });
                }

                const statusData = await fetchProjectStatuses();
                const mappedStatuses = statusData.map((status: any) => ({
                    value: status.id.toString(),
                    display: status.name,
                }));
                setStatuses(mappedStatuses);
            } catch (error) {
                showErrorToast('Failed to load project data or statuses');
            }
        };

        loadProjectInfo();
    }, [projectId, date]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProjectInfo((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));

        if (value.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: true }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProjectInfo((prevData: any) => ({
                    ...prevData,
                    logo: reader.result as string, // Assuming base64 string for simplicity
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const requiredFields = ['name', 'start_date', 'end_date', 'status', 'color', 'scope', 'description'];

        const hasErrors = requiredFields.some((field) => {
            const value = projectInfo[field as keyof typeof projectInfo];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: typeof projectInfo.name === 'string' && projectInfo.name.trim() === '',
                start_date: typeof projectInfo.start_date === 'string' && projectInfo.start_date.trim() === '',
                end_date: typeof projectInfo.end_date === 'string' && projectInfo.end_date.trim() === '',
                status: typeof projectInfo.status === 'string' && projectInfo.status.trim() === '',
                color: typeof projectInfo.color === 'string' && projectInfo.color.trim() === '',
                scope: typeof projectInfo.scope === 'string' && projectInfo.scope.trim() === '',
                description: typeof projectInfo.description === 'string' && projectInfo.description.trim() === '',
            }));
            showErrorToast('Please fill out all required fields');
            return;
        }

        try {
            if (projectId) {
                await updateProject(projectId, projectInfo);
                showSuccessToast('Project Updated Successfully');
            } else {
                await createProject(customerId, projectInfo);
                showSuccessToast('Project Created Successfully');
            }
            handleClose();
            onSave();
            // if (!projectId) router.push(`/navigation/customers/projects/[project_id]/`);
        } catch (error) {
            showErrorToast('Failed to Save Project');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper
                sx={{
                    margin: 'auto',
                    marginTop: '2%',
                    padding: 2,
                    maxWidth: 600,
                    width: '90%',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    borderRadius: 2,
                }}
            >
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: theme.palette.primary.main }}
                    variant="h6"
                >
                    {projectId ? 'Edit Project' : 'Create Project'}
                </Typography>

                {projectInfo.logo && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Image
                            src={projectInfo.logo}
                            alt="Logo"
                            width={150}
                            height={150}
                            style={{
                                borderRadius: '8px',
                                border: `2px solid ${theme.palette.primary.main}`,
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                )}

                <Box sx={{ m: 2 }}>
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{
                            backgroundColor: theme.palette.info.main,
                            color: theme.palette.text.primary,
                            '&:hover': { backgroundColor: theme.palette.info.dark },
                        }}
                    >
                        Upload New Logo
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                </Box>

                <StyledTextField
                    label="Project Name"
                    name="name"
                    value={projectInfo.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formatDate(projectInfo.start_date)}
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
                    value={formatDate(projectInfo.end_date)}
                    onChange={handleInputChange}
                    required
                    error={errors.end_date}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <StyledSelectField
                    label="Status"
                    name="status"
                    value={projectInfo.status}
                    onChange={handleInputChange}
                    options={statuses}
                />

                <StyledTextField
                    label="Color"
                    name="color"
                    type="color"
                    value={projectInfo.color}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Scope"
                    name="scope"
                    value={projectInfo.scope}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Description"
                    name="description"
                    value={projectInfo.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
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
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ProjectModal;


