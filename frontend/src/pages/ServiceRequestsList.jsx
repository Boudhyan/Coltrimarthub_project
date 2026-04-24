import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { adminTable } from "../components/AdminTableStyles";
import PageLoadingShell from "../components/PageLoadingShell";
import { cell } from "../utils/cellDisplay";
import { canAccess } from "../utils/canAccess";
import { P } from "../constants/routePermissions.js";
import ServiceRequestActions from "../components/ServiceRequestActions.jsx";

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

function displayTableStatus(raw) {
  const s = (raw || "").trim();
  if (s === "submitted") return "allotted";
  return s || "—";
}

export default function ServiceRequestsList() {
  const auth = useSelector((state) => state.auth);
  const { token } = auth;
  const canEdit = canAccess(auth, P.SERVICE_REQUEST_UPDATE);
  const canCreate = canAccess(auth, P.SERVICE_REQUEST_CREATE);
  /** Reviewers: can open read-only observation JSON for any request (backend also enforces). */
  const canViewObservations =
    canAccess(auth, P.OBSERVATION_READ) &&
    (auth.fullAccess || canAccess(auth, P.SERVICE_REQUEST_READ));
  /** Same gate as viewing; backend requires observation_read + assert_can_read_observation. */
  const canEmailReport =
    canAccess(auth, P.OBSERVATION_READ) &&
    (auth.fullAccess || canAccess(auth, P.SERVICE_REQUEST_READ));
  const canDownloadReport = canEmailReport;
  const canEditObservations =
    canAccess(auth, P.OBSERVATION_UPDATE) &&
    (auth.fullAccess || canAccess(auth, P.SERVICE_REQUEST_READ));
  const showActionsColumn =
    canEdit ||
    canViewObservations ||
    canEditObservations ||
    canEmailReport ||
    canDownloadReport;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterService, setFilterService] = useState("");
  const [search, setSearch] = useState("");

  const fetchRows = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-requests`,
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
      toast.error("Failed to load service requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const displayRows = useMemo(() => {
    const list = [...(rows || [])].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
    const q = search.trim().toLowerCase();
    const svc = filterService.trim().toLowerCase();
    return list.filter((r) => {
      if (filterStatus && (r.status || "") !== filterStatus) return false;
      if (
        svc &&
        String(r.service_type_key || "")
          .toLowerCase()
          .indexOf(svc) === -1
      ) {
        return false;
      }
      if (!q) return true;
      const hay = [
        r.id,
        r.customer_name,
        r.customer_email,
        r.contact,
        r.product_summary,
        r.engineer_name,
        r.service_type_key,
        r.status,
        displayTableStatus(r.status),
        formatDate(r.observation_updated_at),
      ]
        .map((x) => String(x ?? "").toLowerCase())
        .join(" ");
      return hay.includes(q);
    });
  }, [rows, filterStatus, filterService, search]);

  const emptyColspan = showActionsColumn ? 11 : 10;

  return (
    <PageLoadingShell loading={loading} minHeight="min-h-[320px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={adminTable.pageTitle}>Service requests</h2>
            <p className="mt-1 text-sm text-slate-600">
              Submitted requests with customer, service type, engineer, and status.
              <span className="mt-1 block text-slate-500">
                <strong>Observation filled</strong> is the last time an engineer
                filled a sheet; if they add or change data after completion, status
                returns to <strong>in progress</strong>.
              </span>
            </p>
          </div>
          {canCreate && (
            <Link
              to="/service-request"
              className={loading ? "pointer-events-none" : ""}
            >
              <button
                type="button"
                disabled={loading}
                className={`${adminTable.btnAdd} inline-flex h-10 items-center gap-2 px-3 disabled:opacity-50`}
              >
                <Plus size={16} />
                New request
              </button>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="min-h-10 min-w-[140px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm"
            >
              <option value="">All</option>
              <option value="draft">draft</option>
              <option value="submitted">allotted</option>
              <option value="allotted">allotted</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Service type contains
            </label>
            <input
              type="search"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              placeholder="e.g. mqt"
              className="min-h-10 min-w-[180px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400"
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Search
            </label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ID, customer, contact, product, engineer…"
              className="w-full min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={`${adminTable.table} min-w-[1220px]`}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>ID</th>
                  <th className={adminTable.th}>Created</th>
                  <th className={adminTable.th}>Service</th>
                  <th className={adminTable.th}>Customer</th>
                  <th className={adminTable.th}>Contact</th>
                  <th className={adminTable.th}>Customer email</th>
                  <th className={adminTable.th}>Product</th>
                  <th className={adminTable.th}>Engineer</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.th}>Observation filled</th>
                  {showActionsColumn && (
                    <th className={adminTable.thAction}>Action</th>
                  )}
                </tr>
              </thead>
              <tbody className={adminTable.tbody}>
                {!loading && rows.length === 0 && (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={emptyColspan}>
                      <span className="text-slate-500">
                        No service requests yet.{" "}
                        {canCreate && (
                          <>
                            <Link
                              to="/service-request"
                              className="font-semibold text-slate-900 underline"
                            >
                              Create one
                            </Link>
                            .
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                )}
                {!loading &&
                  rows.length > 0 &&
                  displayRows.length === 0 &&
                  (Boolean(filterStatus) ||
                    filterService.trim() !== "" ||
                    search.trim() !== "") && (
                    <tr className={adminTable.tr}>
                      <td className={adminTable.td} colSpan={emptyColspan}>
                        <span className="text-slate-500">
                          No rows match the current filters.
                        </span>
                      </td>
                    </tr>
                  )}
                {displayRows.map((r) => (
                  <tr key={r.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{r.id}</td>
                    <td className={`${adminTable.td} whitespace-nowrap text-slate-600`}>
                      {formatDate(r.created_at)}
                    </td>
                    <td className={adminTable.td}>{cell(r.service_type_key)}</td>
                    <td className={adminTable.td}>{cell(r.customer_name)}</td>
                    <td className={adminTable.td}>{cell(r.contact)}</td>
                    <td
                      className={`${adminTable.td} max-w-[200px] truncate text-slate-700`}
                      title={r.customer_email || ""}
                    >
                      {cell(r.customer_email)}
                    </td>
                    <td className={`${adminTable.td} max-w-[200px] truncate`}>
                      {cell(r.product_summary)}
                    </td>
                    <td className={adminTable.td}>{cell(r.engineer_name)}</td>
                    <td className={adminTable.td}>
                      <span
                        className={
                          r.status === "submitted" || r.status === "allotted"
                            ? "inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20"
                            : r.status === "completed"
                              ? "inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900 ring-1 ring-blue-600/20"
                              : r.status === "in_progress"
                                ? "inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-600/25"
                                : "inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-400/30"
                        }
                        title={
                          r.status === "in_progress"
                            ? "Includes jobs reopened after observation data was filled in again."
                            : undefined
                        }
                      >
                        {displayTableStatus(r.status)}
                      </span>
                    </td>
                    <td
                      className={`${adminTable.td} whitespace-nowrap text-xs text-slate-600`}
                      title={
                        r.observation_updated_at
                          ? `Last observation sheet filled: ${formatDate(r.observation_updated_at)}`
                          : "No observation row or not filled yet"
                      }
                    >
                      {formatDate(r.observation_updated_at)}
                    </td>
                    {showActionsColumn && (
                      <td className={adminTable.tdAction}>
                        <ServiceRequestActions
                          id={r.id}
                          selectedId={selectedId}
                          setSelectedId={setSelectedId}
                          open={actionsOpen}
                          setOpen={setActionsOpen}
                          canEdit={canEdit}
                          canViewObservations={canViewObservations}
                          canEditObservations={canEditObservations}
                          canEmailReport={canEmailReport}
                          canDownloadReport={canDownloadReport}
                          observationReportEmailedAt={r.observation_report_emailed_at}
                          customerEmail={r.customer_email}
                          onReportEmailed={fetchRows}
                        />
                      </td>
                    )}
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
