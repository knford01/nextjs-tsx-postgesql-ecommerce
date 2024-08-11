// app/lib/data/user-data.tsx

'use server';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache'; //clear this cache that stores the route segments in the user's browser and trigger a new request to the server\\
import { unstable_noStore as noStore } from 'next/cache';
import { User, UserRole } from '@/types/user';

export async function fetchUsers() {
    noStore();
    try {
        const data = await sql<User>` 
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.avatar,
          u.role,
          ur.display as role_display,
          u.email, 
          'Enter New Password to Change' as password,
          case
            when u.active = 1 then 'Yes'
            else 'No'
          end as active
        FROM users u
        left join user_roles ur on ur.id = u.role
        ORDER BY first_name ASC`;

        const users = data.rows;
        return users;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all users.');
    }
}

export async function fetchUserById(id: string) {
    noStore();
    try {
        const data = await sql<User>`
        SELECT
          id,
          first_name,
          email, 
          '' as password
        FROM users
        WHERE id = ${id};`;

        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user.');
    }
}

const saltRounds = 10;

export async function createUser(data: any) {
    // console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    try {
        await sql`
            INSERT INTO users 
                (first_name, middle_name, last_name, email, password, role, avatar, active)
            VALUES 
                (${data.first_name || ''}, ${data.middle_name || ''}, ${data.last_name || ''}, ${data.email || ''}, ${hashedPassword || ''}, ${data.role || ''}, ${data.avatar || ''}, 1)
        `;
    } catch (error) {
        throw new Error('Failed to Create User');
    }
}

export async function updateUser(id: string, data: any) {
    // console.log(data);

    try {
        if (data.password != 'Enter New Password to Change') {
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            await sql`
            UPDATE users
            SET first_name = ${data.first_name}, middle_name = ${data.middle_name}, last_name = ${data.last_name}, 
            email = ${data.email}, password = ${hashedPassword}, role = ${data.role}, avatar = ${data.avatar}
            WHERE id = ${id}`;
        } else {
            await sql`
            UPDATE users
            SET first_name = ${data.first_name}, middle_name = ${data.middle_name}, last_name = ${data.last_name}, 
            email = ${data.email},  role = ${data.role}, avatar = ${data.avatar}
            WHERE id = ${id}`;
        }
    } catch (error) {
        throw new Error('Database Error: Failed to Update User.');
    }
}

export async function setUserStatus(id: string, active: number) {
    try {
        await sql`UPDATE users set active = ${active} WHERE id = ${id}`;
        revalidatePath('/navigation/users'); //triggers a new server request and re-render the table\\
        return { message: 'User Status Updated' };
    } catch (error) {
        return { message: 'Database Error: Failed to Update User.' };
    }
}

export async function fetchUserTheme(id: string) {
    noStore();
    try {
        const data = await sql<User>`SELECT theme FROM users WHERE id = ${id}`;
        const users = data.rows;
        return users;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch user theme.');
    }
}

export async function setUserTheme(id: string, theme: string) {
    try {
        await sql`UPDATE users set theme = ${theme} WHERE id = ${id}`;
        revalidatePath('/navigation/users');
        return { message: 'User Theme Updated' };
    } catch (error) {
        return { message: 'Database Error: Failed to Update Theme.' };
    }
}

export async function fetchUserRoles(active?: number) {
    noStore();
    try {
        let data;

        if (active === 1 || active === 2) {
            // Query with WHERE clause
            data = await sql<UserRole>`SELECT id, role, display, active FROM user_roles WHERE active = ${active} ORDER BY role ASC`;
        } else {
            // Query without WHERE clause
            data = await sql<UserRole>`SELECT id, role, display, active FROM user_roles ORDER BY role ASC`;
        }

        const users = data.rows;
        return users;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch user roles.');
    }
}

export async function fetchRoleById(id: string) {
    noStore();
    try {
        let data = await sql<UserRole>`SELECT id, role, display, active FROM user_roles WHERE id = ${id} ORDER BY role ASC`;
        const users = data.rows;
        return users;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch user roles.');
    }
}

export async function setUserRoles(id: number, data: any) {
    try {
        await sql`UPDATE user_roles SET role = ${data.role}, display = ${data.display}, active = ${data.active} WHERE id = ${id}`;
    } catch (error) {
        throw new Error('Database Error: Failed to Update User.');
    }
}

export async function createRole(data: any) {
    console.log(data);

    try {
        await sql`
            INSERT INTO user_roles 
                (role, display, active)
            VALUES 
                (${data.role}, ${data.display}, 1)`;
    } catch (error) {
        throw new Error('Failed to Create User');
    }
}