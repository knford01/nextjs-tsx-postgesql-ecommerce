// src/db/schedule-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function createShift(
    employeeId: number,
    createdUser: number,
    date: string,
    shift: {
        start_time: string;
        end_time: string;
        color: string;
        note?: string;
    }
): Promise<any> {
    try {
        const result = await sql`
            INSERT INTO shifts (
                employee_id, created_user, date, start_time, end_time, color, note
            ) VALUES (
                ${employeeId}, ${createdUser}, ${date}, ${shift.start_time}, ${shift.end_time}, ${shift.color}, ${shift.note || null}
            )
            RETURNING *;
        `;

        return result.rows[0];
    } catch (error) {
        console.error('Error creating shift:', error);
        throw new Error('Failed to create shift.');
    }
}

export async function updateShift(
    shiftId: number,
    shift: {
        start_time?: string;
        end_time?: string;
        color?: string;
        note?: string;
    }
): Promise<any> {
    try {
        const result = await sql`
            UPDATE shifts
            SET
                start_time = COALESCE(${shift.start_time}, start_time),
                end_time = COALESCE(${shift.end_time}, end_time),
                color = COALESCE(${shift.color}, color),
                note = COALESCE(${shift.note}, note)
            WHERE id = ${shiftId}
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            throw new Error('Shift not found.');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating shift:', error);
        throw new Error('Failed to update shift.');
    }
}

export async function fetchShiftByEmployeeIdAndDate(
    employeeId: number,
    date: string
): Promise<any> {
    try {
        const result = await sql`
            SELECT * FROM shifts
            WHERE employee_id = ${employeeId} AND date = ${date}
            ORDER BY id DESC
            LIMIT 1;
        `;

        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching shift:', error);
        throw new Error('Failed to fetch shift.');
    }
}

