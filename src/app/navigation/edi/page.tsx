'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
// import ordersTab from '@/components/edi/ordersTab';
// import qualityTab from '@/components/edi/qualityTab';
// import shippedTab from '@/components/edi/shippedTab';
// import historyTab from '@/components/edi/historyTab';
// import settingsTab from '@/components/edi/settingsTab';

const EDIPage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<any>(0);
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'edi_fulfillment')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const tabsConfig = [
        { label: 'Orders', permission: 'orders' },
        { label: 'Quality Assurance', permission: 'quality_assurance' },
        { label: 'Shipped', permission: 'shipped' },
        { label: 'History', permission: 'history' },
        { label: 'Settings', permission: 'settings' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'edi_fulfillment', tab.permission));

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="edi-tabs"
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
                <Box sx={{ mt: 2 }}>
                    <Typography>Orders section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>QA section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Shipped section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>History section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 4 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Settings section coming soon...</Typography>
                </Box>
            )}
        </Box>
    );
};

export default EDIPage;
