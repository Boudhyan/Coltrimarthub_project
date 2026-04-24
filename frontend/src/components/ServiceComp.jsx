import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  Activity,
  Wrench,
  ClipboardList,
  List,
  UserCheck,
} from "lucide-react";
import { canAccess, canAccessAny } from "../utils/canAccess";
import { P } from "../constants/routePermissions";

const subBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition";
const subInactive = "text-white/90 hover:bg-white/10 hover:text-white";
const subActive = "bg-white text-slate-900 shadow-sm ring-1 ring-white/20";

export default function ServiceComp({ onNavigate = () => {} }) {
  const auth = useSelector((state) => state.auth);
  const fullAccess = Boolean(auth.fullAccess);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() =>
    ["/services", "/service-requests", "/service-request", "/my-assignments"].some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    ),
  );

  const items = useMemo(
    () =>
      [
        {
          to: "/services",
          perm: P.SERVICE_TYPE_READ,
          icon: Wrench,
          label: "Services",
        },
        {
          to: "/service-requests",
          perm: P.SERVICE_REQUEST_READ,
          icon: List,
          label: "Service requests",
        },
        {
          to: "/service-request",
          perm: P.SERVICE_REQUEST_CREATE,
          icon: ClipboardList,
          label: "New service request",
          end: true,
        },
        {
          to: "/my-assignments",
          engineerOnly: true,
          icon: UserCheck,
          label: "My assignments",
          end: true,
        },
      ].filter((x) => {
        if (x.engineerOnly) return !fullAccess;
        if (x.anyOf) return canAccessAny(auth, x.anyOf);
        return canAccess(auth, x.perm);
      }),
    [auth, fullAccess],
  );

  useEffect(() => {
    if (
      ["/services", "/service-requests", "/service-request", "/my-assignments"].some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      )
    ) {
      setOpen(true);
    }
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <ul className="space-y-1">
        <li>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] font-semibold text-white transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 shrink-0 text-white/90" aria-hidden />
              Service master
            </span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-white/80 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              open ? "mt-1 max-h-96" : "max-h-0"
            }`}
          >
            <ul className="ml-2 space-y-0.5 border-l border-white/15 pl-3">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `${subBase} ${isActive ? subActive : subInactive}`
                      }
                    >
                      <Icon size={16} className="shrink-0 opacity-90" />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}
