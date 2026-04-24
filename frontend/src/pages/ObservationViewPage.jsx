import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { PDF_PAGE_MANIFEST } from "../constants/pdfObservationManifest";
import { resolveObservationSheetMode } from "../constants/serviceObservationProfiles";
import PageLoadingShell from "../components/PageLoadingShell";
import { adminTable } from "../components/AdminTableStyles";
import { cell } from "../utils/cellDisplay";
import { canAccess } from "../utils/canAccess";
import { P } from "../constants/routePermissions.js";
import ObservationDataViewer from "../components/ObservationDataViewer";

const titleForKey = (key, manifest) => {
  const m = (manifest || []).find((e) => e.pageKey === key || e.storageKey === key);
  return m ? m.title : key;
};

function anchorIdForPageKey(key) {
  return `obs-${String(key).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function formatTs(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function ObservationViewPage() {
  const { serviceRequestId } = useParams();
  const auth = useSelector((s) => s.auth);
  const { token } = auth;
  const canEditObservations =
    canAccess(auth, P.OBSERVATION_UPDATE) &&
    (auth.fullAccess || canAccess(auth, P.SERVICE_REQUEST_READ));
  const [loading, setLoading] = useState(true);
  const [sr, setSr] = useState(null);
  const [obs, setObs] = useState(null);

  const api = useCallback(() => {
    const base = import.meta.env.VITE_API_URL;
    return {
      base,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const id = Number(serviceRequestId);
    if (!Number.isFinite(id) || id < 1) {
      toast.error("Invalid service request");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { base, headers } = api();
        const srRes = await axios.get(`${base}/service-requests/${id}`, {
          headers,
          withCredentials: true,
        });
        if (cancelled) return;
        setSr(srRes.data);
        try {
          const obRes = await axios.get(
            `${base}/observation-requests/by-service-request/${id}`,
            { headers, withCredentials: true },
          );
          if (cancelled) return;
          setObs(obRes.data);
        } catch (obErr) {
          if (obErr.response?.status === 404) {
            setObs(null);
          } else {
            throw obErr;
          }
        }
      } catch (e) {
        console.error(e);
        toast.error(
          e.response?.data?.detail || "Could not load observation data",
        );
        setSr(null);
        setObs(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, serviceRequestId, api]);

  const observationKeys = useMemo(() => {
    const raw = obs?.observations_json || {};
    return Object.keys(raw).filter((k) => !k.startsWith("_")).sort();
  }, [obs]);

  const [activeKey, setActiveKey] = useState("");
  const [showAllSheets, setShowAllSheets] = useState(false);

  useEffect(() => {
    if (observationKeys.length === 0) {
      setActiveKey("");
      return;
    }
    setActiveKey((prev) =>
      prev && observationKeys.includes(prev) ? prev : observationKeys[0],
    );
  }, [observationKeys]);

  const activeIdx = observationKeys.indexOf(activeKey);
  const canGoPrev = activeIdx > 0;
  const canGoNext = activeIdx >= 0 && activeIdx < observationKeys.length - 1;

  const fd =
    sr?.form_data && typeof sr.form_data === "object" ? sr.form_data : {};
  const resolved = resolveObservationSheetMode(sr?.service_type_key);
  const effectiveManifest =
    resolved.kind === "profile" ? resolved.profile?.entries || [] : PDF_PAGE_MANIFEST;

  return (
    <PageLoadingShell loading={loading} minHeight="min-h-[360px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <Link
                to="/service-requests"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to service requests
              </Link>
              {canEditObservations && serviceRequestId ? (
                <Link
                  to={`/observation/sr/${serviceRequestId}/edit?page=1`}
                  className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-100"
                >
                  Edit in workspace
                </Link>
              ) : null}
            </div>
            <h2 className={adminTable.pageTitle}>
              Observation review
              {sr?.id != null ? (
                <span className="ml-2 text-base font-normal text-slate-500">
                  (service request #{sr.id})
                </span>
              ) : null}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              All fields saved by the assigned engineer are shown below, grouped by
              sheet (PDF page). Data is stored on the server when the engineer saves
              each page in the observation workspace.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Customer:{" "}
              <strong>{cell(fd.customerName || fd.customer_name)}</strong>
              {" · "}
              Service: <strong>{cell(sr?.service_type_key)}</strong>
              {" · "}
              Request status: <strong>{cell(sr?.status)}</strong>
              {obs?.updated_at ? (
                <>
                  {" · "}
                  Last saved:{" "}
                  <strong>{formatTs(obs.updated_at)}</strong>
                </>
              ) : null}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Use the sheet picker below to open one page at a time, or enable
              &quot;Show all sheets&quot; to scroll the full record.
            </p>
          </div>
        </div>

        {!loading && resolved.kind === "none" && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            No obersvation sheet for this service.
          </p>
        )}

        {!loading && resolved.kind !== "none" && !obs && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            No observation record for this request yet.
          </p>
        )}

        {!loading && resolved.kind !== "none" && obs && observationKeys.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            The observation record exists but no sheet data has been saved yet.
          </p>
        )}

        {!loading && resolved.kind !== "none" && observationKeys.length > 0 && (
          <>
            <nav
              className="sticky top-0 z-10 space-y-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm ring-1 ring-slate-900/[0.06]"
              aria-label="Sheet navigation"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:max-w-[min(100%,280px)]">
                  Sheet
                  <select
                    value={activeKey}
                    onChange={(e) => setActiveKey(e.target.value)}
                    className="mt-1 w-full min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {observationKeys.map((k) => (
                      <option key={k} value={k}>
                        {titleForKey(k, effectiveManifest)}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!canGoPrev}
                    onClick={() =>
                      canGoPrev && setActiveKey(observationKeys[activeIdx - 1])
                    }
                    className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous sheet"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() =>
                      canGoNext && setActiveKey(observationKeys[activeIdx + 1])
                    }
                    className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next sheet"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <span className="text-xs text-slate-500 sm:ml-auto">
                  {activeIdx + 1} / {observationKeys.length}
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={showAllSheets}
                  onChange={(e) => setShowAllSheets(e.target.checked)}
                />
                Show all sheets (long scroll)
              </label>
              {showAllSheets ? (
                <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto border-t border-slate-100 pt-2">
                  <p className="w-full text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Jump to section
                  </p>
                  {observationKeys.map((k) => (
                    <a
                      key={k}
                      href={`#${anchorIdForPageKey(k)}`}
                      className="inline-flex max-w-[220px] truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
                    >
                      {titleForKey(k, effectiveManifest)}
                    </a>
                  ))}
                </div>
              ) : null}
            </nav>

            {!showAllSheets && activeKey ? (
              <section
                className="rounded-xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-900/[0.06]"
              >
                <header className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-white sm:px-5">
                  <h3 className="text-base font-semibold leading-snug">
                    {titleForKey(activeKey, effectiveManifest)}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] text-white/70">
                    {activeKey}
                  </p>
                </header>
                <div className="p-4 sm:p-5">
                  {obs.observations_json[activeKey] === undefined ||
                  obs.observations_json[activeKey] === null ? (
                    <p className="text-sm text-slate-500">No data for this sheet.</p>
                  ) : (
                    <ObservationDataViewer data={obs.observations_json[activeKey]} />
                  )}
                </div>
              </section>
            ) : null}

            {showAllSheets ? (
              <div className="space-y-8">
                {observationKeys.map((k) => {
                  const payload = obs.observations_json[k];
                  return (
                    <section
                      key={k}
                      id={anchorIdForPageKey(k)}
                      className="scroll-mt-28 rounded-xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-900/[0.06]"
                    >
                      <header className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-white sm:px-5">
                        <h3 className="text-base font-semibold leading-snug">
                          {titleForKey(k, effectiveManifest)}
                        </h3>
                        <p className="mt-0.5 font-mono text-[11px] text-white/70">
                          {k}
                        </p>
                      </header>
                      <div className="p-4 sm:p-5">
                        {payload === undefined || payload === null ? (
                          <p className="text-sm text-slate-500">No data for this sheet.</p>
                        ) : (
                          <ObservationDataViewer data={payload} />
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : null}
          </>
        )}
      </div>
    </PageLoadingShell>
  );
}
