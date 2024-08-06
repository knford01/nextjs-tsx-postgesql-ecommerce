import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const sessionCookieName = 'myapp_session';

export function getSession(req: NextRequest) {
    const cookies = req.cookies;
    const sessionCookie = cookies.get(sessionCookieName);

    // Access the cookie value
    const session = sessionCookie?.value;

    if (!session) {
        return {};
    }

    try {
        return JSON.parse(session);
    } catch (error) {
        console.error('Error parsing session:', error);
        return {};
    }
}

export async function commitSession(session: any) {
    const serializedCookie = serialize(sessionCookieName, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.redirect('/').headers.set('Set-Cookie', serializedCookie);
}
