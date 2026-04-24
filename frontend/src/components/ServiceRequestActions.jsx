import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Mail,
  Microscope,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

/**
 * Same interaction pattern as Actionbutton (Users/Roles): Actions dropdown.
 */
function formatEmailedAt(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return null;
  }
}

export default function ServiceRequestActions({
  id,
  selectedId,
  setSelectedId,
  open,
  setOpen,
  canEdit,
  canViewObservations,
  canEditObservations = false,
  canEmailReport = false,
  canDownloadReport = false,
  observationReportEmailedAt = null,
  customerEmail = null,
  onReportEmailed,
}) {
  const { token } = useSelector((s) => s.auth);
  const [emailing, setEmailing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const busy = emailing || downloading;
  const isOpen = open && selectedId === id;
  const hasAny = Boolean(
    canEdit ||
      canViewObservations ||
      canEditObservations ||
      canEmailReport ||
      canDownloadReport,
  );

  const toggle = () => {
    if (busy) return;
    if (selectedId === id) {
      setOpen(!open);
    } else {
      setSelectedId(id);
      setOpen(true);
    }
  };

  const sendReport = async (e) => {
    e.preventDefault();
    if (!token || busy) return;
    const api = import.meta.env.VITE_API_URL;
    setEmailing(true);
    try {
      const { data } = await axios.post(
        `${api}/service-requests/${id}/email-observation-report`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const sent =
        typeof data?.emailed_at === "string"
          ? formatEmailedAt(data.emailed_at)
          : null;
      toast.success(
        sent
          ? `Report emailed to ${data?.to || "customer"} (${sent}).`
          : `Report emailed to ${data?.to || "customer"}.`,
      );
      onReportEmailed?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      const d = err.response?.data?.detail;
      toast.error(
        typeof d === "string" ? d : "Could not email the observation report.",
      );
    } finally {
      setEmailing(false);
    }
  };

  const downloadReport = async (e) => {
    e.preventDefault();
    if (!token || busy) return;
    const api = import.meta.env.VITE_API_URL;
    setDownloading(true);
    try {
      const res = await axios.get(
        `${api}/service-requests/${id}/observation-report.pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          withCredentials: true,
        },
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `observations_sr${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded.");
      setOpen(false);
    } catch (err) {
      console.error(err);
      let msg = "Could not download the observation report.";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          if (typeof parsed?.detail === "string") msg = parsed.detail;
        } catch {
          /* keep default */
        }
      } else if (typeof err.response?.data?.detail === "string") {
        msg = err.response.data.detail;
      }
      toast.error(msg);
    } finally {
      setDownloading(false);
    }
  };

  if (!hasAny) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => toggle()}
        disabled={busy}
        className="group inline-flex items-stretch overflow-hidden rounded-xl bg-neutral-900 text-sm font-semibold text-white shadow-lg shadow-black/25 ring-1 ring-neutral-800 transition hover:bg-neutral-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center gap-2 px-3 py-2.5">
          <MoreHorizontal className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          Actions
        </span>
        <span className="flex items-center border-l border-white/15 bg-black/30 px-2.5 transition group-hover:bg-black/40">
          {isOpen ? (
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-[100] min-w-[220px] max-w-[280px] overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 py-1.5 shadow-2xl ring-1 ring-white/10"
          role="menu"
        >
          {(canEmailReport || customerEmail) && (
            <div className="border-b border-white/10 px-4 py-2.5 text-xs leading-snug text-white/80">
              <p className="font-semibold text-white/95">Customer PDF email</p>
              {customerEmail ? (
                <p className="mt-1 break-all text-white/75">{customerEmail}</p>
              ) : (
                <p className="mt-1 text-amber-200/90">No email on file</p>
              )}
              {canEmailReport ? (
                observationReportEmailedAt ? (
                  <p className="mt-1.5 text-emerald-200/95">
                    Last sent: {formatEmailedAt(observationReportEmailedAt) || "—"}
                  </p>
                ) : (
                  <p className="mt-1.5 text-amber-200/90">Not sent yet</p>
                )
              ) : null}
            </div>
          )}
          {canEdit && (
            <Link
              to={`/service-requests/${id}/edit`}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 ${busy ? "pointer-events-none opacity-50" : ""}`}
              onClick={() => setOpen(false)}
            >
              <Pencil className="h-4 w-4 text-white/90" strokeWidth={2} />
              Edit request
            </Link>
          )}
          {canViewObservations && (
            <Link
              to={`/service-requests/${id}/observations`}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 ${busy ? "pointer-events-none opacity-50" : ""}`}
              onClick={() => setOpen(false)}
            >
              <Eye className="h-4 w-4 text-white/90" strokeWidth={2} />
              View observations
            </Link>
          )}
          {canEditObservations && (
            <Link
              to={`/observation/sr/${id}/edit?page=1`}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 ${busy ? "pointer-events-none opacity-50" : ""}`}
              onClick={() => setOpen(false)}
            >
              <Microscope className="h-4 w-4 text-white/90" strokeWidth={2} />
              Edit observations
            </Link>
          )}
          {canDownloadReport && (
            <button
              type="button"
              onClick={downloadReport}
              disabled={busy}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4 shrink-0 text-white/90" strokeWidth={2} />
              {downloading ? "Downloading…" : "Download report"}
            </button>
          )}
          {canEmailReport && (
            <button
              type="button"
              onClick={sendReport}
              disabled={busy}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Mail className="h-4 w-4 shrink-0 text-white/90" strokeWidth={2} />
              {emailing ? "Sending…" : "Email report"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
