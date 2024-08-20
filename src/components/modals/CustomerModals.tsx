import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createCustomer, updateCustomer, fetchCustomerById } from '@/db/customer-data';
import { useRouter } from 'next/navigation';

interface CustomerModalProps {
    open: boolean;
    handleClose: () => void;
    customerId?: number; // Optional customer ID for editing
    onSave: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ open, handleClose, customerId, onSave }) => {
    const theme = useTheme();
    const router = useRouter();

    const [customerData, setCustomerData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        avatar: '', // New field for avatar
    });

    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        if (customerId) {
            // Fetch customer data if editing
            const loadCustomerData = async () => {
                try {
                    const data = await fetchCustomerById(customerId);
                    setCustomerData(prevData => ({
                        ...prevData,
                        name: data.name || '',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        zip: data.zip || '',
                        phone: data.contact_phone || '',
                        email: data.contact_email || '',
                        avatar: data.avatar || '',
                    }));
                } catch (error) {
                    showErrorToast('Failed to load customer data');
                }
            };
            loadCustomerData();
        }
    }, [customerId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'name' && value.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, name: true }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, name: false }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCustomerData((prevData) => ({
                    ...prevData,
                    avatar: reader.result as string, // Assuming base64 string for simplicity
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (customerData.name.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, name: true }));
            return;
        }

        try {
            if (customerId) {
                await updateCustomer(customerId, customerData); // Update customer
                showSuccessToast('Customer Updated Successfully');
            } else {
                const newCustomerId = await createCustomer(customerData); // Create customer
                showSuccessToast('Customer Created Successfully');
                router.push(`/navigation/customers/${newCustomerId}`); // Redirect to new customer profile
            }
            handleClose();
            onSave(); // Trigger the save callback
        } catch (error) {
            showErrorToast('Failed to Save Customer');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper
                sx={{
                    margin: 'auto',
                    marginTop: '5%',
                    padding: 2,
                    maxWidth: 400,
                    width: '90%', // Make width responsive
                    maxHeight: '95vh', // Set max height
                    overflowY: 'auto',  // Enable vertical scrolling
                    borderRadius: 2,
                }}
            >
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {customerId ? 'Edit Customer' : 'Create Customer'}
                </Typography>

                {customerData.avatar && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Image
                            src={customerData.avatar}
                            alt="Avatar"
                            width={150}
                            height={150}
                            style={{
                                borderRadius: '50%',
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
                            backgroundColor: `${theme.palette.info.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.info.dark} !important` },
                        }}
                    >
                        Upload New Image
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                </Box>

                <StyledTextField
                    label="Name"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Address"
                    name="address"
                    value={customerData.address}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="City"
                    name="city"
                    value={customerData.city}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="State"
                    name="state"
                    value={customerData.state}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Postal"
                    name="zip"
                    value={customerData.zip}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Phone"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Email"
                    name="email"
                    value={customerData.email}
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

export default CustomerModal;
