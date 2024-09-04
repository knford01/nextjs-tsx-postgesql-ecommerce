import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { setProjectWarehouses, updateProject } from '@/db/project-data';
import { fetchWarehouses } from '@/db/warehouse-data';

interface ProjectSettingsModalProps {
    open: boolean;
    handleClose: () => void;
    project: {
        id: number;
        pallet_prefix: string | null;
        warehouses: number[];
    };
    onSave: () => void;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ open, handleClose, project, onSave }) => {
    const theme = useTheme();
    const [warehouses, setWarehouses] = useState<number[]>(project.warehouses || []);
    const [allWarehouses, setAllWarehouses] = useState<any[]>([]);

    useEffect(() => {
        const loadWarehouses = async () => {
            try {
                const warehouseData = await fetchWarehouses();
                if (warehouseData.length === 0) {
                    showErrorToast('No warehouses were found.');
                } else {
                    setAllWarehouses(warehouseData);
                }
            } catch (error) {
                showErrorToast('Failed to load warehouses.');
            }
        };

        loadWarehouses();
    }, []);

    const emptySettingsData = useMemo(() => ({
        pallet_prefix: project.pallet_prefix || '',
    }), [project]);

    const [settingsData, setSettingsData] = useState(emptySettingsData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setSettingsData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleWarehousesChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setWarehouses(e.target.value as number[]);
    };

    const handleSubmit = async () => {
        try {
            await updateProject(project.id, settingsData);
            await setProjectWarehouses(project.id, warehouses);
            showSuccessToast('Settings Updated Successfully');
            handleClose();
            onSave();
        } catch (error) {
            showErrorToast('Failed to Save Settings');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">
                    Edit Settings
                </Typography>

                <StyledTextField
                    label="Pallet Prefix"
                    name="pallet_prefix"
                    value={settingsData.pallet_prefix}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Warehouses"
                    select
                    SelectProps={{
                        multiple: true,
                        value: warehouses,
                        onChange: handleWarehousesChange,
                        renderValue: (selected: any) => (selected as number[]).map(id => {
                            const warehouse = allWarehouses.find(w => w.id === id);
                            return warehouse ? warehouse.name : id;
                        }).join(', '),
                    }}
                    fullWidth
                    margin="normal"
                >
                    {allWarehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                        </MenuItem>
                    ))}
                </StyledTextField>

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

export default ProjectSettingsModal;
