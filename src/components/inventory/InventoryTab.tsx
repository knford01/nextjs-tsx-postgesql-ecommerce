import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import { StyledSearchableSelect, StyledTextField } from '@/styles/StyledTextField';
import { fetchActiveWarehouses, fetchActiveWarehouseLocations, fetchWarehouseLocationsByWarehouseId } from '@/db/warehouse-data';
import { fetchActiveItems, fetchActiveItemsByWarehouseId } from '@/db/item-data';
import ClearButton from '@/components/ui/buttons/ClearButton';

const InventoryDataGrid = dynamic(() => import('@/components/datagrid/InventoryDataGrid'), { ssr: false });

interface Option {
    value: any;
    label: string;
}

export default function InventoryTab() {
    const theme = useTheme();
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

    const [searchParameters, setsearchParameters] = useState({
        warehouse_id: null,
        item_number: null,
        location_id: null,
        pallet_tag: '',
        serial_number: '',
    });
    const [warehouseOptions, setWarehouseOptions] = useState<Option[]>([]);
    const [locationOptions, setLocationOptions] = useState<Option[]>([]);
    const [itemNumberOptions, setItemNumberOptions] = useState<Option[]>([]);

    const handleInputChange = async (field: string, value: any) => {
        setsearchParameters((prev) => ({ ...prev, [field]: value }));

        if (field === 'warehouse_id') {
            if (value) {
                const locations = await fetchWarehouseLocationsByWarehouseId(value.value);
                const items = await fetchActiveItemsByWarehouseId(value.value);
                setLocationOptions(locations.map((loc: any) => ({ value: loc.id, label: loc.name })));
                setItemNumberOptions(items.map((item: any) => ({ value: item.id, label: `${item.item_number} - ${item.name}` })));
            } else {
                setLocationOptions([]);
                setItemNumberOptions([]);
            }
        }
    };

    const clearsearchParameters = () => {
        setsearchParameters({
            warehouse_id: null,
            item_number: null,
            location_id: null,
            pallet_tag: '',
            serial_number: '',
        });
    };

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'inventory', 'inventory')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    useEffect(() => {
        const fetchInitialData = async () => {
            const warehouses = await fetchActiveWarehouses();
            const locations = await fetchActiveWarehouseLocations();
            const items = await fetchActiveItems();

            setWarehouseOptions(warehouses.map((wh: any) => ({ value: wh.id, label: wh.name })));
            setLocationOptions(locations.map((loc: any) => ({ value: loc.id, label: loc.name })));
            setItemNumberOptions(items.map((item: any) => ({ value: item.id, label: `${item.item_number} - ${item.name}` })));
        };

        fetchInitialData();
    }, []);

    return (
        <Container
            maxWidth={false}
            sx={{
                m: 0,
                mt: 1.5,
                width: 'auto',
                height: 'auto',
                transition: 'all 0.3s',
            }}
        >
            <Grid container spacing={2} sx={{ mb: 1.5 }} alignItems="center">
                <Grid item sx={{ mt: 1 }}>
                    <ClearButton onClick={clearsearchParameters} />
                </Grid>
                {/* <Grid item sx={{ mt: 1 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.success.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` }
                        }}
                        onClick={() => console.log('Search triggered with:', searchParameters)}
                    >
                        Search
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <StyledSearchableSelect
                        label="Warehouse"
                        options={warehouseOptions}
                        value={searchParameters.warehouse_id}
                        onChange={(value) => handleInputChange('warehouse_id', value)}
                        placeholder="Select Warehouse"
                    />
                </Grid> */}
                <Grid item xs={2}>
                    <StyledSearchableSelect
                        label="Item Number"
                        options={itemNumberOptions}
                        value={searchParameters.item_number}
                        onChange={(value) => handleInputChange('item_number', value)}
                        placeholder="Select Item Number"
                    />
                </Grid>
                {/* <Grid item xs={2}>
                    <StyledSearchableSelect
                        label="Location"
                        options={locationOptions}
                        value={searchParameters.location_id}
                        onChange={(value) => handleInputChange('location_id', value)}
                        placeholder="Select Location"
                    />
                </Grid>
                <Grid item xs={2}>
                    <StyledTextField
                        label="Pallet Tag"
                        value={searchParameters.pallet_tag}
                        onChange={(e: any) => handleInputChange('pallet_tag', e.target.value)}
                    />
                </Grid>
                <Grid item xs={2}>
                    <StyledTextField
                        label="Serial Number"
                        value={searchParameters.serial_number}
                        onChange={(e: any) => handleInputChange('serial_number', e.target.value)}
                    />
                </Grid> */}
            </Grid>
            <InventoryDataGrid searchParameters={searchParameters} />
        </Container>
    );



























































}
