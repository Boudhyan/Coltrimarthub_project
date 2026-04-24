import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import Loader from "../components/Loader";
import { rolesForPermissionDropdown } from "../utils/roleFilters";

/**
 * Assign permission codes to a role. Users inherit permissions through their role.
 */
export default function PermissionsPage() {
  const navigate = useNavigate();
  const { token, roleId: myRoleId } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const roleIdFromQuery = searchParams.get("roleId");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [selected, setSelected] = useState(new Set());

  const editingOwnRole = useMemo(
    () =>
      myRoleId != null &&
      Boolean(roleId) &&
      String(roleId) === String(myRoleId),
    [myRoleId, roleId],
  );

  const assignableRoles = useMemo(
    () => rolesForPermissionDropdown(roles),
    [roles],
  );

  const loadBase = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [rolesRes, permRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/roles/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      setAllPermissions(Array.isArray(permRes.data) ? permRes.data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load permissions data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBase();
  }, [loadBase]);

  useEffect(() => {
    if (!roleIdFromQuery || assignableRoles.length === 0) return;
    const match = assignableRoles.some(
      (r) => String(r.id) === String(roleIdFromQuery),
    );
    if (match) setRoleId(String(roleIdFromQuery));
  }, [roleIdFromQuery, assignableRoles]);

  const loadRolePermissions = useCallback(
    async (rid) => {
      if (!token || !rid) {
        setSelected(new Set());
        return;
      }
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/roles/${rid}/permissions`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        setSelected(new Set(Array.isArray(data) ? data : []));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load role permissions");
        setSelected(new Set());
      }
    },
    [token],
  );

  useEffect(() => {
    if (roleId) {
      loadRolePermissions(roleId);
    } else {
      setSelected(new Set());
    }
  }, [roleId, loadRolePermissions]);

  useEffect(() => {
    if (!roleId || assignableRoles.length === 0) return;
    const stillValid = assignableRoles.some(
      (r) => String(r.id) === String(roleId),
    );
    if (!stillValid) setRoleId("");
  }, [assignableRoles, roleId]);

  const byModule = useMemo(() => {
    const m = new Map();
    for (const p of allPermissions) {
      const mod = (p.module && String(p.module).trim()) || "General";
      if (!m.has(mod)) m.set(mod, []);
      m.get(mod).push(p);
    }
    for (const [, arr] of m) {
      arr.sort((a, b) => a.code.localeCompare(b.code));
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [allPermissions]);

  const toggle = (code) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSave = async () => {
    if (!roleId) {
      toast.error("Select a role");
      return;
    }
    if (editingOwnRole) {
      toast.error("You cannot change permissions for your own role");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/roles/${roleId}/permissions`,
        { permissions: Array.from(selected) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      toast.success("Permissions saved");
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLoadingShell loading={loading} minHeight="min-h-[400px]">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className={adminTable.pageTitle}>Permissions</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Choose a role and tick the permission codes that apply. Users receive these
            permissions through their assigned role (see Users → edit user).
            Administrator roles are not listed; they always have full access.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Role
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">— Select role —</option>
              {assignableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={saving || !roleId || editingOwnRole}
            onClick={handleSave}
            className={`${adminTable.btnAdd} inline-flex min-h-[42px] items-center gap-2 px-5 disabled:opacity-50`}
          >
            {saving ? (
              <>
                <Loader size={20} className="text-white" />
                Saving…
              </>
            ) : (
              <>
                <KeyRound size={18} className="text-white" />
                Save permissions
              </>
            )}
          </button>
        </div>

        {!roleId ? (
          <p className="text-sm text-slate-500">Select a role to edit its permissions.</p>
        ) : editingOwnRole ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            This is your current role. Permission changes are disabled. Ask another
            administrator to update this role if needed.
          </p>
        ) : (
          <div className={adminTable.wrap}>
            <div className="divide-y divide-slate-100 bg-white p-4">
              {byModule.map(([module, perms]) => (
                <div key={module} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-800">
                    {module}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {perms.map((p) => (
                      <label
                        key={p.id}
                        className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm transition hover:bg-slate-100"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(p.code)}
                          onChange={() => toggle(p.code)}
                          disabled={saving}
                          className="mt-0.5 accent-slate-900"
                        />
                        <span>
                          <span className="font-medium text-slate-900">{p.code}</span>
                          {p.action ? (
                            <span className="block text-xs text-slate-500">{p.action}</span>
                          ) : null}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {allPermissions.length === 0 && !loading && (
                <p className="text-sm text-slate-500">
                  No permission rows in the database. Seed the{" "}
                  <code className="rounded bg-slate-100 px-1">permissions</code> table.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLoadingShell>
  );
}
