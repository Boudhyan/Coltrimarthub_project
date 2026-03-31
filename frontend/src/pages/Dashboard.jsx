export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* STATUS CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Profile Sent", color: "bg-teal-500" },
          { title: "Agreement Done", color: "bg-purple-600" },
          { title: "Resume Provided", color: "bg-green-400" },
          { title: "Candidate Provided", color: "bg-gray-500" },
          { title: "Proposal", color: "bg-green-700" },
          { title: "Not Picked", color: "bg-yellow-400" },
          { title: "Not Connecting", color: "bg-red-300" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-white shadow rounded p-4"
          >
            <div className={`w-12 h-12 ${item.color} rounded mr-4`}></div>
            <div>
              <p className="text-blue-600 font-semibold">{item.title}</p>
              <p className="text-gray-700 font-bold">0</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER + TABLE SECTION */}
      <div className="grid grid-cols-3 gap-4">
        {/* LEFT PANEL */}
        <div className="bg-indigo-200 p-6 rounded col-span-1">
          {["Assigned", "Pending", "Opportunities", "Converted"].map(
            (item, index) => (
              <div key={index} className="flex justify-between mb-6">
                <div>
                  <p className="font-semibold">{item}</p>
                  <p className="text-blue-600 font-bold">0</p>
                </div>

                <div className="text-2xl">👤➕</div>
              </div>
            ),
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-2 bg-white shadow rounded p-4">
          {/* FILTER */}
          <div className="flex items-center gap-3 mb-4">
            <div>
              <label className="text-sm">From</label>
              <input type="date" className="border rounded px-2 py-1 ml-2" />
            </div>

            <div>
              <label className="text-sm">To</label>
              <input type="date" className="border rounded px-2 py-1 ml-2" />
            </div>

            <button className="bg-gray-200 px-4 py-1 rounded">Filter</button>

            <div className="ml-auto">
              <input
                placeholder="Search..."
                className="border rounded px-3 py-1"
              />
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">NAME</th>
                <th className="border px-4 py-2 text-left">EMAIL</th>
                <th className="border px-4 py-2 text-left">PHONE</th>
                <th className="border px-4 py-2 text-left">POSTCODE</th>
                <th className="border px-4 py-2 text-left">SOURCE</th>
                <th className="border px-4 py-2 text-left">DATE</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border px-4 py-2">Sagar Jain</td>
                <td className="border px-4 py-2">
                  sagarkumar.jain33@gmail.com
                </td>
                <td className="border px-4 py-2">+91 7588888844</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">
                  <span className="bg-green-500 text-white px-2 rounded text-xs">
                    2
                  </span>
                </td>
                <td className="border px-4 py-2">1 year ago</td>
              </tr>
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between mt-4 text-sm">
            <p>Showing 1 to 1 of 1 entries</p>

            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded">Previous</button>

              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                1
              </button>

              <button className="border px-3 py-1 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
