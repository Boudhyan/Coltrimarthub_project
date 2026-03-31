import React, { useState } from "react";

export default function StatusDropdown() {
  const [status, setStatus] = useState("Active");

  return (
    <div className="w-64">
      <label className="block text-sm font-medium mb-1">
        Status
      </label>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
      >
        <option value="Active">Active</option>
        <option value="Deactive">Deactive</option>
      </select>

      <p className="text-sm text-gray-500 mt-2">
        Selected: {status}
      </p>
    </div>
  );
}