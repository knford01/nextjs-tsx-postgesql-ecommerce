// src/components/datagrid/UserDataGrid.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import Image from 'next/image';
import { AddUser, UpdateUser, UserAccess, UserStatus } from '@/components/ui/Buttons';
import { User } from '@/types/user';
import { fetchUsers } from '@/db/user-data';
import CustomDataGrid from './CustomDataGrid';

interface UserDataGridProps {
    filterId?: string;
}

const UserDataGrid: React.FC<UserDataGridProps> = ({ filterId }) => {
    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = useCallback(async () => {
        const usersData = await fetchUsers();
        setUsers(usersData);
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: '',
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
                ) : null // If no avatar, render nothing
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
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <>
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
