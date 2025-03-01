import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchDepartments } from '@/db/employee-settings-data';
import DepartmentModal from '@/components/modals/DepartmentModal';

const DepartmentsDataGrid: React.FC = () => {
    const theme = useTheme();
    const [departments, setDepartments] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDepartmentId, setCurrentDepartmentId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadDepartments = useCallback(async () => {
        const departmentData = await fetchDepartments();
        setDepartments(departmentData || []);
    }, []);

    // Load departments on component mount
    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]);

    const handleOpenModal = (departmentId?: number) => {
        setCurrentDepartmentId(departmentId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentDepartmentId(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'active_status', headerName: 'Active', flex: 0.5, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 150,
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
                rows={departments}
                columns={columns}
                fileName="departments_export"
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
                        {isMobile ? 'Create' : 'Create Department'}
                    </Button>
                }
                columnsToIgnore={['actions']}
            />

            <DepartmentModal
                open={modalOpen}
                handleClose={handleCloseModal}
                departmentId={currentDepartmentId}
                loadDepartments={loadDepartments}
            />
        </>
    );
};

export default DepartmentsDataGrid;
