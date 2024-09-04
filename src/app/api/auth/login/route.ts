// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { commitSession } from '@/utils/session'; // Example session management functions
import verifyUserCredentials from '@/utils/auth';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    const user = await verifyUserCredentials(email, password);

    if (user) {
        // Store user information in the session
        const session = { user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, role_display: user.role_display, active: user.active } };
        return await commitSession(session, req);
    } else {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
} 
