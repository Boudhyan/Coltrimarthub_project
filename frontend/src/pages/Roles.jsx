import React from "react";
import { Plus } from "lucide-react";
import ActionDropdown from "../components/Actionbutton";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import { cell } from "../utils/cellDisplay";

function Roles() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [roles, setRoles] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  const fetchRoles = useCallback(async () => {
    if (!token) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/roles`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      const msg =
        error.response?.data?.detail ||
        error.message ||
        "Failed to load roles";
      toast.error(
        typeof msg === "string" ? msg : "Failed to load roles",
      );
      setRoles([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <PageLoadingShell loading={initialLoading}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminTable.pageTitle}>Roles</h2>
          <Link to="/add-role" className={initialLoading ? "pointer-events-none" : ""}>
            <button
              type="button"
              disabled={initialLoading}
              className={`${adminTable.btnAdd} flex h-10 min-w-[10rem] cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Plus size={16} /> Add Roles
            </button>
          </Link>
        </div>
        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={adminTable.table}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Name</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.thAction}>Action</th>
                </tr>
              </thead>

              <tbody className={adminTable.tbody}>
                {!initialLoading && roles.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={3}>
                      <span className="text-slate-500">No roles found.</span>
                    </td>
                  </tr>
                )}
                {roles.map((role) => {
                  const active = role.is_active !== false;
                  return (
                  <tr key={role.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{cell(role.name)}</td>
                    <td className={adminTable.td}>
                      <span
                        className={
                          active
                            ? "inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20"
                            : "inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-400/30"
                        }
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className={adminTable.tdAction}>
                      <ActionDropdown
                        open={open}
                        setOpen={setOpen}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        id={role.id}
                        setRoles={setRoles}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}

export default Roles;
