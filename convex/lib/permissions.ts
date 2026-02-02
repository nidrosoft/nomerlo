import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export type UserRole =
    | 'super_admin'      // Nomerlo staff - platform-wide access
    | 'owner'            // Organization owner - full org access
    | 'property_manager' // Manager - assigned properties only
    | 'staff'            // Staff - limited access
    | 'tenant'           // Tenant - their unit only
    | 'maintenance'      // Maintenance - work orders only

export type Permission =
    | 'properties:read' | 'properties:write' | 'properties:delete'
    | 'units:read' | 'units:write' | 'units:delete'
    | 'tenants:read' | 'tenants:write' | 'tenants:invite'
    | 'leases:read' | 'leases:write' | 'leases:sign'
    | 'payments:read' | 'payments:write' | 'payments:process'
    | 'maintenance:read' | 'maintenance:write' | 'maintenance:assign'
    | 'documents:read' | 'documents:write' | 'documents:delete'
    | 'reports:read' | 'reports:export'
    | 'settings:read' | 'settings:write'
    | 'billing:read' | 'billing:write'
    | 'team:read' | 'team:write' | 'team:invite'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    super_admin: ['*'] as any, // All permissions
    owner: [
        'properties:read', 'properties:write', 'properties:delete',
        'units:read', 'units:write', 'units:delete',
        'tenants:read', 'tenants:write', 'tenants:invite',
        'leases:read', 'leases:write', 'leases:sign',
        'payments:read', 'payments:write', 'payments:process',
        'maintenance:read', 'maintenance:write', 'maintenance:assign',
        'documents:read', 'documents:write', 'documents:delete',
        'reports:read', 'reports:export',
        'settings:read', 'settings:write',
        'billing:read', 'billing:write',
        'team:read', 'team:write', 'team:invite',
    ],
    property_manager: [
        'properties:read',
        'units:read', 'units:write',
        'tenants:read', 'tenants:write', 'tenants:invite',
        'leases:read', 'leases:write',
        'payments:read',
        'maintenance:read', 'maintenance:write', 'maintenance:assign',
        'documents:read', 'documents:write',
        'reports:read',
    ],
    staff: [
        'properties:read',
        'units:read',
        'tenants:read',
        'maintenance:read', 'maintenance:write',
        'documents:read',
    ],
    tenant: [
        'payments:read', 'payments:write',
        'maintenance:read', 'maintenance:write',
        'documents:read',
    ],
    maintenance: [
        'maintenance:read', 'maintenance:write',
        'properties:read',
        'units:read',
    ],
}

// Get authenticated user with their role and organization
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthorized: Not authenticated");
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

// Verify user has access to organization
export async function verifyOrgAccess(
    ctx: QueryCtx | MutationCtx,
    organizationId: Id<"organizations">
) {
    const user = await getAuthenticatedUser(ctx);

    // Super admins have access to all orgs
    // @ts-ignore
    if (user.role === "super_admin") {
        return user;
    }

    // Check if user belongs to organization
    const membership = await ctx.db
        .query("organizationMembers")
        .withIndex("by_user_org", (q) =>
            q.eq("userId", user._id).eq("organizationId", organizationId)
        )
        .unique();

    if (!membership) {
        throw new Error("Unauthorized: No access to this organization");
    }

    return { ...user, orgRole: membership.role };
}

// Check specific permission
export function hasPermission(
    userRole: UserRole,
    permission: Permission
): boolean {
    const permissions = ROLE_PERMISSIONS[userRole];
    // @ts-ignore
    return permissions.includes('*') || permissions.includes(permission);
}

// Require permission or throw
export async function requirePermission(
    ctx: QueryCtx | MutationCtx,
    organizationId: Id<"organizations">,
    permission: Permission
) {
    const user = await verifyOrgAccess(ctx, organizationId);

    // @ts-ignore
    if (!hasPermission(user.orgRole || user.role, permission)) {
        throw new Error(`Unauthorized: Missing permission ${permission}`);
    }

    return user;
}
