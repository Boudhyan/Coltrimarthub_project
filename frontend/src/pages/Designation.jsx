import React from "react";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Popup from "../components/Popup";
import LogoutButton from "../components/logoutbutton";

function Designation() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Designation");
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
      <div className="p-6 flex-1 ">
        {/* TITLE */}
        <div className="flex justify-between m-b-4 items-center ">
          <h2 className="text-lg font-semibold mb-4">Designation</h2>
          <button
          onClick={() => setOpen(true)}
          className="text-white cursor-pointer bg-green-700 w-40 h-10 border border-amber-50 rounded-xl mb-3 ">

            Add Designation
          </button>
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
                <th className="border px-4 py-2 text-left">Designation</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border px-4 py-2">IT </td>
                <td className="border px-4 py-2 text-left">
                  <button className="text-white bg-green-700 w-20 h-10 border border-amber-50 rounded-xl mb-3 ">
                    Active
                  </button>
                </td>

                <td className="border px-4 py-2 flex justify-end ">
                  <button
                    onClick={() => setOpen(true)}
                    className="text-white bg-green-700 w-10 h-10 border border-amber-50 rounded-xl mb-3 flex justify-center items-center "
                  >
                    <Pencil size={16} />
                  </button>
                  <button className="text-white bg-red-600 w-10 h-10 border border-amber-50 rounded-xl mb-3  flex justify-center items-center">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>

              <tr>
                <td className="border px-4 py-2">Sales_Manager</td>
                <td className="border px-4 py-2 text-left">
                  <button className="text-white bg-green-700 w-20 h-10 border border-amber-50 rounded-xl mb-3 ">
                    Active
                  </button>
                </td>
                <td className="border px-4 py-2 flex justify-end ">
                  <button className="text-white bg-green-700 w-10 h-10 border border-amber-50 rounded-xl mb-3 flex justify-center items-center ">
                    <Pencil size={16} />
                  </button>
                  <button className="text-white bg-red-600 w-10 h-10 border border-amber-50 rounded-xl mb-3  flex justify-center items-center">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
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

      <Popup open={open} setOpen={setOpen} title={title} />

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

export default Designation;
