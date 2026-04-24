/**
 * Roles that must not appear in the Permissions page dropdown (full-access / admin roles).
 */
export function isReservedPermissionRoleName(name) {
  if (!name || typeof name !== "string") return true;
  const n = name.trim().toLowerCase();
  return (
    n === "admin" ||
    n === "administrator" ||
    n === "super admin" ||
    n === "superadmin" ||
    n === "super-admin"
  );
}

/** Roles assignable on the Permissions screen (excludes Admin, etc.). */
export function rolesForPermissionDropdown(roles) {
  if (!Array.isArray(roles)) return [];
  return roles.filter((r) => r?.name && !isReservedPermissionRoleName(r.name));
}
