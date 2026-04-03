import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";


function permissions() {
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

  const [form, setForm] = useState({
    permissions: {},
  });

  const [loading, setLoading] = useState(false);


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

  return (
    <div>
      <button
        type="button"
        onClick={handleSelectAllGlobal}
        className="my-4 bg-gray-200 px-3 py-1 rounded"
      >
        Toggle All Permissions
      </button>
      ;{/* Table */}
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
      ;
    </div>
  );
}

export default permissions;
