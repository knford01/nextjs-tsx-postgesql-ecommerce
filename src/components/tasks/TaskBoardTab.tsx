'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import { SearchableSelect } from '@/styles/inputs/SearchableSelect';
import { showErrorToast } from '@/components/ui/ButteredToast';
import ClearButton from '@/components/ui/buttons/ClearButton';
import TaskBoardTable from './taskboard/TaskBoardTable';
import { useTaskBoardData } from '@/hooks/taskboard/useTaskBoardData';
import { useGroupUsers } from '@/hooks/taskboard/useGroupUsers';
import { useTaskBoardTasks } from '@/hooks/taskboard/useTaskBoardTasks';

export default function SchedulingTab() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { groups, selectedGroup, setSelectedGroup, sessionUser } = useTaskBoardData();
    const groupUsers = useGroupUsers(selectedGroup);

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'tasks', 'task_board')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    const handleClear = () => setSelectedGroup(null);

    const headerTitles = ['On Hold', 'Pending', ...groupUsers.map(user => user.user_name), 'Completed', 'Canceled'];
    const tasksByColumn = useTaskBoardTasks(headerTitles, groupUsers);

    return (
        <Container maxWidth={false} sx={{ mt: 5, width: 'auto', transition: 'all 0.3s' }}>
            <Grid container spacing={2} sx={{ mb: 1.5, alignItems: 'center', overflowX: isMobile ? 'auto' : 'visible' }}>
                <Grid item>
                    <ClearButton onClick={handleClear} />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ minWidth: isMobile ? '300px' : 'auto' }}>
                    <SearchableSelect
                        label="Group"
                        options={groups}
                        value={selectedGroup}
                        onChange={(value) => setSelectedGroup(value as OptionType)}
                        placeholder="Select Group"
                    />
                </Grid>
            </Grid>

            <TaskBoardTable headers={headerTitles} tasksByColumn={tasksByColumn} sessionUser={sessionUser} />
        </Container>
    );
}
