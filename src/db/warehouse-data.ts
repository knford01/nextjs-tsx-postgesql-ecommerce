// app/lib/data/warehouse-data.tsx

'use server';
import { idID } from '@mui/material/locale';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchActiveWarehouses() {
    noStore();
    try {
        const data = await sql<Warehouse>` 
        SELECT
          *
        FROM warehouses
        WHERE active = true
        ORDER BY name ASC`;

        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all warehouses.');
    }
}

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

export async function fetchActiveWarehouseLocations() {
    noStore();
    try {
        const data = await sql<WarehouseLocation>`
        SELECT id, name
        FROM warehouse_locations
        WHERE active = true
        ORDER BY name ASC;`;

        return data.rows || null;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch active warehouse locations.');
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

export async function fetchPreferredLocation(item_id: number, warehouse_id: number) {
    noStore();
    try {
        const data = await sql<any>`SELECT * FROM item_preferred_location WHERE item_id = ${item_id} AND warehouse_id = ${warehouse_id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch preferred location.');
    }
}

export async function fetchAvailableWarehouseLocations(wh_id: number, loc_id_selected?: number) {
    noStore();
    try {
        const data = loc_id_selected
            ? await sql<any[]>`
                SELECT 
                    wh.*
                FROM warehouse_locations wh
                WHERE wh.active = true
                  AND wh.warehouse_id = ${wh_id}
                  AND id NOT IN (
                      SELECT location_id 
                      FROM item_preferred_location 
                      WHERE location_id NOT IN (
                          SELECT id 
                          FROM warehouse_locations 
                          WHERE multi_item = true
                      ) 
                      AND location_id <> ${loc_id_selected}
                  )
                ORDER BY wh.name ASC;
            `
            : await sql<any[]>`
                SELECT 
                    wh.*
                FROM warehouse_locations wh
                WHERE wh.active = true
                  AND wh.warehouse_id = ${wh_id}
                  AND id NOT IN (
                      SELECT location_id 
                      FROM item_preferred_location 
                      WHERE location_id NOT IN (
                          SELECT id 
                          FROM warehouse_locations 
                          WHERE multi_item = true
                      )
                  )
                ORDER BY wh.name ASC;
            `;

        return data.rows || [];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch available warehouse locations.');
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

export async function updateItemPreferredLocation(item_id: any, wh_loc_ids: { [key: number]: number }) {
    noStore();
    try {
        // Delete existing preferred locations for the item
        await sql`DELETE FROM item_preferred_location WHERE item_id = ${item_id};`;

        // Insert new preferred locations for each warehouse_id and location_id pair
        for (const [warehouse_id, location_id] of Object.entries(wh_loc_ids)) {
            await sql`
                INSERT INTO item_preferred_location (item_id, warehouse_id, location_id) 
                VALUES (${item_id}, ${Number(warehouse_id)}, ${location_id});
            `;
        }

        return { success: true, message: 'Item preferred locations updated successfully.' };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update item preferred locations.');
    }
}

export async function fetchCarriers(): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        SELECT
          *
        FROM carriers;`;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch carriers.');
    }
}

export async function fetchActiveCarriers(): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        SELECT
            *,
            CASE
                WHEN active = TRUE THEN 'Yes'
                ELSE 'No'
            END AS active
        FROM carriers
        WHERE active = true;`;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch carriers.');
    }
}

export async function fetchCarrierById(id: number): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        SELECT
          *
        FROM carriers
        WHERE id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch carrier.');
    }
}

export async function createCarrier(name: string, scac: string, active: boolean): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        INSERT INTO carriers (name, scac, active)
        VALUES (${name}, ${scac}, ${active})
        RETURNING *;`;

        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to add carrier.');
    }
}

export async function updateCarrier(id: number, name?: string, scac?: string, active?: boolean): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        UPDATE carriers
        SET
          name = COALESCE(${name}, name),
          scac = COALESCE(${scac}, scac),
          active = COALESCE(${active}, active)
        WHERE id = ${id}
        RETURNING *;`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update carrier.');
    }
}

