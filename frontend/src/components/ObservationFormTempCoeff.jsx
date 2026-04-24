import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

const emptyRow = () => ({ sampleNo: "", alpha: "", beta: "", delta: "" });

export default function ObservationFormTempCoeff({ value: form, onChange }) {
  const setTop = (k, v) => onChange({ ...form, [k]: v });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    onChange({ ...form, rows });
  };
  const markScroll = useScrollToNewEntry(form.rows.length, "temp-coeff");
  const add = () => {
    markScroll(form.rows.length);
    onChange({ ...form, rows: [...form.rows, emptyRow()] });
  };
  const removeLast = () => {
    if (form.rows.length <= 1) return;
    onChange({ ...form, rows: form.rows.slice(0, -1) });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase text-slate-600">
          Test conditions (high / low)
        </p>
        <div>
          <label className={labelCls}>Ambient air temperature [°C] high / low</label>
          <input
            value={form.ambientHighLow}
            onChange={(e) => setTop("ambientHighLow", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Irradiance [W/m²] high / low</label>
          <input
            value={form.irradianceHighLow}
            onChange={(e) => setTop("irradianceHighLow", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Module temperature [°C] high / low</label>
          <input
            value={form.moduleTempHighLow}
            onChange={(e) => setTop("moduleTempHighLow", e.target.value)}
            className={inputCls}
          />
        </div>
      </section>

      <section className="mt-5 border-t border-slate-200 pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase text-slate-700">
            Temperature coefficients (α, β, δ)
          </h2>
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
        <p className="mb-3 text-[11px] text-slate-500">
          α, β, and δ are entered per sample on the observation sheet (table 07).
        </p>
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`temp-coeff-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Sample {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo}
                    onChange={(e) => setRow(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>α [%/°C]</label>
                  <input
                    value={row.alpha ?? ""}
                    onChange={(e) => setRow(idx, "alpha", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>β [%/°C]</label>
                  <input
                    value={row.beta}
                    onChange={(e) => setRow(idx, "beta", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>δ [%/°C]</label>
                  <input
                    value={row.delta}
                    onChange={(e) => setRow(idx, "delta", e.target.value)}
                    className={inputCls}
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
          value={form.supplementary}
          onChange={(e) => setTop("supplementary", e.target.value)}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>
    </div>
  );
}
