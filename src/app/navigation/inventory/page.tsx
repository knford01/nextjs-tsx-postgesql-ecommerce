'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme, } from '@mui/material';
import { fetchInventory } from '@/db/inventory-data';
import { fetchItems } from '@/db/item-data';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';

const CustomerProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [inventory, setInventory] = useState<any>([]);
    const [items, setItems] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<any>(0);
    const combinedPermissions = useCombinedPermissions();

    const loadInventory = async () => {
        const data = await fetchInventory();
        setInventory(data);
    };

    const loadItems = async () => {
        const data = await fetchItems();
        setItems(data);
    };

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'inventory')) {
            router.push('@app/navigation/403');
        } else {
            loadInventory();
            loadItems();
        }
    }, [combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    if (!inventory) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 2, mx: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="inventory-tabs" sx={{ '.MuiTab-root': { textTransform: 'none' }, }}>
                <Tab label="Inventory" />
                <Tab label="Items" />
                {/* <Tab label="Reports" />
                <Tab label="Logs" /> */}
            </Tabs>

            {activeTab === 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Inventory section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Items section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Logs section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Logs section coming soon...</Typography>
                </Box>
            )}

        </Box>
    );
};

export default CustomerProfilePage;

