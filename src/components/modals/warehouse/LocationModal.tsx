import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField, StyledCheckbox } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createWarehouseLocation, updateWarehouseLocation, fetchWarehouseLocationById } from '@/db/warehouse-data';

interface LocationModalProps {
    open: boolean;
    handleClose: () => void;
    locationId?: number; // Optional location ID for editing
    warehouse_id: number; // Required warehouse ID
    loadLocations: () => void;  // Callback to trigger when the location is saved
}

const LocationModal: React.FC<LocationModalProps> = ({ open, handleClose, locationId, warehouse_id, loadLocations }) => {
    const theme = useTheme();
    const [session, setSession] = useState<any>();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const sessionData = await response.json();
                    setSession(sessionData);
                    // console.log("session: ", sessionData);
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
            }
        };

        fetchSession();
    }, []);

    const emptyLocationData = useMemo(() => ({
        name: '',
        aisle: '',
        rack: '',
        row: '',
        bin: '',
        multi_pallet: false,
        multi_item: false,
        created_user: session?.user?.id || null,
        active: true,
    }), [session]);

    const [locationData, setLocationData] = useState(emptyLocationData);

    const [errors, setErrors] = useState({
        aisle: false,
    });

    useEffect(() => {
        if (locationId) {
            const loadLocationData = async () => {
                try {
                    const data = await fetchWarehouseLocationById(locationId);
                    setLocationData(data);
                } catch (error) {
                    showErrorToast('Failed to load location data');
                }
            };
            loadLocationData();
        } else {
            // Reset to empty location data when creating a new location
            setLocationData(emptyLocationData);

        }
    }, [locationId, emptyLocationData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setLocationData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value,
        }));

        // Basic validation
        if (['aisle'].includes(name)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value.trim() === '',
            }));
        }
    };

    const handleSubmit = async () => {
        const requiredFields = ['aisle'];

        const hasErrors = requiredFields.some((field) => {
            const value = locationData[field as keyof typeof locationData];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                aisle: typeof locationData.aisle === 'string' && locationData.aisle.trim() === '',
            }));
            return;
        }

        try {
            if (locationId) {
                await updateWarehouseLocation(locationId, locationData);
                showSuccessToast('Location Updated Successfully');
            } else {
                await createWarehouseLocation(warehouse_id, locationData);
                showSuccessToast('Location Created Successfully');
            }
            handleClose();
            loadLocations();
        } catch (error) {
            showErrorToast('Failed to Save Location');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {locationId ? 'Edit Location' : 'Create Location'}
                </Typography>

                <StyledTextField
                    label="Aisle"
                    name="aisle"
                    value={locationData.aisle}
                    onChange={handleInputChange}
                    required
                    error={errors.aisle}
                    helperText={errors.aisle ? 'Aisle is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Rack"
                    name="rack"
                    value={locationData.rack}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Row"
                    name="row"
                    value={locationData.row}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Bin"
                    name="bin"
                    value={locationData.bin}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledCheckbox
                    label="Multi-Pallet"
                    checked={locationData.multi_pallet}
                    onChange={handleInputChange}
                    name="multi_pallet"
                />

                <StyledCheckbox
                    label="Multi-Item"
                    checked={locationData.multi_item}
                    onChange={handleInputChange}
                    name="multi_item"
                />

                <StyledSelectField
                    label="Active"
                    name="active"
                    value={locationData.active}
                    onChange={handleInputChange}
                    options={[
                        { value: true, display: 'Active' },
                        { value: false, display: 'Inactive' }
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

export default LocationModal;
