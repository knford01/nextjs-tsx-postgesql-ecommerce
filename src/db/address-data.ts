'use server';

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Fetch all addresses with error handling and caching disabled
export async function getAddresses() {
    noStore(); // Disable caching
    try {
        const data = await sql<Address>`SELECT * FROM addresses ORDER BY company, name, address1, city DESC`;
        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch addresses.');
    }
}

// Fetch address by ID with error handling and caching disabled
export async function getAddressById(id: number) {
    noStore(); // Disable caching
    try {
        const data = await sql<Address>`SELECT * FROM addresses WHERE id = ${id}`;
        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch address by ID.');
    }
}

// Create a new address with error handling and caching disabled
export async function createAddress(address: {
    company: string;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state_province?: string;
    postal_code?: string;
    country: string;
    phone: string;
    email: string;
}) {
    noStore(); // Disable caching
    try {
        const data = await sql`
            INSERT INTO addresses (company, name, address1, address2, city, state_province, postal_code, country, phone, email)
            VALUES (${address.company}, ${address.name}, ${address.address1}, ${address.address2}, ${address.city}, ${address.state_province}, ${address.postal_code}, ${address.country}, ${address.phone}, ${address.email})
            RETURNING *;
        `;
        return data.rows[0];
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to create address.');
    }
}

// Update an existing address by ID with error handling and caching disabled
export async function updateAddress(
    id: number,
    address: {
        company?: string;
        name?: string;
        address1?: string;
        address2?: string;
        city?: string;
        state_province?: string;
        postal_code?: string;
        country?: string;
        phone?: string;
        email?: string;
    }) {
    noStore(); // Disable caching
    try {
        const data = await sql`
            UPDATE addresses SET
                company = COALESCE(${address.company}, company),
                name = COALESCE(${address.name}, name),
                address1 = COALESCE(${address.address1}, address1),
                address2 = COALESCE(${address.address2}, address2),
                city = COALESCE(${address.city}, city),
                state_province = COALESCE(${address.state_province}, state_province),
                postal_code = COALESCE(${address.postal_code}, postal_code),
                country = COALESCE(${address.country}, country),
                phone = COALESCE(${address.phone}, phone),
                email = COALESCE(${address.email}, email)
            WHERE id = ${id}
            RETURNING *;
        `;
        return data.rows[0];
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to update address.');
    }
}
