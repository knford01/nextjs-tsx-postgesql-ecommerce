import { getRolePermissions, getUserPermissions } from "@/db/permissions";

export async function getCombinedPermissions(userId: string, roleId: number): Promise<CombinedPermission[]> {
    const userPermissions: Permission[] = await getUserPermissions(userId);
    const rolePermissions: Permission[] = await getRolePermissions(roleId);

    const combinedPermissions: Map<string, Set<string>> = new Map();

    // Helper function to add permissions to the map
    const addPermissions = (permissions: Permission[]) => {
        permissions.forEach(permission => {
            if (!combinedPermissions.has(permission.area)) {
                combinedPermissions.set(permission.area, new Set(permission.access.split(',')));
            } else {
                const currentAccess = combinedPermissions.get(permission.area)!;
                permission.access.split(',').forEach(access => currentAccess.add(access));
            }
        });
    };

    // Add user and role permissions to the map
    addPermissions(userPermissions);
    addPermissions(rolePermissions);

    // Convert the map back to an array of CombinedPermission
    return Array.from(combinedPermissions.entries()).map(([area, accessSet]) => ({
        area,
        access: Array.from(accessSet),
    }));
}

export function hasAccess(combinedPermissions: CombinedPermission[], area: string, subArea: string): boolean {
    const permission = combinedPermissions.find(p => p.area === area);
    return permission ? permission.access.includes(subArea) : false;
}
