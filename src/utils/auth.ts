import { getUser, userSession } from '@/db/user-data';
import { User } from '@/types/user';
import bcrypt from 'bcrypt';

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
        user.password = '';
        // If the password is valid, return the user object, otherwise return null
        if (isPasswordValid) {
            // Add record of user logging in\\
            await userSession(user.id, undefined, undefined);

            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to verify user credentials:', error);
        throw new Error('Failed to verify user credentials.');
    }
}
