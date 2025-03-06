import { useEffect, useState } from 'react';
import { showErrorToast } from '@/components/ui/ButteredToast';
import { fetchGroupById } from '@/db/task-settings-data';
import { fetchGroupUserByUserID } from '@/db/task-board-data';

export function useGroupUsers(selectedGroup: OptionType | null) {
    const [groupUsers, setGroupUsers] = useState<{ user_name: string; role_display: string }[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!selectedGroup) return;
            try {
                const fetchedUsersCSV = await fetchGroupById(selectedGroup.value);
                if (!fetchedUsersCSV?.user_ids) return;

                const userIds = fetchedUsersCSV.user_ids.split(',').map((id: string) => id.trim()).filter(Boolean);
                const users = await Promise.all(userIds.map((id: string) => fetchGroupUserByUserID(id)));

                setGroupUsers(users);
            } catch (error) {
                showErrorToast('Failed to load group users.');
            }
        };

        fetchUsers();
    }, [selectedGroup]);

    return groupUsers;
}
