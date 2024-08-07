// app/ui/components/datagrid/UserDataGrid.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import { AddUser, UpdateUser, UserStatus } from '@/components/ui/Buttons';
import { User } from '@/types/user';
import { fetchUsers } from '@/db/user-data';
import DataGridExporter from './DataGridExporter';

interface UserDataGridProps {
    filterId?: string;
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

const UserDataGrid: React.FC<UserDataGridProps> = ({ filterId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [tooltipInfo, setTooltipInfo] = useState<{ rowId: string | number, field: string } | null>(null);

    useEffect(() => {
        loadUsers();
        console.log('UseEffect');
    }, []);

    // const interval = setInterval(() => {
    //     console.log('setInterval');

    //     loadUsers();
    //     return () => clearInterval(interval); // Cleanup interval on unmount
    // }, 25000); // 25 seconds

    const loadUsers = useCallback(async () => {
        const usersData = await fetchUsers();
        setUsers(usersData);
    }, []);

    const handleCellClick = (params: GridCellParams) => {
        if (params.field !== 'avatar' && params.value) {
            copyToClipboard(params.value.toString());
            setTooltipInfo({ rowId: params.id, field: params.field });
            setTimeout(() => setTooltipInfo(null), 2000); // Hide the tooltip after 2 seconds
        }
    };

    const renderCell = (params: GridCellParams) => {
        const isTooltipVisible = !!(tooltipInfo && tooltipInfo.rowId === params.id && tooltipInfo.field === params.field);
        return (
            <Tooltip
                title="Copied!"
                open={isTooltipVisible}
                disableHoverListener
                disableFocusListener
                disableTouchListener
                placement="right"
            >
                <div>{params.value as React.ReactNode}</div>
            </Tooltip>
        );
    };

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
                <Image
                    src={params.value}
                    alt="Avatar"
                    width={35}
                    height={35}
                    style={{ borderRadius: '50%', marginTop: '8px', maxWidth: 35, maxHeight: 35 }}
                />
            ),
        },
        {
            field: 'first_name',
            headerName: 'First Name',
            flex: 1,
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'string',
            flex: 1.5,
        },
        {
            field: 'role_display',
            headerName: 'Role',
            type: 'string',
            flex: 1,
        },
        {
            field: 'active',
            headerName: 'Active',
            type: 'string',
            flex: 0.5,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: .75,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', pt: .75 }}>
                    <UpdateUser id={params.row.id} row={params.row} loadUsers={loadUsers} />
                    <UserStatus id={params.row.id} curStatus={params.row.active === 'Yes' ? 1 : 0} loadUsers={loadUsers} />
                </Box>
            ),
        },
    ];

    const updatedColumns = columns.map((col) => ({
        ...col,
        renderCell: col.field !== 'avatar' && col.field !== 'actions' ? renderCell : col.renderCell,
    }));

    return (
        <Box sx={{ height: '100%', width: '100%', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <DataGridExporter data={users} fileName="users_export.xlsx" />
                </Box>
                <AddUser loadUsers={loadUsers} />
            </Box>
            <DataGrid
                sx={{
                    '& .MuiDataGrid-root': {
                        borderRadius: 2,
                    },
                    '& .MuiDataGrid-main': {
                        borderRadius: 2,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                    },
                    borderRadius: '5px',
                    '& .MuiDataGrid-footerContainer': {
                        borderBottomLeftRadius: '5px',
                        borderBottomRightRadius: '5px',
                    },
                }}
                filterModel={{
                    items: filterId ? [
                        {
                            field: 'id',
                            operator: 'equals',
                            value: filterId,
                        },
                    ] : [],
                }}
                rows={users}
                columns={updatedColumns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                checkboxSelection
                disableRowSelectionOnClick
                onCellClick={handleCellClick}
            />
        </Box>
    );
};

export default UserDataGrid;
