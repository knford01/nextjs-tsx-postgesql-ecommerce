import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchWarehouseLocationsByWarehouseId } from '@/db/warehouse-data';
import LocationModal from '../modals/warehouse/LocationModal';

interface WarehouseLocationDataGridProps {
    warehouseId: number;
}

const WarehouseLocationDataGrid: React.FC<WarehouseLocationDataGridProps> = ({ warehouseId }) => {
    const theme = useTheme();
    const [locations, setLocations] = useState<WarehouseLocation[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentLocationId, setCurrentLocationId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadLocations = useCallback(async () => {
        if (warehouseId) {
            const locationData = await fetchWarehouseLocationsByWarehouseId(warehouseId);
            setLocations(locationData as WarehouseLocation[]);
        }
    }, [warehouseId]);

    useEffect(() => {
        loadLocations();
    }, [loadLocations]);

    const handleOpenModal = (locationId?: number) => {
        setCurrentLocationId(locationId); // undefined if locationId is not provided
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentLocationId(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'aisle', headerName: 'Aisle', flex: 1, minWidth: 200 },
        { field: 'rack', headerName: 'Rack', flex: 1, minWidth: 150 },
        { field: 'row', headerName: 'Row', flex: 1, minWidth: 200 },
        { field: 'bin', headerName: 'Bin', flex: 1, minWidth: 150 },
        { field: 'active_display', headerName: 'Active', flex: 0.5, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 250,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenModal(params.row.id)}
                    startIcon={<PencilIcon className="w-5" />}
                    sx={{
                        p: 1,
                        pr: 0,
                        mr: 1,
                        backgroundColor: `${theme.palette.info.main} !important`,
                        color: `${theme.palette.text.primary} !important`,
                        borderColor: `${theme.palette.text.primary} !important`,
                        '&:hover': {
                            backgroundColor: `${theme.palette.info.dark} !important`,
                            color: `${theme.palette.text.secondary} !important`,
                        },
                        [theme.breakpoints.down('sm')]: {
                            minWidth: 'unset',
                            padding: '4px 8px',
                        },
                    }}
                >
                </Button>
            ),
        },
    ];

    return (
        <>
            <CustomDataGrid
                rows={locations}
                columns={columns}
                fileName="locations_export"
                buttons={
                    <Button
                        startIcon={<PlusIcon className="h-5" />}
                        onClick={() => handleOpenModal()}
                        variant="contained"
                        sx={{
                            r: 0, backgroundColor: `${theme.palette.secondary.main} !important`, color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                        }}>
                        {isMobile ? 'Location' : 'Create Location'}
                    </Button>}
                columnsToIgnore={['avatar', 'actions']}
            />
            <LocationModal warehouse_id={warehouseId} open={modalOpen} handleClose={handleCloseModal} locationId={currentLocationId} loadLocations={loadLocations} />
        </>
    );
};

export default WarehouseLocationDataGrid;
