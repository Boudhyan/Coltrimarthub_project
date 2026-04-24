import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AdminPageTopBar from "../components/AdminPageTopBar";

function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-slate-900/35 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close menu overlay"
        />
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[250px]">
        <div className="sticky top-0 z-10 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="ml-3 mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm"
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
        </div>
        <AdminPageTopBar />
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
