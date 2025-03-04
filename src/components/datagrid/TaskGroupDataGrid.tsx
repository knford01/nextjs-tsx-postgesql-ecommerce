import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchGroups } from '@/db/task-settings-data';
import GroupsModal from '@/components/modals/tasks/GroupsModal';

const TaskGroupDataGrid: React.FC = () => {
    const theme = useTheme();
    const [groups, setGroups] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadGroups = useCallback(async () => {
        const groupData = await fetchGroups();
        setGroups(groupData || []);
    }, []);

    // Load groups on component mount
    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    const handleOpenModal = (groupId?: number) => {
        setCurrentGroupId(groupId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentGroupId(undefined);
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
                />
            ),
        },
    ];

    return (
        <>
            <CustomDataGrid
                rows={groups}
                columns={columns}
                fileName="task_groups_export"
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
                        {isMobile ? 'Create' : 'Create Group'}
                    </Button>
                }
                columnsToIgnore={['actions']}
            />

            <GroupsModal
                open={modalOpen}
                handleClose={handleCloseModal}
                groupId={currentGroupId}
                loadGroups={loadGroups}
            />
        </>
    );
};

export default TaskGroupDataGrid;
