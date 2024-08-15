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
    const router = useRouter();
    const { customerId } = params;

    const [emails, setEmails] = useState<any>([]);
    const [emailFormData, setEmailFormData] = useState({
        subject: '',
        body: '',
        recipients: []
    });

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
        <Box sx={{ mt: 2, mx: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="customer-profile-tabs" sx={{ '.MuiTab-root': { textTransform: 'none' }, }}>
                <Tab label="Details" />
                <Tab label="Reports" />
                <Tab label="Logs" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Customer Details Card */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                            <CardContent sx={{ position: 'relative' }}>
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
                                        src={customer.avatar || ''}
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
                                        <Typography sx={{ p: 1 }}>{customer.contact_phone}</Typography>
                                        <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        <Typography sx={{ p: 1 }}>{customer.contact_email}</Typography>
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
                                    <Grid
                                        container
                                        spacing={2}
                                        key={index}
                                        sx={{ mb: 2, cursor: 'pointer' }}  // Add cursor: pointer here
                                        onClick={() => handleEditContact(contact.id)}
                                    >
                                        <Grid item xs={4}>
                                            <Typography>{contact.first_name} {contact.last_name}</Typography>
                                            <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>{contact.phone_number}</Typography>
                                            <Divider sx={{ bgcolor: theme.palette.divider }} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            {contact.main == 1 && (
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
                                    <Typography variant="h6">Sent Emails</Typography>
                                </Box>
                                <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                                {emails.map((email: any, index: number) => (
                                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography>{new Date(email.date_created).toLocaleString()}</Typography>
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
                </Grid>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
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
                </Box>
            )}

            {activeTab === 2 && (
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
