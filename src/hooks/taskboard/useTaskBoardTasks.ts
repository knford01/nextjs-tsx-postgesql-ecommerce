import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchActiveTaskBoardTasks } from '@/db/task-board-data';
import { showErrorToast } from '@/components/ui/ButteredToast';

export function useTaskBoardTasks(headerTitles: string[], groupUsers: any[]) {
    const [tasksByColumn, setTasksByColumn] = useState<Record<string, any[][]>>({});
    const hasFetchedOnce = useRef(false);
    const prevGroupUsersCount = useRef(groupUsers.length); // Track previous count

    const stableHeaders = useMemo(() => [...headerTitles], [headerTitles]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchAndProcessTasks = async () => {
            try {
                const tasks = await fetchActiveTaskBoardTasks();
                if (!tasks) return;

                // Determine max position for structuring columns
                const maxPosition = Math.max(...tasks.map((task: any) => task.position), 1);

                // Initialize an empty structure based on `stableHeaders`
                const taskStructure: Record<string, any[][]> = {};
                stableHeaders.forEach(header => {
                    taskStructure[header] = Array.from({ length: maxPosition }, () => []);
                });

                // Populate the structure with tasks
                tasks.forEach((task: any) => {
                    const { status_name, user_name, position } = task;
                    const taskPosition = position - 1;

                    const normalizedUserName = user_name?.trim() || '';

                    if (status_name !== 'In-Progress') {
                        if (taskStructure[status_name]) {
                            taskStructure[status_name][taskPosition].push(task);
                        }
                    } else {
                        if (taskStructure[normalizedUserName]) {
                            taskStructure[normalizedUserName][taskPosition].push(task);
                        }
                    }
                });

                setTasksByColumn(taskStructure);
                hasFetchedOnce.current = true;
            } catch (error) {
                showErrorToast('Failed to fetch tasks.');
            }
        };

        // Fetch tasks initially
        if (!hasFetchedOnce.current) {
            fetchAndProcessTasks();
        }

        // Fetch again if `groupUsers` updates
        if (groupUsers.length !== prevGroupUsersCount.current) {
            prevGroupUsersCount.current = groupUsers.length;
            fetchAndProcessTasks();
        }

        // Set up polling every 30 seconds
        intervalId = setInterval(() => {
            fetchAndProcessTasks();
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, [stableHeaders, groupUsers.length]); // Only re-run when `headerTitles` or `groupUsers.length` change

    return tasksByColumn;
}
