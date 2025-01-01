'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
// import employeesTab from '@/components/employees/employeesTab';
// import schedulingTab from '@/components/employees/schedulingTab';
// import attendanceTab from '@/components/employees/attendanceTab';
// import ptoTab from '@/components/employees/ptoTab';
// import reportsTab from '@/components/employees/reportsTab';
// import settingsTab from '@/components/employees/settingsTab';

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
        { label: 'Attendance', permission: 'attendance' },
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
                <Box sx={{ mt: 2 }}>
                    <Typography>Employees section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Scheduling section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Attendance section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>PTO Leave section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 4 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Reports section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 5 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Settings section coming soon...</Typography>
                </Box>
            )}
        </Box>
    );
};

export default EmployeesPage;
