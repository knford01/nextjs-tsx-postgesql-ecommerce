// app/lib/data/warehouse-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchReceivingByWarehouseId(warehouseId: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
        SELECT 
            rec.*,
            w.name as warehouse,
            carr.name as carrier_name,
            rs.name as status_name,
            rs.class as status_class,
            c.name as customer_name,
            p.name as project_name
        FROM receiving rec
        LEFT JOIN warehouses w ON w.id = rec.warehouse_id
        LEFT JOIN carriers carr ON carr.id = rec.carrier_id
        LEFT JOIN receiving_statuses rs ON rs.id = rec.status_id
        LEFT JOIN customers c ON c.id = rec.customer_id
        LEFT JOIN projects p ON p.id = rec.project_id
        WHERE rec.warehouse_id = ${warehouseId};`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch receiving by warehouse ID.');
    }
}

export async function fetchReceivingById(receivingId: number): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
        SELECT 
            rec.*,
            w.name as warehouse,
            carr.name as carrier_name,
            rs.name as status_name,
            rs.class as status_class,
            c.name as customer_name,
            p.name as project_name
        FROM receiving rec
        LEFT JOIN warehouses w ON w.id = rec.warehouse_id
        LEFT JOIN carriers carr ON carr.id = rec.carrier_id
        LEFT JOIN receiving_statuses rs ON rs.id = rec.status_id
        LEFT JOIN customers c ON c.id = rec.customer_id
        LEFT JOIN projects p ON p.id = rec.project_id
        WHERE rec.id = ${receivingId};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch receiving by ID.');
    }
}

export async function createReceiving(userID: any, warehouseID: any, data: any): Promise<number> {
    try {
        const result = await sql`
            INSERT INTO receiving (
                customer_id, 
                project_id, 
                warehouse_id, 
                status_id, 
                carrier_id, 
                bol, 
                po_number, 
                start_date, 
                seal, 
                comment, 
                user_id,
                created_date
            ) VALUES (
                ${data.customer_id}, 
                ${data.project_id}, 
                ${warehouseID}, 
                ${data.status_id}, 
                ${data.carrier_id}, 
                ${data.bol}, 
                ${data.po_number}, 
                ${data.start_date}, 
                ${data.seal}, 
                ${data.comment}, 
                ${userID}, 
                NOW()
            )
            RETURNING id;
        `;

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error('No ID returned after receiving creation');
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create receiving record');
    }
}

export async function updateReceiving(
    id: number,
    data: {
        customer_id?: number;
        project_id?: number;
        status_id?: number;
        carrier_id?: number;
        type?: string;
        bol?: string;
        po_number?: string;
        start_date?: string;
        tracking_number?: string;
        seal?: string;
        comment?: string;
        completed_date?: string;
    }
): Promise<any> {
    noStore(); // Disable caching
    try {
        const result = await sql`
        UPDATE receiving SET
          customer_id = COALESCE(${data.customer_id}, customer_id),
          project_id = COALESCE(${data.project_id}, project_id),
          status_id = COALESCE(${data.status_id}, status_id),
          carrier_id = COALESCE(${data.carrier_id}, carrier_id),
          type = COALESCE(${data.type}, type),
          bol = COALESCE(${data.bol}, bol),
          po_number = COALESCE(${data.po_number}, po_number),
          start_date = COALESCE(${data.start_date}, start_date),
          tracking_number = COALESCE(${data.tracking_number}, tracking_number),
          seal = COALESCE(${data.seal}, seal),
          comment = COALESCE(${data.comment}, comment),
          completed_date = COALESCE(${data.completed_date}, completed_date)
        WHERE id = ${id}
        RETURNING *;
      `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update receiving record.');
    }
}


export async function fetchStagingByWarehouseId(id: number) {
    noStore();
    try {
        const data = await sql<any>` 
        SELECT
          r.*,
          c.name as customer_name,
          p.name as project_name,
          w.name as warehouse_name,
          rs.name as status,
          rs.class as status_class,
          car.name as carrier_name,
          
          '0' as pallets_received,
          '0' as items_received

        FROM receiving r
        LEFT JOIN customers c on c.id = r.customer_id
        LEFT JOIN projects p on p.id = r.project_id
        LEFT JOIN warehouses w on w.id = r.warehouse_id
        LEFT JOIN receiving_statuses rs on rs.id = r.status_id
        LEFT JOIN carriers car on car.id = r.carrier_id
        WHERE r.warehouse_id = ${id};`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch staging.');
    }
}

export async function fetchStagingById(id: number) {
    noStore();
    try {
        const data = await sql<any>` 
        SELECT
          r.*,
          c.name as customer_name,
          p.name as project_name,
          w.name as warehouse_name,
          rs.name as status,
          rs.class as status_class,
          car.name as carrier_name,
          
          '0' as pallets_received,
          '0' as items_received

        FROM receiving r
        LEFT JOIN customers c on c.id = r.customer_id
        LEFT JOIN projects p on p.id = r.project_id
        LEFT JOIN warehouses w on w.id = r.warehouse_id
        LEFT JOIN receiving_statuses rs on rs.id = r.status_id
        LEFT JOIN carriers car on car.id = r.carrier_id
        WHERE r.id = ${id};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch staging.');
    }
}

export async function fetchActiveReceivingStatuses(): Promise<any> {
    noStore();
    try {
        const data = await sql` 
        SELECT
          *
        FROM receiving_statuses
        WHERE active = true;`;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch receiving statuses.');
    }
}
