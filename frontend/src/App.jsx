import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SwitchPanel from "./pages/SwitchPanel";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Roles from "./pages/Roles.jsx";
import Department from "./pages/Department.jsx";
import Designation from "./pages/Designation.jsx";
import Customers from "./pages/Customers.jsx";
import Editroles from "./pages/Editroles.jsx";
import Edituser from "./pages/Edituser.jsx";
import AddUserForm from "./pages/AddUser.jsx";
import AddRole from "./pages/AddRole.jsx";
import ServiceRequest from "./pages/ServiceRequest.jsx";
import ServiceType from "./pages/ServiceType.jsx";
import ServiceRequestsList from "./pages/ServiceRequestsList.jsx";
import MyServiceAssignments from "./pages/MyServiceAssignments.jsx";
import ObservationViewPage from "./pages/ObservationViewPage.jsx";
import PermissionsPage from "./pages/PermissionsPage.jsx";
import Auth from "./pages/Auth.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Pagenotfound from "./pages/Pagenotfound.jsx";
import MobileFormLayout from "./layout/MobileFormLayout.jsx";
import ObservationMQT061Ini from "./pages/ObservationMQT061Ini.jsx";
import ObservationWorkspace from "./pages/ObservationWorkspace.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AdminObservationRedirect, EngineerOnly } from "./components/RouteGuards.jsx";
import { P } from "./constants/routePermissions.js";

function PostLoginRedirect() {
  const fullAccess = useSelector((state) => state.auth.fullAccess);
  return (
    <Navigate to={fullAccess ? "/" : "/my-assignments"} replace />
  );
}

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <PostLoginRedirect /> : <Auth type="login" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        <Route element={<MobileFormLayout />}>
          <Route
            path="/observation/sr/:serviceRequestId/edit"
            element={<ObservationWorkspace />}
          />
          <Route
            path="/observation/sr/:serviceRequestId/mqt-06-1-ini"
            element={<ObservationMQT061Ini />}
          />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute requireFullAccess>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/switch-panel"
            element={
              <ProtectedRoute requireFullAccess>
                <SwitchPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute permission={P.USER_READ}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute permission={P.ROLE_READ}>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department"
            element={
              <ProtectedRoute permission={P.DEPARTMENT_READ}>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designation"
            element={
              <ProtectedRoute permission={P.DESIGNATION_READ}>
                <Designation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute permission={P.CUSTOMER_READ}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute permission={P.ROLE_UPDATE}>
                <PermissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-roles/:id"
            element={
              <ProtectedRoute permission={P.ROLE_UPDATE}>
                <Editroles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-user/:id"
            element={
              <ProtectedRoute permission={P.USER_UPDATE}>
                <Edituser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute permission={P.USER_CREATE}>
                <AddUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-role"
            element={
              <ProtectedRoute permission={P.ROLE_CREATE}>
                <AddRole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-type"
            element={<Navigate to="/services" replace />}
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute permission={P.SERVICE_TYPE_READ}>
                <ServiceType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-requests"
            element={
              <ProtectedRoute permission={P.SERVICE_REQUEST_READ}>
                <ServiceRequestsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-request"
            element={
              <ProtectedRoute permission={P.SERVICE_REQUEST_CREATE}>
                <ServiceRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-requests/:id/edit"
            element={
              <ProtectedRoute permission={P.SERVICE_REQUEST_UPDATE}>
                <ServiceRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-requests/:serviceRequestId/observations"
            element={
              <ProtectedRoute permission={P.OBSERVATION_READ}>
                <ObservationViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-assignments"
            element={
              <EngineerOnly>
                <MyServiceAssignments />
              </EngineerOnly>
            }
          />

          <Route path="*" element={<Pagenotfound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
