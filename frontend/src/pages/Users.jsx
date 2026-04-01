import React, { use, useEffect } from "react";
import { Plus } from "lucide-react";
import ActionDropdown from "../components/Actionbutton";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/logoutbutton";
import { useSelector } from "react-redux";
import { useState } from "react";

function Users() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:8000/users", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
        },
      });
      setUsers(data);
      console.log("Fetched users:", data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, setUsers, users]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* TOP BAR */}
      <div className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">☰</span>
          <span className="text-gray-600">Home</span>
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          <span>🔍</span>
          <span>💬</span>
          <span>🔔</span>
          <LogoutButton />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6 flex-1">
        <div className="flex justify-between m-b-4 items-center ">
          <h2 className="text-lg font-semibold mb-4">Users List</h2>
          <Link to="/add-user">
            <button className="text-white cursor-pointer bg-green-700 w-40 h-10 border border-amber-50 rounded-xl mb-3 flex justify-center items-center gap-2">
              <Plus size={16} /> Add Users
            </button>
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white shadow rounded p-4">
          {/* BUTTONS + SEARCH */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              {[
                "Copy",
                "CSV",
                "Excel",
                "PDF",
                "Print",
                "Column visibility",
              ].map((btn) => (
                <button
                  key={btn}
                  className="bg-gray-700 text-white text-sm px-3 py-1 rounded"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div>
              <input
                placeholder="Search"
                className="border rounded px-3 py-1"
              />
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">UserId</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Designation</th>
                <th className="border px-4 py-2 text-left">Department</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Colour</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 &&
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user?.username}</td>
                    <td className="border px-4 py-2">{user?.id}</td>
                    <td className="border px-4 py-2">{user?.phone}</td>
                    <td className="border px-4 py-2">{user?.email}</td>
                    <td className="border px-4 py-2">{user?.designation}</td>
                    <td className="border px-4 py-2">{user?.department}</td>
                    <td className="border px-4 py-2">{user?.role_name}</td>
                    <td className="border px-4 py-2">{user?.colour}</td>
                    <td className="border px-4 py-2">
                      {user.isactive ? "Active" : "inactive"}
                    </td>

                    <td
                      className="border px-4 py-2 flex justify-end gap
                "
                    >
                      <ActionDropdown id={user.id} />
                    </td>
                  </tr>
                ))}
              {/* <tr>
                <td className="border px-4 py-2">Kewal Krishan</td>
                <td className="border px-4 py-2">1234</td>
                <td className="border px-4 py-2">09910035373</td>
                <td className="border px-4 py-2">kewalkwason@gmail.com</td>
                <td className="border px-4 py-2">IT</td>
                <td className="border px-4 py-2">Sales</td>
                <td className="border px-4 py-2">Admin</td>
                <td className="border px-4 py-2">Blue</td>
                <td className="border px-4 py-2">Active</td>

                <td className="border px-4 py-2 flex justify-end gap-2">
                  <ActionDropdown />
                </td>
              </tr> */}

              {/* <tr>
                <td className="border px-4 py-2">Kewal Krishan</td>
                <td className="border px-4 py-2">1234</td>
                <td className="border px-4 py-2">09910035373</td>
                <td className="border px-4 py-2">kewalkwason@gmail.com</td>
                <td className="border px-4 py-2">IT</td>
                <td className="border px-4 py-2">Sales</td>
                <td className="border px-4 py-2">Admin</td>
                <td className="border px-4 py-2">Blue</td>
                <td className="border px-4 py-2">Active</td>
                <td className="border px-4 py-2 flex justify-end gap-2">
                  <ActionDropdown />
                </td>
              </tr> */}
            </tbody>
          </table>

          {/* TABLE FOOTER */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span>Showing 1 to 2 of 2 entries</span>

            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded bg-gray-100">
                Previous
              </button>

              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                1
              </button>

              <button className="border px-3 py-1 rounded bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white text-sm text-gray-600 px-6 py-3 border-t">
        Copyright © 2022-2023{" "}
        <span className="text-blue-600 font-semibold">
          Marthub IT | Dashboard :: LEADS Management
        </span>
        . All rights reserved.
      </div>
    </div>
  );
}

export default Users;
