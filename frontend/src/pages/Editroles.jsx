import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { KeyRound } from "lucide-react";
import PageLoadingShell from "../components/PageLoadingShell";
import Loader from "../components/Loader";
import { adminTable } from "../components/AdminTableStyles";

function EditRole() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    is_active: true,
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRoleData = useCallback(async () => {
    if (!token || !id) {
      setPageLoading(false);
      return;
    }
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/roles/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      setForm({
        name: data.name ?? "",
        is_active: data.is_active !== false,
      });
    } catch (error) {
      console.error("Error fetching role data:", error);
      toast.error("Failed to load role");
    } finally {
      setPageLoading(false);
    }
  }, [id, token]);

  const handleSubmit = async () => {
    if (saving) return;
    const name = form.name.trim();
    if (!name) {
      toast.error("Role name is required");
      return;
    }
    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/roles/${id}`,
        { name, is_active: form.is_active },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      toast.success("Role updated successfully!");
      navigate("/roles");
    } catch (error) {
      console.error("Error updating role:", error);
      const detail = error.response?.data?.detail;
      toast.error(
        typeof detail === "string" ? detail : "Failed to update role.",
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  return (
    <PageLoadingShell loading={pageLoading} minHeight="min-h-[320px]">
      <div className="flex flex-col gap-5">
        <h2 className={adminTable.pageTitle}>Edit role</h2>

        <div className="flex max-w-xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              disabled={saving || pageLoading}
              placeholder="Role name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Status
            </label>
            <select
              value={form.is_active ? "active" : "inactive"}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  is_active: e.target.value === "active",
                }))
              }
              disabled={saving || pageLoading}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p className="mt-2 text-xs text-slate-500">
              Inactive roles cannot sign in; users with this role are blocked until
              the role is active again.
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-sm font-medium text-slate-800">
              Permission codes for this role
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Choose which actions this role may perform on the Permissions page.
              Users inherit those permissions through their assigned role.
            </p>
            <Link
              to={`/permissions?roleId=${id}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
            >
              <KeyRound size={16} className="shrink-0" aria-hidden />
              Open permissions for this role
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={saving || pageLoading}
              onClick={handleSubmit}
              className={`${adminTable.btnAdd} inline-flex min-h-[42px] min-w-[8rem] items-center justify-center gap-2 px-5 disabled:opacity-50`}
            >
              {saving ? (
                <>
                  <Loader size={20} className="text-white" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => navigate("/roles")}
              className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}

export default EditRole;
