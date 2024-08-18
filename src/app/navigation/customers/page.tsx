'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button, Box, TextField, useTheme, Grid, Card, CardContent, Typography, InputAdornment, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { fetchCustomers } from '@/db/customer-data';
import SearchIcon from '@mui/icons-material/Search';
import { PlusIcon } from '@heroicons/react/24/outline';
import CustomerModal from '@/components/modals/CustomerModals';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';

// Define the Customer type if not already defined
type Customer = {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
};

const CustomersPage = () => {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]); // Explicitly type the state as Customer[]

    const loadCustomers = useCallback(async () => {
        const customersData: Customer[] = await fetchCustomers();
        setCustomers(customersData);
    }, []);

    // Use useEffect to call loadCustomers on component mount
    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'customers')) {
            router.push('/navigation/403'); // Redirect to a 403 error page or any other appropriate route                                                                                            
        } else {
            loadCustomers();
        }
    }, [combinedPermissions, router, loadCustomers]);

    const handleCreateCustomer = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery)
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
                    placeholder={isMobile ? 'Search' : 'Search Customers'}
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
                    onClick={handleCreateCustomer}
                >
                    {isMobile ? 'Create' : 'Create Customer'}
                </Button>
            </Box>

            <Grid container spacing={2}>
                {filteredCustomers.map((customer) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={customer.id}>
                        <Link href={`/navigation/customers/${customer.id}`} passHref>
                            <Card
                                className="cursor-pointer"
                                sx={{
                                    backgroundColor: theme.palette.background.level1,
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        color: theme.palette.text.primary
                                    },
                                    p: 1,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', paddingLeft: 1 }}>
                                    {customer.name}
                                </Typography>
                                <Box sx={{ backgroundColor: theme.palette.text.primary, borderRadius: 1, p: 1, }}>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        {customer.address}
                                    </Typography>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        {customer.city}, {customer.state} {customer.zip}
                                    </Typography>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        {customer.contact_name} {customer.contact_name && customer.contact_phone ? '-' : ''} {customer.contact_phone}
                                    </Typography>
                                </Box>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            <CustomerModal open={openModal} handleClose={handleCloseModal} onSave={handleCloseModal} /> {/* Use the modal here */}
        </Box>
    );
};

export default CustomersPage; 
