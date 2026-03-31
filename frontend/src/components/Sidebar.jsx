import { Link, Links } from "react-router-dom";
import URsideComp from "./URsideComp";

import { useState } from "react";
import ServiceComp from "./ServiceComp";

export default function Sidebar() {
  const [openUsers, setOpenUsers] = useState(false);
  return (
    <nav className="bg-blue-950 text-white shadow-md border-r border-gray-200 h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4 overflow-auto font-bold">
      {/* Main */}

      <Link to="/">
        <div className="font-bold text-[15px] block bg-blue-700 text-white rounded px-4 py-2 transition-all">
          Dashboard
        </div>
      </Link>

      <ul>
        <li>
          <Link
            to="/switch-panel"
            className="text-white text-[15px] block hover:text-slate-900 hover:bg-gray-100 rounded px-4 py-2 transition-all mt-2 font-bold"
          >
            Switch Panel
          </Link>
        </li>
      </ul>

      <URsideComp />
      <ServiceComp />
    </nav>
  );
}
