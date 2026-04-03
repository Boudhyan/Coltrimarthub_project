import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

export default function Popup({
  open,
  setOpen,
  title,

  // Department props
  departments,
  setdepartments,
  departmentName,
  departmentId,

  // Designation props
  designations,
  setDesignations,
  designationName,
  designationId,
}) {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Proper initialization
  const [inputValue, setInputValue] = useState("");

  // ✅ Sync value when editing
  useEffect(() => {
    if (title.includes("Department")) {
      setInputValue(departmentName || "");
    } else if (title.includes("Designation")) {
      setInputValue(designationName || "");
    }
  }, [title, departmentName, designationName]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // ======================
      // 🟢 DEPARTMENT LOGIC
      // ======================
      if (title === "Add Department") {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/departments`,
          { name: inputValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        );

        setdepartments((prev) => [...prev, data]);
        toast.success("Department added!");
      } else if (title === "Edit Department") {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/departments/${departmentId}`,
          { name: inputValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        );

        setdepartments((prev) =>
          prev.map((item) =>
            item.id === departmentId ? { ...item, name: inputValue } : item,
          ),
        );

        toast.success("Department updated!");
      }

      // ======================
      // 🔵 DESIGNATION LOGIC
      // ======================
      else if (title === "Add Designation") {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/designations`,
          { name: inputValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        );

        setDesignations((prev) => [...prev, data]);
        toast.success("Designation added!");
      } else if (title === "Edit Designation") {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/designations/${designationId}`,
          { name: inputValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        );

        setDesignations((prev) =>
          prev.map((item) =>
            item.id === designationId ? { ...item, name: inputValue } : item,
          ),
        );

        toast.success("Designation updated!");
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {open && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 z-40"></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-5 py-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>

                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between border-t px-5 py-4">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Close
                </button>

                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <Loader size={20} color="#fff" /> : title}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
