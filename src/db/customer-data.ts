// app/lib/data/user-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; //clear this cache that stores the route segments in the user's browser and trigger a new request to the server\\
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCustomers() {
    noStore();
    try {
        const data = await sql<Customer>` 
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM customers
        ORDER BY name ASC`;

        const customer = data.rows;
        return customer;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customer.');
    }
}

export async function fetchCustomerById(id: string) {
    noStore();
    try {
        const data = await sql<Customer>`
        SELECT
          *,
          case
            when active = 1 then 'Yes'
            else 'No'
          end as active
        FROM customers
        WHERE id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customer.');
    }
}

export async function createCustomer(data: any): Promise<number> {
    try {
        const result: QueryResult<Customer> = await sql`
            INSERT INTO customers 
                (name, address, city, state, zip, phone, email, active)
            VALUES 
                (${data.name || ''}, ${data.address || ''}, ${data.city || ''}, ${data.state || ''}, ${data.zip || ''}, ${data.phone || ''}, ${data.email || ''}, 1)
            RETURNING id;
        `;

        // Access the first row's id
        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error('No ID returned after customer creation');
        }
    } catch (error) {
        throw new Error('Failed to Create Customer');
    }
}