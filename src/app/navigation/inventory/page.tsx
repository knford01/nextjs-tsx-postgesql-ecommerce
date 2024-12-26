'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme, } from '@mui/material';
import { fetchInventory } from '@/db/inventory-data';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import ManufacturersTab from '@/components/inventory/ManufacturerTab';
import ModelsTab from '@/components/inventory/ModelsTab';

const InventoryPage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [inventory, setInventory] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<any>(0);
    const { warehouseId } = params;
    const combinedPermissions = useCombinedPermissions();

    // const loadInventory = async () => {
    //     const data = await fetchInventory();
    //     setInventory(data);
    // };

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'inventory')) {
            router.push('@app/navigation/403');
        } else {
            // loadInventory();
        }
    }, [combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const updateSessionWH = () => {

    };

    const tabsConfig = [
        { label: 'Inventory', permission: 'inventory' },
        { label: 'Items', permission: 'items' },
        { label: 'Manufacturers', permission: 'manufacturers' },
        { label: 'Models', permission: 'models' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'inventory', tab.permission));

    if (!inventory) {
        return <Typography>Failed to load inventory...</Typography>;
    }

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
                <Box sx={{ mt: 2 }}>
                    <Typography>Inventory section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Item section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <ManufacturersTab />
            )}

            {activeTab === 3 && (
                <ModelsTab />
            )}
        </Box>
    );
};

export default InventoryPage;

