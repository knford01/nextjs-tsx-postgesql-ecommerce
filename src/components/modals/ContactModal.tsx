import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createContact, updateContact, fetchContactById } from '@/db/contact-data';

interface ContactModalProps {
    open: boolean;
    handleClose: () => void;
    contactId?: string; // Optional contact ID for editing
    customer_id?: number;
    onSave: () => void;  // Callback to trigger when the contact is saved
}

const ContactModal: React.FC<ContactModalProps> = ({ open, handleClose, contactId, customer_id = 0, onSave }) => {
    const theme = useTheme();

    const emptyContactData = useMemo(() => ({
        customer_id: customer_id || 0,
        main: 0,
        first_name: '',
        last_name: '',
        phone_number: '',
        ext: '',
        email: '',
        active: 1,
    }), [customer_id]);

    const [contactData, setContactData] = useState(emptyContactData);

    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        phone_number: false,
        email: false,
    });

    useEffect(() => {
        if (contactId) {
            const loadContactData = async () => {
                try {
                    const data = await fetchContactById(contactId);
                    setContactData(data);
                } catch (error) {
                    showErrorToast('Failed to load contact data');
                }
            };
            loadContactData();
        } else {
            // Reset to empty contact data when creating a new contact
            setContactData(emptyContactData);
        }
    }, [contactId, emptyContactData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setContactData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value,
        }));

        // Basic validation
        if (name === 'first_name' || name === 'last_name' || name === 'phone_number' || name === 'email') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value.trim() === '',
            }));
        }
    };

    const handleSubmit = async () => {
        const requiredFields = ['first_name', 'last_name', 'phone_number', 'email'];

        const hasErrors = requiredFields.some((field) => {
            const value = contactData[field as keyof typeof contactData];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                first_name: typeof contactData.first_name === 'string' && contactData.first_name.trim() === '',
                last_name: typeof contactData.last_name === 'string' && contactData.last_name.trim() === '',
                phone_number: typeof contactData.phone_number === 'string' && contactData.phone_number.trim() === '',
                email: typeof contactData.email === 'string' && contactData.email.trim() === '',
            }));
            return;
        }

        try {
            if (contactId) {
                await updateContact(contactId, contactData, customer_id);
                showSuccessToast('Contact Updated Successfully');
            } else {
                await createContact(contactData, customer_id);
                showSuccessToast('Contact Created Successfully');
            }
            handleClose();
            onSave(); // Trigger the save callback to refresh the parent component data
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
                    {contactId ? 'Edit Contact' : 'Create Contact'}
                </Typography>

                <StyledTextField
                    label="First Name"
                    name="first_name"
                    value={contactData.first_name}
                    onChange={handleInputChange}
                    required
                    error={errors.first_name}
                    helperText={errors.first_name ? 'First name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Last Name"
                    name="last_name"
                    value={contactData.last_name}
                    onChange={handleInputChange}
                    required
                    error={errors.last_name}
                    helperText={errors.last_name ? 'Last name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Phone Number"
                    name="phone_number"
                    value={contactData.phone_number}
                    onChange={handleInputChange}
                    required
                    error={errors.phone_number}
                    helperText={errors.phone_number ? 'Phone number is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Extension"
                    name="ext"
                    value={contactData.ext}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Email"
                    name="email"
                    value={contactData.email}
                    onChange={handleInputChange}
                    required
                    error={errors.email}
                    helperText={errors.email ? 'Email is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledSelectField
                    label="Primary Contact"
                    name="main"
                    value={contactData.main}
                    onChange={handleInputChange}
                    options={[
                        { value: 1, display: 'Yes' },
                        { value: 0, display: 'No' }
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

export default ContactModal;
