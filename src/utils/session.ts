import { parse, serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const sessionCookieName = 'myapp_session';

export function getSession(req: Request) {
    // Get the cookies from the Request headers
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    const session = cookies[sessionCookieName];

    if (!session) {
        return null;
    }

    try {
        return JSON.parse(session);
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
}

export async function commitSession(session: any, req: NextRequest) {
    const serializedCookie = serialize(sessionCookieName, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24,
    });

    // Construct an absolute URL for the redirect
    const url = new URL('/navigation', req.nextUrl.origin);

    // Create a response object with a 303 See Other redirect to the absolute URL
    const response = NextResponse.redirect(url, 303);

    // Set the cookie in the response headers
    response.headers.set('Set-Cookie', serializedCookie);

    return response;
}
