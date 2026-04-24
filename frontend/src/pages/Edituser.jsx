import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PageLoadingShell from "../components/PageLoadingShell";
import Loader from "../components/Loader";

function Edituser() {
  const { token, userId } = useSelector((state) => state.auth);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listsLoading, setListsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [form, setForm] = useState({
    username: "",
    role_name: "",
    email: "",
    phone: "",
    department_name: "",
    designation_name: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isSelf =
    id != null && userId != null && String(id) === String(userId);

  const loadLists = useCallback(async () => {
    if (!token) {
      setListsLoading(false);
      return;
    }
    setListsLoading(true);
    try {
      const [r, d, g] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/departments`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/designations`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);
      setRoles(Array.isArray(r.data) ? r.data : []);
      setDepartments(Array.isArray(d.data) ? d.data : []);
      setDesignations(Array.isArray(g.data) ? g.data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dropdown data");
    } finally {
      setListsLoading(false);
    }
  }, [token]);

  const fetchUserData = useCallback(async () => {
    if (!token || !id) {
      setPageLoading(false);
      return;
    }
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      setForm({
        username: data.username ?? "",
        role_name: data.role_name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        department_name: data.department_name ?? "",
        designation_name: data.designation_name ?? "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user");
    } finally {
      setPageLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = async () => {
    if (saving) return;
    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        role_name: form.role_name || null,
        department_name: form.department_name || null,
        designation_name: form.designation_name || null,
      };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      toast.success("User updated successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      const msg = error.response?.data?.detail;
      toast.error(
        typeof msg === "string" ? msg : "Failed to update user. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3 py-2 text-[15px] text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15";

  return (
    <PageLoadingShell loading={pageLoading || listsLoading} minHeight="min-h-screen">
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Edit user</h1>
        <p className="mb-4 text-sm text-slate-600">
          Updates map to columns on <code className="rounded bg-slate-100 px-1">users</code>:
          username, email, phone, role_id, department_id, designation_id.
        </p>
        {isSelf ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            You cannot change your own role here. Another administrator can update your
            role if needed.
          </p>
        ) : null}

        <div
          className={`rounded-xl border border-slate-200 bg-white p-6 shadow ${saving ? "pointer-events-none opacity-60" : ""}`}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Username *
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                name="role_name"
                value={form.role_name}
                onChange={handleChange}
                disabled={isSelf}
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50`}
              >
                <option value="">— None —</option>
                {roles.map((x) => (
                  <option key={x.id} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                name="department_name"
                value={form.department_name}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— None —</option>
                {departments.map((x) => (
                  <option key={x.id} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Designation
              </label>
              <select
                name="designation_name"
                value={form.designation_name}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— None —</option>
                {designations.map((x) => (
                  <option key={x.id} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              disabled={saving || pageLoading}
              className="inline-flex min-h-[42px] min-w-[8rem] items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-2 text-white shadow-md transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handlesubmit}
            >
              {saving ? (
                <>
                  <Loader size={20} className="text-white" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}

export default Edituser;
