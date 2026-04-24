import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setFullAccess,
  setPermissions,
  setUserProfile,
} from "../store/slices/Authslice.js";

/** Token gate + refresh full_access / permissions for sidebar and route guards. */
export default function RequireAuth() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        if (cancelled || !data) return;
        if (typeof data.full_access === "boolean") {
          dispatch(setFullAccess(data.full_access));
        }
        if (Array.isArray(data.permissions)) {
          dispatch(setPermissions(data.permissions));
        }
        if (data.user_id != null || data.role_id !== undefined) {
          dispatch(
            setUserProfile({
              userId:
                typeof data.user_id === "number" ? data.user_id : undefined,
              roleId:
                data.role_id === null || data.role_id === undefined
                  ? null
                  : typeof data.role_id === "number"
                    ? data.role_id
                    : undefined,
            }),
          );
        }
      } catch {
        /* keep cached permissions */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
