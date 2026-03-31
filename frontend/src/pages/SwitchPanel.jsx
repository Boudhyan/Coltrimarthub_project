export default function SwitchPanel() {
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
          <button className="text-black font-semibold">Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6 flex-1">

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-4">Reminder</h2>

        {/* CARD */}
        <div className="bg-white shadow rounded p-4">

          {/* BUTTONS + SEARCH */}
          <div className="flex justify-between mb-4">

            <div className="flex gap-2 flex-wrap">

              {["Copy","CSV","Excel","PDF","Print","Column visibility"].map((btn) => (
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
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border px-4 py-2">Kewal Krishan</td>
                <td className="border px-4 py-2">09910035373</td>
                <td className="border px-4 py-2">
                  kewalkwason@gmail.com
                </td>

                <td className="border px-4 py-2 flex gap-2">
                  <button className="bg-gray-700 text-white px-2 py-1 rounded">
                    🗑
                  </button>

                  <button className="bg-gray-700 text-white px-2 py-1 rounded">
                    🔑
                  </button>
                </td>
              </tr>

              <tr>
                <td className="border px-4 py-2">Ritesh</td>
                <td className="border px-4 py-2">9899740288</td>
                <td className="border px-4 py-2">
                  ritesh@gmail.com
                </td>

                <td className="border px-4 py-2 flex gap-2">
                  <button className="bg-gray-700 text-white px-2 py-1 rounded">
                    🗑
                  </button>

                  <button className="bg-gray-700 text-white px-2 py-1 rounded">
                    🔑
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

      {/* FOOTER */}
      <div className="bg-white text-sm text-gray-600 px-6 py-3 border-t">
        Copyright © 2022-2023 <span className="text-blue-600 font-semibold">
        Marthub IT | Dashboard :: LEADS Management
        </span>. All rights reserved.
      </div>

    </div>
  );
}