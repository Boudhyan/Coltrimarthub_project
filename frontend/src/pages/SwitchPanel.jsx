import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipboardList, FileText, ShieldCheck, Users } from "lucide-react";
import PageLoadingShell from "../components/PageLoadingShell";
import { canAccess } from "../utils/canAccess";
import { P } from "../constants/routePermissions";

function statusLabel(raw) {
  if ((raw || "").trim() === "submitted") return "pending";
  return raw || "—";
}

export default function SwitchPanel() {
  const auth = useSelector((s) => s.auth);
  const { token } = auth;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const api = import.meta.env.VITE_API_URL;
        const headers = { Authorization: `Bearer ${token}` };
        const [uRes, rRes] = await Promise.all([
          axios.get(`${api}/users`, { headers, withCredentials: true }),
          axios.get(`${api}/service-requests`, { headers, withCredentials: true }),
        ]);
        if (cancelled) return;
        setUsers(Array.isArray(uRes.data) ? uRes.data : []);
        setRequests(Array.isArray(rRes.data) ? rRes.data : []);
      } catch {
        if (cancelled) return;
        setUsers([]);
        setRequests([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const stats = useMemo(() => {
    const activeUsers = users.filter((u) => u.is_active !== false).length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const inProgress = requests.filter((r) => r.status === "in_progress").length;
    return {
      activeUsers,
      totalUsers: users.length,
      totalRequests: requests.length,
      completed,
      inProgress,
    };
  }, [users, requests]);

  const quickActions = [
    {
      label: "Create service request",
      to: "/service-request",
      allow: canAccess(auth, P.SERVICE_REQUEST_CREATE),
    },
    {
      label: "Manage users",
      to: "/users",
      allow: canAccess(auth, P.USER_READ),
    },
    {
      label: "Manage roles",
      to: "/roles",
      allow: canAccess(auth, P.ROLE_READ),
    },
    {
      label: "Review observations",
      to: "/service-requests",
      allow: canAccess(auth, P.OBSERVATION_READ),
    },
  ].filter((x) => x.allow);

  const recentRequests = [...requests]
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .slice(0, 6);

  return (
    <PageLoadingShell loading={loading} minHeight="min-h-[300px]">
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg">
          <h1 className="text-2xl font-semibold tracking-tight">Planet Electro Labs</h1>
          <p className="mt-1 text-sm text-slate-200">
            Switch Panel - quick controls and operations overview
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Active Users", value: stats.activeUsers, icon: Users },
            { title: "Total Requests", value: stats.totalRequests, icon: ClipboardList },
            { title: "In Progress", value: stats.inProgress, icon: FileText },
            { title: "Completed", value: stats.completed, icon: ShieldCheck },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{c.title}</p>
                <c.icon className="h-5 w-5 text-slate-500" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04]">
            <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-3 space-y-2">
              {quickActions.length === 0 ? (
                <p className="text-sm text-slate-500">No actions available for your permissions.</p>
              ) : (
                quickActions.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
                  >
                    {a.label}
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] lg:col-span-2">
            <h2 className="text-sm font-semibold text-slate-900">Recent requests</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Service</th>
                    <th className="px-2 py-2">Customer</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-3 text-slate-500">
                        No service requests yet.
                      </td>
                    </tr>
                  ) : (
                    recentRequests.map((r) => (
                      <tr key={r.id} className="border-t border-slate-100">
                        <td className="px-2 py-2 font-medium text-slate-800">{r.id}</td>
                        <td className="px-2 py-2 text-slate-700">{r.service_type_key || "—"}</td>
                        <td className="px-2 py-2 text-slate-700">{r.customer_name || "—"}</td>
                        <td className="px-2 py-2 text-slate-700">{statusLabel(r.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}
