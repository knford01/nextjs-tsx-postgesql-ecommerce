'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Menu, MenuItem, useTheme } from '@mui/material';
import { fetchWarehouseById } from '@/db/warehouse-data';
import WarehouseModal from '@/components/modals/WarehouseModal';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import DetailsTab from '@/components/warehousing/DetailsTab';
import StagingTab from '@/components/warehousing/StagingTab';
import PutAwayTab from '@/components/warehousing/PutAwayTab';
import RecHistoryTab from '@/components/warehousing/RecHistoryTab';
import ReportsTab from '@/components/warehousing/ReportsTab';
import LocationsTab from '@/components/warehousing/LocationsTab';
import SettingsTab from '@/components/warehousing/SettingsTab';

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
        { label: 'Staging', permission: 'staging' },
        { label: 'Put Away', permission: 'put_away' },
        { label: 'Receiving History', permission: 'receiving_history' },
        { label: 'Orders', permission: 'orders' },
        { label: 'Quality Assurance', permission: 'quality_assurance' },
        { label: 'Shipped', permission: 'shipped' },
        { label: 'Fulfilment History', permission: 'fulfilment_history' },
        { label: 'Reports', permission: 'reports' },
        { label: 'Locations', permission: 'locations' },
        { label: 'Settings', permission: 'settings' },
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
                <StagingTab warehouseId={warehouseId} />
            )}

            {activeTab === 2 && (
                <PutAwayTab />
            )}

            {activeTab === 3 && (
                <RecHistoryTab />
            )}

            {activeTab === 4 && (
                <Box>Order Coming Soon...</Box>
            )}

            {activeTab === 5 && (
                <Box>QA Coming Soon...</Box>
            )}

            {activeTab === 6 && (
                <Box>Shipped Coming Soon...</Box>
            )}

            {activeTab === 7 && (
                <Box>Fulfilment History Coming Soon...</Box>
            )}

            {activeTab === 8 && (
                <ReportsTab
                    theme={theme}
                    warehouseId={warehouseId}
                />
            )}

            {activeTab === 9 && (
                <LocationsTab warehouseId={warehouseId} />
            )}

            {activeTab === 10 && (
                <SettingsTab />
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
