import React, { useState } from "react";
import StatusDropdown from "../components/status";
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
  });

  const handleNameChange = (e) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };
  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form:", form);

    if (!form.name) return toast.error("Role name required");

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/roles`,
        { name: form.name },
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
        status: "",
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

        {/* Name */}
        <input
          value={form.name}
          onChange={handleNameChange}
          placeholder="Enter Name"
          className="border px-3 py-2 rounded w-1/2 mb-4"
        />

        {/* Status */}
        <StatusDropdown onChange={handleStatusChange} />

        {/* Global Select */}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded cursor-pointer   hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? <Loader /> : "Add Role"}
        </button>
      </div>
    </form>
  );
}
