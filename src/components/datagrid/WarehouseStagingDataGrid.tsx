import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme, Box } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchStagingByWarehouseId } from '@/db/receiving-data';
import ReceivingModal from '../modals/warehouse/ReceivingModal';
import StagingModal from '../modals/warehouse/StagingModal';

interface StagingDataGridProps {
    warehouseId: number;
}

const StagingDataGrid: React.FC<StagingDataGridProps> = ({ warehouseId }) => {
    const theme = useTheme();
    const [stagings, setStaging] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [stagingModalOpen, setStagingModalOpen] = useState(false);
    const [currentReceivingID, setCurrentReceivingID] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadStaging = useCallback(async () => {
        if (warehouseId) {
            const stagingData = await fetchStagingByWarehouseId(warehouseId);
            setStaging(stagingData as any[]);
            // console.log('setStaging: ', stagings);
        }
    }, [warehouseId]);

    useEffect(() => {
        loadStaging();
    }, [loadStaging]);

    const handleOpenModal = (receivingID?: number) => {
        setCurrentReceivingID(receivingID);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentReceivingID(undefined);
    };

    const handleEdit = (receivingId: number) => {
        setCurrentReceivingID(receivingId);
        setModalOpen(true);
    };

    const handleOpenStagingModal = (receivingId: number) => {
        setCurrentReceivingID(receivingId);
        setStagingModalOpen(true);
    };

    const handleCloseStagingModal = () => {
        setStagingModalOpen(false);
        setCurrentReceivingID(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'customer_name', headerName: 'Customer Name', flex: 1, minWidth: 150 },
        { field: 'project_name', headerName: 'Project Name', flex: 1, minWidth: 150 },
        { field: 'bol', headerName: 'BOL', flex: 1, minWidth: 150 },
        { field: 'po_number', headerName: 'PO Number', flex: 1, minWidth: 150 },
        { field: 'pallets_received', headerName: 'Pallets Received', flex: 1, minWidth: 125 },
        { field: 'items_received', headerName: 'Items Received', flex: 1, minWidth: 125 },
        { field: 'start_date', headerName: 'Receiving Date', flex: 1, minWidth: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 250,
            renderCell: (params) => (
                <>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(params.row.id)}
                        startIcon={<PencilIcon className="w-5" />}
                        sx={{
                            p: 1,
                            pr: 1,
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
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenStagingModal(params.row.id)}
                        startIcon={<PlusIcon className="w-5" />}
                        sx={{
                            p: 1,
                            pr: 1,
                            backgroundColor: `${theme.palette.success.main} !important`,
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
                        Scan
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <CustomDataGrid
                rows={stagings}
                columns={columns}
                fileName="staging_export"
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
                        {isMobile ? 'Receiving' : 'Add Receiving'}
                    </Button>
                }
                columnsToIgnore={['actions']}
            />
            <ReceivingModal
                open={modalOpen}
                handleClose={handleCloseModal}
                warehouseID={warehouseId}
                receivingID={currentReceivingID}
                loadStaging={loadStaging}
            />
            <StagingModal
                open={stagingModalOpen}
                handleClose={handleCloseStagingModal}
                receivingID={currentReceivingID}
                loadStaging={loadStaging}
            />
        </>
    );
};

export default StagingDataGrid;
