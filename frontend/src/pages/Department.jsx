import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import Popup from "../components/Popup";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import { cell } from "../utils/cellDisplay";

function Department() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Add Department");
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [departmentname, setDepartmentname] = useState("");

  const [selectedDepartment, setselectedDepartment] = useState("");
  const [departments, setdepartments] = useState([]);

  const handleEdit = (id, name) => {
    setselectedDepartment(id);
    setTitle("Edit Department");
    setOpen(true);
    setDepartmentname(name);
  };

  const handleDelete = async (id) => {
    try {
      setselectedDepartment(id);
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/departments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setselectedDepartment("");
      setdepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.id !== id),
      );
      setOpen(false);
      toast.success("Department deleted successfully!");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = useCallback(async () => {
    if (!token) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/departments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      setdepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
      setdepartments([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleadd = () => {
    setTitle("Add Department");
    setOpen(true);
    setDepartmentname("");
  };

  return (
    <PageLoadingShell loading={initialLoading}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminTable.pageTitle}>Department</h2>
          <button
            type="button"
            onClick={() => handleadd()}
            disabled={initialLoading || loading}
            className={`${adminTable.btnAdd} flex h-10 min-w-[10rem] cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Plus size={16} className="shrink-0" aria-hidden />
            Add Department
          </button>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={adminTable.table}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Departments</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.thAction}>Action</th>
                </tr>
              </thead>

              <tbody className={adminTable.tbody}>
                {!initialLoading && departments.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={3}>
                      <span className="text-slate-500">No departments found.</span>
                    </td>
                  </tr>
                )}
                {departments.map((department, index) => (
                  <tr key={department.id ?? index} className={adminTable.tr}>
                    <td className={adminTable.td}>{cell(department.name)}</td>
                    <td className={adminTable.td}>
                      <button
                        type="button"
                        className="inline-flex h-9 min-w-[5rem] items-center justify-center rounded-lg bg-emerald-600 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        Active
                      </button>
                    </td>
                    <td className={adminTable.tdAction}>
                      <button
                        type="button"
                        onClick={() => handleEdit(department.id, department.name)}
                        disabled={loading}
                        className={`${adminTable.btnEditIcon} cursor-pointer disabled:opacity-50`}
                        aria-label="Edit department"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${adminTable.btnDeleteIcon} cursor-pointer disabled:opacity-50`}
                        onClick={() => handleDelete(department.id)}
                        disabled={loading}
                        aria-label="Delete department"
                      >
                        {loading && selectedDepartment === department.id ? (
                          <Loader size={16} className="text-white" />
                        ) : (
                          <Trash size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {open && (
          <Popup
            open={open}
            setOpen={setOpen}
            title={title}
            departments={departments}
            setdepartments={setdepartments}
            departmentId={selectedDepartment}
            departmentName={departmentname}
          />
        )}
      </div>
    </PageLoadingShell>
  );
}

export default Department;
