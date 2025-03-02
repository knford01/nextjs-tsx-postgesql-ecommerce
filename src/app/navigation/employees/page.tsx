'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import EmployeesTab from '@/components/employees/EmployeesTab';
import SchedulingTab from '@/components/employees/SchedulingTab';
// import TimeLogTab from '@/components/employees/TimeLogTab';
// import PTOLeaveTab from '@/components/employees/PTOLeaveTab';
// import ReportsTab from '@/components/employees/ReportsTab';
import SettingsTab from '@/components/employees/SettingsTab';

const EmployeesPage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<any>(0);
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'employees')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const tabsConfig = [
        { label: 'Employees', permission: 'employees' },
        { label: 'Scheduling', permission: 'scheduling' },
        { label: 'Time Cards', permission: 'time_cards' },
        { label: 'Time Logs', permission: 'time_logs' },
        { label: 'PTO Leave', permission: 'pto' },
        { label: 'Reports', permission: 'reports' },
        { label: 'Settings', permission: 'settings' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'employees', tab.permission));

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="employees-tabs"
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
                <EmployeesTab />
            )}

            {activeTab === 1 && (
                <SchedulingTab />
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Time Cards section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Time Logs section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 4 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>PTO Leave section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 5 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Reports section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 6 && (
                <SettingsTab />
            )}
        </Box>
    );
};

export default EmployeesPage;
