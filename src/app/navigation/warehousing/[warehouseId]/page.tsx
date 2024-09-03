'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { fetchWarehouseById } from '@/db/warehouse-data';
import WarehouseModal from '@/components/modals/WarehouseModal';
import DetailsTab from '@/components/warehousing/DetailsTab';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import LocationsTab from '@/components/warehousing/LocationsTab';

const WarehouseProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [warehouse, setWarehouse] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<any>(0);
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const { warehouseId } = params;
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'warehousing')) {
            router.push('/navigation/403');
        } else {
            const loadWarehouse = async () => {
                const warehouseData = await fetchWarehouseById(warehouseId);
                setWarehouse(warehouseData);
            };

            loadWarehouse();
        }
    }, [warehouseId, combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const handleWarehouseModalSave = async () => {
        const updatedWarehouse = await fetchWarehouseById(warehouseId);
        setWarehouse(updatedWarehouse);
        setIsWarehouseModalOpen(false);
    };

    const tabsConfig = [
        { label: 'Dashboard', permission: 'dashboard' },
        { label: 'Receiving', permission: 'receiving' },
        { label: 'Fulfilment', permission: 'fulfilment' },
        { label: 'Reports', permission: 'reports' },
        { label: 'Settings', permission: 'settings' },
        { label: 'Locations', permission: 'locations' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'warehousing', tab.permission));

    if (!warehouse) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="warehouse-profile-tabs"
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
                    warehouse={warehouse}
                    handleEditClick={() => setIsWarehouseModalOpen(true)}
                />
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Receiving section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Fulfilment section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Reports section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 4 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Settings section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 5 && (
                <LocationsTab
                    warehouseId={warehouseId}
                />
            )}

            <WarehouseModal
                open={isWarehouseModalOpen}
                handleClose={() => setIsWarehouseModalOpen(false)}
                warehouseId={warehouseId}
                onSave={handleWarehouseModalSave}
            />
        </Box>
    );
};

export default WarehouseProfilePage;
