import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Microscope } from "lucide-react";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import { cell } from "../utils/cellDisplay";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        });
  } catch {
    return "—";
  }
}

/** API may use `submitted` after intake; table shows it as allotted for clarity. */
function displayStatus(raw) {
  const s = (raw || "").trim();
  if (!s) return "—";
  if (s === "submitted") return "allotted";
  return s;
}

async function ensureObservationRow(api, headers, serviceRequestId) {
  try {
    await axios.get(
      `${api}/observation-requests/by-service-request/${serviceRequestId}`,
      { headers, withCredentials: true },
    );
  } catch (e) {
    if (e.response?.status === 404) {
      await axios.post(
        `${api}/observation-requests`,
        { service_request_id: serviceRequestId },
        { headers, withCredentials: true },
      );
      return;
    }
    throw e;
  }
}

export default function MyServiceAssignments() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState(null);

  const fetchRows = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-requests/assigned-to-me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load your assignments");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const goToObservations = async (serviceRequestId) => {
    if (!token || openingId) return;
    const api = import.meta.env.VITE_API_URL;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      setOpeningId(serviceRequestId);
      await ensureObservationRow(api, headers, serviceRequestId);
      navigate(`/observation/sr/${serviceRequestId}/edit?page=1`);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 403) {
        toast.error(e.response?.data?.detail || "Access was denied.");
        return;
      }
      toast.error(
        e.response?.data?.detail || "Could not open observations workspace",
      );
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <PageLoadingShell loading={loading} minHeight="min-h-[320px]">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className={adminTable.pageTitle}>My service assignments</h2>
          <p className="mt-1 text-sm text-slate-600">
            Requests assigned to you as engineer. Open observations to fill the
            sheets; status moves to <strong>in progress</strong> when you save
            pages, and to <strong>completed</strong> when you finish from the
            observation workspace. Saving sheets after completion moves the
            request back to <strong>in progress</strong> so administrators see
            that data changed; the &ldquo;Observation filled&rdquo; column shows
            the latest time a sheet was filled in.
          </p>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={`${adminTable.table} min-w-[1000px]`}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>ID</th>
                  <th className={adminTable.th}>Created</th>
                  <th className={adminTable.th}>Service</th>
                  <th className={adminTable.th}>Customer</th>
                  <th className={adminTable.th}>Contact</th>
                  <th className={adminTable.th}>Product</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.th}>Observation</th>
                  <th className={adminTable.th}>Observation filled</th>
                  <th className={adminTable.thAction}>Actions</th>
                </tr>
              </thead>
              <tbody className={adminTable.tbody}>
                {!loading && rows.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={10}>
                      <span className="text-slate-500">
                        No jobs are assigned to you yet. An admin assigns
                        engineers when creating or editing a service request.
                      </span>
                    </td>
                  </tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{r.id}</td>
                    <td
                      className={`${adminTable.td} whitespace-nowrap text-slate-600`}
                    >
                      {formatDate(r.created_at)}
                    </td>
                    <td className={adminTable.td}>{cell(r.service_type_key)}</td>
                    <td className={adminTable.td}>{cell(r.customer_name)}</td>
                    <td className={adminTable.td}>{cell(r.contact)}</td>
                    <td className={`${adminTable.td} max-w-[200px] truncate`}>
                      {cell(r.product_summary)}
                    </td>
                    <td className={adminTable.td}>
                      <span
                        className={
                          r.status === "completed"
                            ? "inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900 ring-1 ring-blue-600/20"
                            : r.status === "in_progress"
                              ? "inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-600/25"
                              : r.status === "submitted"
                                ? "inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800 ring-1 ring-slate-400/30"
                                : "inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20"
                        }
                      >
                        {displayStatus(r.status)}
                      </span>
                    </td>
                    <td className={adminTable.td}>
                      {r.has_observation ? (
                        <span className="text-xs font-medium text-slate-700">
                          Started
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Not started</span>
                      )}
                    </td>
                    <td
                      className={`${adminTable.td} whitespace-nowrap text-xs text-slate-600`}
                      title={
                        r.observation_updated_at
                          ? `Last observation filled: ${formatDate(r.observation_updated_at)}`
                          : undefined
                      }
                    >
                      {formatDate(r.observation_updated_at)}
                    </td>
                    <td className={adminTable.tdAction}>
                      <button
                        type="button"
                        disabled={loading || openingId === r.id}
                        onClick={() => goToObservations(r.id)}
                        title="Open observation workspace"
                        className={`${adminTable.btnAdd} inline-flex h-9 items-center gap-2 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <Microscope className="h-4 w-4 shrink-0" aria-hidden />
                        {openingId === r.id
                          ? "Opening…"
                          : (r.status || "").trim() === "completed"
                            ? "View / edit"
                            : "Observations"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}
