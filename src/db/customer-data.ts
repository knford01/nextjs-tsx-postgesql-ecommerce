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

export async function fetchCustomerById(id: number) {
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
    // console.log(data);

    try {
        const result: QueryResult<Customer> = await sql`
            INSERT INTO customers 
                (name, address, city, state, zip, contact_phone, contact_email, avatar, active)
            VALUES 
                (${data.name || ''}, ${data.address || ''}, ${data.city || ''}, ${data.state || ''}, ${data.zip || ''}, ${data.phone || ''}, ${data.email || ''}, ${data.avatar || ''}, 1)
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

export async function updateCustomer(id: number, data: any) {
    // console.log(data);

    try {
        await sql`
            UPDATE customers SET 
                name = ${data.name}, address = ${data.address}, city = ${data.city}, state = ${data.state},  zip = ${data.zip}, 
                contact_phone = ${data.phone}, contact_email = ${data.email}, avatar = ${data.avatar}
            WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Database Error: Failed to Update Customer.');
    }
}

export async function fetchCustomerEmails(customer_id: string) {
    noStore();
    try {
        const data = await sql<Customer>`SELECT * FROM customer_emails WHERE customer_id = ${customer_id} order by date_created;`;
        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customer emails.');
    }
}

export async function createCustomerEmail(customer_id: string, data: { subject: string; body: string; recipients: string }) {
    try {
        const result: QueryResult = await sql`
            INSERT INTO customer_emails 
                (customer_id, subject, body, recipients, date_created)
            VALUES 
                (${customer_id}, ${data.subject}, ${data.body}, ${data.recipients}, NOW())
            RETURNING *;
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create customer email.');
    }
}