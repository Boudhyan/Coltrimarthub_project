import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Narrow, touch-friendly shell for field forms (no dashboard sidebar).
 */
export default function MobileFormLayout() {
  const fullAccess = useSelector((s) => s.auth.fullAccess);
  const backTo = fullAccess ? "/" : "/my-assignments";
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-3 py-3">
          <Link
            to={backTo}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-sm font-medium text-blue-800 active:bg-slate-100"
          >
            ← Back
          </Link>
          <span className="text-sm font-semibold text-slate-800">
            Observation
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg px-3 py-4">
        <Outlet />
      </main>
    </div>
  );
}
