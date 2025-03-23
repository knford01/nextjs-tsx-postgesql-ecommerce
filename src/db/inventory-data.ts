// app/lib/data/inventory-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchInventory() {
  noStore();
  try {
    const data = await sql<any>`
        SELECT
          i.id,
          i.name,
          i.description,
          CONCAT(i.name, '\n', i.description) as name_description, 
          i.item_number,
          i.image as avatar,
          c.name as customer_name,
          '0' as available,
          '0' as receiving,
          '0' as received,
          '0' as on_order,
          '0' as picked,
          '0' as adjusted
        FROM items i
        LEFT JOIN customers c on c.id = i.customer_id
        order by i.name asc;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch inventory.');
  }
}

export async function fetchInventoryByItemID(itemID: number) {
  noStore();

  try {
    const data = await sql<any>`
        SELECT
          i.id,
          i.name,
          i.description,
          CONCAT(i.name, '\n', i.description) as name_description,
          i.item_number,
          i.image as avatar,
          c.name as customer_name,
          '0' as available,
          '0' as receiving,
          '0' as received,
          '0' as on_order,
          '0' as picked,
          '0' as adjusted
        FROM items i
        LEFT JOIN customers c ON c.id = i.customer_id
        WHERE i.id = ${itemID}
        ORDER BY i.name ASC;`;

    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch filtered inventory.');
  }
}

export async function fetchFilteredInventory(warehouseID: number, locationID: number, customerID: number) {
  noStore();
  try {
    const data = await sql<any>`
        SELECT
          i.id,
          i.name,
          i.description,
          CONCAT(i.name, '\n', i.description) as name_description, 
          i.item_number,
          i.image as avatar,
          c.name as customer_name,
          '0' as available,
          '0' as receiving,
          '0' as received,
          '0' as on_order,
          '0' as picked,
          '0' as adjusted
        FROM items i
        LEFT JOIN customers c on c.id = i.customer_id
        LEFT JOIN item_warehouses iw on iw.item_id = i.id
        LEFT JOIN item_preferred_location ipl on ipl.item_id = i.id and ipl.warehouse_id = iw.warehouse_id
        order by i.name asc;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch inventory.');
  }
}

