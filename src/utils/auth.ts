import { User } from '@/types/user';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`
        SELECT 
            u.id, u.first_name, u.last_name, u.email, u.role, ur.display as role_display, u.active, u.password 
        FROM users u 
        LEFT JOIN user_roles ur ON ur.id = u.role 
        WHERE u.email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export default async function verifyUserCredentials(email: string, password: string): Promise<User | null> {

    try {
        // Fetch the user by email
        const user = await getUser(email);

        // If user does not exist, return null
        if (!user) {
            return null;
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the password is valid, return the user object, otherwise return null
        if (isPasswordValid) {
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to verify user credentials:', error);
        throw new Error('Failed to verify user credentials.');
    }
}
