import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchItems } from '@/db/item-data';
import ItemModal from '@/components/modals/ItemModal';
import Image from 'next/image';

const ItemsDataGrid: React.FC = () => {
    const theme = useTheme();
    const [items, setItems] = useState<Item[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadItems = useCallback(async () => {
        const itemData = await fetchItems();
        setItems(itemData || []);
    }, []);

    // Load items on component mount
    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleOpenModal = (itemId?: number) => {
        setCurrentItemId(itemId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentItemId(undefined);
    };

    const columns: GridColDef[] = [
        // {
        //     field: 'image',
        //     headerName: '',
        //     minWidth: 70, // Set minimum width to prevent squishing
        //     flex: 0.2,
        //     sortable: false,
        //     renderCell: (params) => (
        //         params.value ? (
        //             <Image
        //                 src={params.value}
        //                 alt="Item Image"
        //                 width={50}
        //                 height={50}
        //                 style={{ objectFit: 'cover', borderRadius: '4px', maxWidth: 50, maxHeight: 50 }}
        //             />
        //         ) : null
        //     ),
        // },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
        { field: 'customer_name', headerName: 'Customer', flex: 1, minWidth: 150 },
        { field: 'customer_number', headerName: 'Customer Number', flex: 1, minWidth: 150 },
        { field: 'item_number', headerName: 'Item Number', flex: 1, minWidth: 150 },
        { field: 'active', headerName: 'Active', flex: 0.5, minWidth: 100 },
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
                rows={items}
                columns={columns}
                fileName="items_export"
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
                loadItems={loadItems}
            />
        </>
    );
};

export default ItemsDataGrid;
