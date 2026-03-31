import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ActionDropdown() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
   const path = location.pathname.startsWith("/users")
    ? "/edit-user/1"
    :   "/edit-roles/1";

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button className="bg-green-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-green-600">
        Action
        <span
          className="bg-amber-400 border-l-amber-50 h-full w-6"
          onClick={() => setOpen(!open)}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
          <ul className="text-gray-700">
            <Link to={path}>
              {" "}
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Edit
              </li>
            </Link>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Banned
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
