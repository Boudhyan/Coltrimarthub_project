import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddUserForm() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "1234",
    email: "",
    phone: "",
    joiningDate: "",
    department_name: "",
    designation: "",
    parent: "",
    role_name: "",
    gender: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        JSON.stringify(form), // no need to stringify
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      // optional: reset form
      setForm({
        password: "",
        username: "",
        email: "",
        phone: "",
        joiningDate: "",
        department_name: "",
        designation: "",
        parent: "",
        role_name: "",
        gender: "",
        address: "",
      });

      toast.success("User added successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handlesubmit}
      className="min-h-screen bg-gray-100 flex justify-center items-start py-10"
    >
      <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Add User</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter Name"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                name="department"
                value={form.department_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-select here-</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Designation */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-select here-</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-select here-</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={form.role_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-select here-</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            {/* Parent */}
            <div>
              <label className="block text-sm font-medium mb-1">Parent</label>
              <select
                name="parent"
                value={form.parent}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-select here-</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-1.5 text-sm rounded"
          >
            Add User
          </button>
        </div>
      </div>
    </form>
  );
}
