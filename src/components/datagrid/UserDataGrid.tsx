// src/components/datagrid/UserDataGrid.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import Image from 'next/image';
import { AddUser, UpdateUser, UserAccess, UserStatus } from '@/components/ui/buttons/Buttons';
import { User } from '@/types/user';
import { fetchUsers } from '@/db/user-data';
import CustomDataGrid from './CustomDataGrid';
import EmulateUser from '../ui/buttons/EmulateUser';

interface UserDataGridProps {
    filterId?: string;
}

const UserDataGrid: React.FC<UserDataGridProps> = ({ filterId }) => {
    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = useCallback(async () => {
        const usersData = await fetchUsers();
        setUsers(usersData);
    }, [setUsers]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
            minWidth: 70, // Set minimum width to prevent squishing
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
                params.value ? (
                    <Image
                        src={params.value}
                        alt="Avatar"
                        width={35}
                        height={35}
                        style={{ borderRadius: '50%', marginTop: '8px', maxWidth: 35, maxHeight: 35 }}
                    />
                ) : null
            ),
        },
        { field: 'first_name', flex: 1, headerName: 'First Name', type: 'string', minWidth: 150 },
        { field: 'last_name', flex: 1, headerName: 'Last Name', type: 'string', minWidth: 150 },
        { field: 'email', flex: 1, headerName: 'Email', type: 'string', minWidth: 200 },
        { field: 'role_display', flex: 1, headerName: 'Role', type: 'string', minWidth: 100 },
        { field: 'active', flex: 0.5, headerName: 'Active', type: 'string', minWidth: 80 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            flex: 1.5,
            minWidth: 250,
            renderCell: (params) => (
                <>
                    <EmulateUser row={params.row} loadUsers={loadUsers} />
                    <UpdateUser id={params.row.id} row={params.row} loadUsers={loadUsers} />
                    <UserAccess id={params.row.id} />
                    <UserStatus id={params.row.id} curStatus={params.row.active === 'Yes' ? 1 : 0} loadUsers={loadUsers} />
                </>
            ),
        },
    ];

    return (
        <CustomDataGrid
            rows={users}
            columns={columns}
            fileName="users_export"
            buttons={<AddUser loadUsers={loadUsers} />}
            columnsToIgnore={['avatar', 'actions']}
        />
    );
};

export default UserDataGrid;
