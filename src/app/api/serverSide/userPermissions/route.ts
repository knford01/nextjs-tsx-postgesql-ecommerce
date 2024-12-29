// src/app/api/serverSide/userPermissions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAllActivePermissions, getUserPermissions } from '@/db/permissions';
import { fetchUserById } from '@/db/user-data';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const user = await fetchUserById(userId);
        const permissions = await getAllActivePermissions();
        const rolePermissions = await getUserPermissions(userId);

        return NextResponse.json({ user, permissions, rolePermissions });
    } catch (error) {
        console.error('Error fetching user permissions:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

