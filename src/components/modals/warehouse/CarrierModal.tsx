import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField, StyledCheckbox } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createCarrier, updateCarrier, fetchCarrierById } from '@/db/warehouse-data';

interface CarrierModalProps {
    open: boolean;
    handleClose: () => void;
    carrierId?: number; // Optional carrier ID for editing
    loadCarriers: () => void;  // Callback to trigger when the carrier is saved
}

const CarrierModal: React.FC<CarrierModalProps> = ({ open, handleClose, carrierId, loadCarriers }) => {
    const theme = useTheme();

    const emptyCarrierData = useMemo(() => ({
        name: '',
        scac: '',
        active: true,
    }), []);

    const [carrierData, setCarrierData] = useState(emptyCarrierData);

    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        if (carrierId) {
            const loadCarrierData = async () => {
                try {
                    const data = await fetchCarrierById(carrierId);
                    setCarrierData(data);
                } catch (error) {
                    showErrorToast('Failed to load carrier data');
                }
            };
            loadCarrierData();
        } else {
            // Reset to empty carrier data when creating a new carrier
            setCarrierData(emptyCarrierData);

        }
    }, [carrierId, emptyCarrierData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setCarrierData((prevData) => ({
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
            const value = carrierData[field as keyof typeof carrierData];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: typeof carrierData.name === 'string' && carrierData.name.trim() === '',
            }));
            return;
        }

        try {
            if (carrierId) {
                await updateCarrier(carrierId, carrierData.name, carrierData.scac, carrierData.active);
                showSuccessToast('Carrier Updated Successfully');
            } else {
                await createCarrier(carrierData.name, carrierData.scac, carrierData.active);
                showSuccessToast('Carrier Created Successfully');
            }
            handleClose();
            loadCarriers();
        } catch (error) {
            showErrorToast('Failed to Save Carrier');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {carrierId ? 'Edit Carrier' : 'Create Carrier'}
                </Typography>

                <StyledTextField
                    label="Name"
                    name="name"
                    value={carrierData.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="SCAC"
                    name="scac"
                    value={carrierData.scac}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledSelectField
                    label="Active"
                    name="active"
                    value={carrierData.active}
                    onChange={handleInputChange}
                    options={[
                        { value: 'true', display: 'Active' },
                        { value: 'false', display: 'Inactive' }
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

export default CarrierModal;
