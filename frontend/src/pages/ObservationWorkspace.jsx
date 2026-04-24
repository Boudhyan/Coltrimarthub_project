import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ObservationPageForm from "../components/ObservationPageForm";
import {
  PDF_PAGE_MANIFEST,
  parsePdfPageFromQuery,
} from "../constants/pdfObservationManifest";
import {
  mergeAllObservationPages,
  mergeDataForEntry,
  defaultDataForEntry,
  sanitizeObservationPageForSave,
} from "../constants/observationPageModel";
import { SERVICE_TYPE_MQT_06_1_INI } from "../constants/observationPages";
import { resolveObservationSheetMode } from "../constants/serviceObservationProfiles";
import { canAccess } from "../utils/canAccess";
import { P } from "../constants/routePermissions.js";

function formatServerDateTime(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? null
      : d.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        });
  } catch {
    return null;
  }
}

export default function ObservationWorkspace() {
  const { serviceRequestId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useSelector((s) => s.auth);
  const { token, fullAccess } = auth;

  const pageQuery = searchParams.get("page");
  const [linkedId, setLinkedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [srStatus, setSrStatus] = useState(null);
  const [observationUpdatedAt, setObservationUpdatedAt] = useState(null);
  const [serviceTypeKey, setServiceTypeKey] = useState("");
  const [sheetMode, setSheetMode] = useState("legacy54");
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [pages, setPages] = useState(() => mergeAllObservationPages({}));
  const serviceProfile = useMemo(() => {
    const resolved = resolveObservationSheetMode(serviceTypeKey);
    return resolved.kind === "profile" ? resolved.profile : null;
  }, [serviceTypeKey]);
  const activeManifest = useMemo(
    () => (sheetMode === "profile" ? serviceProfile?.entries || [] : PDF_PAGE_MANIFEST),
    [serviceProfile, sheetMode],
  );
  const activePdfPage = useMemo(() => {
    const parsed = parsePdfPageFromQuery(pageQuery);
    const maxPage = Math.max(1, activeManifest.length);
    return Math.min(Math.max(parsed, 1), maxPage);
  }, [pageQuery, activeManifest]);
  const activeEntry = useMemo(
    () =>
      activeManifest.find((e) => e.pdfPage === activePdfPage) ||
      activeManifest[0],
    [activePdfPage, activeManifest],
  );
  const activeStorageKey = useMemo(
    () => activeEntry?.storageKey || activeEntry?.pageKey || "page_01",
    [activeEntry],
  );

  const deniedRedirect = useCallback(() => {
    const to =
      fullAccess || canAccess(auth, P.SERVICE_REQUEST_READ)
        ? "/service-requests"
        : "/my-assignments";
    navigate(to, { replace: true });
  }, [auth, fullAccess, navigate]);

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

  const refreshSrStatus = useCallback(async () => {
    if (!linkedId || !token) return;
    try {
      const { base, headers } = api();
      const { data } = await axios.get(`${base}/service-requests/${linkedId}`, {
        headers,
        withCredentials: true,
      });
      setSrStatus(data?.status ?? null);
    } catch {
      setSrStatus(null);
    }
  }, [linkedId, token, api]);

  const savePage = useCallback(
    async (pageKey, data) => {
      if (!linkedId) return;
      if (sheetMode === "none") return;
      const payload = serviceProfile
        ? data || {}
        : sanitizeObservationPageForSave(pageKey, data);
      const { base, headers } = api();
      try {
        const { data: saved } = await axios.patch(
          `${base}/observation-requests/by-service-request/${linkedId}/page/${pageKey}`,
          { data: payload },
          { headers, withCredentials: true },
        );
        if (saved?.updated_at != null) {
          setObservationUpdatedAt(saved.updated_at);
        }
      } catch (e) {
        if (e.response?.status === 403) {
          toast.error(e.response?.data?.detail || "Access was denied.");
          deniedRedirect();
          return;
        }
        throw e;
      }
      setPages((prev) => ({ ...prev, [pageKey]: payload }));
      await refreshSrStatus();
    },
    [linkedId, api, refreshSrStatus, deniedRedirect, serviceProfile, sheetMode],
  );

  useEffect(() => {
    if (!linkedId || !token) return;
    refreshSrStatus();
  }, [linkedId, token, refreshSrStatus]);

  useEffect(() => {
    const canonical = String(activePdfPage);
    if (pageQuery !== canonical) {
      setSearchParams({ page: canonical }, { replace: true });
    }
  }, [activePdfPage, pageQuery, setSearchParams]);

  useEffect(() => {
    if (!token) return;

    const canQuickCreateObs =
      fullAccess ||
      (canAccess(auth, P.OBSERVATION_UPDATE) &&
        canAccess(auth, P.SERVICE_REQUEST_READ));
    if (serviceRequestId === "new" && !canQuickCreateObs) {
      toast.error(
        "Open observations from My assignments using the Observations button on your row.",
      );
      navigate("/my-assignments", { replace: true });
      setLoading(false);
      return;
    }

    if (serviceRequestId === "new") {
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          const { base, headers } = api();
          const { data: sr } = await axios.post(
            `${base}/service-requests`,
            {
              service_type_key: SERVICE_TYPE_MQT_06_1_INI,
              status: "allotted",
            },
            { headers, withCredentials: true },
          );
          await axios.post(
            `${base}/observation-requests`,
            { service_request_id: sr.id },
            { headers, withCredentials: true },
          );
          if (!cancelled) {
            navigate(`/observation/sr/${sr.id}/edit?page=1`, { replace: true });
          }
        } catch (e) {
          console.error(e);
          toast.error("Could not create service / observation row.");
          setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    const id = Number(serviceRequestId);
    if (!Number.isFinite(id) || id < 1) {
      toast.error("Invalid service request id");
      setLoading(false);
      return;
    }
    setLinkedId(id);

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { base, headers } = api();
        let data;
        try {
          const obRes = await axios.get(
            `${base}/observation-requests/by-service-request/${id}`,
            { headers, withCredentials: true },
          );
          data = obRes.data;
        } catch (obErr) {
          if (obErr.response?.status === 404) {
            await axios.post(
              `${base}/observation-requests`,
              { service_request_id: id },
              { headers, withCredentials: true },
            );
            const obRes2 = await axios.get(
              `${base}/observation-requests/by-service-request/${id}`,
              { headers, withCredentials: true },
            );
            data = obRes2.data;
          } else {
            throw obErr;
          }
        }
        if (cancelled) return;
        setObservationUpdatedAt(data.updated_at ?? null);
        const { data: srData } = await axios.get(
          `${base}/service-requests/${id}`,
          { headers, withCredentials: true },
        );
        if (cancelled) return;
        const srKey = String(srData?.service_type_key || "");
        setServiceTypeKey(srKey);
        const resolved = resolveObservationSheetMode(srKey);
        setSheetMode(resolved.kind);
        const raw = data.observations_json || {};
        const profile = resolved.kind === "profile" ? resolved.profile : null;
        if (profile?.entries?.length) {
          const next = {};
          for (const entry of profile.entries) {
            const key = entry.storageKey || entry.pageKey;
            next[key] = mergeDataForEntry(entry, raw[key]);
          }
          setPages(next);
        } else {
          setPages(mergeAllObservationPages(raw));
        }
      } catch (e) {
        console.error(e);
        if (e.response?.status === 403) {
          toast.error(e.response?.data?.detail || "Access was denied.");
          deniedRedirect();
          return;
        }
        toast.error("Failed to load observation.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [serviceRequestId, token, fullAccess, navigate, api, auth, deniedRedirect]);

  const handlePageChange = async (e) => {
    const nextNum = parseInt(e.target.value, 10);
    if (nextNum === activePdfPage) return;
    try {
      setSaving(true);
      await savePage(activeStorageKey, pages[activeStorageKey]);
      setSearchParams({ page: String(nextNum) });
      toast.success("Page saved");
    } catch (err) {
      console.error(err);
      toast.error("Could not save before leaving this page");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCurrent = async () => {
    try {
      setSaving(true);
      await savePage(activeStorageKey, pages[activeStorageKey]);
      toast.success("Saved");
    } catch (e) {
      console.error(e);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const runCompleteObservations = async () => {
    if (!linkedId) return;
    try {
      setSaving(true);
      await savePage(activeStorageKey, pages[activeStorageKey]);
      const { base, headers } = api();
      await axios.post(
        `${base}/service-requests/${linkedId}/complete-observations`,
        {},
        { headers, withCredentials: true },
      );
      setSrStatus("completed");
      setCompleteModalOpen(false);
      toast.success("Service request marked completed.");
      navigate("/my-assignments", { replace: true });
    } catch (e) {
      console.error(e);
      toast.error(
        e.response?.data?.detail || "Could not complete observations",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClearCurrentPage = async () => {
    if (!window.confirm("Clear all data on this page? This cannot be undone.")) {
      return;
    }
    const empty = defaultDataForEntry(activeEntry);
    const nextPages = { ...pages, [activeStorageKey]: empty };
    setPages(nextPages);
    try {
      setSaving(true);
      await savePage(activeStorageKey, empty);
      toast.success("Page cleared");
    } catch (e) {
      console.error(e);
      toast.error("Clear failed to sync");
    } finally {
      setSaving(false);
    }
  };

  if (serviceRequestId === "new" || loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-600 shadow">
        Loading…
      </div>
    );
  }

  if (sheetMode === "none") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900 shadow">
        No obersvation sheet for this service.
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-10 -mx-1 mb-3 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        {linkedId ? (
          <div className="text-center">
            <p className="text-[11px] font-medium text-slate-500">
              Service request #{linkedId}
            </p>
            {srStatus ? (
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                Status: {srStatus}
              </p>
            ) : null}
            {observationUpdatedAt ? (
              <p className="mt-1 text-[11px] font-medium text-slate-600">
                Observation last filled:{" "}
                <span className="text-slate-800">
                  {formatServerDateTime(observationUpdatedAt) || "—"}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
        <label className={labelClsStatic}>PDF page</label>
        <select
          value={activePdfPage}
          onChange={handlePageChange}
          disabled={saving}
          className="w-full min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-base font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {activeManifest.map((p) => (
            <option key={p.pdfPage} value={p.pdfPage}>
              Page {p.pdfPage}
            </option>
          ))}
        </select>
        <p className="text-center text-xs leading-snug text-slate-600">{activeEntry.title}</p>
        <p className="text-[11px] text-slate-500">
          Changing the page saves the one you are leaving. Use + Sample / + Row to add entries.
        </p>
        <button
          type="button"
          onClick={handleClearCurrentPage}
          disabled={saving}
          className="w-full min-h-10 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-800 active:bg-red-100 disabled:opacity-50"
        >
          Clear this page
        </button>
      </div>

      <ObservationPageForm
        entry={activeEntry}
        value={pages[activeStorageKey]}
        onChange={(next) =>
          setPages((prev) => ({ ...prev, [activeStorageKey]: next }))
        }
      />

      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={handleSaveCurrent}
          disabled={saving || !linkedId}
          className="flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md active:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save this page"}
        </button>
        {linkedId && srStatus && srStatus !== "completed" ? (
          <button
            type="button"
            onClick={() => setCompleteModalOpen(true)}
            disabled={saving}
            className="flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 text-sm font-semibold text-emerald-900 shadow-sm active:bg-emerald-100 disabled:opacity-50"
          >
            Complete observations
          </button>
        ) : null}
        {linkedId && srStatus === "completed" ? (
          <p className="text-center text-xs font-medium text-emerald-800">
            This service request is marked completed. You can still fill in or
            update any sheet; saving moves the request back to{" "}
            <strong>in progress</strong> so administrators see that observation
            data changed. Download the PDF again after updates for an up-to-date
            file.
          </p>
        ) : null}
      </div>

      {completeModalOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="complete-obs-title"
          onClick={() => {
            if (!saving) setCompleteModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl ring-1 ring-slate-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="complete-obs-title"
              className="text-lg font-semibold text-slate-900"
            >
              Complete observations?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Only continue if you have saved every sheet you need and the job is
              ready to close. The service request will be marked{" "}
              <strong>completed</strong> and administrators will rely on this as the
              final submission.
            </p>
            <p className="mt-3 text-sm font-medium text-amber-900">
              Are you sure you have fully completed the observation work for this
              request?
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setCompleteModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => runCompleteObservations()}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Working…" : "Yes, mark complete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const labelClsStatic =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600";
