'use server';

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Create a new permission
export const createPermission = async (area: string, subAreas: string) => {
  try {
    const result = await sql`
      INSERT INTO permissions (area, sub_areas)
      VALUES (${area.toLowerCase().replace(/ /g, '_')}, ${subAreas.toLowerCase().replace(/ /g, '_')})
      RETURNING id, area, sub_areas;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating permission:', error);
    throw new Error('Failed to create permission');
  }
};

// Get all permissions
export const getAllPermissions = async (): Promise<Permission[]> => {
  try {
    const result = await sql`SELECT id, area, sub_areas, active FROM permissions;`;
    return result.rows as Permission[];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw new Error('Failed to fetch permissions');
  }
};

// Update an existing permission
export const updatePermission = async (id: number, area: string, subAreas: string) => {
  try {
    const result = await sql`
      UPDATE permissions
      SET area = ${area.toLowerCase().replace(/ /g, '_')}, sub_areas = ${subAreas.toLowerCase().replace(/ /g, '_')}
      WHERE id = ${id}
      RETURNING id, area, sub_areas;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error updating permission:', error);
    throw new Error('Failed to update permission');
  }
};

// Delete a permission
export const deletePermission = async (id: number) => {
  try {
    await sql`
      DELETE FROM permissions
      WHERE id = ${id};
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw new Error('Failed to delete permission');
  }
};
