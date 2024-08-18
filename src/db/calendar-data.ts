// db/calendar-data.tsx

'use server';
import { formatTime } from '@/functions/common';
import { sql } from '@vercel/postgres';

export async function getCalendarEvents(): Promise<any[]> {
    try {
        const data = await sql`
            SELECT 
                *, 
                case 
                    when event_type = 'all_day' then true
                else false
                end as allday
            FROM events 
            WHERE active = 'true'`;
        return data.rows;
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        throw new Error('Failed to fetch calendar events');
    }
}

export async function getCalendarEventById(id: string = ''): Promise<any> {
    try {
        const data = await sql<any>`
            SELECT 
                *, 
                case 
                    when event_type = 'all_day' then true
                else false
                end as allday
            FROM events 
            WHERE id = ${id}`;
        return data.rows[0] || null;
    } catch (error) {
        console.error(`Error fetching calendar event with id ${id}:`, error);
        throw new Error('Failed to fetch calendar event');
    }
}

export async function deleteEvent(id: string): Promise<string> {
    try {
        await sql`UPDATE events SET active = false WHERE id = ${id}`;
        return 'saved';
    } catch (error) {
        console.error(`Error deleting event with id ${id}:`, error);
        throw new Error('Failed to delete event');
    }
}

export async function editCalendarEvent(eventData: any): Promise<string> {
    // console.log('editCalendarEvent:', eventData);
    const { id, event_type, ...rest } = eventData;

    if (event_type === 'day' || event_type === 'all_day') {
        rest.start_date = eventData.start_date;
        rest.end_date = eventData.start_date;
    }

    // Ensure start_time and end_time have the format "HH:mm:ss"
    rest.start_time = formatTime(rest.start_time || '00:00:00');
    rest.end_time = formatTime(rest.end_time || '23:59:59');

    // Convert dow array to CSV string if it's an array
    if (Array.isArray(rest.dow)) {
        rest.dow = rest.dow.join(',');
    }

    try {
        if (id) {
            // Update the existing event
            const query = sql`
                UPDATE events
                SET
                    event_type = ${event_type},
                    start_date = ${rest.start_date},
                    end_date = ${rest.end_date},
                    start_time = ${rest.start_time},
                    end_time = ${rest.end_time},
                    title = ${rest.title},
                    description = ${rest.description},
                    dow = ${rest.dow || ''},
                    color = ${rest.color},
                    active = ${rest.active}
                WHERE id = ${id}
            `;
            await query;
            return id;
        } else {
            // Insert a new event
            const query = sql`
                INSERT INTO events (
                    event_type,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                    title,
                    description,
                    dow,
                    color,
                    active,
                    user_id
                ) VALUES (
                    ${event_type},
                    ${rest.start_date},
                    ${rest.end_date},
                    ${rest.start_time},
                    ${rest.end_time},
                    ${rest.title},
                    ${rest.description},
                    ${rest.dow || ''},
                    ${rest.color},
                    ${rest.active},
                    ${rest.user_id}
                ) RETURNING id
            `;
            const result = await query;
            return result.rows[0].id;
        }
    } catch (error: any) {
        console.error('Error saving calendar event:', error.message); // Log the error message
        console.error('Full error details:', error); // Log full error details
        throw new Error(`Failed to save calendar event: ${error.message}`);
    }
}

export async function dragAndDropEvent(eventData: any): Promise<string> {
    const { id, event_type, start_date } = eventData;

    if (event_type === 'recurring') {
        return 'Recurring events cannot be updated by drag and drop';
    } else {
        try {
            const date = new Date(start_date);
            date.setHours(date.getHours() + 5); // Adjust for timezone difference if needed
            const formattedDate = date.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

            await sql`UPDATE events SET start_date = ${formattedDate}, end_date = ${formattedDate} WHERE id = ${id}`;
            return 'saved';
        } catch (error) {
            console.error(`Error updating event with id ${id}:`, error);
            throw new Error('Failed to update event');
        }
    }
}
