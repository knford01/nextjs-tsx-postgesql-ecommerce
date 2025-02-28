import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { showErrorToast } from '@/components/ui/ButteredToast';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchEmployees, fetchActiveEmployees, fetchInactiveEmployees, fetchEmployeeByUserId } from '@/db/employee-data';
import EmployeeModal from '@/components/modals/EmployeeModal';
import HistoryModal from '@/components/modals/HistoryModal';
import Image from 'next/image';

interface SearchParameters {
    status?: { value: string; label: string };
}

const EmployeesDataGrid: React.FC<{ searchParameters?: SearchParameters }> = ({ searchParameters }) => {
    const theme = useTheme();
    const combinedPermissions = useCombinedPermissions();
    const [sessionUser, setSessionUser] = useState<any>(null); // Ensure it's null initially
    const [employees, setEmployees] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState<number | undefined>(undefined);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const userCanEdit = hasAccess(combinedPermissions, 'employees', 'edit_employees');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                setSessionUser(session.user);
            } catch (error) {
                showErrorToast('Failed to fetch session');
            }
        };

        checkSession();
    }, []);

    const loadEmployees = useCallback(async () => {
        if (!sessionUser) return;

        let employeeData = [];

        if (userCanEdit && searchParameters?.status?.value === 'true') {
            employeeData = await fetchActiveEmployees();
        } else if (userCanEdit && searchParameters?.status?.value === 'false') {
            employeeData = await fetchInactiveEmployees();
        } else {
            if (userCanEdit) {
                employeeData = await fetchEmployees();
            } else {
                employeeData = await fetchEmployeeByUserId(sessionUser.id);
            }
        }

        setEmployees(employeeData || []);
    }, [searchParameters?.status, userCanEdit, sessionUser]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const handleOpenModal = (employeeId?: number) => {
        setCurrentEmployeeId(employeeId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentEmployeeId(undefined);
    };

    const handleOpenHistoryModal = (employeeId?: number) => {
        setCurrentEmployeeId(employeeId);

        setTimeout(() => {
            setHistoryModalOpen(true);
        }, 0);
    };

    const handleCloseHistoryModal = () => {
        setHistoryModalOpen(false);
        setCurrentEmployeeId(undefined);
    };

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: 'Avatar',
            minWidth: 70,
            flex: 0.2,
            sortable: false,
            renderCell: (params) =>
                params.value ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Image
                            src={params.value}
                            alt="Avatar"
                            width={35}
                            height={35}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                width: 35,
                                height: 35,
                            }}
                        />
                    </div>
                ) : null,
        },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'department_name', headerName: 'Department', flex: 1, minWidth: 150 },
        { field: 'role_display', headerName: 'Role', flex: 1, minWidth: 150 },
        { field: 'time_employed', headerName: 'Time Employed', flex: 1, minWidth: 150 },
        { field: 'active_status', headerName: 'Active', flex: 0.5, minWidth: 100 },
    ];

    if (userCanEdit) {
        columns.push({
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 250,
            renderCell: (params) => (
                <div style={{ gap: '8px' }}>
                    {/* Edit Button */}
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenModal(params.row.id)}
                        startIcon={<PencilIcon className="w-5" />}
                        sx={{
                            p: 1,
                            pr: 0,
                            mr: 1,
                            backgroundColor: `${theme.palette.info.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            borderColor: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.info.dark} !important`,
                                color: `${theme.palette.text.secondary} !important`,
                            },
                            [theme.breakpoints.down('sm')]: {
                                minWidth: 'unset',
                                padding: '4px 8px',
                            },
                        }}
                    />

                    {/* History Button */}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenHistoryModal(params.row.id)}
                        startIcon={<ClockIcon className="w-5" />}
                        sx={{
                            p: 1,
                            pr: 0,
                            backgroundColor: `${theme.palette.warning.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            borderColor: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.warning.dark} !important`,
                                color: `${theme.palette.text.secondary} !important`,
                            },
                            [theme.breakpoints.down('sm')]: {
                                minWidth: 'unset',
                                padding: '4px 8px',
                            },
                        }}
                    />
                </div>
            ),
        });
    }

    return (
        <>
            <CustomDataGrid
                rows={employees}
                columns={columns}
                fileName="employees_export"
                buttons={
                    userCanEdit && (
                        <Button
                            startIcon={<PlusIcon className="h-5" />}
                            onClick={() => handleOpenModal()}
                            variant="contained"
                            sx={{
                                r: 0,
                                backgroundColor: `${theme.palette.secondary.main} !important`,
                                color: `${theme.palette.text.primary} !important`,
                                '&:hover': {
                                    backgroundColor: `${theme.palette.action.hover} !important`,
                                },
                            }}
                        >
                            {isMobile ? 'Create' : 'Create Employee'}
                        </Button>
                    )
                }
                columnsToIgnore={['avatar', 'actions']}
            />

            <EmployeeModal open={modalOpen} handleClose={handleCloseModal} employeeId={currentEmployeeId} loadEmployees={loadEmployees} />

            <HistoryModal open={historyModalOpen} handleClose={handleCloseHistoryModal} table='employee_history' id={currentEmployeeId} />
        </>
    );
};

export default EmployeesDataGrid;
