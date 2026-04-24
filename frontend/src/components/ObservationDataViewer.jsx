/**
 * Renders observation page payloads (nested objects/arrays) in a readable way for admins.
 */
function humanizeKey(key) {
  if (typeof key !== "string") return String(key);
  const spaced = key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (!spaced) return key;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isPlainObject(v) {
  return (
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.getPrototypeOf(v) === Object.prototype
  );
}

const MAX_TABLE_COLS = 28;

export default function ObservationDataViewer({ data, depth = 0 }) {
  if (data === null || data === undefined) {
    return <span className="text-slate-400">—</span>;
  }

  if (typeof data === "boolean") {
    return <span className="font-medium">{data ? "Yes" : "No"}</span>;
  }

  if (typeof data === "number") {
    if (!Number.isFinite(data)) {
      return <span className="text-slate-400">—</span>;
    }
    return <span>{String(data)}</span>;
  }

  if (typeof data === "string") {
    const t = data.trim();
    if (t === "") return <span className="text-slate-400">—</span>;
    if (/^\d{4}-\d{2}-\d{2}/.test(t)) {
      const d = new Date(t);
      if (!Number.isNaN(d.getTime())) {
        return <span>{d.toLocaleString()}</span>;
      }
    }
    return (
      <span className="whitespace-pre-wrap break-words leading-relaxed">{data}</span>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-slate-400 italic">No rows</span>;
    }

    const allObjects = data.every(isPlainObject);
    if (allObjects && data.length > 0 && depth < 8) {
      const colSet = new Set();
      data.forEach((row) => {
        Object.keys(row || {}).forEach((k) => {
          if (!k.startsWith("_")) colSet.add(k);
        });
      });
      const cols = [...colSet];
      if (cols.length > 0 && cols.length <= MAX_TABLE_COLS) {
        return (
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full min-w-[320px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  {cols.map((c) => (
                    <th
                      key={c}
                      className="border-b border-slate-200 px-2.5 py-2 text-xs font-semibold uppercase tracking-wide"
                    >
                      {humanizeKey(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/90"
                  >
                    {cols.map((c) => (
                      <td
                        key={c}
                        className="max-w-[min(28rem,90vw)] px-2.5 py-2 align-top text-slate-800"
                      >
                        <ObservationDataViewer
                          data={row?.[c]}
                          depth={depth + 1}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    return (
      <ol className="list-decimal space-y-3 pl-5 text-slate-800 marker:font-medium">
        {data.map((item, i) => (
          <li key={i} className="pl-1">
            <ObservationDataViewer data={item} depth={depth + 1} />
          </li>
        ))}
      </ol>
    );
  }

  if (isPlainObject(data)) {
    const entries = Object.entries(data).filter(([k]) => !k.startsWith("_"));
    if (entries.length === 0) {
      return <span className="text-slate-400 italic">Empty</span>;
    }

    return (
      <div
        className={
          depth > 0
            ? "mt-1 space-y-2 border-l-2 border-slate-200 pl-3"
            : "space-y-2"
        }
      >
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="rounded-lg border border-slate-100 bg-white/90 p-3 shadow-sm ring-1 ring-slate-900/[0.04]"
          >
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {humanizeKey(k)}
            </div>
            <div className="text-[15px] leading-snug text-slate-900">
              <ObservationDataViewer data={v} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className="break-all">{String(data)}</span>;
}
