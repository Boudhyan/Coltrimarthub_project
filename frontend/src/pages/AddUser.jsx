import React from "react";

export default function AddUserForm() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
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
                placeholder="Enter Name"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                defaultValue="admin@gmail.com"
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                placeholder="Enter Phone"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Joining Date
              </label>
              <input type="date" className="w-full border rounded px-3 py-2" />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select className="w-full border rounded px-3 py-2">
                <option>-select here-</option>
              </select>
            </div>

            {/* DOB */}

            {/* Marital Status */}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Designation */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <select className="w-full border rounded px-3 py-2">
                <option>-select here-</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select className="w-full border rounded px-3 py-2">
                <option>-select here-</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                placeholder="Enter Address"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select className="w-full border rounded px-3 py-2">
                <option>-select here-</option>
              </select>
            </div>

            {/* Color Indication */}

            {/* Status Condition */}

            {/* Parent */}
            <div>
              <label className="block text-sm font-medium mb-1">Parent</label>
              <select className="w-full border rounded px-3 py-2">
                <option>Admin</option>
              </select>
            </div>

            {/* Checkbox */}
          </div>
        </div>

        <div className="pt-4">
          <button className="mt-4 w-full bg-blue-600 text-white py-1.5 text-sm rounded">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}
