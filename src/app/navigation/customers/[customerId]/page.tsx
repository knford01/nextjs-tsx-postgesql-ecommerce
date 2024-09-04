//src/app/navigation/customers/[customerId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { fetchCustomerById, fetchCustomerEmails } from '@/db/customer-data';
import { fetchContactsByCustomerId } from '@/db/contact-data';
import CustomerModal from '@/components/modals/CustomerModals';
import ContactModal from '@/components/modals/ContactModal';
import CustomerEmailModal from '@/components/modals/EmailModals';
import DetailsTab from '@/components/customers/DetailsTab';
import ReportsTab from '@/components/customers/ReportsTab';
import ProjectsTab from '@/components/customers/ProjectsTab';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';

const CustomerProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [contacts, setContacts] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<any>(0);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [emails, setEmails] = useState<any>([]);
    const { customerId } = params;

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        const loadCustomerData = async () => {
            try {
                const customerData = await fetchCustomerById(customerId);
                setCustomer(customerData);

                const contactData = await fetchContactsByCustomerId(customerId);
                setContacts(contactData);

                const emailData = await fetchCustomerEmails(customerId);
                setEmails(emailData);
            } catch (error) {
                console.error('Failed to load customer data:', error);
            }
        };

        if (!hasAccess(combinedPermissions, 'navigation', 'customers')) {
            router.push('/navigation/403');
        } else {
            loadCustomerData();
        }
    }, [customerId, combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const handleCustomerModalSave = async () => {
        const updatedCustomer = await fetchCustomerById(customerId);
        setCustomer(updatedCustomer);
        setIsCustomerModalOpen(false);
    };

    const handleContactModalSave = async () => {
        const updatedContacts = await fetchContactsByCustomerId(customerId);
        setContacts(updatedContacts);
        setIsContactModalOpen(false);
        setSelectedContactId(null); // Clear selected contact ID after saving
    };

    const handleEmailModalSave = async () => {
        const updatedEmails = await fetchCustomerEmails(customerId);
        setEmails(updatedEmails);
        setIsEmailModalOpen(false);
    };

    const tabsConfig = [
        { label: 'Details', permission: 'details' },
        { label: 'Projects', permission: 'projects' },
        { label: 'Reports', permission: 'reports' },
        { label: 'Logs', permission: 'logs' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'customers', tab.permission));

    if (!customer) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
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
                    {accessibleTabs.map((tab) => (
                        <Tab key={tab.label} label={tab.label} />
                    ))}
                </Tabs>

                {activeTab === 0 && (
                    <DetailsTab
                        theme={theme}
                        customer={customer}
                        handleEditClick={() => setIsCustomerModalOpen(true)}
                        contacts={contacts}
                        handleAddContact={() => {
                            setSelectedContactId(null);
                            setIsContactModalOpen(true);
                        }}
                        handleEditContact={(contactId: string) => {
                            setSelectedContactId(contactId);
                            setIsContactModalOpen(true);
                        }}
                        emails={emails}
                        handleSendEmail={() => setIsEmailModalOpen(true)}
                    />
                )}

                {activeTab === 1 && (
                    <ProjectsTab
                        theme={theme}
                        customerId={customerId}
                    />
                )}

                {activeTab === 2 && (
                    <ReportsTab
                        theme={theme}
                    />
                )}

                {activeTab === 3 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Logs section coming soon...</Typography>
                    </Box>
                )}

                <CustomerModal
                    open={isCustomerModalOpen}
                    handleClose={() => setIsCustomerModalOpen(false)}
                    customerId={customerId}
                    onSave={handleCustomerModalSave}
                />

                <ContactModal
                    open={isContactModalOpen}
                    handleClose={() => {
                        setIsContactModalOpen(false);
                        setSelectedContactId(null);
                    }}
                    contactId={selectedContactId || undefined}
                    customer_id={customerId || undefined}
                    onSave={handleContactModalSave}
                />

                <CustomerEmailModal
                    open={isEmailModalOpen}
                    handleClose={() => setIsEmailModalOpen(false)}
                    customer_id={customerId}
                    onSave={handleEmailModalSave}
                />

            </Box>
        </>
    );
};

export default CustomerProfilePage;
