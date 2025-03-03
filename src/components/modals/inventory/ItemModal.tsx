import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Modal, Button, Paper, Typography, Box, Grid, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledTextField, StyledMultiSelectField, StyledSelectField } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createItem, fetchItemById, updateItem, updateItemProjects, fetchManufacturers, fetchModelsByManufacturerId, fetchUOM, updateItemWarehouses } from '@/db/item-data';
import { fetchCustomers } from '@/db/customer-data';
import { fetchProjectsByCustomerId } from '@/db/project-data';
import { fetchAvailableWarehouseLocations, fetchPreferredLocation, fetchWarehouseByProjectId, updateItemPreferredLocation } from '@/db/warehouse-data';

interface ItemModalProps {
    open: boolean;
    handleClose: () => void;
    itemId?: number;
    loadItems: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ open, handleClose, itemId, loadItems }) => {
    const theme = useTheme();

    const emptyItemData = useMemo(() => ({
        id: 0,
        date_created: '',
        customer_name: '',
        manufacturer_name: '',
        model_name: '',
        customer_id: 0,
        projects_csv: '' as any,
        project_ids: [] as any[],
        name: '',
        description: '',
        item_number: '',
        article_number: '',
        customer_number: '',
        upc: '',
        sku: '',
        active: '',
        image: '',
        manufacturer_id: 0,
        model_id: 0,
        uom_id: 0,
        bulk: false,
        req_sn: false,
        case_pack_qty: 0,
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        warehouses_csv: '' as any,
        warehouse_ids: [] as any[],
        low_inv: 0,
    }), []);

    const [itemData, setItemData] = useState(emptyItemData);
    const [customers, setCustomers] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [manufacturers, setManufacturers] = useState<{ value: string; display: string }[]>([]);
    const [models, setModels] = useState<{ value: string; display: string }[]>([]);
    const [uoms, setUOMs] = useState<{ value: string; display: string }[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [warehouseLocations, setWarehouseLocations] = useState<{ [warehouseId: number]: any[] }>({});
    const [selectedLocations, setSelectedLocations] = useState<{ [warehouseId: number]: number }>({});
    const [errors, setErrors] = useState({ name: false, item_number: false, active: false, uom_id: false, bulk: false, req_sn: false, warehouses: false });

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data.map((customer: any) => ({ value: customer.id.toString(), display: customer.name })));
            } catch (error) {
                showErrorToast('Failed to load customers');
            }
        };

        const loadManufacturers = async () => {
            try {
                const data = await fetchManufacturers();
                setManufacturers(data.map((manufacturer: any) => ({ value: manufacturer.id, display: manufacturer.name })));
            } catch (error) {
                showErrorToast('Failed to load manufacturers');
            }
        };

        const loadUOMs = async () => {
            try {
                const data = await fetchUOM();
                setUOMs(data.map((uom: any) => ({ value: uom.id, display: uom.uom })));
            } catch (error) {
                showErrorToast('Failed to load units of measure');
            }
        };

        const loadItemData = async () => {
            if (itemId) {
                try {
                    const data = await fetchItemById(itemId);
                    setItemData({
                        ...data,
                        id: data.id ?? 0,
                        date_created: data.date_created ? data.date_created.toISOString() : '',
                        customer_name: data.customer_name || '',
                        manufacturer_name: data.manufacturer_name || '',
                        model_name: data.model_name || '',
                        customer_id: data.customer_id ?? 0,
                        project_ids: data.projects_csv ? data.projects_csv.split(',').map(Number) : [],
                        name: data.name || '',
                        description: data.description || '',
                        item_number: data.item_number || '',
                        article_number: data.article_number || '',
                        customer_number: data.customer_number || '',
                        upc: data.upc || '',
                        sku: data.sku || '',
                        active: data.active || '',
                        image: data.image || '',
                        manufacturer_id: data.manufacturer_id ?? 0,
                        model_id: data.model_id ?? 0,
                        uom_id: data.uom_id ?? 0,
                        bulk: data.bulk ?? false,
                        req_sn: data.req_sn ?? false,
                        case_pack_qty: data.case_pack_qty ?? 0,
                        length: data.length ?? 0,
                        width: data.width ?? 0,
                        height: data.height ?? 0,
                        weight: data.weight ?? 0,
                        warehouse_ids: data.warehouses_csv ? data.warehouses_csv.split(',').map(Number) : [],
                    });
                    populateProjects(data.customer_id);
                } catch (error) {
                    showErrorToast('Failed to load item data');
                }
            } else {
                setItemData(emptyItemData);
            }
        };

        if (open) {
            loadManufacturers();
            loadUOMs();
            loadCustomers();
            loadItemData();
        } else {
            setItemData(emptyItemData);
            setProjects([]);
            setWarehouses([]);
            setWarehouseLocations([]);
            setSelectedLocations([]);
        }
    }, [open, itemId, emptyItemData]);

    useEffect(() => {
        if (itemData.project_ids && itemData.project_ids.length > 0) {
            populateWarehouses(itemData.project_ids);
        }

    }, [itemData.project_ids]);

    useEffect(() => {
        if (itemData.manufacturer_id) {
            const loadModels = async () => {
                try {
                    const data = await fetchModelsByManufacturerId(Number(itemData.manufacturer_id));
                    setModels(data.map((model: any) => ({ value: model.id, display: model.name })));
                } catch (error) {
                    showErrorToast('Failed to load models');
                }
            };

            loadModels();
        } else {
            setModels([]);
        }
    }, [itemData.manufacturer_id]);

    const populateProjects = async (customerId: any) => {
        if (customerId) {
            try {
                const projectData = await fetchProjectsByCustomerId(customerId);
                setProjects(projectData.map((project: any) => ({ label: project.name, value: project.id })));
            } catch (error) {
                showErrorToast('Failed to load projects');
            }
        }
    };

    const populateWarehouses = async (projectIDs: any) => {
        if (projectIDs) {
            try {
                const warehouseData = await fetchWarehouseByProjectId(projectIDs);
                if (warehouseData.length > 0) {
                    setWarehouses(
                        warehouseData.map((warehouse: Warehouse) => ({
                            label: warehouse.name,
                            value: warehouse.id,
                        }))
                    );
                } else {
                    setWarehouses([]);
                    setSelectedLocations([]);
                }
            } catch (error) {
                showErrorToast('Failed to load warehouses');
            }
        } else {
            setWarehouses([]);
            setSelectedLocations([]);
        }
    };

    const populateWarehouseLocations = useCallback(
        async (warehouseIDs: number[]) => {
            if (warehouseIDs && warehouseIDs.length > 0) {
                try {
                    const updatedLocations: { [warehouseId: number]: any[] } = {};
                    const updatedSelectedLocations: { [warehouseId: number]: number } = {};

                    for (const warehouseID of warehouseIDs) {
                        let preferredLocData = null;

                        // Only fetch preferred location if itemId exists
                        if (itemId) {
                            preferredLocData = await fetchPreferredLocation(itemId, warehouseID);
                        }

                        const availableLocationsData = await fetchAvailableWarehouseLocations(
                            warehouseID,
                            preferredLocData?.location_id
                        );

                        // Map available locations to the format required for the select dropdown
                        updatedLocations[warehouseID] = availableLocationsData.map((location: any) => ({
                            value: location.id,
                            display: location.name,
                        }));

                        // Set the preferred location if available
                        if (preferredLocData) {
                            updatedSelectedLocations[warehouseID] = preferredLocData.location_id;
                        }
                    }

                    setWarehouseLocations(updatedLocations);
                    setSelectedLocations((prev) => ({ ...prev, ...updatedSelectedLocations }));
                } catch (error) {
                    console.error('Error while fetching warehouse locations: ', error);
                    showErrorToast('Failed to load warehouse locations');
                }
            }
        },
        [itemId]
    );

    useEffect(() => {
        if (itemData.warehouse_ids && itemData.warehouse_ids.length > 0) {
            populateWarehouseLocations(itemData.warehouse_ids);
        }
    }, [itemData.warehouse_ids, populateWarehouseLocations]);

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;

        setItemData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };

            // If bulk item is true, force req_sn to be false
            if (name === 'bulk' && value === 'true') {
                updatedData.req_sn = false;
            }

            return updatedData;
        });

        if (name === 'customer_id') {
            populateProjects(parseInt(value));
        }
    };

    const handleProjectChange = (selectedProjects: any[]) => {
        const projectIds = selectedProjects.map((option: any) => option.value);
        setItemData((prevData: any) => ({
            ...prevData,
            project_ids: projectIds,
        }));

        if (projectIds.length) {
            populateWarehouses(projectIds);
        } else {
            setWarehouses([]);
        }
    };

    const handleWarehouseChange = (selectedWarehouses: any[]) => {
        const warehouseIds = selectedWarehouses.map((option: any) => option.value);
        setItemData((prevData: any) => ({
            ...prevData,
            warehouse_ids: selectedWarehouses.map((option: any) => option.value),
        }));

        populateWarehouseLocations(warehouseIds);
    };

    const handleLocationChange = (warehouseId: number, selectedLocationId: number) => {
        setSelectedLocations((prev) => ({
            ...prev,
            [warehouseId]: selectedLocationId,
        }));

        // console.log('selectedLocations: ', selectedLocations);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setItemData((prevData) => ({ ...prevData, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateFields = () => {
        const newErrors = {
            customer_id: !itemData.customer_id,
            projects: !itemData.project_ids,
            name: !itemData.name.trim(),
            item_number: !itemData.item_number.trim(),
            active: itemData.active === null || itemData.active === undefined,
            uom_id: !itemData.uom_id,
            bulk: itemData.bulk === null,
            req_sn: itemData.req_sn === null,
            warehouses: !itemData.warehouse_ids,
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            showErrorToast('Please fill out all required fields');
            return;
        }

        const { id, date_created, customer_name, manufacturer_name, model_name, projects_csv, project_ids, warehouses_csv, warehouse_ids, active, ...restItemData } = itemData;
        const cleanedItemData = {
            ...restItemData,
            active: active === 'Yes', // 'Yes' becomes true, 'No' becomes false
        };
        // console.log('cleanedItemData: ', cleanedItemData);

        try {
            if (itemId) {
                await updateItem(itemId, cleanedItemData);
                if (itemData.project_ids) {
                    await updateItemProjects(itemId, itemData.project_ids);
                }
                if (itemData.warehouse_ids) {
                    await updateItemWarehouses(itemId, itemData.warehouse_ids);
                }
                if (selectedLocations) {
                    await updateItemPreferredLocation(itemId, selectedLocations);
                }
                showSuccessToast('Item Updated Successfully');
            } else {
                const newItem = await createItem(cleanedItemData);
                if (newItem && itemData.project_ids) {
                    await updateItemProjects(newItem.id, itemData.project_ids);
                }
                if (newItem && itemData.warehouse_ids) {
                    await updateItemWarehouses(newItem.id, itemData.warehouse_ids);
                }
                if (newItem && selectedLocations) {
                    await updateItemPreferredLocation(newItem.id, selectedLocations);
                }
                showSuccessToast('Item Created Successfully');
            }

            handleModalClose();
            loadItems();
        } catch (error) {
            showErrorToast('Failed to Save Item');
        }
    };

    const handleModalClose = () => {
        setItemData(emptyItemData);
        setProjects([]);
        setWarehouses([]);
        setWarehouseLocations([]);
        setSelectedLocations([]);
        setErrors({ name: false, item_number: false, active: false, uom_id: false, bulk: false, req_sn: false, warehouses: false });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleModalClose}>
            <Paper style={{ margin: 'auto', marginTop: '3%', padding: 20, maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}>
                <Typography
                    sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {itemId ? 'Edit Item' : 'Create Item'}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Item Assignment
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Customer"
                                name="customer_id"
                                value={itemData.customer_id}
                                onChange={handleInputChange}
                                options={customers}
                                required
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StyledMultiSelectField
                                label="Projects"
                                name="projects"
                                value={itemData.project_ids.map((id: any) => projects.find((project: any) => project.value === id)).filter(Boolean) as any[]}
                                onChange={(options: any) => handleProjectChange(options)}
                                options={projects}
                                required
                                disabled={!itemData.customer_id}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Details
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <StyledTextField
                                label="Name"
                                name="name"
                                value={itemData.name}
                                onChange={handleInputChange}
                                required
                                error={errors.name}
                                helperText={errors.name ? 'Name is required' : ''}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Description"
                                name="description"
                                value={itemData.description}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Item Number (VN)"
                                name="item_number"
                                value={itemData.item_number}
                                onChange={handleInputChange}
                                required
                                error={errors.item_number}
                                helperText={errors.item_number ? 'Item Number is required' : ''}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Article Number"
                                name="article_number"
                                value={itemData.article_number}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Customer Item Number (BN)"
                                name="customer_number"
                                value={itemData.customer_number}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="UPC"
                                name="upc"
                                value={itemData.upc}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="SKU"
                                name="sku"
                                value={itemData.sku}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <StyledSelectField
                                label="Active"
                                name="active"
                                value={itemData.active.toString()}
                                onChange={handleInputChange}
                                options={[{ value: 'Yes', display: 'Yes' }, { value: 'No', display: 'No' }]}
                                required
                                error={errors.active}
                                helperText={errors.active ? 'Status is required' : ''}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                type="file"
                                name="image"
                                onChange={handleImageUpload}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    mt: 1,
                                    '& .MuiInputBase-root': {
                                        height: '2.5em', // Match height of text fields
                                        display: 'flex',
                                        alignItems: 'center', // Vertically center content
                                        backgroundColor: theme => `${theme.palette.text.primary} !important`,
                                    },
                                    '& .MuiInputBase-input': {
                                        height: '100%', // Ensure the input fills the height
                                        padding: '5px 14px', // Match padding of text fields
                                        boxSizing: 'border-box',
                                    },
                                }}
                            />

                            {itemData.image && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Image
                                        src={itemData.image}
                                        alt="Item"
                                        width={300}
                                        height={300}
                                        objectFit="cover"
                                        placeholder="blur"
                                        blurDataURL={itemData.image}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Specifications
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <StyledSelectField
                                label="Manufacturer"
                                name="manufacturer_id"
                                value={itemData.manufacturer_id}
                                onChange={handleInputChange}
                                options={manufacturers}
                                fullWidth
                                margin="normal"
                            />

                            <StyledSelectField
                                label="Model"
                                name="model_id"
                                value={itemData.model_id}
                                onChange={handleInputChange}
                                options={models}
                                fullWidth
                                margin="normal"
                                disabled={!itemData.manufacturer_id}
                            />
                            <StyledSelectField
                                label="Unit of Measure"
                                name="uom_id"
                                value={itemData.uom_id}
                                onChange={handleInputChange}
                                options={uoms}
                                required
                                error={errors.uom_id}
                                helperText={errors.uom_id ? 'Unit of Measure is required' : ''}
                                fullWidth
                                margin="normal"
                            />

                            <StyledSelectField
                                label="Bulk Item (Non Serialized)"
                                name="bulk"
                                value={itemData.bulk}
                                onChange={handleInputChange}
                                options={[{ value: true, display: 'True' }, { value: false, display: 'False' }]}
                                required
                                error={errors.bulk}
                                helperText={errors.bulk ? 'Bulk Item selection is required' : ''}
                                fullWidth
                                margin="normal"
                            />

                            <StyledSelectField
                                label="Require Serial Number"
                                name="req_sn"
                                value={itemData.req_sn}
                                onChange={handleInputChange}
                                options={[{ value: true, display: 'True' }, { value: false, display: 'False' }]}
                                required
                                error={errors.req_sn}
                                helperText={(itemData.bulk && itemData.req_sn) ? 'Cannot require serial number for bulk items' : ''}
                                fullWidth
                                margin="normal"
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <StyledTextField
                                label="Case Pack Quantity"
                                name="case_pack_qty"
                                type="number"
                                value={itemData.case_pack_qty}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Length (IN)"
                                name="length"
                                type="number"
                                value={itemData.length}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Width (IN)"
                                name="width"
                                type="number"
                                value={itemData.width}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Height (IN)"
                                name="height"
                                type="number"
                                value={itemData.height}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <StyledTextField
                                label="Weight (LBS)"
                                name="weight"
                                type="number"
                                value={itemData.weight}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Warehousing
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledMultiSelectField
                                label="Warehouses"
                                name="warehouses"
                                value={itemData.warehouse_ids.map((id: any) => warehouses.find((warehouse: any) => warehouse.value === id)).filter(Boolean) as any[]}
                                onChange={(options: any) => handleWarehouseChange(options)}
                                options={warehouses}
                                required
                            />

                            {/* Render location selects for each warehouse */}
                            {itemData.warehouse_ids.map((warehouseId: number) => (
                                <Box key={warehouseId} sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 0, color: `${theme.palette.primary.main}` }}>
                                        Locations for Warehouse {warehouses.find((w: any) => w.value === warehouseId)?.label || warehouseId}
                                    </Typography>
                                    <StyledSelectField
                                        label={`Select Location`}
                                        value={selectedLocations[warehouseId] || ''}
                                        onChange={(e) => handleLocationChange(warehouseId, Number(e.target.value))}
                                        options={warehouseLocations[warehouseId] || []}
                                        fullWidth
                                    />
                                </Box>
                            ))}
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ flex: 1 }}>
                                <StyledTextField
                                    label="Low Inventory Alert"
                                    name="low_inv"
                                    type="number"
                                    value={itemData.low_inv}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

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
                        onClick={handleModalClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ItemModal;
