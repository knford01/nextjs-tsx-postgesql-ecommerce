// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './src/utils/session'; // Ensure this is compatible with the Edge runtime

export async function middleware(req: NextRequest) {
    // Get the session (make sure this function is compatible with Next.js Edge middleware)
    const session = await getSession(req);

    // console.log(session);

    // Check if the user session exists
    if (!session || !session.user) {
        // Redirect to login page
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Allow the request to continue
    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|gif|svg|webp)$).*)'],
};

