import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Users,
  Shield,
  UserCog,
  ChevronDown,
  Notebook,
  KeyRound,
  Building2,
} from "lucide-react";
import { canAccess } from "../utils/canAccess";
import { P } from "../constants/routePermissions";

const subBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition";
const subInactive = "text-white/90 hover:bg-white/10 hover:text-white";
const subActive = "bg-white text-slate-900 shadow-sm ring-1 ring-white/20";

const groupPaths = [
  "/users",
  "/roles",
  "/department",
  "/designation",
  "/customers",
  "/permissions",
];

export default function URsideComp({ onNavigate = () => {} }) {
  const auth = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const [openUsers, setOpenUsers] = useState(() =>
    groupPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`)),
  );

  const items = useMemo(
    () =>
      [
        { to: "/users", perm: P.USER_READ, icon: Users, label: "Users" },
        { to: "/roles", perm: P.ROLE_READ, icon: Shield, label: "Roles" },
        {
          to: "/department",
          perm: P.DEPARTMENT_READ,
          icon: UserCog,
          label: "Department",
        },
        {
          to: "/designation",
          perm: P.DESIGNATION_READ,
          icon: Notebook,
          label: "Designation",
        },
        {
          to: "/customers",
          perm: P.CUSTOMER_READ,
          icon: Building2,
          label: "Customers",
        },
        {
          to: "/permissions",
          perm: P.ROLE_UPDATE,
          icon: KeyRound,
          label: "Permissions",
        },
      ].filter((x) => canAccess(auth, x.perm)),
    [auth],
  );

  useEffect(() => {
    if (groupPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      setOpenUsers(true);
    }
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <ul className="space-y-1">
        <li>
          <button
            type="button"
            onClick={() => setOpenUsers(!openUsers)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] font-semibold text-white transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 shrink-0 text-white/90" aria-hidden />
              Users &amp; roles
            </span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-white/80 transition-transform duration-300 ${
                openUsers ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openUsers ? "mt-1 max-h-96" : "max-h-0"
            }`}
          >
            <ul className="ml-2 space-y-0.5 border-l border-white/15 pl-3">
              {items.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `${subBase} ${isActive ? subActive : subInactive}`
                    }
                  >
                    <Icon size={16} className="shrink-0 opacity-90" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}
