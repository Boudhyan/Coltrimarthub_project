/** @param {object} auth state.auth @param {string} [code] */
export function canAccess(auth, code) {
  if (!auth?.token) return false;
  if (auth.fullAccess) return true;
  if (!code) return true;
  return (
    Array.isArray(auth.permissions) && auth.permissions.includes(code)
  );
}

export function canAccessAny(auth, codes) {
  if (!codes?.length) return true;
  return codes.some((c) => canAccess(auth, c));
}
