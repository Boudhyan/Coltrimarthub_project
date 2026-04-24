import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function AddUserForm() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loadingLists, setLoadingLists] = useState(true);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role_name: "",
    department_name: "",
    designation_name: "",
  });

  const loadLists = useCallback(async () => {
    if (!token) {
      setLoadingLists(false);
      return;
    }
    setLoadingLists(true);
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
      toast.error("Failed to load roles / departments / designations");
    } finally {
      setLoadingLists(false);
    }
  }, [token]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (submitting || loadingLists) return;
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
    if (!form.password || !String(form.password).trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        role_name: form.role_name || null,
        department_name: form.department_name || null,
        designation_name: form.designation_name || null,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("User added successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      const msg = error.response?.data?.detail;
      toast.error(
        typeof msg === "string" ? msg : "Failed to add user. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3 py-2 text-[15px] text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15";

  return (
    <form
      onSubmit={handlesubmit}
      className={`flex min-h-screen items-start justify-center bg-gray-100 py-10 ${submitting || loadingLists ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Add user</h2>
        <p className="mb-6 text-sm text-slate-600">
          Fields match the <code className="rounded bg-slate-100 px-1">users</code> table:
          username, email, phone, password hash, role, department, designation.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className={inputClass}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              autoComplete="tel"
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
              className={inputClass}
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
          <div className="md:col-span-2">
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

        <div className="pt-8">
          <button
            type="submit"
            disabled={submitting || loadingLists}
            className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader size={20} className="text-white" />
                Saving…
              </>
            ) : (
              "Add user"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
