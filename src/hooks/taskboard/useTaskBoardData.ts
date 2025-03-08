import { useEffect, useState } from 'react';
import { showErrorToast } from '@/components/ui/ButteredToast';
import { fetchUserTaskBoardGroup, setUserTaskBoardGroup } from '@/db/user-data';
import { fetchActiveGroups } from '@/db/task-settings-data';

export function useTaskBoardData() {
    const [groups, setGroups] = useState<OptionType[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<OptionType | null>(null);
    const [sessionUser, setSessionUser] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedGroups = await fetchActiveGroups();
                const formattedGroups = [
                    ...fetchedGroups.map((group: any) => ({
                        value: group.id.toString(),
                        label: group.name,
                    })),
                ];
                setGroups(formattedGroups);

                const response = await fetch('/api/auth/session');
                const session = await response.json();
                setSessionUser(session.user);

                const taskBoardGroup = await fetchUserTaskBoardGroup(session.user.id);
                if (taskBoardGroup.value) setSelectedGroup(taskBoardGroup);
            } catch (error) {
                showErrorToast('Failed to fetch task board data.');
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (sessionUser && selectedGroup) {
            setUserTaskBoardGroup(sessionUser.id, selectedGroup.value).catch(() =>
                showErrorToast('Failed to save selected group.')
            );
        }
    }, [selectedGroup, sessionUser]);

    return { groups, selectedGroup, setSelectedGroup, sessionUser };
}
