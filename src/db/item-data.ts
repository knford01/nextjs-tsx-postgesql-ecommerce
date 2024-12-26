// app/lib/data/item-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchItems() {
  noStore();
  try {
    const data = await sql<Item>`
      SELECT
        items.*,
        CASE
            WHEN items.active = TRUE THEN 'Yes'
            ELSE 'No'
        END AS active,
        customers.name AS customer_name,
        (SELECT string_agg(project_id::TEXT, ',') 
        FROM item_projects 
        WHERE item_id = items.id) AS projects,
        (SELECT string_agg(warehouse_id::TEXT, ',') 
        FROM item_warehouses 
        WHERE item_id = items.id) AS warehouses
    FROM items
    LEFT JOIN customers ON customers.id = items.customer_id
    ORDER BY items.name DESC;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all items.');
  }
}

export async function fetchItemsById(id: number) {
  noStore();
  try {
    const data = await sql<Item>`
        SELECT
          *,
          case
            when active = TRUE then 'Yes'
            else 'No'
          end as active,
          customers.name AS customer_name,
        (SELECT string_agg(project_id::TEXT, ',') FROM item_projects WHERE item_id = items.id) AS projects,
        (SELECT string_agg(warehouse_id::TEXT, ',') FROM item_warehouses WHERE item_id = items.id) AS warehouses
        FROM items
        LEFT JOIN customers ON customers.id = items.customer_id
        WHERE id = ${id};`;

    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch item with ID ${id}.`);
  }
}

export async function fetchItemsByWarehouseId(warehouseId: number) {
  noStore();
  try {
    const data = await sql<Item>`
        SELECT
          *,
          CASE
            WHEN active = TRUE THEN 'Yes'
            ELSE 'No'
          END AS active,
          customers.name AS customer_name,
          (SELECT string_agg(project_id::TEXT, ',') FROM item_projects WHERE item_id = items.id) AS projects,
          (SELECT string_agg(warehouse_id::TEXT, ',') FROM item_warehouses WHERE item_id = items.id) AS warehouses
        FROM items
        LEFT JOIN customers ON customers.id = items.customer_id
        WHERE items.id IN (SELECT item_id FROM item_warehouses WHERE warehouse_id = ${warehouseId})
        ORDER BY name DESC;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch items for warehouse ID ${warehouseId}.`);
  }
}

export async function fetchItemsByProjectId(projectId: number) {
  noStore();
  try {
    const data = await sql<Item>`
        SELECT
          *,
          CASE
            WHEN active = TRUE THEN 'Yes'
            ELSE 'No'
          END AS active,
          customers.name AS customer_name,
          (SELECT string_agg(project_id::TEXT, ',') FROM item_projects WHERE item_id = items.id) AS projects,
          (SELECT string_agg(warehouse_id::TEXT, ',') FROM item_warehouses WHERE item_id = items.id) AS warehouses
        FROM items
        LEFT JOIN customers ON customers.id = items.customer_id
        WHERE items.id IN (SELECT item_id FROM item_projects WHERE project_id = ${projectId})
        ORDER BY name DESC;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch items for warehouse ID ${projectId}.`);
  }
}

