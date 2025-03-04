'use client';

import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import InventoryTab from '@/components/inventory/InventoryTab';
import ItemTab from '@/components/inventory/ItemTab';
import SettingsTab from '@/components/inventory/SettingsTab';

const InventoryPage = ({ params }: any) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<any>(0);
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'inventory')) {
            router.push('@app/navigation/403');
        }
    }, [combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const tabsConfig = [
        { label: 'Inventory', permission: 'inventory' },
        { label: 'Items', permission: 'items' },
        { label: 'Settings', permission: 'settings' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'inventory', tab.permission));

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="inventory-profile-tabs"
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
                <InventoryTab />
            )}

            {activeTab === 1 && (
                <ItemTab />
            )}

            {activeTab === 2 && (
                <SettingsTab />
            )}
        </Box>
    );
};

export default InventoryPage;

