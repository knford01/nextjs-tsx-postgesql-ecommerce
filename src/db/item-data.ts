// app/lib/data/item-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchItems() {
    noStore();
    try {
        const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM items
        order by name desc;`;

        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all projects.');
    }
}