// src/db/schedule-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function createSchedule(schedule: {
    user_id: number;
    department_id: number;
    dob: string;
    social_number?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    personal_email?: string;
    start_date: string;
    end_date?: string;
    active?: boolean;
}, sessionUser: { id: number }): Promise<any> {
    try {
        // Assign default values for missing fields
        const sanitizedSchedule = {
            user_id: schedule.user_id,
            department_id: schedule.department_id,
            dob: schedule.dob || null,
            social_number: schedule.social_number || null,
            address1: schedule.address1 || null,
            address2: schedule.address2 || null,
            city: schedule.city || null,
            state: schedule.state || null,
            zip: schedule.zip || null,
            personal_email: schedule.personal_email || null,
            start_date: schedule.start_date || null,
            end_date: schedule.end_date || null,
            active: schedule.active ?? true, // Default to `true` if `active` is undefined
        };

        // Log the sanitized data
        // console.log('Sanitized Schedule Data:', sanitizedSchedule);

        const result = await sql`
            INSERT INTO schedules (
                user_id, department_id, dob, social_number, address1, address2,
                city, state, zip, personal_email, start_date, end_date, active
            ) VALUES (
                ${sanitizedSchedule.user_id}, ${sanitizedSchedule.department_id}, ${sanitizedSchedule.dob}, ${sanitizedSchedule.social_number},
                ${sanitizedSchedule.address1}, ${sanitizedSchedule.address2}, ${sanitizedSchedule.city}, ${sanitizedSchedule.state},
                ${sanitizedSchedule.zip}, ${sanitizedSchedule.personal_email}, ${sanitizedSchedule.start_date},
                ${sanitizedSchedule.end_date}, ${sanitizedSchedule.active}
            )
            RETURNING *;
        `;

        return result.rows[0];
    } catch (error) {
        console.error('Error creating schedule:', error);
        throw new Error('Failed to create schedule.');
    }
}

export async function updateSchedule(scheduleId: number, updates: {
    department_id?: number;
    dob?: string;
    social_number?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    personal_email?: string;
    start_date?: string;
    end_date?: string;
    active?: boolean;
}, sessionUser: { id: number }): Promise<any> {
    try {
        const result = await sql`
            UPDATE schedules
            SET
                department_id = COALESCE(${updates.department_id}, department_id),
                dob = COALESCE(${updates.dob}, dob),
                social_number = COALESCE(${updates.social_number}, social_number),
                address1 = COALESCE(${updates.address1}, address1),
                address2 = COALESCE(${updates.address2}, address2),
                city = COALESCE(${updates.city}, city),
                state = COALESCE(${updates.state}, state),
                zip = COALESCE(${updates.zip}, zip),
                personal_email = COALESCE(${updates.personal_email}, personal_email), 
                start_date = COALESCE(${updates.start_date}, start_date),
                end_date = COALESCE(${updates.end_date}, end_date),
                active = COALESCE(${updates.active}, active)
            WHERE id = ${scheduleId}
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            throw new Error('Schedule not found.');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw new Error('Failed to update schedule.');
    }
}