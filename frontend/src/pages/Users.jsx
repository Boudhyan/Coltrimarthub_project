import React, { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import ActionDropdown from "../components/Actionbutton";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import { cell } from "../utils/cellDisplay";

function Users() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [open, setOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <PageLoadingShell loading={initialLoading} minHeight="min-h-[320px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminTable.pageTitle}>Users</h2>
          <Link to="/add-user" className={initialLoading ? "pointer-events-none" : ""}>
            <button
              type="button"
              disabled={initialLoading}
              className={`${adminTable.btnAdd} flex h-10 min-w-[10rem] cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Plus size={16} /> Add Users
            </button>
          </Link>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={`${adminTable.table} min-w-[960px]`}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Name</th>
                  <th className={adminTable.th}>User ID</th>
                  <th className={adminTable.th}>Phone</th>
                  <th className={adminTable.th}>Email</th>
                  <th className={adminTable.th}>Designation</th>
                  <th className={adminTable.th}>Department</th>
                  <th className={adminTable.th}>Role</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.thAction}>Action</th>
                </tr>
              </thead>

              <tbody className={adminTable.tbody}>
                {!initialLoading && users.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={9}>
                      <span className="text-slate-500">No users found.</span>
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr key={user.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{cell(user?.username)}</td>
                    <td className={adminTable.td}>{cell(user?.id)}</td>
                    <td className={adminTable.td}>{cell(user?.phone)}</td>
                    <td className={`${adminTable.td} max-w-[220px] truncate`}>
                      {cell(user?.email)}
                    </td>
                    <td className={adminTable.td}>
                      {cell(user?.designation_name ?? user?.designation)}
                    </td>
                    <td className={adminTable.td}>
                      {cell(user?.department_name ?? user?.department)}
                    </td>
                    <td className={adminTable.td}>{cell(user?.role_name)}</td>
                    <td className={adminTable.td}>
                      <span
                        className={
                          user.is_active
                            ? "inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20"
                            : "inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-400/30"
                        }
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className={adminTable.tdAction}>
                      <ActionDropdown
                        id={user.id}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        setUsers={setUsers}
                        open={open}
                        setOpen={setOpen}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}

export default Users;
