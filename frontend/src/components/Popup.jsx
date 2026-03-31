import { useState } from "react";

export default function Popup({ open, setOpen, title }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Button to open modal */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>

      {open && (
        <>
          {/* Overlay (makes background dull) */}
          <div className="fixed inset-0 bg-black/40 z-40"></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-5 py-3">
                <h2 className="text-lg font-semibold">
                  Add {title}
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {title}
                  </label>
                  <input type="text" className="w-full border rounded p-2" />
                </div>

                {title != "Service" ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select className="w-full border rounded p-2">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between border-t px-5 py-4">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Close
                </button>

                <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                  Add {title}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
