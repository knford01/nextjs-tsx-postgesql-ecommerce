// app/lib/data/project-data.tsx

'use server';
import { sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Fetch all projects
export async function fetchProjects() {
  noStore();
  try {
    const data = await sql<Project[]>`SELECT * FROM projects order by customer_id, id desc;`;
    return data.rows || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all projects.');
  }
}

// Fetch a project by ID
export async function fetchProjectByID(id: number) {
  noStore();
  try {
    const data = await sql<Project>`
      SELECT 
        p.*,
        ps.name as status_name,
        ps.class as status_theme
      FROM projects p
      LEFT JOIN project_statuses ps on ps.id = p.status
      WHERE p.id = ${id} 
      order by p.end_date, p.name desc;`;
    return data.rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}

// Fetch projects by customer ID
export async function fetchProjectsByCustomerId(id: number) {
  noStore();
  try {
    const data = await sql<Project>`
      SELECT 
        p.*,
        ps.name as status_name,
        ps.class as status_theme
      FROM projects p
      LEFT JOIN project_statuses ps on ps.id = p.status
      WHERE p.customer_id = ${id} 
      order by p.end_date, p.name desc;`;
    return data.rows || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects.');
  }
}

// Create a new project
export async function createProject(customer_id: number, data: any) {
  try {
    const result = await sql`
      INSERT INTO projects (
        name, customer_id, manager_id, details, start_date, end_date, status, 
        pallet_prefix, color, logo, scope, description, original_estimate, 
        contact_name, contact_phone, contact_email, active
      ) VALUES (
        ${data.name}, ${customer_id}, ${data.managerId}, ${data.details}, ${data.start_date}, ${data.end_date}, ${data.status},
        ${data.pallet_prefix}, ${data.color}, ${data.logo}, ${data.scope}, ${data.description}, ${data.originalEstimate},
        ${data.contactName}, ${data.contactPhone}, ${data.contactEmail}, true
      ) RETURNING *`;

    return result.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create project.');
  }
}

// Update an existing project
export async function updateProject(id: number, data: any) {
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
        contact_name = COALESCE(${data.contactName}, contact_name),
        contact_phone = COALESCE(${data.contactPhone}, contact_phone),
        contact_email = COALESCE(${data.contactEmail}, contact_email),
        active = COALESCE(${data.active}, active)
      WHERE id = ${id} RETURNING *`;
    return result.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update project.');
  }
}

// Update a project's status
export async function updateProjectStatus(id: number, status: number) {
  try {
    const result = await sql<Project>`UPDATE projects SET status = ${status} WHERE id = ${id};`;
    return result.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to update project status.');
  }
}

// Fetch a project statuses
export async function fetchProjectStatuses() {
  noStore();
  try {
    const data = await sql<any[]>`SELECT * FROM project_statuses where active = true`;
    return data.rows || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project.');
  }
}
