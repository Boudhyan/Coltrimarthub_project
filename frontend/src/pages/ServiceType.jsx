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

function ServiceType() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Add Service Type");
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [editingName, setEditingName] = useState("");

  const fetchTypes = useCallback(async () => {
    if (!token) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setServiceTypes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load service types");
      setServiceTypes([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleAdd = () => {
    setTitle("Add Service Type");
    setSelectedId(null);
    setEditingName("");
    setOpen(true);
  };

  const handleEdit = (id, name) => {
    setTitle("Edit Service Type");
    setSelectedId(id);
    setEditingName(name);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setSelectedId(id);
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/service-types/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setServiceTypes((prev) => prev.filter((t) => t.id !== id));
      toast.success("Service type deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete service type");
    } finally {
      setLoading(false);
      setSelectedId(null);
    }
  };

  return (
    <PageLoadingShell loading={initialLoading}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminTable.pageTitle}>Services</h2>
          <button
            type="button"
            onClick={handleAdd}
            disabled={initialLoading || loading}
            className={`${adminTable.btnAdd} flex h-10 min-w-[10rem] items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Plus size={16} className="shrink-0" aria-hidden />
            Add Service
          </button>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={adminTable.table}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Service</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.thAction}>Action</th>
                </tr>
              </thead>

              <tbody className={adminTable.tbody}>
                {!initialLoading && serviceTypes.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={3}>
                      <span className="text-slate-500">No service types yet.</span>
                    </td>
                  </tr>
                )}
                {serviceTypes.map((st) => (
                  <tr key={st.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{cell(st.name)}</td>
                    <td className={adminTable.td}>
                      <span className="inline-flex h-9 min-w-[5rem] items-center justify-center rounded-lg bg-emerald-600 text-xs font-semibold text-white shadow-sm">
                        Active
                      </span>
                    </td>
                    <td className={adminTable.tdAction}>
                      <button
                        type="button"
                        onClick={() => handleEdit(st.id, st.name)}
                        disabled={loading}
                        className={`${adminTable.btnEditIcon} disabled:opacity-50`}
                        aria-label="Edit service type"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(st.id)}
                        disabled={loading}
                        className={`${adminTable.btnDeleteIcon} disabled:opacity-50`}
                        aria-label="Delete service type"
                      >
                        {loading && selectedId === st.id ? (
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
      </div>

      {open && (
        <Popup
          open={open}
          setOpen={setOpen}
          title={title}
          serviceTypes={serviceTypes}
          setServiceTypes={setServiceTypes}
          serviceTypeId={selectedId}
          serviceTypeName={editingName}
        />
      )}
    </PageLoadingShell>
  );
}

export default ServiceType;
