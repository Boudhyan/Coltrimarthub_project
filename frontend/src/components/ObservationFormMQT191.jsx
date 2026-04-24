import { emptyMqt191Row } from "../constants/observationPages";
import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

function Mqt191SideFields({ row, rowIdx, sideKey, title, enabled, setSide }) {
  const s = row[sideKey];
  return (
    <>
      <div
        className={`sm:col-span-2 border-t border-slate-200 pt-2 text-[11px] font-semibold uppercase text-slate-500 ${
          !enabled ? "opacity-45" : ""
        }`}
      >
        {title}
      </div>
      <div>
        <label className={labelCls}>Integ. irradiation [kWh/m²]</label>
        <input
          inputMode="decimal"
          value={s.integratedIrradiationKwhm2}
          onChange={(e) =>
            setSide(rowIdx, sideKey, "integratedIrradiationKwhm2", e.target.value)
          }
          disabled={!enabled}
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
      <div>
        <label className={labelCls}>Irradiance [W/m²]</label>
        <input
          inputMode="decimal"
          value={s.irradianceWm2}
          onChange={(e) => setSide(rowIdx, sideKey, "irradianceWm2", e.target.value)}
          disabled={!enabled}
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
      <div>
        <label className={labelCls}>Module temp. [°C]</label>
        <input
          inputMode="decimal"
          value={s.moduleTempC}
          onChange={(e) => setSide(rowIdx, sideKey, "moduleTempC", e.target.value)}
          disabled={!enabled}
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
      <div>
        <label className={labelCls}>Resistive load</label>
        <input
          value={s.resistiveLoad}
          onChange={(e) => setSide(rowIdx, sideKey, "resistiveLoad", e.target.value)}
          disabled={!enabled}
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
      <div>
        <label className={labelCls}>Pmax @ end [W]</label>
        <input
          inputMode="decimal"
          value={s.pmaxEndW}
          onChange={(e) => setSide(rowIdx, sideKey, "pmaxEndW", e.target.value)}
          disabled={!enabled}
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
      <div>
        <label className={labelCls}>(Pmax−Pmin)/Pavg [%]</label>
        <input
          inputMode="decimal"
          value={s.spreadPmaxPminPct}
          onChange={(e) =>
            setSide(rowIdx, sideKey, "spreadPmaxPminPct", e.target.value)
          }
          disabled={!enabled}
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
      <div>
        <label className={labelCls}>Stable (Yes/No)</label>
        <input
          value={s.stableYesNo}
          onChange={(e) => setSide(rowIdx, sideKey, "stableYesNo", e.target.value)}
          disabled={!enabled}
          placeholder="Yes / No"
          className={`${inputCls} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
        />
      </div>
    </>
  );
}

/**
 * TABLE 02.4 / MQT 19.1 — Initial stabilization (PDF page 4 style, mobile cards).
 */
export default function ObservationFormMQT191({ value: form, onChange }) {
  const setField = (path, v) => onChange({ ...form, [path]: v });

  const setSide = (rowIdx, side, field, v) => {
    const rows = [...form.rows];
    rows[rowIdx] = {
      ...rows[rowIdx],
      [side]: { ...rows[rowIdx][side], [field]: v },
    };
    onChange({ ...form, rows });
  };

  const setRowField = (rowIdx, field, v) => {
    const rows = [...form.rows];
    rows[rowIdx] = { ...rows[rowIdx], [field]: v };
    onChange({ ...form, rows });
  };

  const markScroll = useScrollToNewEntry(form.rows.length, "mqt191");
  const addRow = () => {
    markScroll(form.rows.length);
    onChange({ ...form, rows: [...form.rows, emptyMqt191Row()] });
  };

  const removeLastRow = () => {
    if (form.rows.length <= 1) return;
    onChange({ ...form, rows: form.rows.slice(0, -1) });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Light exposure method
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.lightExposureSolar}
              onChange={(e) => setField("lightExposureSolar", e.target.checked)}
              className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-800">Solar simulator</span>
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.lightExposureNatural}
              onChange={(e) => setField("lightExposureNatural", e.target.checked)}
              className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
          </label>
        </div>
      </section>

      <section className="mt-4">
        <label className={labelCls}>
          Stabilization criterion per IS 14286 (Part 1 / Sec …)
        </label>
        <input
          type="text"
          value={form.stabilizationCriterion}
          onChange={(e) => setField("stabilizationCriterion", e.target.value)}
          className={inputCls}
          placeholder="e.g. section reference…"
        />
      </section>

      <section className="mt-5 border-t border-slate-200 pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase text-slate-700">Test cycles</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addRow}
              className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={removeLastRow}
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
              data-obs-entry={`mqt191-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Entry {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo}
                    onChange={(e) => setRowField(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Test cycle</label>
                  <input
                    value={row.testCycle}
                    onChange={(e) => setRowField(idx, "testCycle", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <Mqt191SideFields
                  row={row}
                  rowIdx={idx}
                  sideKey="solar"
                  title="Solar simulator"
                  enabled={form.lightExposureSolar}
                  setSide={setSide}
                />
                <Mqt191SideFields
                  row={row}
                  rowIdx={idx}
                  sideKey="natural"
                  title="Natural sunlight"
                  enabled={form.lightExposureNatural}
                  setSide={setSide}
                />
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
          onChange={(e) => setField("supplementary", e.target.value)}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>
    </div>
  );
}
