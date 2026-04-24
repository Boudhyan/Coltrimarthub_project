import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

/** Engineers-only areas (e.g. My assignments). Admins use dashboard / service requests. */
export function EngineerOnly({ children }) {
  const fullAccess = useSelector((s) => s.auth.fullAccess);
  if (fullAccess) return <Navigate to="/" replace />;
  return children;
}

/**
 * Observation workspace is for assigned engineers. Full-access users review via
 * Service requests → View observations.
 */
export function AdminObservationRedirect({ children }) {
  const fullAccess = useSelector((s) => s.auth.fullAccess);
  const { serviceRequestId } = useParams();
  if (!fullAccess) return children;
  if (serviceRequestId === "new") {
    return <Navigate to="/service-requests" replace />;
  }
  const id = Number(serviceRequestId);
  if (Number.isFinite(id) && id >= 1) {
    return (
      <Navigate to={`/service-requests/${id}/observations`} replace />
    );
  }
  return <Navigate to="/service-requests" replace />;
}
