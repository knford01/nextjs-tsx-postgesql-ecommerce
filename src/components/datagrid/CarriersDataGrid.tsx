import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchActiveCarriers } from '@/db/warehouse-data';
import CarrierModal from '@/components/modals/warehouse/CarrierModal';

const CarriersDataGrid: React.FC = () => {
    const theme = useTheme();
    const [carriers, setCarriers] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCarrierId, setCurrentCarrierId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadCarriers = useCallback(async () => {
        const carrierData = await fetchActiveCarriers();
        setCarriers(carrierData || []);
    }, []);

    // Load carriers on component mount
    useEffect(() => {
        loadCarriers();
    }, [loadCarriers]);

    const handleOpenModal = (carrierId?: number) => {
        setCurrentCarrierId(carrierId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentCarrierId(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'scac', headerName: 'SCAC', flex: 1, minWidth: 100 },
        { field: 'active', headerName: 'Active', flex: 0.5, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 150,
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
                rows={carriers}
                columns={columns}
                fileName="carriers_export"
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
                        {isMobile ? 'Create' : 'Create Carrier'}
                    </Button>
                }
                columnsToIgnore={['actions']}
            />

            <CarrierModal
                open={modalOpen}
                handleClose={handleCloseModal}
                carrierId={currentCarrierId}
                loadCarriers={loadCarriers}
            />
        </>
    );
};

export default CarriersDataGrid;
