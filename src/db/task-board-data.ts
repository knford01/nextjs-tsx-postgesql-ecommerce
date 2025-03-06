// src/db/task-board-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

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
                p.name AS project_name,
                c.name AS customer_name
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


