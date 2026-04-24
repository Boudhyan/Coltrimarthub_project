import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import Loader from "../components/Loader";

const emptyForm = { name: "", address: "", phone: "", email: "" };

export default function Customers() {
  const auth = useSelector((s) => s.auth);
  const { token } = auth;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deletingId, setDeletingId] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchRows = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/customers`, {
        headers,
        withCredentials: true,
      });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load customers");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name || "",
      address: row.address || "",
      phone: row.phone || "",
      email: row.email || "",
    });
    setOpen(true);
  };

  const onSave = async () => {
    const payload = {
      name: (form.name || "").trim(),
      address: (form.address || "").trim() || null,
      phone: (form.phone || "").trim() || null,
      email: (form.email || "").trim() || null,
    };
    if (!payload.name) {
      toast.error("Customer name is required");
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/customers/${editingId}`,
          payload,
          { headers, withCredentials: true },
        );
        toast.success("Customer updated");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/customers`, payload, {
          headers,
          withCredentials: true,
        });
        toast.success("Customer created");
      }
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchRows();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/customers/${id}`, {
        headers,
        withCredentials: true,
      });
      setRows((prev) => prev.filter((x) => x.id !== id));
      toast.success("Customer deleted");
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.detail || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageLoadingShell loading={loading}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminTable.pageTitle}>Customers</h2>
          <button
            type="button"
            onClick={openCreate}
            className={`${adminTable.btnAdd} flex h-10 min-w-[10rem] items-center justify-center gap-2`}
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={adminTable.table}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Name</th>
                  <th className={adminTable.th}>Address</th>
                  <th className={adminTable.th}>Phone</th>
                  <th className={adminTable.th}>Email</th>
                  <th className={adminTable.thAction}>Action</th>
                </tr>
              </thead>
              <tbody className={adminTable.tbody}>
                {!loading && rows.length === 0 ? (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={5}>
                      <span className="text-slate-500">No customers found.</span>
                    </td>
                  </tr>
                ) : null}
                {rows.map((r) => (
                  <tr key={r.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{r.name || "—"}</td>
                    <td className={adminTable.td}>{r.address || "—"}</td>
                    <td className={adminTable.td}>{r.phone || "—"}</td>
                    <td className={adminTable.td}>{r.email || "—"}</td>
                    <td className={adminTable.tdAction}>
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className={adminTable.btnEditIcon}
                        aria-label="Edit customer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(r.id)}
                        disabled={deletingId === r.id}
                        className={adminTable.btnDeleteIcon}
                        aria-label="Delete customer"
                      >
                        {deletingId === r.id ? (
                          <Loader size={16} className="text-white" />
                        ) : (
                          <Trash2 size={16} />
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

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
              />
              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="min-h-[96px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageLoadingShell>
  );
}

