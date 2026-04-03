import React from "react";
import ActionDropdown from "../components/Actionbutton";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Popup from "../components/Popup";
import LogoutButton from "../components/logoutbutton";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Department() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Add Department");
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [departmentname, setDepartmentname] = useState("");

  const [selectedDepartment, setselectedDepartment] = useState("");
  const [departments, setdepartments] = useState([]);

  const handleEdit = (id, departmentname) => {
    console.log(departmentname);
    setselectedDepartment(id);
    setTitle("Edit Department");
    setOpen(true);
    setDepartmentname(departmentname); // Set the department name for editing
  };

  const handleDelete = async (id) => {
    try {
      setselectedDepartment(id);
      setLoading(true);
      console.log(`Delete department with ID: ${id}`);
      await axios.delete(`${import.meta.env.VITE_API_URL}/departments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setselectedDepartment(""); // Clear selected department after deletion
      setdepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.id !== id),
      );
      setOpen(false);
      toast.success("Department deleted successfully!");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/departments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      setdepartments(data);
      console.log("Fetched departments:", data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleadd = () => {
    setTitle("Add Department");
    setOpen(true);
    setDepartmentname(""); // Clear department name for adding new department
  };
  useEffect(() => {
    fetchDepartments();
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

      {/* MAIN CONTENT */}
      <div className="p-6 flex-1">
        <div className="flex justify-between m-b-4 items-center ">
          <h2 className="text-lg font-semibold mb-4"> Department</h2>
          <button
            onClick={() => handleadd()}
            className="text-white cursor-pointer bg-green-700 w-40 h-10 border border-amber-50 rounded-xl mb-3 "
          >
            Add Department
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
                <th className="border px-4 py-2 text-left">Departments</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((department, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{department.name}</td>
                  <td className="border px-4 py-2 text-left">
                    <button className="text-white bg-green-700 w-20 h-10 border border-amber-50 rounded-xl mb-3 ">
                      Active
                    </button>
                  </td>
                  <td className="border px-4 py-2 flex justify-end ">
                    <button
                      onClick={() => handleEdit(department.id, department.name)}
                      className="text-white bg-green-700 w-10 h-10 border border-amber-50 cursor-pointer rounded-xl mb-3  flex justify-center items-center "
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-white bg-red-600 w-10 h-10 border border-amber-50 cursor-pointer rounded-xl mb-3  flex justify-center items-center"
                      onClick={() => handleDelete(department.id)}
                      disabled={loading}
                    >
                      {loading && selectedDepartment == department.id ? (
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
      {open && (
        <Popup
          open={open}
          setOpen={setOpen}
          title={title}
          departments={departments}
          setdepartments={setdepartments}
          departmentId={selectedDepartment}
          departmentName={departmentname}
        />
      )}

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

export default Department;
