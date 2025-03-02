'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { getAddresses } from '@/db/address-data';
import CustomDataGrid from './CustomDataGrid';
import AddressModal from '@/components/modals/settings/AddressModal';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const AddressDataGrid: React.FC = () => {
    const theme = useTheme();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadAddresses = useCallback(async () => {
        const addressData = await getAddresses();
        // console.log("addressData", addressData);
        setAddresses(addressData as Address[]);
    }, []);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    const handleOpenModal = (addressId?: number) => {
        setCurrentAddressId(addressId); // undefined if addressId is not provided
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentAddressId(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'company', headerName: 'Company', flex: 1, minWidth: 150 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
        { field: 'address1', headerName: 'Address', flex: 1, minWidth: 200 },
        { field: 'city', headerName: 'City', flex: 1, minWidth: 150 },
        { field: 'country', headerName: 'Country', flex: 0.5, minWidth: 100 },
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
                            padding: '4px 8px', // Adjust padding for mobile
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
                rows={addresses}
                columns={columns}
                fileName="addresses_export"
                buttons={
                    <Button startIcon={<PlusIcon className="h-5" />} onClick={() => handleOpenModal()} variant="contained"
                        sx={{
                            r: 0, backgroundColor: `${theme.palette.secondary.main} !important`, color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                        }}>

                        {isMobile ? 'Address' : 'Create Address'}
                    </Button>}
                columnsToIgnore={['avatar', 'actions']}
            />
            <AddressModal open={modalOpen} handleClose={handleCloseModal} addressId={currentAddressId} loadAddresses={loadAddresses} />
        </>
    );
};

export default AddressDataGrid;
