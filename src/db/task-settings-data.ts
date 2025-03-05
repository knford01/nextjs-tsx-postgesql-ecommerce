// src/db/task-settings-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function createGroup(
    name: string,
    userIds: string,
    active: boolean,
    createdUser: number
): Promise<any> {
    noStore();
    try {
        const data = await sql`
        INSERT INTO task_groups (name, user_ids, active, created_user, date_created)
        VALUES (${name}, ${userIds}, ${active}, ${createdUser}, NOW())
        RETURNING *;`;

        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create task group.');
    }
}

export async function updateGroup(
    id: number,
    name?: string,
    userIds?: string,
    active?: boolean
): Promise<any> {
    noStore();
    try {
        const data = await sql`
        UPDATE task_groups
        SET
          name = COALESCE(${name}, name),
          user_ids = COALESCE(${userIds}, user_ids),
          active = COALESCE(${active}, active)
        WHERE id = ${id}
        RETURNING *;`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update task group.');
    }
}

export async function fetchGroups(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                tg.*, 
                CASE 
                    WHEN tg.active = TRUE THEN 'True'
                    ELSE 'False'
                END AS active_status
            FROM task_groups tg
            ORDER BY name;`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch task groups.');
    }
}

export async function fetchActiveGroups(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                tg.*
            FROM task_groups tg
            WHERE tg.active = TRUE
            ORDER BY name;`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch active task groups.');
    }
}

export async function fetchInactiveGroups(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                tg.*
            FROM task_groups tg
            WHERE tg.active = FALSE
            ORDER BY name;`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch active task groups.');
    }
}

export async function fetchGroupById(id: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                tg.*, 
                CASE 
                    WHEN tg.active = TRUE THEN 'True'
                    ELSE 'False'
                END AS active_status
            FROM task_groups tg
            WHERE tg.id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch task group.');
    }
}
