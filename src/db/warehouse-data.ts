// app/lib/data/warehouse-data.tsx

'use server';
import { idID } from '@mui/material/locale';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchWarehouses() {
    noStore();
    try {
        const data = await sql<Warehouse>` 
        SELECT
          *
        FROM warehouses
        ORDER BY name ASC`;

        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all warehouses.');
    }
}

export async function fetchWarehouseById(id: number) {
    noStore();
    try {
        const data = await sql<Warehouse>` 
        SELECT
          *
        FROM warehouses
        WHERE id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch warehouse.');
    }
}

export async function fetchWarehouseByProjectId(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('Invalid project IDs provided');
    }
    const idsString = ids.map((id) => Number(id)).join(', ');

    try {
        // Connect to the database and run the query
        const client = await db.connect();
        const data = await client.query(`
            SELECT w.*
            FROM warehouses w
            WHERE w.id IN (
                SELECT warehouse_id
                FROM project_warehouses
                WHERE project_id IN (${idsString})
            )
        `);

        // Release the client back to the pool
        client.release();

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch warehouses.');
    }
}

export async function createWarehouse(data: Omit<Warehouse, 'id'>): Promise<number> {
    try {
        const result: QueryResult<Warehouse> = await sql`
            INSERT INTO warehouses (
                name, 
                address, 
                city, 
                state, 
                zip, 
                country, 
                contact_name,
                contact_phone,
                active
            ) VALUES (
                ${data.name}, 
                ${data.address}, 
                ${data.city}, 
                ${data.state}, 
                ${data.zip}, 
                ${data.country}, 
                ${data.contact_name},
                ${data.contact_phone},
                'true'
            )
            RETURNING id;
        `;

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error('No ID returned after warehouse creation');
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create warehouse');
    }
}

export async function updateWarehouse(id: number, data: Partial<Omit<Warehouse, 'id'>>): Promise<void> {
    try {
        await sql`
            UPDATE warehouses SET
                name = ${data.name},
                address = ${data.address},
                city = ${data.city},
                state = ${data.state},
                zip = ${data.zip},
                country = ${data.country},
                contact_name = ${data.contact_name},
                contact_phone = ${data.contact_phone},
                active = ${data.active}
            WHERE id = ${id};
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update warehouse');
    }
}

// Fetch all warehouse locations by warehouse ID
export async function fetchWarehouseLocationsByWarehouseId(warehouseId: number) {
    noStore();
    try {
        const data = await sql<WarehouseLocation>`
        SELECT
          *,
          case when active = true then 'Yes' else 'No' end as active_display
        FROM warehouse_locations
        WHERE warehouse_id = ${warehouseId}
        ORDER BY name ASC;`;

        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch warehouse locations by warehouse ID.');
    }
}

// Fetch a single warehouse location by ID
export async function fetchWarehouseLocationById(id: number) {
    noStore();
    try {
        const data = await sql<WarehouseLocation>`
        SELECT
          *,
          case when active = true then 'Yes' else 'No' end as active_display
        FROM warehouse_locations
        WHERE id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch warehouse location.');
    }
}

// Create a new warehouse location
export async function createWarehouseLocation(warehouse_id: number, data: {
    name: string;
    aisle: string;
    rack: string;
    row: string;
    bin: string;
    multi_pallet: boolean;
    multi_item: boolean;
    active: boolean;
    created_user: number;
}): Promise<number> {
    try {
        let name = '';
        if (data.aisle) name += data.aisle;
        if (data.rack) name += (name ? '.' : '') + data.rack;
        if (data.row) name += (name ? '.' : '') + data.row;
        if (data.bin) name += (name ? '.' : '') + data.bin;

        const result: QueryResult<{ id: number }> = await sql`
            INSERT INTO warehouse_locations (
                warehouse_id, 
                name, 
                aisle, 
                rack, 
                row, 
                bin, 
                multi_pallet, 
                multi_item, 
                active, 
                created_user
            ) VALUES (
                ${warehouse_id}, 
                ${name}, 
                ${data.aisle}, 
                ${data.rack}, 
                ${data.row}, 
                ${data.bin}, 
                ${data.multi_pallet}, 
                ${data.multi_item}, 
                ${data.active}, 
                ${data.created_user}
            )
            RETURNING id;
        `;

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error('No ID returned after location creation');
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create warehouse location');
    }
}

export async function updateWarehouseLocation(id: number, data: {
    aisle?: string;
    rack?: string;
    row?: string;
    bin?: string;
    multi_pallet?: boolean;
    multi_item?: boolean;
    active?: boolean;
}): Promise<void> {
    try {
        let name = '';
        if (data.aisle) name += data.aisle;
        if (data.rack) name += (name ? '.' : '') + data.rack;
        if (data.row) name += (name ? '.' : '') + data.row;
        if (data.bin) name += (name ? '.' : '') + data.bin;

        await sql`
            UPDATE warehouse_locations SET
                name = ${name},
                aisle = COALESCE(${data.aisle}, aisle),
                rack = COALESCE(${data.rack}, rack),
                row = COALESCE(${data.row}, row),
                bin = COALESCE(${data.bin}, bin),
                multi_pallet = COALESCE(${data.multi_pallet}, multi_pallet),
                multi_item = COALESCE(${data.multi_item}, multi_item),
                active = COALESCE(${data.active}, active),
            WHERE id = ${id};
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update warehouse location');
    }
}


