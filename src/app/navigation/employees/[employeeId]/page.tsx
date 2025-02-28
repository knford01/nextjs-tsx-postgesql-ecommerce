// src/app/navication/employees/[employeeId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { fetchEmployeeById } from '@/db/employee-data';
import EmployeeModal from '@/components/modals/EmployeeModal';
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
    const employeeId = params.employeeId as string;

    const combinedPermissions = useCombinedPermissions();
    const userCanEdit = hasAccess(combinedPermissions, 'employees', 'edit_employees');

    useEffect(() => {
        const loadEmployeeData = async () => {
            try {
                const employeeData = await fetchEmployeeById(employeeId);
                setEmployee(employeeData);
                console.log("employee: ", employee);
            } catch (error) {
                console.error('Failed to load employee data:', error);
            }
        };

        if (!hasAccess(combinedPermissions, 'employees', 'employees')) {
            router.push('/navigation/403');
        } else {
            loadEmployeeData();
        }
    }, [employeeId, combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const handleEmployeeModalSave = async () => {
        const updatedEmployee = await fetchEmployeeById(employeeId);
        setEmployee(updatedEmployee);
        setIsEmployeeModalOpen(false);
    };

    const tabsConfig = [
        { label: 'Details', permission: 'employee_details' },
        { label: 'Schedule', permission: 'employee_schedule' },
        { label: 'Attendance', permission: 'employee_attendance' },
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
                        <Typography>Employee Schedule coming soon...</Typography>
                    </Box>
                )}

                {activeTab === 2 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Employee Attendance coming soon...</Typography>
                    </Box>
                )}

                {activeTab === 3 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Employee Leave Requests coming soon...</Typography>
                    </Box>
                )}

                <EmployeeModal
                    open={isEmployeeModalOpen}
                    handleClose={() => setIsEmployeeModalOpen(false)}
                    employeeId={employeeId}
                    loadEmployees={handleEmployeeModalSave}
                />

            </Box>
        </>
    );
};

export default EmployeeProfilePage;
