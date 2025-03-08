// src/db/task-board-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchTaskRow(taskId: number): Promise<any> {
    noStore();
    try {
        const data = await sql`SELECT * FROM tasks WHERE id = ${taskId};`;
        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch task row.');
    }
}

export async function taskHistory(action: string, taskId: number, changeUser: number): Promise<void> {
    noStore();
    try {
        const taskData = await fetchTaskRow(taskId);
        if (!taskData) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }
        const newValue = JSON.stringify(taskData);

        await sql`
            INSERT INTO task_history (history_id, action, new_value, change_user)
            VALUES (${taskId}, ${action}, ${newValue}, ${changeUser});
        `;
    } catch (error) {
        console.error('Error logging task history:', error);
        throw new Error('Failed to log task history.');
    }
}

export async function fetchGroupUserByUserID(id: any): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT
            u.id,
            u.first_name,
            u.last_name,
            COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') AS user_name,
            -- u.avatar,
            u.role,
            ur.display as role_display,
            u.email 
            FROM users u
            left join user_roles ur on ur.id = u.role
            WHERE u.id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch group User.');
    }
}

export async function fetchActiveTaskBoardTasks(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT
                t.*,
                COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') AS user_name,
                ts.name AS status_name,
                ts.class,
                p.name AS project_name,
                c.name AS customer_name,
                (
                    SELECT COALESCE(SUM(COALESCE(end_time, NOW()) - start_time), INTERVAL '0 seconds')::TEXT 
                    FROM task_times 
                    WHERE task_id = t.id AND active = TRUE
                ) AS sum_time,
                TO_CHAR(
                    INTERVAL '1 hour' * t.original_estimate::NUMERIC, 
                    'HH24:MI:SS'
                ) AS estimated_time
            FROM tasks t
            LEFT JOIN users u ON u.id = t.assigned_user_id
            LEFT JOIN task_statuses ts ON ts.id = t.status_id
            LEFT JOIN projects p ON p.id = t.project_id
            LEFT JOIN customers c ON c.id = t.customer_id
            WHERE t.active = TRUE
            AND t.completed_user IS NULL
            AND t.canceled_user IS NULL
            ORDER BY t.status_id, t.assigned_user_id, t.position;
            `;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch task board tasks.');
    }
}

export async function updateTaskLocationById(
    taskId: number,
    statusId: number,
    userId: number | null,
    newPosition: number,
    changeUser: number
): Promise<any> {
    noStore();

    try {
        // Get the current position and assigned_user_id of the task
        const taskData = await sql`SELECT position, assigned_user_id FROM tasks WHERE id = ${taskId};`;

        if (!taskData.rows.length) {
            throw new Error("Task not found.");
        }

        const currentPosition = taskData.rows[0].position;

        // Determine whether to filter by assigned_user_id or not
        if (userId !== null) {
            // Case 1: Updating within a specific assigned_user_id
            await sql`
                UPDATE tasks
                SET position = position + 1
                WHERE status_id = ${statusId}
                AND assigned_user_id = ${userId}
                AND position >= ${newPosition}
                ORDER BY position ASC;
            `;

            await sql`
                UPDATE tasks
                SET status_id = ${statusId},
                    assigned_user_id = ${userId},
                    position = ${newPosition}
                WHERE id = ${taskId};
            `;

            if (currentPosition > newPosition) {
                await sql`
                    UPDATE tasks
                    SET position = position - 1
                    WHERE status_id = ${statusId}
                    AND assigned_user_id = ${userId}
                    AND position > ${currentPosition}
                    ORDER BY position ASC;
                `;
            }
        } else {
            // Case 2: Updating within the status_id only (no assigned_user filter)
            await sql`
                UPDATE tasks
                SET position = position + 1
                WHERE status_id = ${statusId}
                AND position >= ${newPosition}
                ORDER BY position ASC;
            `;

            await sql`
                UPDATE tasks
                SET status_id = ${statusId},
                    assigned_user_id = NULL,
                    position = ${newPosition}
                WHERE id = ${taskId};
            `;

            if (currentPosition > newPosition) {
                await sql`
                    UPDATE tasks
                    SET position = position - 1
                    WHERE status_id = ${statusId}
                    AND position > ${currentPosition}
                    ORDER BY position ASC;
                `;
            }
        }

        // Log task update
        await taskHistory('Updated', taskId, changeUser);

        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update task.');
    }
}





