import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { LayoutDashboard, SlidersHorizontal } from "lucide-react";
import URsideComp from "./URsideComp";
import ServiceComp from "./ServiceComp";

const navLinkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold transition";

const navInactive = "text-white/95 hover:bg-white/10 hover:text-white";
const navActive = "bg-white text-slate-900 shadow-md ring-1 ring-white/20";

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const fullAccess = useSelector((state) => state.auth.fullAccess);

  return (
    <nav
      className={`fixed left-0 top-0 z-20 h-screen w-[250px] shrink-0 overflow-auto border-r border-slate-800 bg-slate-900 px-3 py-6 shadow-lg transition-transform duration-200 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {fullAccess ? (
        <div className="mb-6 border-b border-white/10 pb-4">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navActive : navInactive}`
            }
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden />
            Dashboard
          </NavLink>
        </div>
      ) : null}

      {fullAccess ? (
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/switch-panel"
              onClick={onClose}
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navActive : navInactive}`
              }
            >
              <SlidersHorizontal className="h-5 w-5 shrink-0" aria-hidden />
              Switch panel
            </NavLink>
          </li>
        </ul>
      ) : null}

      <URsideComp onNavigate={onClose} />
      <ServiceComp onNavigate={onClose} />
    </nav>
  );
}
