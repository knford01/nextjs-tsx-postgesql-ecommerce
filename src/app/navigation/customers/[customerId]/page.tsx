'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Card, CardContent, Typography, Tabs, Tab, Button, IconButton, Link, useTheme, Avatar, Divider } from '@mui/material';
import { fetchCustomerById } from '@/db/customer-data';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';

const contacts = [
    {
        name: 'John Doe',
        phone: '555-123-4567',
        isPrimary: true,
    },
    {
        name: 'Jane Smith',
        phone: '555-234-5678',
        isPrimary: false,
    },
    {
        name: 'Emily Johnson',
        phone: '555-345-6789',
        isPrimary: false,
    },
    {
        name: 'Michael Brown',
        phone: '555-456-7890',
        isPrimary: false,
    },
];

const emails = [
    {
        dateTime: '2024-08-14 10:00 AM',
        subject: 'Welcome!',
    },
    {
        dateTime: '2024-08-13 03:45 PM',
        subject: 'Invoice Attached',
    },
    {
        dateTime: '2024-08-12 11:30 AM',
        subject: 'Follow-up',
    },
    {
        dateTime: '2024-08-11 01:00 PM',
        subject: 'Meeting Scheduled',
    },
    {
        dateTime: '2024-08-10 09:15 AM',
        subject: 'Thank You',
    },
];

const CustomerProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const [customer, setCustomer] = useState<any>(null); // Set type to any
    const [activeTab, setActiveTab] = useState<any>(0); // Set type to any
    const router = useRouter();

    const { customerId } = params;

    useEffect(() => {
        const loadCustomer = async () => {
            const customerData = await fetchCustomerById(customerId);
            setCustomer(customerData);
        };

        loadCustomer();
    }, [customerId]);

    const handleTabChange = (event: any, newValue: any) => { // Set parameter types to any
        setActiveTab(newValue);
    };

    const handleEditClick = () => {
        // Logic to enable editing of customer details
    };

    const handleAddContact = () => {
        // Logic to add a new contact
    };

    const handleSendEmail = () => {
        // Logic to send an email
    };

    if (!customer) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 2, mx: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="customer-profile-tabs" sx={{ '.MuiTab-root': { textTransform: 'none', }, }}>
                <Tab label="Details" />
                <Tab label="Logs" />
            </Tabs>

            {activeTab === 0 && (

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Customer Details Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                            <CardContent sx={{ position: 'relative' }}>
                                {/* Edit Icon at the top right */}
                                <IconButton
                                    onClick={handleEditClick}
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                >
                                    <EditIcon />
                                </IconButton>

                                {/* Avatar Centered */}
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Avatar
                                        alt={customer.name}
                                        src={customer.avatarUrl || ''}
                                        sx={{ width: 100, height: 100, backgroundColor: theme.palette.primary.main }}
                                    >
                                        {!customer.avatarUrl && <PersonIcon sx={{ fontSize: 60, color: theme.palette.text.primary }} />}
                                    </Avatar>
                                </Box>

                                <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                                {/* Two Column Layout */}
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography sx={{ p: 1 }}>Name</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>Address</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>City</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>State</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>Zip</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>Phone</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>Email</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography sx={{ p: 1 }}>{customer.name}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.address}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.city}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.state}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.zip}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.phone}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.email}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contacts Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <IconButton onClick={handleAddContact} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <AddIcon />
                                </IconButton>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Typography variant="h6">Contacts</Typography>
                                </Box>
                                <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                                {contacts.map((contact: any, index: number) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                        <Grid item xs={4}>
                                            <Typography>{contact.name}</Typography>
                                            <Divider sx={{ bgcolor: theme.palette.divider }} />

                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>{contact.phone}</Typography>
                                            <Divider sx={{ bgcolor: theme.palette.divider }} />

                                        </Grid>
                                        <Grid item xs={4}>
                                            {contact.isPrimary && (
                                                <>
                                                    <Typography sx={{ fontWeight: 'bold', color: theme.palette.success.light }}>Primary Contact</Typography>
                                                    <Divider sx={{ bgcolor: theme.palette.divider }} />
                                                </>
                                            )}
                                        </Grid>
                                    </Grid>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Send Email Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <IconButton onClick={handleSendEmail} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <EmailIcon />
                                </IconButton>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Typography variant="h6">Send Email</Typography>
                                </Box>
                                <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                                {emails.map((email, index) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography>{email.dateTime}</Typography>
                                            <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{email.subject}</Typography>
                                            <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        </Grid>
                                    </Grid>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Reports Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <AssignmentIcon sx={{ position: 'absolute', top: 8, right: 8, marginTop: 1, marginRight: 1 }} />

                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Typography variant="h6">Reports</Typography>
                                </Box>
                                <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                                <Box mt={2}>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2 }}>
                                        Short Ship
                                    </Link>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2 }}>
                                        Daily Orders
                                    </Link>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2 }}>
                                        Daily Receiving
                                    </Link>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2 }}>
                                        Daily Shipped
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Logs section coming soon...</Typography>
                </Box>
            )}
        </Box>
    );
};

export default CustomerProfilePage;
