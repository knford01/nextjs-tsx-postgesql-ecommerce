import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { fetchContactsByCustomerId } from '@/db/contact-data';
import { createCustomerEmail } from '@/db/customer-data';

interface CustomerEmailModalProps {
    open: boolean;
    handleClose: () => void;
    customer_id: string;
    onSave: () => void; // Callback to trigger when the email is saved
}

const CustomerEmailModal: React.FC<CustomerEmailModalProps> = ({ open, handleClose, customer_id, onSave }) => {
    const theme = useTheme();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [isUnusable, setIsUnusable] = useState(false);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const contactData = await fetchContactsByCustomerId(customer_id);
                if (contactData.length === 0) {
                    setIsUnusable(true);
                    showErrorToast('No contacts found for this customer.');
                } else {
                    setContacts(contactData);
                    setIsUnusable(false);
                }
            } catch (error) {
                showErrorToast('Failed to load contacts.');
                setIsUnusable(true);
            }
        };

        loadContacts();
    }, [customer_id]);

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(e.target.value);
    };

    const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBody(e.target.value);
    };

    const handleRecipientsChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setRecipients(e.target.value as string[]);
    };

    const handleSubmit = async () => {
        if (subject.trim() === '' || body.trim() === '' || recipients.length === 0) {
            showErrorToast('Please fill in all fields and select at least one recipient.');
            return;
        }

        try {
            await createCustomerEmail(customer_id, {
                subject,
                body,
                recipients: recipients.join(',')
            });
            showSuccessToast('Email Sent Successfully');
            setSubject('');
            setBody('');
            setRecipients([]);
            handleClose();
            onSave(); // Trigger the save callback to refresh the parent component data
        } catch (error) {
            showErrorToast('Failed to send email.');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 500 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    Send Email
                </Typography>

                {isUnusable ? (
                    <Typography color="error" sx={{ textAlign: 'center' }}>
                        This modal is unusable because no contacts were found for this customer.
                    </Typography>
                ) : (
                    <>
                        <StyledTextField
                            label="Subject"
                            value={subject}
                            onChange={handleSubjectChange}
                            required
                            fullWidth
                            margin="normal"
                        />

                        <StyledTextField
                            label="Recipients"
                            select
                            SelectProps={{
                                multiple: true,
                                value: recipients,
                                onChange: handleRecipientsChange,
                                renderValue: (selected: any) => (selected as string[]).join(', ')
                            }}
                            required
                            fullWidth
                            margin="normal"
                        >
                            {contacts.map((contact) => (
                                <MenuItem key={contact.id} value={contact.id.toString()}>
                                    {contact.first_name} {contact.last_name} ({contact.email})
                                </MenuItem>
                            ))}
                        </StyledTextField>


                        <StyledTextField
                            label="Body"
                            value={body}
                            onChange={handleBodyChange}
                            required
                            multiline
                            rows={4}
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
                                Send
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
                    </>
                )}
            </Paper>
        </Modal>
    );
};

export default CustomerEmailModal;
