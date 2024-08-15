// app/lib/data/contact-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchContacts() {
    noStore();
    try {
        const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM contacts
        ORDER BY last_name ASC`;

        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all contacts.');
    }
}

export async function fetchContactById(id: string) {
    noStore();
    try {
        const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM contacts
        WHERE id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch contact.');
    }
}

export async function fetchContactsByCustomerId(id: string) {
    noStore();
    try {
        const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM contacts
        WHERE customer_id = ${id}
        order by main desc;`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch contacts.');
    }
}

export async function createContact(data: Omit<Contact, 'id'>, customer_id: number): Promise<number> {
    try {
        const result: QueryResult<Contact> = await sql`
            INSERT INTO contacts (
                customer_id, 
                main, 
                first_name, 
                last_name, 
                phone_number, 
                ext, 
                email, 
                active
            ) VALUES (
                ${customer_id}, 
                ${data.main}, 
                ${data.first_name}, 
                ${data.last_name}, 
                ${data.phone_number}, 
                ${data.ext || null}, 
                ${data.email}, 
                ${data.active}
            )
            RETURNING id;
        `;

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error('No ID returned after contact creation');
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to Create Contact');
    }
}

export async function updateContact(id: string, data: Partial<Omit<Contact, 'id'>>, customer_id: number): Promise<void> {
    try {
        if (data.main == 1) {
            await sql`
            UPDATE contacts SET
                main = 0
            WHERE customer_id = ${customer_id};
        `;
        }

        await sql`
            UPDATE contacts SET
                main = ${data.main},
                first_name = ${data.first_name},
                last_name = ${data.last_name},
                phone_number = ${data.phone_number},
                ext = ${data.ext || null},
                email = ${data.email}
            WHERE id = ${id};
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to Update Contact');
    }
}
