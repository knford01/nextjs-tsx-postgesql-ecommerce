// src/db/employee-settings-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchDepartments(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                d.*, 
                case 
                    when d.active = TRUE then 'True'
                    else 'False'
                end as active_status
            FROM departments d`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch departments.');
    }
}

export async function fetchActiveDepartments(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                d.*
            FROM departments d
            where d.active = TRUE`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch departments.');
    }
}

export async function fetchDepartmentById(id: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                d.*, 
                case 
                    when d.active = TRUE then 'True'
                    else 'False'
                end as active_status
            FROM departments d
            where d.id = ${id}`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch departments.');
    }
}

export async function createDepartment(name: string, active: boolean): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        INSERT INTO departments (name, active)
        VALUES (${name}, ${active})
        RETURNING *;`;

        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to add department.');
    }
}

export async function updateDepartment(id: number, name?: string, active?: boolean): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        UPDATE departments
        SET
          name = COALESCE(${name}, name),
          active = COALESCE(${active}, active)
        WHERE id = ${id}
        RETURNING *;`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update department.');
    }
}
