import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Loader from "./Loader";

export default function ActionDropdown({
  id,
  selectedUser,
  setSelectedUser,
  setUsers,
  setRoles,
  open,
  setOpen,
}) {
  const location = useLocation();
  const path = location.pathname.startsWith("/users")
    ? `/edit-user/${id}`
    : `/edit-roles/${id}`;

  const { token } = useSelector((state) => state.auth);
  const isOpen = open && selectedUser === id;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (location.pathname.startsWith("/users")) {
      try {
        setDeleting(true);
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setSelectedUser("");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setOpen(false);
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      } finally {
        setDeleting(false);
      }
    } else if (location.pathname.startsWith("/roles") && setRoles) {
      try {
        setDeleting(true);
        await axios.delete(`${import.meta.env.VITE_API_URL}/roles/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setSelectedUser("");
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
        setOpen(false);
        toast.success("Role deleted successfully!");
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("Failed to delete role. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const toggle = () => {
    if (deleting) return;
    if (selectedUser === id) {
      setOpen(!open);
    } else {
      setSelectedUser(id);
      setOpen(true);
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => toggle()}
        disabled={deleting}
        className="group inline-flex items-stretch overflow-hidden rounded-xl bg-neutral-900 text-sm font-semibold text-white shadow-lg shadow-black/25 ring-1 ring-neutral-800 transition hover:bg-neutral-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center gap-2 px-3 py-2.5">
          <MoreHorizontal className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          Actions
        </span>
        <span className="flex items-center border-l border-white/15 bg-black/30 px-2.5 transition group-hover:bg-black/40">
          {isOpen ? (
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-[100] min-w-[180px] overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 py-1.5 shadow-2xl ring-1 ring-white/10"
          role="menu"
        >
          <Link
            to={path}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 ${deleting ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => setOpen(false)}
          >
            <Pencil className="h-4 w-4 text-white/90" strokeWidth={2} />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-300 transition hover:bg-red-950/80 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {deleting ? (
              <Loader size={16} className="text-red-200" />
            ) : (
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            )}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
