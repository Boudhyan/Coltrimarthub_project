import React, { useEffect, useState, useCallback } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import Popup from "../components/Popup";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import { cell } from "../utils/cellDisplay";

function Designation() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Add Designation");
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [designationName, setDesignationName] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [designations, setDesignations] = useState([]);

  const handleEdit = (id, name) => {
    setSelectedDesignation(id);
    setTitle("Edit Designation");
    setDesignationName(name);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setSelectedDesignation(id);
      setLoading(true);

      await axios.delete(`${import.meta.env.VITE_API_URL}/designations/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setDesignations((prev) => prev.filter((item) => item.id !== id));

      toast.success("Designation deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete designation");
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = useCallback(async () => {
    if (!token) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/designations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      setDesignations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load designations");
      setDesignations([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  const handleAdd = () => {
    setTitle("Add Designation");
    setDesignationName("");
    setSelectedDesignation("");
    setOpen(true);
  };

  return (
    <PageLoadingShell loading={initialLoading}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminTable.pageTitle}>Designation</h2>

          <button
            type="button"
            onClick={handleAdd}
            disabled={initialLoading || loading}
            className={`${adminTable.btnAdd} flex h-10 min-w-[10rem] items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Plus size={16} className="shrink-0" aria-hidden />
            Add Designation
          </button>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={adminTable.table}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Designation</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.thAction}>Action</th>
                </tr>
              </thead>

              <tbody className={adminTable.tbody}>
                {!initialLoading && designations.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={3}>
                      <span className="text-slate-500">No designations found.</span>
                    </td>
                  </tr>
                )}
                {designations.map((item) => (
                  <tr key={item.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{cell(item.name)}</td>

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
                        onClick={() => handleEdit(item.id, item.name)}
                        disabled={loading}
                        className={`${adminTable.btnEditIcon} disabled:opacity-50`}
                        aria-label="Edit designation"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className={`${adminTable.btnDeleteIcon} disabled:opacity-50`}
                        disabled={loading}
                        aria-label="Delete designation"
                      >
                        {loading && selectedDesignation === item.id ? (
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
            designations={designations}
            setDesignations={setDesignations}
            designationId={selectedDesignation}
            designationName={designationName}
          />
        )}
      </div>
    </PageLoadingShell>
  );
}

export default Designation;
