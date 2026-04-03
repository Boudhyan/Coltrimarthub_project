import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Popup from "../components/Popup";
import LogoutButton from "../components/logoutbutton";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Designation() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Add Designation");
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [designationName, setDesignationName] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [designations, setDesignations] = useState([]);

  // ✅ EDIT
  const handleEdit = (id, name) => {
    setSelectedDesignation(id);
    setTitle("Edit Designation");
    setDesignationName(name);
    setOpen(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      setSelectedDesignation(id);
      setLoading(true);

      await axios.delete(`${import.meta.env.VITE_API_URL}/designations/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setDesignations((prev) => prev.filter((item) => item.id !== id));

      toast.success("Designation deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete designation");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH
  const fetchDesignations = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/designations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      console.log("fetched designations: ", data);

      setDesignations(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ ADD
  const handleAdd = () => {
    setTitle("Add Designation");
    setDesignationName("");
    setSelectedDesignation("");
    setOpen(true);
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

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

      {/* MAIN */}
      <div className="p-6 flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Designation</h2>

          <button
            onClick={handleAdd}
            className="text-white bg-green-700 w-40 h-10 rounded-xl mb-3"
          >
            Add Designation
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white shadow rounded p-4">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Designation</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {designations.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.name}</td>

                  <td className="border px-4 py-2">
                    <button className="text-white bg-green-700 w-20 h-10 rounded-xl">
                      Active
                    </button>
                  </td>

                  <td className="border px-4 py-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item.id, item.name)}
                      className="bg-green-700 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      disabled={loading}
                    >
                      {loading && selectedDesignation === item.id ? (
                        <Loader size={16} color="#fff" />
                      ) : (
                        <Trash size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ POPUP */}
      {open && (
        <Popup
          open={open}
          setOpen={setOpen}
          title={title}
          designations={designations}
          setDesignations={setDesignations}
          designationId={selectedDesignation}
          designationName={designationName}
        />
      )}

      {/* FOOTER */}
      <div className="bg-white text-sm text-gray-600 px-6 py-3 border-t">
        Copyright © 2022-2023{" "}
        <span className="text-blue-600 font-semibold">
          Marthub IT | Dashboard
        </span>
      </div>
    </div>
  );
}

export default Designation;
