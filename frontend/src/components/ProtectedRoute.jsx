import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { canAccess, canAccessAny } from "../utils/canAccess";

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.permission] — single required permission
 * @param {string[]} [props.anyOf] — user needs at least one
 * @param {boolean} [props.requireFullAccess] — only full-access (admin) users
 */
export default function ProtectedRoute({
  children,
  permission,
  anyOf,
  requireFullAccess,
}) {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  let allowed = true;
  if (requireFullAccess) {
    allowed = Boolean(auth.token) && Boolean(auth.fullAccess);
  } else if (anyOf?.length) {
    allowed = canAccessAny(auth, anyOf);
  } else if (permission) {
    allowed = canAccess(auth, permission);
  }

  if (!allowed) {
    const fallback = auth.fullAccess ? "/" : "/my-assignments";
    return (
      <Navigate to={fallback} replace state={{ deniedFrom: location.pathname }} />
    );
  }
  return children;
}
