import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { StyledTextField } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createWarehouse, updateWarehouse, fetchWarehouseById } from '@/db/warehouse-data'; // Adjusted import
import { useRouter } from 'next/navigation';

interface WarehouseModalProps {
    open: boolean;
    handleClose: () => void;
    warehouseId?: any; // Optional warehouse ID for editing
    onSave: () => void;
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({ open, handleClose, warehouseId, onSave }) => {
    const theme = useTheme();
    const router = useRouter();

    const [warehouseData, setWarehouseData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '', // Ensure this matches type
        contact_name: '',
        contact_phone: '',
        country: 'US', // Default value if needed
        active: true, // Ensure this matches type
        date_created: new Date().toISOString(), // Default or current date
    });

    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        if (warehouseId) {
            // Fetch warehouse data if editing
            const loadWarehouseData = async () => {
                try {
                    const data = await fetchWarehouseById(warehouseId);
                    setWarehouseData(prevData => ({
                        ...prevData,
                        name: data.name || '',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        zip: data.zip || '',
                        contact_name: data.contact_name || '',
                        contact_phone: data.contact_phone || '',
                        country: data.country || 'US',
                        active: data.active || true,
                        date_created: data.date_created || new Date().toISOString(),
                    }));
                } catch (error) {
                    showErrorToast('Failed to load warehouse data');
                }
            };
            loadWarehouseData();
        }
    }, [warehouseId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Convert 'active' from string to boolean if necessary
        setWarehouseData((prevData) => ({
            ...prevData,
            [name]: name === 'active' ? (value === 'true') : value,
        }));

        if (name === 'name' && value.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, name: true }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, name: false }));
        }
    };

    const handleSubmit = async () => {
        if (warehouseData.name.trim() === '') {
            setErrors((prevErrors) => ({ ...prevErrors, name: true }));
            return;
        }

        // Convert active from number to boolean if necessary
        const formattedWarehouseData: Omit<Warehouse, 'id'> = {
            name: warehouseData.name,
            address: warehouseData.address,
            city: warehouseData.city,
            state: warehouseData.state,
            zip: warehouseData.zip,
            contact_name: warehouseData.contact_name,
            contact_phone: warehouseData.contact_phone,
            country: warehouseData.country,
            active: warehouseData.active, // No conversion needed if it's already boolean
            date_created: new Date().toISOString(), // Use current date/time
        };

        try {
            if (warehouseId) {
                await updateWarehouse(warehouseId, formattedWarehouseData); // Update warehouse
                showSuccessToast('Warehouse Updated Successfully');
            } else {
                const newWarehouseId = await createWarehouse(formattedWarehouseData); // Create warehouse
                showSuccessToast('Warehouse Created Successfully');
                router.push(`/navigation/warehouses/${newWarehouseId}`); // Redirect to new warehouse profile
            }
            handleClose();
            onSave(); // Trigger the save callback
        } catch (error) {
            showErrorToast('Failed to Save Warehouse');
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
                    {warehouseId ? 'Edit Warehouse' : 'Create Warehouse'}
                </Typography>

                <StyledTextField
                    label="Name"
                    name="name"
                    value={warehouseData.name}
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
                    value={warehouseData.address}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="City"
                    name="city"
                    value={warehouseData.city}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="State"
                    name="state"
                    value={warehouseData.state}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Postal"
                    name="zip"
                    type="number" // Ensure this is number type
                    value={warehouseData.zip}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Contact Name"
                    name="contact_name"
                    value={warehouseData.contact_name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Contact Phone"
                    name="contact_phone"
                    value={warehouseData.contact_phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="Country"
                    name="country"
                    value={warehouseData.country}
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

export default WarehouseModal;
