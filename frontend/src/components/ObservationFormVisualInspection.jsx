import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

const emptyRow = () => ({ sampleNo: "", findings: "" });

const defaultForm = () => ({
  rows: [emptyRow()],
  supplementary: "",
});

export default function ObservationFormVisualInspection({ value: form, onChange }) {
  const safe =
    form && typeof form === "object"
      ? {
          ...defaultForm(),
          ...form,
          rows: Array.isArray(form.rows) && form.rows.length > 0 ? form.rows : [emptyRow()],
        }
      : defaultForm();

  const setTop = (k, v) => onChange({ ...safe, [k]: v });
  const setRow = (i, k, v) => {
    const rows = [...safe.rows];
    rows[i] = { ...emptyRow(), ...rows[i], [k]: v };
    onChange({ ...safe, rows });
  };
  const markScroll = useScrollToNewEntry(safe.rows.length, "vis-insp");
  const add = () => {
    markScroll(safe.rows.length);
    onChange({ ...safe, rows: [...safe.rows, emptyRow()] });
  };
  const removeLast = () => {
    if (safe.rows.length <= 1) return;
    onChange({ ...safe, rows: safe.rows.slice(0, -1) });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase text-slate-700">Samples</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={add}
              className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
            >
              + Sample
            </button>
            <button
              type="button"
              onClick={removeLast}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
            >
              − Last
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {safe.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`vis-insp-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Sample {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => setRow(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Nature and position of findings — comments or photo refs
                  </label>
                  <textarea
                    rows={3}
                    value={row.findings ?? ""}
                    onChange={(e) => setRow(idx, "findings", e.target.value)}
                    className={`${inputCls} resize-y min-h-[5rem]`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <label className={labelCls}>Supplementary information</label>
        <textarea
          rows={4}
          value={safe.supplementary ?? ""}
          onChange={(e) => setTop("supplementary", e.target.value)}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>
    </div>
  );
}
