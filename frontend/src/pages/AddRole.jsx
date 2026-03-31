import React from "react";
import StatusDropdown from "../components/status";

const permissionsData = [
  {
    module: "User",
    actions: ["Read", "Create", "Update", "Delete", "Profile", "Banned"],
  },
  {
    module: "Role",
    actions: ["Read", "Create", "Update", "Delete", "Banned"],
  },
  {
    module: "Designation",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Department",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Leadsource",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Leadtype",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Leadstatus",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Membershiptype",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Productreport",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Lead",
    actions: [
      "Read",
      "Create",
      "Update",
      "Delete",
      "Import",
      "Assign",
      "Share",
      "Sale",
      "Status",
      "Type",
      "Source",
      "Name",
      "Email",
      "Phone",
      "Postcode",
      "Chat",
      "Action",
      "Updatedby",
      "Conversation",
      "Customer",
      "Leadid",
      "Substatus",
      "Search",
    ],
  },
  {
    module: "UserReport",
    actions: [
      "Read",
      "Assign",
      "Status",
      "Type",
      "Source",
      "Name",
      "Email",
      "Phone",
      "Postcode",
      "Updatedby",
      "Export",
      "Leadid",
    ],
  },
  {
    module: "UserStatus",
    actions: [
      "Export",
      "Updatedby",
      "Postcode",
      "Phone",
      "Email",
      "Name",
      "Source",
      "Type",
      "Status",
      "Assign",
      "Read",
      "Leadid",
    ],
  },
  {
    module: "StatusCondition",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "GraphicalReport",
    actions: [
      "Read",
      "Charts",
      "Leadstatus",
      "Userstatus",
      "Sales",
      "Mail",
      "Dial",
      "Report",
      "Analytics",
    ],
  },
  {
    module: "Leadsubstatus",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Tab",
    actions: [
      "UserAndRoleTab",
      "LeadTab",
      "DataAndExportTab",
      "ConditionsTab",
      "LeadMasterTab",
    ],
  },
  {
    module: "SwitchPanel",
    actions: ["Read", "Switch"],
  },
  {
    module: "LeadByStatus",
    actions: ["Read"],
  },
  {
    module: "Notepad",
    actions: ["Read", "Update"],
  },
  {
    module: "Satisfied",
    actions: ["Read", "Create", "Update", "Delete"],
  },
  {
    module: "Notpad",
    actions: ["Read", "Update"],
  },
  {
    module: "Exmember",
    actions: ["Read"],
  },
  {
    module: "Package",
    actions: ["Read"],
  },
  {
    module: "Service",
    actions: ["Read"],
  },
];

export default function AddRole() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">Add Role</h2>

        {/* Role Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full md:w-1/2 border rounded px-3 py-2"
          />
        </div>

        <StatusDropdown />

        {/* Permissions Table */}
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-4 py-2 border">
                  Module / Sub Module
                </th>
                <th className="text-left px-4 py-2 border">Permissions</th>
              </tr>
            </thead>

            <tbody>
              {permissionsData.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 font-medium border">
                    {item.module}
                  </td>

                  <td className="px-4 py-3 border">
                    <div className="flex flex-wrap gap-4">
                      {item.actions.map((action, i) => (
                        <label key={i} className="flex items-center gap-2">
                          <input type="checkbox" />
                          {action}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Add Role
          </button>
        </div>
      </div>
    </div>
  );
}
