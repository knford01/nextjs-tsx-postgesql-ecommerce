'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, useMediaQuery } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import { SearchableSelect } from '@/styles/inputs/SearchableSelect';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import ClearButton from '@/components/ui/buttons/ClearButton';
import { fetchActiveGroups, fetchGroupById } from '@/db/task-settings-data';
import { fetchGroupUserByUserID } from '@/db/task-board-data';
import { fetchUserTaskBoardGroup, setUserTaskBoardGroup } from '@/db/user-data';

export default function SchedulingTab() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [groups, setGroups] = useState<OptionType[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<OptionType | null>(null);
    const [groupUsers, setGroupUsers] = useState<{ user_name: string; role_display: string }[]>([]);
    const [headerGroups, setHeaderGroups] = useState<{ title: string; }[]>([]);

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'tasks', 'task_board')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    const [sessionUser, setSessionUser] = useState<any>(null);
    useEffect(() => {
        const loadGroups = async () => {
            try {
                const fetchedGroups = await fetchActiveGroups();
                const formattedGroups = [
                    ...fetchedGroups.map((group: any) => ({
                        value: group.id.toString(),
                        label: group.name,
                    })),
                ];
                setGroups(formattedGroups);
            } catch (error) {
                showErrorToast('Failed to load groups.');
            }
        };
        const loadUserSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                setSessionUser(session.user);

                const taskBoardGroup = await fetchUserTaskBoardGroup(session.user.id);
                console.log("taskBoardGroup:", taskBoardGroup);
                if (taskBoardGroup) {
                    setSelectedGroup(taskBoardGroup);
                }
            } catch (error) {
                showErrorToast('Failed to fetch session');
            }
        };

        loadGroups().then(loadUserSession);
    }, []);

    useEffect(() => {
        const loadGroupUsersCSV = async (): Promise<string | null> => {
            console.log("selectedGroup: ", selectedGroup);
            try {
                if (!selectedGroup) return null;
                const fetchedUsersCSV = await fetchGroupById(selectedGroup.value);
                return fetchedUsersCSV?.user_ids || null;
            } catch (error) {
                showErrorToast('Failed to load group users.');
                return null;
            }
        };

        const loadGroupUsers = async (fetchedUsersCSV: string | null) => {
            try {
                if (!fetchedUsersCSV) return;
                const userIds = fetchedUsersCSV.split(',').map(userId => userId.trim());
                const validUserIds = userIds.filter(id => id.length > 0);
                const fetchedGroupUsers = await Promise.all(validUserIds.map(id => fetchGroupUserByUserID(id)));
                setGroupUsers(fetchedGroupUsers);
            } catch (error) {
                showErrorToast('Failed to load group users.');
            }
        };

        const fetchAndLoadUsers = async () => {
            const fetchedUsersCSV = await loadGroupUsersCSV();
            await loadGroupUsers(fetchedUsersCSV);
        };

        fetchAndLoadUsers();
    }, [selectedGroup]);

    useEffect(() => {
        const saveUserGroupPreference = async () => {
            if (sessionUser && selectedGroup) {
                console.log("sessionUser.id: ", sessionUser.id);
                console.log("selectedGroup.value: ", selectedGroup.value);
                try {
                    await setUserTaskBoardGroup(sessionUser.id, selectedGroup.value);
                } catch (error) {
                    showErrorToast('Failed to save selected group.');
                }
            }
        };

        saveUserGroupPreference();
    }, [selectedGroup, sessionUser]);

    const handleClear = () => {
        setSelectedGroup(null);
    };

    useEffect(() => {
        const headers = ['On Hold', 'Pending', ...groupUsers.map(user => user.user_name), 'Completed', 'Canceled'];
        setHeaderGroups(headers.map(title => ({ title })));
    }, [groupUsers]);

    return (
        <Container maxWidth={false} sx={{ m: 0, mt: 5, width: 'auto', height: 'auto', transition: 'all 0.3s' }}>
            <Grid
                container
                spacing={2}
                sx={{
                    mb: 1.5,
                    alignItems: 'center',
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    overflowX: isMobile ? 'auto' : 'visible',
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    gap: isMobile ? 2 : 0,
                    '&::-webkit-scrollbar': { display: 'none' },
                    position: 'relative',
                }}
            >
                <Grid item sx={{ flexShrink: 0, mt: 1 }}>
                    <ClearButton onClick={handleClear} />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', gap: 2, minWidth: isMobile ? '300px' : 'auto', overflow: 'visible' }}>
                    <SearchableSelect
                        label="Group"
                        options={groups}
                        value={selectedGroup}
                        onChange={(value) => setSelectedGroup(value as OptionType)}
                        placeholder="Select Group"
                    />
                </Grid>
            </Grid>

            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.text.primary }}>
                        <TableRow>
                            {headerGroups.map(({ title }, i) => (
                                <TableCell
                                    key={i}
                                    sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize',
                                        borderRight: '1px solid #ccc',
                                        borderBottom: '1px solid #ccc'
                                    }}
                                >
                                    {title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {/* <TableCell sx={{ backgroundColor: theme.palette.secondary.main, fontWeight: 'bold', textTransform: 'capitalize' }}></TableCell> */}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

