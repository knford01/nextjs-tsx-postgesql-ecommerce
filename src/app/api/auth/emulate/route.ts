import { fetchUserById } from '@/db/user-data';
import { commitSession, getSession } from '@/utils/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { emulate, emulating_user, emulated_user } = await req.json();
    const session = getSession(req);

    if (emulate) {
        if (!session.user.emulating_user_id) {
            session.user.emulating_user_id = emulating_user.id;
        }

        session.user.id = emulated_user.id;
        session.user.first_name = emulated_user.first_name;
        session.user.last_name = emulated_user.last_name;
        session.user.role = emulated_user.role;
        session.user.role_display = emulated_user.role_display;
    } else {
        // Stop emulating and revert back to the original user
        if (session.user.emulating_user_id) {
            const result = await fetchUserById(session.user.emulating_user_id);
            const originalUser = result?.rows?.[0];

            if (originalUser) {
                session.user.id = originalUser.id;
                session.user.first_name = originalUser.first_name;
                session.user.last_name = originalUser.last_name;
                session.user.role = originalUser.role;
                session.user.role_display = originalUser.role_display;
            }

            delete session.user.emulating_user_id;
        }
    }

    return await commitSession(session, req);
}
