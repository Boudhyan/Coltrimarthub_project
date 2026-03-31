import { useState } from "react";

function Edituser() {
  const [form, setForm] = useState({
    name: "Admin",
    role: "admin",
    email: "admin@gmail.com",
    phone: "9874563210",
    color: "#DC3545",
    statusCondition: "No",
    joiningDate: "2022-09-05",
    parent: "Admin",
    department: "Sales_Manager",
    designation: "IT",
    gender: "Male",
    allLead: true,
    newLead: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-4">Add Leads</h1>

      {/* Note bar */}
      <div className="bg-gray-600 text-white px-4 py-2 rounded-t">
        *Note fields Marked With "*" Are Mandatory
      </div>

      <div className="bg-white p-6 rounded-b shadow">
        <div className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option>admin</option>
              <option>manager</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Color Indication
            </label>
            <div className="flex">
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full border rounded-l p-2"
              />
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-12 border rounded-r"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Status condition */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status Condition Apply
            </label>
            <select
              name="statusCondition"
              value={form.statusCondition}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option>No</option>
              <option>Yes</option>
            </select>
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
              className="w-full border rounded p-2"
            />
          </div>

          {/* Parent */}
          <div>
            <label className="block text-sm font-medium mb-1">Parent</label>
            <select
              name="parent"
              value={form.parent}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option>Admin</option>
              <option>Manager</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option>Sales_Manager</option>
              <option>Marketing</option>
            </select>
          </div>

          {/* Lead options */}
          <div className="flex flex-col justify-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="allLead"
                checked={form.allLead}
                onChange={handleChange}
              />
              All Lead
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="newLead"
                checked={form.newLead}
                onChange={handleChange}
              />
              New Lead
            </label>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Designation
            </label>
            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option>IT</option>
              <option>HR</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Edituser;
