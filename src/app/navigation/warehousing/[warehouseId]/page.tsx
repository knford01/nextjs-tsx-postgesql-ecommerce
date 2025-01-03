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
    // const [receivingAnchorEl, setReceivingAnchorEl] = useState<null | HTMLElement>(null);
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

    // const handleReceivingClick = (event: React.MouseEvent<HTMLElement>) => {
    //     setReceivingAnchorEl(event.currentTarget);
    // };

    // const handleReceivingClose = () => {
    //     setReceivingAnchorEl(null);
    // };

    // const handleReceivingOptionClick = (option: string) => {
    //     setReceivingAnchorEl(null);
    //     if (option === 'Staging') {
    //         setActiveTab(6);
    //     }
    //     if (option === 'Put Away') {
    //         setActiveTab(7);
    //     }
    //     if (option === 'History') {
    //         setActiveTab(8);
    //     }
    // };

    const tabsConfig = [
        { label: 'Dashboard', permission: 'dashboard' },
        { label: 'Staging', permission: 'receiving' },
        { label: 'Put Away', permission: 'receiving' },
        { label: 'History', permission: 'receiving' },
        { label: 'Fulfilment', permission: 'fulfilment' },
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
                    // tab.label === 'Receiving' ? (
                    //     <Tab
                    //         key={tab.label}
                    //         label={tab.label}
                    //         onClick={handleReceivingClick}
                    //     />
                    // ) : (
                    <Tab key={tab.label} label={tab.label} />
                    // )
                ))}
            </Tabs>

            {/* <Menu
                anchorEl={receivingAnchorEl}
                open={Boolean(receivingAnchorEl)}
                onClose={handleReceivingClose}
            >
                <MenuItem onClick={() => handleReceivingOptionClick('Staging')}>Staging</MenuItem>
                <MenuItem onClick={() => handleReceivingOptionClick('Put Away')}>Put Away</MenuItem>
                <MenuItem onClick={() => handleReceivingOptionClick('History')}>History</MenuItem>
            </Menu> */}

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
                <Box>Fulfilment Coming Soon...</Box>
            )}

            {activeTab === 5 && (
                <ReportsTab
                    theme={theme}
                    warehouseId={warehouseId}
                />
            )}

            {activeTab === 6 && (
                <LocationsTab warehouseId={warehouseId} />
            )}

            {activeTab === 7 && (
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
