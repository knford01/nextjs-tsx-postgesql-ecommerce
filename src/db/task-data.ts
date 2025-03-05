'use server';
import { db, sql } from '@vercel/postgres';
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

export async function createTask(task: {
    customer_id: number;
    project_id: number;
    status_id: number;
    title: string;
    scope?: string;
    description?: string;
    original_estimate?: string;
    start_date?: string;
    end_date?: string;
}, sessionUser: { id: number }): Promise<any> {
    noStore();
    try {
        // Determine the last position for the given status_id
        const positionResult = await sql`
            SELECT COALESCE(MAX(position) + 1, 1) AS new_position FROM tasks WHERE status_id = ${task.status_id};
        `;
        const newPosition = positionResult.rows[0]?.new_position || 1;

        // Assign default values
        const sanitizedTask = {
            customer_id: task.customer_id,
            project_id: task.project_id,
            status_id: task.status_id,
            position: newPosition,
            title: task.title,
            scope: task.scope || null,
            description: task.description || null,
            original_estimate: task.original_estimate || null,
            active: true, // Default to true for new tasks
            created_user: sessionUser.id,
            start_date: task.start_date || null,
            end_date: task.end_date || null,
        };

        // Insert into tasks table
        const result = await sql`
            INSERT INTO tasks (
                customer_id, project_id, status_id, position, title, scope, description, 
                original_estimate, active, created_user, date_created, start_date, end_date
            ) VALUES (
                ${sanitizedTask.customer_id}, ${sanitizedTask.project_id}, ${sanitizedTask.status_id}, ${sanitizedTask.position}, 
                ${sanitizedTask.title}, ${sanitizedTask.scope}, ${sanitizedTask.description}, 
                ${sanitizedTask.original_estimate}, ${sanitizedTask.active}, ${sanitizedTask.created_user}, 
                NOW(), ${sanitizedTask.start_date}, ${sanitizedTask.end_date}
            )
            RETURNING *;
        `;

        await taskHistory('Created', result.rows[0].id, sessionUser.id);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create task.');
    }
}

export async function updateTask(taskId: number, updates: {
    customer_id?: number;
    project_id?: number;
    title?: string;
    scope?: string;
    description?: string;
    original_estimate?: string;
    active?: boolean;
    start_date?: string;
    end_date?: string;
}, sessionUser: { id: number }): Promise<any> {
    noStore();
    try {
        const result = await sql`
            UPDATE tasks
            SET
                customer_id = COALESCE(${updates.customer_id}, customer_id),
                project_id = COALESCE(${updates.project_id}, project_id),
                title = COALESCE(${updates.title}, title),
                scope = COALESCE(${updates.scope}, scope),
                description = COALESCE(${updates.description}, description),
                original_estimate = COALESCE(${updates.original_estimate}, original_estimate),
                active = COALESCE(${updates.active}, active),
                start_date = COALESCE(${updates.start_date}, start_date),
                end_date = COALESCE(${updates.end_date}, end_date)
            WHERE id = ${taskId}
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            throw new Error('Task not found.');
        }

        await taskHistory('Updated', result.rows[0].id, sessionUser.id);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update task.');
    }
}

/* ---- New Update Functions ---- */

export async function updateStatusIdByTaskId(taskId: number, statusId: number, changeUser: number): Promise<any> {
    noStore();
    try {
        const data = await sql`
        UPDATE tasks
        SET status_id = ${statusId}
        WHERE id = ${taskId}
        RETURNING *;`;

        await taskHistory('Updated', taskId, changeUser);
        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update task status.');
    }
}

export async function updateAssignedUserByTaskId(taskId: number, userId: number | null, changeUser: number): Promise<any> {
    noStore();
    try {
        const data = await sql`
        UPDATE tasks
        SET assigned_user_id = ${userId}
        WHERE id = ${taskId}
        RETURNING *;`;

        await taskHistory('Updated', taskId, changeUser);
        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update assigned user.');
    }
}

export async function updatePositionByTaskId(taskId: number, position: number, changeUser: number): Promise<any> {
    noStore();
    try {
        const data = await sql`
        UPDATE tasks
        SET position = ${position}
        WHERE id = ${taskId}
        RETURNING *;`;

        await taskHistory('Updated', taskId, changeUser);
        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update task position.');
    }
}

export async function markTaskAsCompleted(taskId: number, sessionUser: { id: number }): Promise<any> {
    noStore();
    try {
        const result = await sql`
            UPDATE tasks
            SET 
                status_id = 4,
                completed_user = ${sessionUser.id}
            WHERE id = ${taskId}
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            throw new Error('Task not found.');
        }

        await taskHistory('Updated', taskId, sessionUser.id);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to mark task as completed.');
    }
}

