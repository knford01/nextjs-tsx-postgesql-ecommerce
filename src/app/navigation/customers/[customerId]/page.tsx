'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Card, CardContent, Typography, Tabs, Tab, Button, IconButton, Link, useTheme, Avatar, Divider } from '@mui/material';
import { fetchCustomerById, fetchCustomerEmails } from '@/db/customer-data';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import CustomerModal from '@/components/modals/CustomerModals';
import ContactModal from '@/components/modals/ContactModal'; // Import ContactModal
import { fetchContactsByCustomerId } from '@/db/contact-data';
import CustomerEmailModal from '@/components/modals/EmailModals';

const CustomerProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const [customer, setCustomer] = useState<any>(null);
    const [contacts, setContacts] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<any>(0);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [emails, setEmails] = useState<any>([]);
    const { customerId } = params;

    useEffect(() => {
        const loadCustomer = async () => {
            const customerData = await fetchCustomerById(customerId);
            setCustomer(customerData);
        };

        loadCustomer();

        const loadContacts = async () => {
            const contactData = await fetchContactsByCustomerId(customerId);
            setContacts(contactData);
        };

        loadContacts();

        const loadEmails = async () => {
            const emailData = await fetchCustomerEmails(customerId);
            setEmails(emailData);
        };

        loadEmails();
    }, [customerId]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const handleEditClick = () => {
        setIsCustomerModalOpen(true);
    };

    const handleCustomerModalClose = () => {
        setIsCustomerModalOpen(false);
    };

    const handleCustomerModalSave = async () => {
        const updatedCustomer = await fetchCustomerById(customerId);
        setCustomer(updatedCustomer);
        setIsCustomerModalOpen(false);
    };

    const handleAddContact = () => {
        setSelectedContactId(null); // Clear selectedContactId to add new contact
        setIsContactModalOpen(true);
    };

    const handleEditContact = (contactId: string) => {
        setSelectedContactId(contactId); // Set the contact ID to edit
        setIsContactModalOpen(true);
    };

    const handleContactModalClose = () => {
        setIsContactModalOpen(false);
        setSelectedContactId(null); // Clear selected contact ID after closing modal
    };

    const handleContactModalSave = async () => {
        const updatedContacts = await fetchContactsByCustomerId(customerId);
        setContacts(updatedContacts);
        setIsContactModalOpen(false);
        setSelectedContactId(null); // Clear selected contact ID after saving
    };

    const handleSendEmail = () => {
        setIsEmailModalOpen(true);
    };

    const handleEmailModalSave = async () => {
        const updatedEmails = await fetchCustomerEmails(customerId);
        setEmails(updatedEmails);
        setIsEmailModalOpen(false);
    };

    if (!customer) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="customer-profile-tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    '.MuiTab-root': { textTransform: 'none', minWidth: 'auto' },
                    overflowX: 'auto',
                }}
            >
                <Tab label="Details" />
                <Tab label="Projects" />
                <Tab label="Reports" />
                <Tab label="Logs" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Customer Details Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <IconButton
                                    onClick={handleEditClick}
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                >
                                    <EditIcon sx={{ color: theme.palette.primary.main }} />
                                </IconButton>

                                {/* Avatar Centered */}
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Avatar
                                        alt={customer.name}
                                        src={customer.avatar || ''}
                                        sx={{ width: 80, height: 80, backgroundColor: theme.palette.primary.main }}
                                    >
                                        {!customer.avatarUrl && <PersonIcon sx={{ fontSize: 48, color: theme.palette.text.primary }} />}
                                    </Avatar>
                                </Box>

                                <Box
                                    sx={{
                                        p: 1,
                                        backgroundColor: theme.palette.text.primary,
                                        color: theme.palette.primary.main,
                                        borderRadius: '8px',
                                    }}
                                >
                                    {/* Table Layout for Customer Details */}
                                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <Box component="tbody">
                                            {[
                                                { label: 'Name', value: customer.name },
                                                { label: 'Address', value: customer.address },
                                                { label: 'City', value: customer.city },
                                                { label: 'State', value: customer.state },
                                                { label: 'Zip', value: customer.zip },
                                                { label: 'Phone', value: customer.contact_phone },
                                                { label: 'Email', value: customer.contact_email },
                                            ].map((item, index) => (
                                                <Box component="tr" key={index}>
                                                    <Box component="td" sx={{ fontWeight: 'bold', fontSize: 14, width: '35%', padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                        {item.label}
                                                    </Box>
                                                    <Box component="td" sx={{ fontSize: 14, padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                        {item.value}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contacts Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <IconButton onClick={handleAddContact} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <AddIcon sx={{ color: theme.palette.primary.main }} />
                                </IconButton>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Contacts</Typography>
                                </Box>

                                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <Box component="tbody">
                                        {contacts.map((contact: any, index: number) => (
                                            <Box component="tr" key={index} onClick={() => handleEditContact(contact.id)} sx={{ cursor: 'pointer' }}>
                                                <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                    <Typography sx={{ fontSize: 14 }}>{contact.first_name} {contact.last_name}</Typography>
                                                </Box>
                                                <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                    <Typography sx={{ fontSize: 14 }}>{contact.phone_number}</Typography>
                                                </Box>
                                                {contact.main === 1 && (
                                                    <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                        <Typography sx={{ fontWeight: 'bold', fontSize: 12, color: theme.palette.success.light }}>Primary Contact</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Send Email Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <IconButton onClick={handleSendEmail} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                                </IconButton>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Sent Emails</Typography>
                                </Box>

                                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <Box component="tbody">
                                        {emails.map((email: any, index: number) => (
                                            <Box component="tr" key={index}>
                                                <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                    <Typography sx={{ fontSize: 14 }}>{new Date(email.date_created).toLocaleString()}</Typography>
                                                </Box>
                                                <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                    <Typography sx={{ fontSize: 14 }}>{email.subject}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Projects section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    {/* Reports Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                            <CardContent sx={{ position: 'relative' }}>
                                <AssignmentIcon sx={{ position: 'absolute', top: 8, right: 8, marginTop: 1, marginRight: 1 }} />

                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Typography variant="h6" sx={{ fontSize: 16 }}>Reports</Typography>
                                </Box>
                                <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                                <Box mt={2}>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                        Short Ship
                                    </Link>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                        Daily Orders
                                    </Link>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                        Daily Receiving
                                    </Link>
                                    <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                        Daily Shipped
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Logs section coming soon...</Typography>
                </Box>
            )}

            {/* Customer Modal */}
            <CustomerModal
                open={isCustomerModalOpen}
                handleClose={handleCustomerModalClose}
                customerId={customerId} // Pass customerId for editing
                onSave={handleCustomerModalSave} // Trigger this when the modal is saved
            />

            {/* Contact Modal */}
            <ContactModal
                open={isContactModalOpen}
                handleClose={handleContactModalClose}
                contactId={selectedContactId || undefined} // Pass selected contact ID or undefined for new contact
                customer_id={customerId || undefined}
                onSave={handleContactModalSave} // Trigger this when the modal is saved
            />

            <CustomerEmailModal
                open={isEmailModalOpen}
                handleClose={() => setIsEmailModalOpen(false)}
                customer_id={customerId}
                onSave={handleEmailModalSave}
            />
        </Box>
    );
};

export default CustomerProfilePage;
