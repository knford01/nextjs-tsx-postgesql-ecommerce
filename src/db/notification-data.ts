// app/lib/data/notification-data.tsx

'use server';
import { QueryResult, sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchNotifications() {
    noStore();
    try {
        const data = await sql<Notice>`
        SELECT
            n.*,
            ni.name,
            ni.color,
            '' as date_viewed
        FROM notices n
        LEFT JOIN notice_importance ni ON ni.id = n.importance_id
        LIMIT 3`;

        return data.rows;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch notifications.');
    }
}

export async function fetchNotificationById(id: string) {
    noStore();
    try {
        const data = await sql<Notice>`
        SELECT
            n.*,
            ni.name,
            ni.color
        FROM notices n
        LEFT JOIN notice_importance ni ON ni.id = n.importance_id
        WHERE n.id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch notification.');
    }
}

export async function fetchNotificationByUserId(user_id: number) {
    noStore();
    try {
        const data = await sql<Notice>`
        SELECT
            n.*,
            ni.name,
            ni.color
        FROM notices n
        LEFT JOIN notice_importance ni ON ni.id = n.importance_id
        LEFT JOIN notices_sent ns on ns.notice_id = n.id
        WHERE ns.user_id = ${user_id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch notification.');
    }
}


export async function createNotification(data: Notice, user_ids: number[]) {
    try {
        const result: QueryResult<Notice> = await sql`
            INSERT INTO notices 
                (importance_id, subject, notice, user_id, date_created)
            VALUES 
                (${data.importance_id}, ${data.subject}, ${data.notice}, ${data.user_id}, ${data.date_created})
            RETURNING id;
        `;

        if (result.rows.length > 0) {
            const notice_id = result.rows[0].id;
            for (const user_id of user_ids) {
                await sql`
                INSERT INTO notices_sent 
                    (notice_id, user_id, date_viewed)
                VALUES 
                    (${notice_id}, ${user_id}, '0001-01-01 00:00:00')
                `;
            }
            return notice_id;
        } else {
            throw new Error('No ID returned after notification creation');
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create notification.');
    }
}

export async function setNoticeViewed(user_id: number, notice_id: number) {
    try {
        await sql`
            UPDATE notices_sent 
            SET date_viewed = NOW() 
            WHERE user_id = ${user_id} AND notice_id = ${notice_id}`;
        return { message: 'User Status Updated' };
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Failed to update user status.' };
    }
}
