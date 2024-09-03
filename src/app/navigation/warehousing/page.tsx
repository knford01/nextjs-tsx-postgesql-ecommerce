'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button, Box, TextField, useTheme, Grid, Card, CardContent, Typography, InputAdornment, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import WarehouseModal from '@/components/modals/WarehouseModal';
import { fetchWarehouses } from '@/db/warehouse-data';

const WarehousesPage = () => {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]); // Updated state type to Warehouse

    const loadWarehouses = useCallback(async () => {
        const warehousesData: Warehouse[] = await fetchWarehouses();
        setWarehouses(warehousesData);
    }, []);

    // Use useEffect to call loadWarehouses on component mount
    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'warehousing')) {
            router.push('/navigation/403'); // Redirect to a 403 error page or any other appropriate route                                                                                            
        } else {
            loadWarehouses();
        }
    }, [combinedPermissions, router, loadWarehouses]);

    const handleCreateWarehouse = () => { // Updated handler function name
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredWarehouses = warehouses?.filter((warehouse) =>
        warehouse.name.toLowerCase().includes(searchQuery)
    );

    return (
        <Box sx={{ mt: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <TextField
                    placeholder={isMobile ? 'Search' : 'Search Warehouses'} // Updated placeholder text
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: isMobile ? '150px' : '300px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon style={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                        ),
                        style: {
                            color: theme.palette.text.secondary,
                            fontWeight: 'bold',
                            height: '40px'
                        },
                    }}
                />
                <Button
                    sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.secondary.main }}
                    variant="contained"
                    startIcon={<PlusIcon className="h-5" />}
                    onClick={handleCreateWarehouse} // Updated onClick handler
                >
                    {isMobile ? 'Create' : 'Create Warehouse'}
                </Button>
            </Box>

            <Grid container spacing={2}>
                {filteredWarehouses?.map((warehouse) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={warehouse.id}>
                        <Link href={`/navigation/warehousing/${warehouse.id}`} passHref>
                            <Card
                                className="cursor-pointer"
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.text.primary,
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.level1,
                                        color: theme.palette.primary.main,
                                    },
                                    p: 1,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', paddingLeft: 1 }}>
                                    {warehouse.name}
                                </Typography>
                                <Box sx={{ backgroundColor: theme.palette.text.primary, borderRadius: 1, p: 1, }}>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        {warehouse.address}
                                    </Typography>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        {warehouse.city}, {warehouse.state} {warehouse.zip}
                                    </Typography>
                                </Box>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            <WarehouseModal open={openModal} handleClose={handleCloseModal} onSave={handleCloseModal} /> {/* Updated modal component */}
        </Box>
    );
};

export default WarehousesPage;
