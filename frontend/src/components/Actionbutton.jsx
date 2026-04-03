import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ActionDropdown({
  id,
  selectedUser,
  setSelectedUser,
  setUsers,
  users,
  open,
  setOpen,
}) {
  const location = useLocation();
  const path = location.pathname.startsWith("/users")
    ? `/edit-user/${id}`
    : `/edit-roles/${id}`;

  const { token } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    if (location.pathname.startsWith("/users")) {
      try {
        console.log(`Delete item with ID: ${id}`);

        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setSelectedUser(""); // Clear selected user after deletion
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Update users state to remove deleted user
        setOpen(false); // Close dropdown after deletion
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    } else if (location.pathname.startsWith("/roles")) {
      try {
        console.log(`Delete item with ID: ${id}`);

        await axios.delete(`${import.meta.env.VITE_API_URL}/roles/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setSelectedUser(""); // Clear selected user after deletion
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id)); // Update roles state to remove deleted role
        setOpen(false); // Close dropdown after deletion
        toast.success("Role deleted successfully!");
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("Failed to delete role. Please try again.");
      }
    }
  };

  const handleopen = (id) => {
    if (selectedUser === id) {
      setOpen(!open); // Toggle dropdown if the same user is clicked
    } else {
      setSelectedUser(id); // Set the selected user and open dropdown
      setOpen(true);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button className="bg-green-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-green-600">
        Action
        <span
          className="bg-amber-400 border-l-amber-50 h-full w-6"
          onClick={() => handleopen(id)}
        >
          {open && selectedUser == id ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>

      {/* Dropdown */}
      {open && selectedUser == id && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
          <ul className="text-gray-700">
            <Link to={path}>
              {" "}
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-center items-center">
                Edit
              </li>
            </Link>

            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <button onClick={handleDelete} className="w-full h-full">
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
