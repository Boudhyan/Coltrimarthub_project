/** Shared class names for admin list tables (department, designation, users, roles, etc.) */
export const adminTable = {
  wrap: "overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-900/[0.06]",
  scroll: "overflow-x-auto",
  table: "w-full min-w-[520px] border-collapse text-left",
  thead: "bg-slate-900 text-white",
  th: "px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-white/95 first:rounded-tl-xl last:rounded-tr-xl",
  tbody: "divide-y divide-slate-100 bg-white text-[15px] leading-snug text-slate-800 antialiased",
  tr: "transition-colors hover:bg-slate-50/95",
  td: "px-5 py-3.5 align-middle text-slate-700",
  pageTitle: "text-xl font-semibold tracking-tight text-slate-900",
  /** Last column: actions */
  thAction: "px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.08em] text-white/95 first:rounded-tl-xl last:rounded-tr-xl",
  tdAction:
    "px-5 py-3.5 align-middle text-slate-700 flex flex-wrap items-center justify-end gap-2",
  /** Add / primary CTA on users, roles, department, designation */
  btnAdd:
    "rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2",
  /** Row edit (pencil) — black */
  btnEditIcon:
    "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1",
  /** Row delete — red to pair with logout */
  btnDeleteIcon:
    "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50",
};
