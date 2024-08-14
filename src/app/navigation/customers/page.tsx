'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button, Box, TextField, useTheme, Grid, Card, CardContent, Typography, InputAdornment, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { fetchCustomers } from '@/db/customer-data';
import SearchIcon from '@mui/icons-material/Search';
import { PlusIcon } from '@heroicons/react/24/outline';
import CustomerModal from '@/components/modals/CustomerModals';

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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]); // Explicitly type the state as Customer[]

    const loadCustomers = useCallback(async () => {
        const customersData: Customer[] = await fetchCustomers();
        setCustomers(customersData);
    }, []);

    // Use useEffect to call loadCustomers on component mount
    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

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
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                        },
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<PlusIcon className="h-5" />}
                    color="primary"
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
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.text.primary,
                                    '&:hover': { backgroundColor: theme.palette.action.hover },
                                    p: 2,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {customer.name}
                                    </Typography>
                                    <hr
                                        style={{
                                            borderColor: theme.palette.warning.main,
                                            marginTop: 4,
                                            marginBottom: 4,
                                        }}
                                    />
                                    <Typography variant="body2" color={theme.palette.text.primary}>
                                        {customer.address}, {customer.city}, {customer.state} {customer.zip}
                                    </Typography>
                                    <Typography variant="body2" color={theme.palette.text.secondary}>
                                        {customer.contact_name} - {customer.contact_phone}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            <CustomerModal open={openModal} handleClose={handleCloseModal} /> {/* Use the modal here */}
        </Box>
    );
};

export default CustomersPage;
