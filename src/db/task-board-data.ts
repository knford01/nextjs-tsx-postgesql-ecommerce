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

