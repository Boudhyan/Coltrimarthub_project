import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />

      {/* Content Area */}
      <div className="ml-62.5 flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
