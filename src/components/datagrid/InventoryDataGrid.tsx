import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import ItemModal from '@/components/modals/ItemModal';
import { fetchInventory, fetchFilteredInventory } from '@/db/inventory-data';
import Image from 'next/image';

interface SearchParameters {
    warehouse_id?: number | null;
    item_number?: { value: number; label: string } | null;
    location_id?: string | null;
    pallet_tag?: string;
    serial_number?: string;
}

const InventoryDataGrid: React.FC<{ searchParameters?: SearchParameters }> = ({ searchParameters }) => {
    const theme = useTheme();
    const [inventory, setInventory] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadInventory = useCallback(async () => {
        let data;
        // Construct the WHERE clause from searchParameters
        if (searchParameters) {
            if (searchParameters.item_number) {
                data = await fetchFilteredInventory(searchParameters.item_number.value);
            } else {
                data = await fetchInventory();
            }
        }
        setInventory(data || []);
    }, [searchParameters]);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const handleOpenModal = (itemId?: number) => {
        setCurrentItemId(itemId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentItemId(undefined);
    };

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: 'Image',
            minWidth: 70, // Set minimum width to prevent squishing
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
                params.value ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Image
                            src={params.value}
                            alt="Avatar"
                            width={35}
                            height={35}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                width: 35,
                                height: 35
                            }}
                        />
                    </div>
                ) : null
            ),
        },
        { field: 'name', headerName: 'Item', flex: 1, minWidth: 150 },
        { field: 'item_number', headerName: 'Item Number', flex: 1, minWidth: 150 },
        { field: 'customer_name', headerName: 'Customer', flex: 1, minWidth: 150 },
        { field: 'available', headerName: 'Available', flex: 0.5, minWidth: 100 },
        { field: 'receiving', headerName: 'Receiving', flex: 0.5, minWidth: 100 },
        { field: 'received', headerName: 'Received', flex: 0.5, minWidth: 100 },
        { field: 'on_order', headerName: 'On Order', flex: 0.5, minWidth: 100 },
        { field: 'picked', headerName: 'Picked', flex: 0.5, minWidth: 100 },
        { field: 'adjusted', headerName: 'Adjusted', flex: 0.5, minWidth: 100 },
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
                />
            ),
        },
    ];

    return (
        <>
            <CustomDataGrid
                rows={inventory}
                columns={columns}
                fileName="inventory_export"
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
                        {isMobile ? 'Create' : 'Create Item'}
                    </Button>
                }
                columnsToIgnore={['image', 'actions']}
            />

            <ItemModal
                open={modalOpen}
                handleClose={handleCloseModal}
                itemId={currentItemId}
                loadItems={loadInventory}
            />
        </>
    );
};

export default InventoryDataGrid;
