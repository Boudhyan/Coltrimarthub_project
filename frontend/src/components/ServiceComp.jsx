import React from "react";
import { Link, Links } from "react-router-dom";
import { useState } from "react";
import {
  Users,
  Shield,
  UserCog,
  ChevronDown,
  Activity,
  Crown,
} from "lucide-react";

function ServiceComp() {
  const [openUsers, setOpenUsers] = useState(false);

  return (
    <div>
      <ul className="space-y-1">
        {/* Parent Menu */}
        <li>
          <button
            onClick={() => setOpenUsers(!openUsers)}
            className="flex items-center justify-between w-full text-white font-bold text-[15px] hover:text-slate-900 hover:bg-gray-100 rounded px-4 py-2 transition-all"
          >
            <div className="flex items-center gap-2">
              <Activity size={18} />
              Service Master
            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                openUsers ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Items */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openUsers ? "max-h-40 mt-1" : "max-h-0"
            }`}
          >
            <ul className="ml-6 space-y-1">
              <li>
                <Link
                  to="/service-type"
                  className="flex items-center gap-2 text-white text-sm hover:text-slate-900 hover:bg-gray-100 rounded px-3 py-2 transition-all"
                >
                  <Crown size={16} />
                  Service Type
                </Link>
              </li>

              <li>
                <Link
                  to="/service-request"
                  className="flex items-center gap-2 text-white text-sm hover:text-slate-900 hover:bg-gray-100 rounded px-3 py-2 transition-all"
                >
                  <Crown size={16} />
                  Service Request
                </Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default ServiceComp;
