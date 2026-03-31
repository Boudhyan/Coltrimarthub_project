import { Routes, Route } from "react-router-dom";
import SwitchPanel from "./pages/SwitchPanel";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Roles from "./pages/Roles.jsx";
import Department from "./pages/Department.jsx";
import Designation from "./pages/Designation.jsx";
import Editroles from "./pages/Editroles.jsx";
import Edituser from "./pages/Edituser.jsx";
import AddUserForm from "./pages/AddUser.jsx";
import AddRole from "./pages/AddRole.jsx";
import ServiceRequest from "./pages/ServiceRequest.jsx";
import ServiceType from "./pages/ServiceType.jsx";
import Auth from "./pages/Auth.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Pagenotfound from "./pages/Pagenotfound.jsx";

function App() {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  // Check if the user is authenticated on app load
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    <Routes>
      <Route element={token ? <DashboardLayout /> : navigate("/login")}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/switch-panel" element={<SwitchPanel />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/department" element={<Department />} />
        <Route path="/designation" element={<Designation />} />
        <Route path="/edit-roles/:id" element={<Editroles />} />
        <Route path="/edit-user/:id" element={<Edituser />} />
        <Route path="/add-user" element={<AddUserForm />} />
        <Route path="/add-role" element={<AddRole />} />
        <Route path="/service-type" element={<ServiceType />} />
        <Route path="/service-request" element={<ServiceRequest />} />
        <Route path="/login" element={<Auth type={"login"} />} />
        <Route path="*" element={<Pagenotfound />} />
      </Route>
    </Routes>
  );
}

export default App;