export async function createItem(item: Omit<Item, 'id' | 'date_created'>) {
  noStore();
  try {
    const { customer_id, name, description, item_number, customer_number, article_number,
      upc, sku, uom_id, length, width, height, weight, manufacturer_id, model_id,
      case_pack_qty, low_inv, req_sn, bulk, image, active } = item;

    const data = await sql`
        INSERT INTO items (
          customer_id, name, description, item_number, customer_number, article_number, upc, 
          sku, uom_id, length, width, height, weight, manufacturer_id, model_id, 
          case_pack_qty, low_inv, req_sn, bulk, image, active
        ) VALUES (
          ${customer_id}, ${name}, ${description}, ${item_number}, ${customer_number}, ${article_number}, ${upc}, 
          ${sku}, ${uom_id}, ${length}, ${width}, ${height}, ${weight}, ${manufacturer_id}, ${model_id}, 
          ${case_pack_qty}, ${low_inv}, ${req_sn}, ${bulk}, ${image}, ${active}
        )
        RETURNING *;`;

    return data.rows[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create item.');
  }
}

export async function updateItem(
  id: number,
  item: {
    customer_id?: number;
    name?: string;
    description?: string;
    item_number?: string;
    customer_number?: string;
    article_number?: string;
    upc?: string;
    sku?: string;
    uom_id?: number;
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
    manufacturer_id?: number;
    model_id?: number;
    case_pack_qty?: number;
    low_inv?: number;
    req_sn?: boolean;
    bulk?: boolean;
    image?: string;
    active?: boolean;
  }
) {
  noStore(); // Disable caching
  try {
    const data = await sql`
      UPDATE items SET
        customer_id = COALESCE(${item.customer_id}, customer_id),
        name = COALESCE(${item.name}, name),
        description = COALESCE(${item.description}, description),
        item_number = COALESCE(${item.item_number}, item_number),
        customer_number = COALESCE(${item.customer_number}, customer_number),
        article_number = COALESCE(${item.article_number}, article_number),
        upc = COALESCE(${item.upc}, upc),
        sku = COALESCE(${item.sku}, sku),
        uom_id = COALESCE(${item.uom_id}, uom_id),
        length = COALESCE(${item.length}, length),
        width = COALESCE(${item.width}, width),
        height = COALESCE(${item.height}, height),
        weight = COALESCE(${item.weight}, weight),
        manufacturer_id = COALESCE(${item.manufacturer_id}, manufacturer_id),
        model_id = COALESCE(${item.model_id}, model_id),
        case_pack_qty = COALESCE(${item.case_pack_qty}, case_pack_qty),
        low_inv = COALESCE(${item.low_inv}, low_inv),
        req_sn = COALESCE(${item.req_sn}, req_sn),
        bulk = COALESCE(${item.bulk}, bulk),
        image = COALESCE(${item.image}, image),
        active = COALESCE(${item.active}, active)
      WHERE id = ${id}
      RETURNING *;
    `;
    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update item.');
  }
}

//End Items - Start Manufacture and Models\\
export async function fetchManufacturers() {
  noStore();
  try {
    const data = await sql<Manufacturer>`
      SELECT
        manufacturers.*,
        CASE
          WHEN manufacturers.active = TRUE THEN 'Yes'
          ELSE 'No'
        END AS active
      FROM manufacturers
      ORDER BY manufacturers.name DESC;
    `;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all manufacturers.');
  }
}

export async function fetchManufacturerById(id: number) {
  noStore();
  try {
    const data = await sql<Manufacturer>`
      SELECT
        *,
        CASE
          WHEN active = TRUE THEN 'Yes'
          ELSE 'No'
        END AS active
      FROM manufacturers
      WHERE id = ${id};
    `;

    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch manufacturer with ID ${id}.`);
  }
}

export async function createManufacturer(manufacturer: Omit<Manufacturer, 'id' | 'date_created'>) {
  noStore();
  try {
    const { name, contact_name, contact_phone, active } = manufacturer;

    const data = await sql`
        INSERT INTO manufacturers (
          name, contact_name, contact_phone, active
        ) VALUES (
          ${name}, ${contact_name}, ${contact_phone}, ${active}
        )
        RETURNING *;`;

    return data.rows[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create manufacturer.');
  }
}

export async function updateManufacturer(
  id: number,
  manufacturer: {
    name?: string;
    contact_name?: string;
    contact_phone?: string;
    active?: boolean;
  }
) {
  noStore(); // Disable caching
  try {
    const data = await sql`
      UPDATE manufacturers SET
        name = COALESCE(${manufacturer.name}, name),
        contact_name = COALESCE(${manufacturer.contact_name}, contact_name),
        contact_phone = COALESCE(${manufacturer.contact_phone}, contact_phone),
        active = COALESCE(${manufacturer.active}, active)
      WHERE id = ${id}
      RETURNING *;
    `;
    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update manufacturer.');
  }
}

export async function fetchModels() {
  noStore();
  try {
    const data = await sql<Model>`
      SELECT
        *,
        CASE
          WHEN active = TRUE THEN 'Yes'
          ELSE 'No'
        END AS active,
        (
          SELECT manufacturers.name
          FROM manufacturers
          WHERE manufacturers.id = models.manufacturer_id
        ) AS manufacturer_name
      FROM models
      ORDER BY name ASC;`;

    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all models.');
  }
}

export async function fetchModelById(id: number) {
  noStore();
  try {
    const data = await sql<Model & { manufacturer_name?: string }>`
      SELECT
        *,
        (
          SELECT manufacturers.name
          FROM manufacturers
          WHERE manufacturers.id = models.manufacturer_id
        ) AS manufacturer_name
      FROM models
      WHERE id = ${id}
      ORDER BY name ASC;`;

    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch model with ID ${id}.`);
  }
}

export async function createModel(model: Omit<Model, 'id' | 'manufacturer_name' | 'date_created'>) {
  noStore();
  try {
    const {
      manufacturer_id,
      name,
      active
    } = model;

    const data = await sql`
      INSERT INTO models (
        manufacturer_id, name, active
      ) VALUES (
        ${manufacturer_id},
        ${name},
        ${active}
      )
      RETURNING *;`;

    return data.rows[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create model.');
  }
}

export async function updateModel(
  id: number,
  model: {
    manufacturer_id?: number;
    name?: string;
    active?: boolean;
  }
) {
  noStore();
  try {
    const data = await sql`
      UPDATE models
      SET
        manufacturer_id = COALESCE(${model.manufacturer_id}, manufacturer_id),
        name = COALESCE(${model.name}, name),
        active = COALESCE(${model.active}, active)
      WHERE id = ${id}
      RETURNING *;`;

    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update model.');
  }
}

