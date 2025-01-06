import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchEmployees } from '@/db/employee-data';
import EmployeeModal from '@/components/modals/EmployeeModal';
import Image from 'next/image';

const EmployeesDataGrid: React.FC = () => {
    const theme = useTheme();
    const [employees, setEmployees] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadEmployees = useCallback(async () => {
        const employeeData = await fetchEmployees();
        setEmployees(employeeData || []);
    }, []);

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

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: 'Avatar',
            minWidth: 70,
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
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
                                height: 35
                            }}
                        />
                    </div>
                ) : null
            ),
        },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'department_name', headerName: 'Department', flex: 1, minWidth: 150 },
        { field: 'role_display', headerName: 'Role', flex: 1, minWidth: 150 },
        { field: 'time_employed', headerName: 'Time Employed', flex: 1, minWidth: 150 },
        { field: 'active_status', headerName: 'Active', flex: 0.5, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 250, // Ensure actions column has enough space
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenModal(params.row.id)}
                    startIcon={<PencilIcon className="w-5" />}
                    sx={{
                        p: 1, pr: 0, mr: 1,
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
                >
                </Button>
            ),
        },
    ];

    return (
        <>
            <CustomDataGrid
                rows={employees}
                columns={columns}
                fileName="employees_export"
                buttons={
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
                }
                columnsToIgnore={['actions']}
            />

            <EmployeeModal
                open={modalOpen}
                handleClose={handleCloseModal}
                employeeId={currentEmployeeId}
                loadEmployees={loadEmployees}
            />
        </>
    );
};

export default EmployeesDataGrid;
