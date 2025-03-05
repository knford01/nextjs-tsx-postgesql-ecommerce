// src/app/navication/employees/[taskId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { fetchEmployeeById } from '@/db/employee-data';
// import EmployeeModal from '@/components/modals/employees/EmployeeModal';
import EmployeeDetailsTab from '@/components/employees/EmployeeDetailsTab';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter, useParams } from 'next/navigation';

const EmployeeProfilePage = () => {
    const theme = useTheme();
    const router = useRouter();
    const [employee, setEmployee] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<any>(0);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const params = useParams();
    const taskId = params.taskId as string;

    const combinedPermissions = useCombinedPermissions();
    const userCanEdit = hasAccess(combinedPermissions, 'employees', 'edit_employees');

    useEffect(() => {
        const loadEmployeeData = async () => {
            try {
                const employeeData = await fetchEmployeeById(taskId);
                setEmployee(employeeData);
            } catch (error) {
                console.error('Failed to load employee data:', error);
            }
        };

        if (!hasAccess(combinedPermissions, 'employees', 'employees')) {
            router.push('/navigation/403');
        } else {
            loadEmployeeData();
        }
    }, [taskId, combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const handleEmployeeModalSave = async () => {
        const updatedEmployee = await fetchEmployeeById(taskId);
        setEmployee(updatedEmployee);
        setIsEmployeeModalOpen(false);
    };

    const tabsConfig = [
        { label: 'Details', permission: 'employee_details' },
        { label: 'Time Card', permission: 'employee_time_card' },
        { label: 'Time Logs', permission: 'employee_time_logs' },
        { label: 'Leave Requests', permission: 'employee_leave' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'employees', tab.permission));

    if (!employee) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            <Box sx={{ mt: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="employee-profile-tabs"
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
                    <EmployeeDetailsTab
                        theme={theme}
                        employee={employee}
                        handleEditClick={() => setIsEmployeeModalOpen(true)}
                        userCanEdit={userCanEdit}
                    />
                )}

                {activeTab === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Employee Time Card coming soon...</Typography>
                    </Box>
                )}

                {activeTab === 2 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Employee Time Logs coming soon...</Typography>
                    </Box>
                )}

                {activeTab === 3 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Employee Leave Requests coming soon...</Typography>
                    </Box>
                )}

                {/* <EmployeeModal
                    open={isEmployeeModalOpen}
                    handleClose={() => setIsEmployeeModalOpen(false)}
                    taskId={taskId}
                    loadEmployees={handleEmployeeModalSave}
                /> */}

            </Box>
        </>
    );
};

export default EmployeeProfilePage;
