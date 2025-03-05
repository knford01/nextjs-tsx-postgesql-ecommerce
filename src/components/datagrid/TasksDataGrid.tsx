import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { showErrorToast } from '@/components/ui/ButteredToast';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchTasks, fetchTasksByCustomerId, fetchTasksByProjectId, fetchTasksByCustomerIdAndProjectId } from '@/db/task-data';
import TaskModal from '@/components/modals/tasks/TaskModal';
import HistoryModal from '@/components/modals/HistoryModal';
import Link from 'next/link';

interface SearchParameters {
    customerId?: number;
    projectId?: number;
}

const TasksDataGrid: React.FC<{ searchParameters?: SearchParameters }> = ({ searchParameters }) => {
    const theme = useTheme();
    const combinedPermissions = useCombinedPermissions();
    const [sessionUser, setSessionUser] = useState<any>(null); // Ensure it's null initially
    const [tasks, setTasks] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<number | undefined>(undefined);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const userCanEdit = hasAccess(combinedPermissions, 'tasks', 'edit_task');

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

    const loadTasks = useCallback(async () => {
        let taskData = [];

        const customerId = searchParameters?.customerId;
        const projectId = searchParameters?.projectId;

        if (customerId && projectId) {
            taskData = await fetchTasksByCustomerIdAndProjectId(customerId, projectId);
        } else if (customerId) {
            taskData = await fetchTasksByCustomerId(customerId);
        } else if (projectId) {
            taskData = await fetchTasksByProjectId(projectId);
        } else {
            taskData = await fetchTasks();
        }

        const formattedTasks = taskData.map((task: any) => ({
            ...task,
            start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : '',
            end_date: task.end_date ? new Date(task.end_date).toISOString().split('T')[0] : '',
        }));

        setTasks(formattedTasks);
    }, [searchParameters?.customerId, searchParameters?.projectId]);


    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleOpenModal = (taskId?: number) => {
        setCurrentTaskId(taskId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentTaskId(undefined);
    };

    const handleOpenHistoryModal = (taskId?: number) => {
        setCurrentTaskId(taskId);

        setTimeout(() => {
            setHistoryModalOpen(true);
        }, 0);
    };

    const handleCloseHistoryModal = () => {
        setHistoryModalOpen(false);
        setCurrentTaskId(undefined);
    };

    const columns: GridColDef[] = [
        // {
        //     field: 'view',
        //     headerName: 'View',
        //     minWidth: 70,
        //     flex: 0.2,
        //     sortable: false,
        //     renderCell: (params) => (
        //         <Link
        //             href={`/navigation/tasks/${params.row.id}`}
        //             style={{ textDecoration: 'none', color: theme.palette.text.primary, fontWeight: 'bold' }}
        //         >
        //             Visit
        //         </Link>
        //     ),
        // },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
        { field: 'customer_name', headerName: 'Customer Name', flex: 1, minWidth: 200 },
        { field: 'project_name', headerName: 'Project Name', flex: 1, minWidth: 200 },
        { field: 'status_display', headerName: 'Status', flex: 1, minWidth: 100 },
        { field: 'start_date', headerName: 'Start Date', flex: 1, minWidth: 100 },
        { field: 'end_date', headerName: 'End Date', flex: 1, minWidth: 100 },
        { field: 'active_status', headerName: 'Active', flex: 0.5, minWidth: 100 },
    ];

    if (userCanEdit) {
        columns.push({
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 200,
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
                rows={tasks}
                columns={columns}
                fileName="tasks_export"
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
                            {isMobile ? 'Create' : 'Create Task'}
                        </Button>
                    )
                }
                columnsToIgnore={['avatar', 'actions', 'view']}
            />

            <TaskModal open={modalOpen} handleClose={handleCloseModal} taskId={currentTaskId} loadTasks={loadTasks} />

            <HistoryModal open={historyModalOpen} handleClose={handleCloseHistoryModal} table='task_history' id={currentTaskId} />
        </>
    );
};

export default TasksDataGrid;
