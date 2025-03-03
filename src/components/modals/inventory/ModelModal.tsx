import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createModel, updateModel, fetchModelById, fetchManufacturers } from '@/db/item-data';

// The DB representation of a Model
interface DBModel {
    id: number;
    name: string;
    manufacturer_id: number;
    active: boolean;
    date_created?: Date;
    // manufacturer_name?: string; // If your DB query returns this
}

// The local form shape in the modal
interface ModelFormData {
    id?: number;
    name: string;
    manufacturer_id: number | ''; // '' means "not selected yet"
    active: 'Yes' | 'No';         // Our form uses strings instead of booleans
}

// Basic type for Manufacturer dropdown
interface Manufacturer {
    id: number;
    name: string;
}

interface ModelModalProps {
    open: boolean;
    handleClose: () => void;
    modelId?: number; // If present, we're editing
    loadModels: () => void; // Refresh the model list after saving
}

const ModelModal: React.FC<ModelModalProps> = ({ open, handleClose, modelId, loadModels }) => {
    const theme = useTheme();

    /**
     * Local form state. This shape differs from the DB shape
     * to allow for optional/empty/Yes-No fields.
     */
    const emptyModelData: ModelFormData = useMemo(
        () => ({
            name: '',
            manufacturer_id: '',
            active: 'Yes', // default to "Yes" if new
        }),
        []
    );

    const [modelData, setModelData] = useState<ModelFormData>(emptyModelData);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [errors, setErrors] = useState({
        name: false,
        manufacturer_id: false,
    });

    // Fetch manufacturer list for dropdown
    const loadManufacturerList = async () => {
        try {
            const data = await fetchManufacturers();
            setManufacturers(data || []);
        } catch (error) {
            console.error('Failed to fetch manufacturers:', error);
        }
    };

    // On mount, load manufacturers
    useEffect(() => {
        loadManufacturerList();
        // No dependencies here -> runs once
        // or include an empty array: []
    }, []);

    // If editing an existing model, fetch & populate
    useEffect(() => {
        if (modelId) {
            (async () => {
                try {
                    const data = await fetchModelById(modelId);
                    // Suppose data has shape { id, name, manufacturer_id, active (bool), ... }
                    const formData: ModelFormData = {
                        id: data.id,
                        name: data.name,
                        manufacturer_id: data.manufacturer_id ?? '',
                        active: data.active ? 'Yes' : 'No',
                    };
                    setModelData(formData);
                } catch (error) {
                    showErrorToast('Failed to load model data');
                }
            })();
        } else {
            // Otherwise, reset for creation
            setModelData(emptyModelData);
        }
    }, [modelId, emptyModelData]);

    // Handle changes in text/select inputs
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setModelData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (['name', 'manufacturer_id'].includes(name)) {
            setErrors((prev) => ({
                ...prev,
                [name]: value === '',
            }));
        }
    };

    // Validate & submit
    const handleSubmit = async () => {
        const newErrors = {
            name: !modelData.name, // blank string => error
            manufacturer_id: modelData.manufacturer_id === '',
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((x) => x);
        if (hasErrors) return;

        try {
            // Convert local form shape to DB shape
            const payload = {
                name: modelData.name.trim(),
                manufacturer_id: Number(modelData.manufacturer_id), // convert string -> number
                active: modelData.active === 'Yes',
            };

            if (modelId) {
                // Update existing
                await updateModel(modelId, payload);
                showSuccessToast('Model updated successfully!');
            } else {
                // Create new
                await createModel(payload);
                showSuccessToast('Model created successfully!');
            }

            handleClose();
            loadModels(); // Refresh parent data
        } catch (error) {
            showErrorToast('Failed to save model');
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
                    width: '90%',
                    borderRadius: 2,
                    backgroundColor: `${theme.palette.background.paper} !important`,
                }}
            >
                <Typography
                    sx={{
                        mb: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: `${theme.palette.primary.main} !important`,
                    }}
                    variant="h6"
                >
                    {modelId ? 'Edit Model' : 'Create Model'}
                </Typography>

                {/* Model Name */}
                <StyledTextField
                    label="Model Name"
                    name="name"
                    value={modelData.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Model name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                {/* Manufacturer Select */}
                <StyledSelectField
                    label="Manufacturer"
                    name="manufacturer_id"
                    value={modelData.manufacturer_id}
                    onChange={handleInputChange}
                    options={manufacturers.map((m) => ({
                        value: m.id.toString(), // store as string
                        display: m.name,
                    }))}
                    error={errors.manufacturer_id}
                    helperText={errors.manufacturer_id ? 'Manufacturer is required' : ''}
                />

                <StyledSelectField
                    label="Active"
                    name="active"
                    value={modelData.active}
                    onChange={handleInputChange}
                    options={[
                        { value: 'Yes', display: 'Active' },
                        { value: 'No', display: 'Inactive' },
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

export default ModelModal;
