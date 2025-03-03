import React, { useState, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledTextField } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { updateProject } from '@/db/project-data';

interface ProjectContactModalProps {
    open: boolean;
    handleClose: () => void;
    project: {
        id: number;
        contact_name: string | null;
        contact_phone: string | null;
        contact_email: string | null;
    };
    onSave: () => void;
}

const ProjectContactModal: React.FC<ProjectContactModalProps> = ({ open, handleClose, project, onSave }) => {
    const theme = useTheme();

    const emptyContactData = useMemo(() => ({
        contact_name: project.contact_name || '',
        contact_phone: project.contact_phone || '',
        contact_email: project.contact_email || '',
    }), [project]);

    const [contactData, setContactData] = useState(emptyContactData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setContactData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await updateProject(project.id, contactData);
            showSuccessToast('Contact Updated Successfully');
            handleClose();
            onSave();
        } catch (error) {
            showErrorToast('Failed to Save Contact');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    Edit Contact
                </Typography>

                <StyledTextField
                    label="Contact Name"
                    name="contact_name"
                    value={contactData.contact_name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Contact Phone"
                    name="contact_phone"
                    value={contactData.contact_phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Contact Email"
                    name="contact_email"
                    value={contactData.contact_email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
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

export default ProjectContactModal;
