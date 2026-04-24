import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function AddRole() {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    is_active: true,
  });

  const handleNameChange = (e) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };
  const handleStatusChange = (e) => {
    setForm((prev) => ({
      ...prev,
      is_active: e.target.value === "active",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Role name required");

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/roles`,
        { name: form.name.trim(), is_active: form.is_active },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      toast.success("Role created");

      setForm({
        name: "",
        is_active: true,
      });

      navigate("/roles");
    } catch (err) {
      console.error(err);
      toast.error("Error creating role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add Role</h2>

        <input
          value={form.name}
          onChange={handleNameChange}
          placeholder="Enter Name"
          className="border px-3 py-2 rounded w-1/2 mb-4 block"
        />

        <div className="mb-4 max-w-xs">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={form.is_active ? "active" : "inactive"}
            onChange={handleStatusChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Global Select */}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex min-h-[42px] min-w-[8rem] cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-2 text-white shadow-md transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader size={20} className="text-white" />
              Saving…
            </>
          ) : (
            "Add Role"
          )}
        </button>
      </div>
    </form>
  );
}
