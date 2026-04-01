// import React from "react";
// import StatusDropdown from "../components/status";

// const permissionsData = [
//   {
//     module: "User",
//     actions: ["Read", "Create", "Update", "Delete", "Profile", "Banned"],
//   },
//   {
//     module: "Role",
//     actions: ["Read", "Create", "Update", "Delete", "Banned"],
//   },
//   {
//     module: "Designation",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Department",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Leadsource",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Leadtype",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Leadstatus",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Membershiptype",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Productreport",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Lead",
//     actions: [
//       "Read",
//       "Create",
//       "Update",
//       "Delete",
//       "Import",
//       "Assign",
//       "Share",
//       "Sale",
//       "Status",
//       "Type",
//       "Source",
//       "Name",
//       "Email",
//       "Phone",
//       "Postcode",
//       "Chat",
//       "Action",
//       "Updatedby",
//       "Conversation",
//       "Customer",
//       "Leadid",
//       "Substatus",
//       "Search",
//     ],
//   },
//   {
//     module: "UserReport",
//     actions: [
//       "Read",
//       "Assign",
//       "Status",
//       "Type",
//       "Source",
//       "Name",
//       "Email",
//       "Phone",
//       "Postcode",
//       "Updatedby",
//       "Export",
//       "Leadid",
//     ],
//   },
//   {
//     module: "UserStatus",
//     actions: [
//       "Export",
//       "Updatedby",
//       "Postcode",
//       "Phone",
//       "Email",
//       "Name",
//       "Source",
//       "Type",
//       "Status",
//       "Assign",
//       "Read",
//       "Leadid",
//     ],
//   },
//   {
//     module: "StatusCondition",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "GraphicalReport",
//     actions: [
//       "Read",
//       "Charts",
//       "Leadstatus",
//       "Userstatus",
//       "Sales",
//       "Mail",
//       "Dial",
//       "Report",
//       "Analytics",
//     ],
//   },
//   {
//     module: "Leadsubstatus",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Tab",
//     actions: [
//       "UserAndRoleTab",
//       "LeadTab",
//       "DataAndExportTab",
//       "ConditionsTab",
//       "LeadMasterTab",
//     ],
//   },
//   {
//     module: "SwitchPanel",
//     actions: ["Read", "Switch"],
//   },
//   {
//     module: "LeadByStatus",
//     actions: ["Read"],
//   },
//   {
//     module: "Notepad",
//     actions: ["Read", "Update"],
//   },
//   {
//     module: "Satisfied",
//     actions: ["Read", "Create", "Update", "Delete"],
//   },
//   {
//     module: "Notpad",
//     actions: ["Read", "Update"],
//   },
//   {
//     module: "Exmember",
//     actions: ["Read"],
//   },
//   {
//     module: "Package",
//     actions: ["Read"],
//   },
//   {
//     module: "Service",
//     actions: ["Read"],
//   },
// ];

// export default function AddRole() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
//         {/* Header */}
//         <h2 className="text-xl font-semibold mb-4">Add Role</h2>

//         {/* Role Name */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-1">Name</label>
//           <input
//             type="text"
//             placeholder="Enter Name"
//             className="w-full md:w-1/2 border rounded px-3 py-2"
//           />
//         </div>

//         <StatusDropdown />

//         {/* Permissions Table */}
//         <div className="overflow-auto border rounded">
//           <table className="min-w-full text-sm border-collapse">
//             <thead className="bg-gray-200 sticky top-0">
//               <tr>
//                 <th className="text-left px-4 py-2 border">
//                   Module / Sub Module
//                 </th>
//                 <th className="text-left px-4 py-2 border">Permissions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {permissionsData.map((item, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="px-4 py-3 font-medium border">
//                     {item.module}
//                   </td>

//                   <td className="px-4 py-3 border">
//                     <div className="flex flex-wrap gap-4">
//                       {item.actions.map((action, i) => (
//                         <label key={i} className="flex items-center gap-2">
//                           <input type="checkbox" />
//                           {action}
//                         </label>
//                       ))}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Button */}
//         <div className="mt-6">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
//             Add Role
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import StatusDropdown from "../components/status";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

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
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    status: "",
    permissions: {},
  });

  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const handlePermissionChange = (module, action) => {
    setForm((prev) => {
      const current = prev.permissions[module] || [];

      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: updated,
        },
      };
    });
  };

  const handleSelectAllModule = (module, actions) => {
    setForm((prev) => {
      const current = prev.permissions[module] || [];
      const allSelected = current.length === actions.length;

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: allSelected ? [] : actions,
        },
      };
    });
  };

  const handleSelectAllGlobal = () => {
    const allSelected = permissionsData.every(
      (item) =>
        (form.permissions[item.module] || []).length === item.actions.length,
    );

    if (allSelected) {
      setForm((prev) => ({ ...prev, permissions: {} }));
    } else {
      const allPermissions = {};
      permissionsData.forEach((item) => {
        allPermissions[item.module] = item.actions;
      });

      setForm((prev) => ({
        ...prev,
        permissions: allPermissions,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) return toast.error("Role name required");

    try {
      setLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/roles`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("Role created");

      setForm({
        name: "",
        status: "",
        permissions: {},
      });
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
          type="button"
          onClick={handleSelectAllGlobal}
          className="my-4 bg-gray-200 px-3 py-1 rounded"
        >
          Toggle All Permissions
        </button>

        {/* Table */}
        <div className="border rounded overflow-auto">
          <table className="min-w-full text-sm">
            <tbody>
              {permissionsData.map((item, i) => {
                const selected = form.permissions[item.module] || [];
                const allChecked = selected.length === item.actions.length;

                return (
                  <tr key={i}>
                    <td className="border px-4 py-3 font-medium">
                      {item.module}
                    </td>

                    <td className="border px-4 py-3">
                      <label className="flex gap-2 font-semibold mb-2">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={() =>
                            handleSelectAllModule(item.module, item.actions)
                          }
                        />
                        Select All
                      </label>

                      <div className="flex flex-wrap gap-4">
                        {item.actions.map((action, idx) => (
                          <label key={idx} className="flex gap-2">
                            <input
                              type="checkbox"
                              checked={selected.includes(action)}
                              onChange={() =>
                                handlePermissionChange(item.module, action)
                              }
                            />
                            {action}
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded cursor-pointer   hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Add Role"}
        </button>
      </div>
    </form>
  );
}
