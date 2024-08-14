import { getRolePermissions, getUserPermissions } from "@/db/permissions";

interface Permission {
    role_id: number;
    permission_id: number;
    area: string;
    access: string; // Comma-separated list of sub-areas
}

async function hasAccess(
    userId: string,
    role: number,
    area: string,
    subArea: string
): Promise<boolean> {
    const userPermissions: Permission[] = await getUserPermissions(userId);
    const rolePermissions: Permission[] = await getRolePermissions(role);

    // Helper function to check permissions
    const checkPermissions = (permissions: Permission[]): boolean => {
        return permissions.some(permission =>
            permission.area === area && permission.access.split(',').includes(subArea)
        );
    };

    // Check user permissions first
    if (checkPermissions(userPermissions)) {
        return true;
    }

    // Check role permissions if no direct user permissions are found
    if (checkPermissions(rolePermissions)) {
        return true;
    }

    // If no access is found, return false
    return false;
}
