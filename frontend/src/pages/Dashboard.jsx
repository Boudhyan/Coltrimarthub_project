import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BarChart3, ClipboardList, Layers3, Users } from "lucide-react";
import PageLoadingShell from "../components/PageLoadingShell";
import { adminTable } from "../components/AdminTableStyles";

function statusPillCls(status) {
  if (status === "completed") return "bg-blue-50 text-blue-900 ring-blue-600/20";
  if (status === "in_progress") return "bg-amber-50 text-amber-900 ring-amber-600/25";
  if (status === "submitted" || status === "allotted") return "bg-emerald-50 text-emerald-800 ring-emerald-600/20";
  return "bg-slate-100 text-slate-700 ring-slate-400/30";
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function Dashboard() {
  const { token } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const api = import.meta.env.VITE_API_URL;
        const headers = { Authorization: `Bearer ${token}` };
        const [srRes, usersRes, stRes] = await Promise.all([
          axios.get(`${api}/service-requests`, { headers, withCredentials: true }),
          axios.get(`${api}/users`, { headers, withCredentials: true }),
          axios.get(`${api}/service-types`, { headers, withCredentials: true }),
        ]);
        if (cancelled) return;
        setServiceRequests(Array.isArray(srRes.data) ? srRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setServiceTypes(Array.isArray(stRes.data) ? stRes.data : []);
      } catch {
        if (cancelled) return;
        setServiceRequests([]);
        setUsers([]);
        setServiceTypes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const stats = useMemo(() => {
    const statusCount = {
      submitted: 0,
      allotted: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      draft: 0,
    };
    for (const r of serviceRequests) {
      const k = (r.status || "draft").trim();
      statusCount[k] = (statusCount[k] || 0) + 1;
    }
    const activeUsers = users.filter((u) => u.is_active !== false).length;
    return {
      totalRequests: serviceRequests.length,
      completed: statusCount.completed || 0,
      inProgress: statusCount.in_progress || 0,
      pending: (statusCount.submitted || 0) + (statusCount.allotted || 0),
      cancelled: statusCount.cancelled || 0,
      activeUsers,
      totalUsers: users.length,
      totalServiceTypes: serviceTypes.length,
      statusCount,
    };
  }, [serviceRequests, users, serviceTypes]);

  const recentRows = useMemo(
    () =>
      [...serviceRequests]
        .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
        .slice(0, 8),
    [serviceRequests],
  );

  return (
    <PageLoadingShell loading={loading} minHeight="min-h-[320px]">
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg">
          <h2 className="text-xl font-semibold tracking-tight">Operations Dashboard</h2>
          <p className="mt-1 text-sm text-slate-200">
            Real-time snapshot of service requests, team load, and execution status.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Total Requests", value: stats.totalRequests, icon: ClipboardList },
            { title: "In Progress", value: stats.inProgress, icon: BarChart3 },
            { title: "Completed", value: stats.completed, icon: Layers3 },
            { title: "Active Users", value: stats.activeUsers, icon: Users },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                <card.icon className="h-5 w-5 text-slate-500" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04]">
            <h3 className="text-sm font-semibold text-slate-900">Request Status Mix</h3>
            <div className="mt-3 space-y-2 text-sm">
              {[
                ["Pending", stats.pending],
                ["In Progress", stats.inProgress],
                ["Completed", stats.completed],
                ["Cancelled", stats.cancelled],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-slate-700">{label}</span>
                  <span className="font-semibold text-slate-900">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Catalog & Capacity</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Service Types</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalServiceTypes}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total Users</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Completion Rate</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {stats.totalRequests > 0
                    ? `${Math.round((stats.completed / stats.totalRequests) * 100)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={adminTable.wrap}>
          <div className={adminTable.scroll}>
            <table className={`${adminTable.table} min-w-[920px]`}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>ID</th>
                  <th className={adminTable.th}>Service</th>
                  <th className={adminTable.th}>Customer</th>
                  <th className={adminTable.th}>Engineer</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.th}>Created</th>
                </tr>
              </thead>
              <tbody className={adminTable.tbody}>
                {recentRows.map((r) => (
                  <tr key={r.id} className={adminTable.tr}>
                    <td className={adminTable.td}>{r.id}</td>
                    <td className={adminTable.td}>{r.service_type_key || "—"}</td>
                    <td className={adminTable.td}>{r.customer_name || "—"}</td>
                    <td className={adminTable.td}>{r.engineer_name || "—"}</td>
                    <td className={adminTable.td}>
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${statusPillCls(r.status || "")}`}>
                        {r.status || "draft"}
                      </span>
                    </td>
                    <td className={adminTable.td}>{formatDate(r.created_at)}</td>
                  </tr>
                ))}
                {!loading && recentRows.length === 0 ? (
                  <tr className={adminTable.tr}>
                    <td className={adminTable.td} colSpan={6}>
                      <span className="text-slate-500">No service requests yet.</span>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}
