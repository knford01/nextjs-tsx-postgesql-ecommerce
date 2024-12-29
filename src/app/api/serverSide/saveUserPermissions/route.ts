// src/app/api/serverSide/saveUserPermissions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { saveUserPermission } from '@/db/permissions';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        for (const permission of body) {
            if (!permission.user_id || !permission.permission_id || permission.access === undefined) {
                return NextResponse.json(
                    { error: 'Missing required fields in one or more permissions' },
                    { status: 400 }
                );
            }
        }

        // Save permissions to the database
        await saveUserPermission(body);

        // Return success response
        return NextResponse.json({ success: true, message: 'Permissions updated successfully' });
    } catch (error) {
        console.error('Failed to save permissions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
