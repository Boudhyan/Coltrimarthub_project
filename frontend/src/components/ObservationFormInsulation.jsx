import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

const emptyRow = () => ({
  sampleNo: "",
  requiredMohm: "",
  measuredMohm: "",
  result: "",
  dielectricYesDescription: "",
  dielectricNo: false,
});

/**
 * @param {{ value: object, onChange: function, variant?: "initial_04" | "final_239" }} props
 */
export default function ObservationFormInsulation({ value: form, onChange, variant = "initial_04" }) {
  const isFinal = variant === "final_239";
  const setTop = (k, v) => onChange({ ...form, [k]: v });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    onChange({ ...form, rows });
  };
  const add = () => onChange({ ...form, rows: [...form.rows, emptyRow()] });
  const removeLast = () => {
    if (form.rows.length <= 1) return;
    onChange({ ...form, rows: form.rows.slice(0, -1) });
  };

  const tableTitle = isFinal
    ? "TABLE 23.9: MQT 03 — Final insulation test"
    : "TABLE 04: MQT 03 — Initial insulation test";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-bold leading-snug text-slate-900">{tableTitle}</h2>
      <section className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Test voltage applied [V]</label>
          <input
            value={form.testVoltage ?? ""}
            onChange={(e) => setTop("testVoltage", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Size of module [m²]</label>
          <input
            value={form.moduleSize ?? ""}
            onChange={(e) => setTop("moduleSize", e.target.value)}
            className={inputCls}
          />
        </div>
        {!isFinal ? (
          <div className="sm:col-span-2">
            <label className={labelCls}>Required resistance [MΩ] (sheet header)</label>
            <input
              value={form.requiredResistanceMohm ?? ""}
              onChange={(e) => setTop("requiredResistanceMohm", e.target.value)}
              className={inputCls}
            />
          </div>
        ) : null}
      </section>

      <section className="mt-5 border-t border-slate-200 pt-4">
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
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`insul-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Sample {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => setRow(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                {isFinal ? (
                  <div>
                    <label className={labelCls}>Required [MΩ]</label>
                    <input
                      value={row.requiredMohm ?? ""}
                      onChange={(e) => setRow(idx, "requiredMohm", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ) : null}
                <div>
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm ?? ""}
                    onChange={(e) => setRow(idx, "measuredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => setRow(idx, "result", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Dielectric breakdown — Yes (description)</label>
                  <input
                    value={row.dielectricYesDescription ?? ""}
                    onChange={(e) =>
                      setRow(idx, "dielectricYesDescription", e.target.value)
                    }
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-semibold text-slate-700">
                    Dielectric breakdown — No (column)
                  </p>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!row.dielectricNo}
                      onChange={(e) => setRow(idx, "dielectricNo", e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm font-medium">No</span>
                  </label>
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
          value={form.supplementary ?? ""}
          onChange={(e) => setTop("supplementary", e.target.value)}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>
    </div>
  );
}
