import { sql } from '@vercel/postgres';

export const resolvers = {
    Query: {
        getFilteredInventory: async (
            _: any,
            args: { warehouseID?: number; locationID?: number; customerID?: number }
        ) => {
            const { warehouseID, locationID, customerID } = args;

            let whereClauses: string[] = [];
            let values: any[] = [];

            if (warehouseID !== undefined) {
                whereClauses.push(`iw.warehouse_id = $${values.length + 1}`);
                values.push(warehouseID);
            }

            if (locationID !== undefined) {
                whereClauses.push(`ipl.location_id = $${values.length + 1}`);
                values.push(locationID);
            }

            if (customerID !== undefined) {
                whereClauses.push(`i.customer_id = $${values.length + 1}`);
                values.push(customerID);
            }

            const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

            const query = `
                SELECT DISTINCT ON (i.id)
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
                ${whereSQL}
                ORDER BY i.id, i.name ASC;
            `;

            try {
                const result = await sql.query(query, values);
                return result.rows || [];
            } catch (err) {
                console.error('GraphQL Inventory Error:', err);
                throw new Error('Failed to fetch filtered inventory.');
            }
        },
    },
};