/* ---- Fetch Functions ---- */

export async function fetchTasks(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                t.*,
                c.name as customer_name,
                p.name as project_name,
                CASE 
                    WHEN t.active = TRUE THEN 'Active'
                    ELSE 'Inactive'
                END AS active_status,
                ts.name as status_display
            FROM tasks t
            LEFT JOIN task_statuses ts on ts.id = t.status_id
            LEFT JOIN customers c on c.id = t.customer_id
            LEFT JOIN projects p on p.id = t.project_id
            ORDER BY t.status_id, t.position;`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch tasks.');
    }
}

export async function fetchTasksByActiveStatus(isActive: boolean): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                t.*,
                c.name AS customer_name,
                p.name AS project_name,
                CASE 
                    WHEN t.active = TRUE THEN 'Active'
                    ELSE 'Inactive'
                END AS active_status,
                ts.name AS status_display
            FROM tasks t
            LEFT JOIN task_statuses ts ON ts.id = t.status_id
            LEFT JOIN customers c ON c.id = t.customer_id
            LEFT JOIN projects p ON p.id = t.project_id
            WHERE t.active = ${isActive}
            ORDER BY t.status_id, t.position;`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch ${isActive ? 'active' : 'inactive'} tasks.`);
    }
}

export async function fetchTaskById(id: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                t.*,
                c.name as customer_name,
                p.name as project_name,
                CASE 
                    WHEN t.active = TRUE THEN 'Active'
                    ELSE 'Inactive'
                END AS active_status,
                ts.name as status_display
            FROM tasks t
            LEFT JOIN task_statuses ts on ts.id = t.status_id
            LEFT JOIN customers c on c.id = t.customer_id
            LEFT JOIN projects p on p.id = t.project_id
            WHERE t.id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch task.');
    }
}

export async function fetchTasksByCustomerId(customerId: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                t.*, 
                c.name AS customer_name, 
                p.name AS project_name, 
                CASE 
                    WHEN t.active = TRUE THEN 'Active' 
                    ELSE 'Inactive' 
                END AS active_status, 
                ts.name AS status_display 
            FROM tasks t
            LEFT JOIN task_statuses ts ON ts.id = t.status_id
            LEFT JOIN customers c ON c.id = t.customer_id
            LEFT JOIN projects p ON p.id = t.project_id
            WHERE t.customer_id = ${customerId}
            ORDER BY t.status_id, t.position;
        `;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch tasks for customer ID: ${customerId}`);
    }
}

export async function fetchTasksByProjectId(projectId: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                t.*, 
                c.name AS customer_name, 
                p.name AS project_name, 
                CASE 
                    WHEN t.active = TRUE THEN 'Active' 
                    ELSE 'Inactive' 
                END AS active_status, 
                ts.name AS status_display 
            FROM tasks t
            LEFT JOIN task_statuses ts ON ts.id = t.status_id
            LEFT JOIN customers c ON c.id = t.customer_id
            LEFT JOIN projects p ON p.id = t.project_id
            WHERE t.project_id = ${projectId}
            ORDER BY t.status_id, t.position;
        `;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch tasks for project ID: ${projectId}`);
    }
}

export async function fetchTasksByCustomerIdAndProjectId(customerId: number, projectId: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                t.*, 
                c.name AS customer_name, 
                p.name AS project_name, 
                CASE 
                    WHEN t.active = TRUE THEN 'Active' 
                    ELSE 'Inactive' 
                END AS active_status, 
                ts.name AS status_display 
            FROM tasks t
            LEFT JOIN task_statuses ts ON ts.id = t.status_id
            LEFT JOIN customers c ON c.id = t.customer_id
            LEFT JOIN projects p ON p.id = t.project_id
            WHERE t.customer_id = ${customerId} AND t.project_id = ${projectId}
            ORDER BY t.status_id, t.position;
        `;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch tasks for customer ID: ${customerId} and project ID: ${projectId}`);
    }
}


