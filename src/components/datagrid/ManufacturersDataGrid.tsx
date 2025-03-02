import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchManufacturers } from '@/db/item-data';
import ManufacturerModal from '@/components/modals/inventory/ManufacturerModal';

const ManufacturersDataGrid: React.FC = () => {
    const theme = useTheme();
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentManufacturerId, setCurrentManufacturerId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadManufacturers = useCallback(async () => {
        const manufacturerData = await fetchManufacturers();
        setManufacturers(manufacturerData || []);
    }, []);

    // Load manufacturers on component mount
    useEffect(() => {
        loadManufacturers();
    }, [loadManufacturers]);

    const handleOpenModal = (manufacturerId?: number) => {
        setCurrentManufacturerId(manufacturerId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentManufacturerId(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'contact_name', headerName: 'Contact Name', flex: 1, minWidth: 150 },
        { field: 'contact_phone', headerName: 'Contact Phone', flex: 1, minWidth: 150 },
        { field: 'active', headerName: 'Active', flex: 0.5, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 250, // Ensure actions column has enough space
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenModal(params.row.id)}
                    startIcon={<PencilIcon className="w-5" />}
                    sx={{
                        p: 1, pr: 0, mr: 1,
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
                rows={manufacturers}
                columns={columns}
                fileName="manufacturers_export"
                buttons={
                    <Button
                        startIcon={<PlusIcon className="h-5" />}
                        onClick={() => handleOpenModal()}
                        variant="contained"
                        sx={{
                            r: 0,
                            backgroundColor: `${theme.palette.secondary.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                        }}
                    >
                        {isMobile ? 'Create' : 'Create Manufacturer'}
                    </Button>
                }
                columnsToIgnore={['actions']}
            />

            <ManufacturerModal
                open={modalOpen}
                handleClose={handleCloseModal}
                manufacturerId={currentManufacturerId}
                loadManufacturers={loadManufacturers}
            />
        </>
    );
};

export default ManufacturersDataGrid;
