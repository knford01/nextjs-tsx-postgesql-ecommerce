// src/db/history-data.tsx

'use server';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Allowed tables and columns to prevent SQL injection
const allowedTables = ['employee_history', 'task_history'];

export async function fetchHistoryRows(table: string, id: number): Promise<any> {
    noStore();

    if (!allowedTables.includes(table)) {
        throw new Error('Invalid table.');
    }

    const query = `
        SELECT 
            t.action,
            t.new_value,
            t.date_time,
            CONCAT(u.first_name, ' ', u.last_name) AS change_user
        FROM ${table} t
        LEFT JOIN users u on u.id = t.change_user
        WHERE history_id = $1;`;

    // console.log(`Executing Query: ${query} with id: ${id}`);

    try {
        const data = await sql.query(query, [id]);
        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch history table.');
    }
}
