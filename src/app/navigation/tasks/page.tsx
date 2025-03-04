'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import TaskBoardTab from '@/components/tasks/TaskBoardTab';
// import reportsTab from '@/components/tasks/reportsTab';
import SettingsTab from '@/components/tasks/SettingsTab';

const TasksPage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<any>(0);
    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'tasks')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const tabsConfig = [
        { label: 'Task Board', permission: 'task_board' },
        { label: 'Tasks', permission: 'tasks' },
        { label: 'Reports', permission: 'reports' },
        { label: 'Settings', permission: 'settings' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'tasks', tab.permission));

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="tasks-profile-tabs"
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
                <TaskBoardTab />
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Tasks section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Reports section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <SettingsTab />
            )}
        </Box>
    );
};

export default TasksPage;
