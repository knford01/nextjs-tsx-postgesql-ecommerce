// app/lib/data/edi-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchEDISetupByID(id: number) {
    noStore();
    try {
        const data = await sql<Project>`
      SELECT * FROM edi_setup 
      WHERE id = ${id}`;
        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch edi setup.');
    }
}

export async function updateEDISetup(id: number, data: any) {
    // console.log("data: ", data);
    try {
        const result = await sql`
        UPDATE projects SET
          name = COALESCE(${data.name}, name),
          manager_id = COALESCE(${data.manager_id}, manager_id),
          details = COALESCE(${data.details}, details),
          start_date = COALESCE(${data.start_date}, start_date),
          end_date = COALESCE(${data.end_date}, end_date),
          status = COALESCE(${data.status}, status),
          pallet_prefix = COALESCE(${data.pallet_prefix}, pallet_prefix),
          color = COALESCE(${data.color}, color),
          logo = COALESCE(${data.logo}, logo),
          scope = COALESCE(${data.scope}, scope),
          description = COALESCE(${data.description}, description),
          original_estimate = COALESCE(${data.original_estimate}, original_estimate),
          contact_name = COALESCE(${data.contact_name}, contact_name),
          contact_email = COALESCE(${data.contact_email}, contact_email),
          contact_phone = COALESCE(${data.contact_phone}, contact_phone),
          active = COALESCE(${data.active}, active)
        WHERE id = ${id} RETURNING *`;
        return result.rows[0] || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to update edi setup.');
    }
}