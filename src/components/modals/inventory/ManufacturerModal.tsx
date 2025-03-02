import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField, StyledCheckbox } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createManufacturer, updateManufacturer, fetchManufacturerById } from '@/db/item-data';

interface ManufacturerModalProps {
    open: boolean;
    handleClose: () => void;
    manufacturerId?: number; // Optional manufacturer ID for editing
    loadManufacturers: () => void;  // Callback to trigger when the manufacturer is saved
}

const ManufacturerModal: React.FC<ManufacturerModalProps> = ({ open, handleClose, manufacturerId, loadManufacturers }) => {
    const theme = useTheme();

    const emptyManufacturerData = useMemo(() => ({
        name: '',
        contact_name: '',
        contact_phone: '',
        active: true,
    }), []);

    const [manufacturerData, setManufacturerData] = useState(emptyManufacturerData);

    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        if (manufacturerId) {
            const loadManufacturerData = async () => {
                try {
                    const data = await fetchManufacturerById(manufacturerId);
                    setManufacturerData(data);
                } catch (error) {
                    showErrorToast('Failed to load manufacturer data');
                }
            };
            loadManufacturerData();
        } else {
            // Reset to empty manufacturer data when creating a new manufacturer
            setManufacturerData(emptyManufacturerData);

        }
    }, [manufacturerId, emptyManufacturerData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setManufacturerData((prevData) => ({
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
            const value = manufacturerData[field as keyof typeof manufacturerData];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: typeof manufacturerData.name === 'string' && manufacturerData.name.trim() === '',
            }));
            return;
        }

        try {
            if (manufacturerId) {
                await updateManufacturer(manufacturerId, manufacturerData);
                showSuccessToast('Manufacturer Updated Successfully');
            } else {
                await createManufacturer(manufacturerData);
                showSuccessToast('Manufacturer Created Successfully');
            }
            handleClose();
            loadManufacturers();
        } catch (error) {
            showErrorToast('Failed to Save Manufacturer');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {manufacturerId ? 'Edit Manufacturer' : 'Create Manufacturer'}
                </Typography>

                <StyledTextField
                    label="Name"
                    name="name"
                    value={manufacturerData.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Contact Name"
                    name="contact_name"
                    value={manufacturerData.contact_name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Contact Phone"
                    name="contact_phone"
                    value={manufacturerData.contact_phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledSelectField
                    label="Active"
                    name="active"
                    value={manufacturerData.active}
                    onChange={handleInputChange}
                    options={[
                        { value: 'Yes', display: 'Active' },
                        { value: 'No', display: 'Inactive' }
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

export default ManufacturerModal;
