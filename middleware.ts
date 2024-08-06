// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './src/utils/session'; // Update the import path as needed

export async function middleware(req: NextRequest) {
    const session = await getSession(req);

    // Check if the user session exists
    if (!session || !session.user) {
        // If not, redirect to the login page
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Allow the request to continue
    return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],//specify specific paths to run on\\
};
