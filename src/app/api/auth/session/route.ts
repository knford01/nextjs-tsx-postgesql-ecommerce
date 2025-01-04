// app/api/auth/session/route.ts

import { NextResponse } from 'next/server';
import { getSession } from '@/utils/session'; // Ensure this path is correct

export async function GET(req: Request) {
    const session = getSession(req);
    // console.log("session: ", session);

    if (session && session.user) {
        return NextResponse.json({ user: session.user });
    } else {
        // console.log("Bad Session: ", session);
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
}
