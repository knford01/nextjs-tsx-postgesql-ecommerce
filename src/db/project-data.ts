// app/lib/data/project-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchProjects() {
  noStore();
  try {
    const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM projects
        order by customer_id, id desc;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all projects.');
  }
}

export async function fetchProjectByID(id: string) {
  noStore();
  try {
    const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM projects
        WHERE id = ${id};`;

    return data.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contact.');
  }
}

export async function fetchProjectByCustomerId(id: number) {
  noStore();
  try {
    const data = await sql<Contact>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM projects
        WHERE customer_id = ${id}
        order by customer_id, id desc;`;

    return data.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects.');
  }
}