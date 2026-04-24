import { Navigate, useParams } from "react-router-dom";

/** @deprecated Use /observation/sr/:id/edit?page=1 */
export default function ObservationMQT061Ini() {
  const { serviceRequestId } = useParams();
  return (
    <Navigate
      to={`/observation/sr/${serviceRequestId}/edit?page=1`}
      replace
    />
  );
}
