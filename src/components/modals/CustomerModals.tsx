import React, { useState } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createCustomer } from '@/db/customer-data';
import { useRouter } from 'next/navigation';

interface CustomerModalProps {
    open: boolean;
    handleClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ open, handleClose }) => {
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
    });

    const [errors, setErrors] = useState({
        name: false,
    });

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

    const handleSubmit = async () => {
        if (customerData.name.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, name: true }));
            return;
        }

        try {
            const customerId = await createCustomer(customerData); // Get the new customer ID
            showSuccessToast('Customer Created Successfully');
            handleClose();
            router.push(`/navigation/customers/${customerId}`); // Redirect to the customer's profile page
        } catch (error) {
            showErrorToast('Failed to Create Customer');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {'Create Customer'}
                </Typography>
                <StyledTextField
                    label="Name"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
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
