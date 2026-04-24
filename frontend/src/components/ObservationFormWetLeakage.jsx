import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

const emptyRow = () => ({
  sampleNo: "",
  requiredMohm: "",
  measuredMohm: "",
  result: "",
});

/** PDF table titles + second-column label (Measured / Limit / Required per sheet). */
const WET_VARIANT_META = {
  table142: {
    title:
      "TABLE 14.2: MQT 15 — Wet leakage current test after thermal cycling 50 test",
    limitLabel: "Required resistance [MΩ]",
  },
  table152: {
    title:
      "TABLE 15.2: MQT 15 — Wet leakage current test after humidity freeze 10 test",
    limitLabel: "Limit [MΩ]",
  },
  table162: {
    title:
      "TABLE 16.2: MQT 15 — Wet leakage current test after retention of junction box on mounting surface",
    limitLabel: "Limit [MΩ]",
  },
  table172: {
    title:
      "TABLE 17.2: MQT 15 — Wet leakage current test after thermal cycling 200 test",
    limitLabel: "Limit [MΩ]",
  },
  table182: {
    title:
      "TABLE 18.2: MQT 15 — Wet leakage current test after damp heat 1000 test",
    limitLabel: "Limit [MΩ]",
  },
  table192: {
    title:
      "TABLE 19.2: MQT 15 — Wet leakage current test after static mechanical load test",
    limitLabel: "Limit [MΩ]",
  },
  table212: {
    title:
      "TABLE 21.2: MQT 15 — Wet leakage current test after hail impact test",
    limitLabel: "Required resistance [MΩ]",
  },
  table222: {
    title:
      "TABLE 22.2: MQT 15 — Wet leakage current test after potential induced degradation test",
    limitLabel: "Required resistance [MΩ]",
  },
  table2310: {
    title: "TABLE 23.10: MQT 15 — Final wet leakage current test",
    limitLabel: "Limit [MΩ]",
  },
};

export default function ObservationFormWetLeakage({ value: form, onChange, variant }) {
  const meta = variant ? WET_VARIANT_META[variant] : null;
  const setTop = (k, v) => onChange({ ...form, [k]: v });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    onChange({ ...form, rows });
  };
  const markScroll = useScrollToNewEntry(form.rows.length, "wet-leak");
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
      {meta?.title ? (
        <h2 className="mb-4 text-sm font-bold leading-snug text-slate-900">{meta.title}</h2>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Test voltage applied [V]</label>
          <input
            value={form.testVoltage}
            onChange={(e) => setTop("testVoltage", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Solution temperature [°C]</label>
          <input
            value={form.solutionTemp}
            onChange={(e) => setTop("solutionTemp", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Solution resistivity [Ω·cm]</label>
          <input
            value={form.solutionResistivity}
            onChange={(e) => setTop("solutionResistivity", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Size of module [m²]</label>
          <input
            value={form.moduleSize}
            onChange={(e) => setTop("moduleSize", e.target.value)}
            className={inputCls}
          />
        </div>
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
              data-obs-entry={`wet-leak-${idx}`}
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
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm}
                    onChange={(e) => setRow(idx, "measuredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    {meta?.limitLabel ?? "Required resistance [MΩ]"}
                  </label>
                  <input
                    value={row.requiredMohm}
                    onChange={(e) => setRow(idx, "requiredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result}
                    onChange={(e) => setRow(idx, "result", e.target.value)}
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
