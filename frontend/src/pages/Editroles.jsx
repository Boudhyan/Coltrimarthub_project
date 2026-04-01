import React, { use } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function editRoles() {
  const Navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    status: "",
  });

  const fetchRoleData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/roles/${id}`,
      );
      setForm({
        name: data.name,
        status: data.status,
      });
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  const handlesubmit = async (e) => {
    // e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/roles/${id}`,
        JSON.stringify(form),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        },
      );
      toast.success("Role updated successfully!");
      Navigate("/roles");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role. Please try again.");
    }
  };

  useEffect(() => {
    // fetchRoleData();
  }, [id]);

  const modules = [
    {
      name: "User",
      permissions: ["Read", "Create", "Update", "Delete", "Profile", "Banned"],
    },
    {
      name: "Role",
      permissions: ["Read", "Create", "Update", "Delete", "Banned"],
    },
    {
      name: "Designation",
      permissions: ["Read", "Create", "Update", "Delete"],
    },
    { name: "Department", permissions: ["Read", "Create", "Update", "Delete"] },
    { name: "Leadsource", permissions: ["Read", "Create", "Update", "Delete"] },
    { name: "Leadtype", permissions: ["Read", "Create", "Update", "Delete"] },
    { name: "Leadstatus", permissions: ["Read", "Create", "Update", "Delete"] },
    {
      name: "Membershiptype",
      permissions: ["Read", "Create", "Update", "Delete"],
    },
  ];

  const [checked, setChecked] = useState({});

  const togglePermission = (module, permission) => {
    setChecked((prev) => ({
      ...prev,
      [`${module}-${permission}`]: !prev[`${module}-${permission}`],
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Role</h1>

      {/* Top Card */}
      <div className="bg-white p-6 rounded shadow mb-6 flex items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-3xl">
          👤
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 w-96">
          <input
            type="text"
            defaultValue="admin"
            className="border p-2 rounded w-full"
          />

          <select className="border p-2 rounded w-full">
            <option>Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white rounded shadow">
        {/* Header */}
        <div className="bg-gray-600 text-white px-4 py-3 font-medium">
          Module/Sub Module (Permissions)
        </div>

        {/* Permissions List */}
        <div className="divide-y">
          {modules.map((module) => (
            <div
              key={module.name}
              className="flex items-center justify-between px-4 py-4"
            >
              <span className="font-semibold text-gray-700">{module.name}</span>

              <div className="flex gap-6">
                {module.permissions.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-1 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked[`${module.name}-${perm}`] || false}
                      onChange={() => togglePermission(module.name, perm)}
                      className="accent-blue-600"
                    />
                    {perm}
                  </label>
                ))}
              </div>
              <div className="mt-6"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-start items-center">
          <button
            className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-700 m-4 "
            onClick={handlesubmit}
          >
            edit role
          </button>
        </div>
      </div>
    </div>
  );
}

export default editRoles;
