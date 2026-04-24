import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, House } from "lucide-react";
import LogoutButton from "./logoutbutton";

/** Top navbar inside dashboard pages: back, home, logout. */
export default function AdminPageTopBar() {
  const navigate = useNavigate();
  const fullAccess = useSelector((state) => state.auth.fullAccess);

  return (
    <div className="sticky top-0 z-10 flex w-full min-w-0 shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/95 px-3 py-3 sm:px-4 md:px-6 shadow-sm backdrop-blur-sm">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2} className="shrink-0" aria-hidden />
          <span className="hidden sm:inline">Back</span>
        </button>
        <span className="h-6 w-px shrink-0 bg-slate-200" aria-hidden />
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `inline-flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
          title="Home"
          aria-label="Go to home"
        >
          <House size={22} strokeWidth={2} className="shrink-0" aria-hidden />
          <span>Home</span>
        </NavLink>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {fullAccess ? (
          <span
            className="hidden rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white sm:inline"
            title="Full access: all permission checks are bypassed for your account"
          >
            Full access
          </span>
        ) : null}
        <LogoutButton />
      </div>
    </div>
  );
}
