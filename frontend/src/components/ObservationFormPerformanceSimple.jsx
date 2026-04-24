import { emptySampleRow } from "../constants/observationPages";
import { defaultSimplePerformanceForm } from "../constants/observationPageModel";
import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

/** Low-irradiance style: Isc, Voc, Imp, Vmp, Pmax, FF, result (one block per sample). */
export default function ObservationFormPerformanceSimple({
  value,
  onChange,
  showMq07Equipment = false,
}) {
  const d = defaultSimplePerformanceForm();
  const form =
    value && typeof value === "object"
      ? { ...d, ...value, samples: value.samples ?? d.samples }
      : d;

  const setField = (k, v) => onChange({ ...form, [k]: v });

  const setSample = (i, field, v) => {
    const samples = [...form.samples];
    samples[i] = { ...samples[i], [field]: v };
    onChange({ ...form, samples });
  };

  const markScrollSample = useScrollToNewEntry(form.samples.length, "perf-simple");

  const solarOn = form.solarSimulatorUsed;
  const naturalOn = form.naturalSunlightUsed;
  const gateSolar = showMq07Equipment && !solarOn;
  /** Align with MQT 06.1: Pmax/FF when either solar simulator or natural is selected. */
  const gatePmaxFf = showMq07Equipment && !solarOn && !naturalOn;

  const add = () => {
    markScrollSample(form.samples.length);
    onChange({ ...form, samples: [...form.samples, emptySampleRow()] });
  };

  const removeLast = () => {
    if (form.samples.length <= 1) return;
    onChange({ ...form, samples: form.samples.slice(0, -1) });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <section>
        <label className={labelCls}>Test method</label>
        <input
          value={form.testMethod}
          onChange={(e) => setField("testMethod", e.target.value)}
          className={`${inputCls} mb-4`}
          placeholder="Test method…"
        />
      </section>

      {showMq07Equipment ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-800">
            Conditions (as on sheet)
          </p>
          <div className="mb-4">
            <label className={labelCls}>Irradiance level [W/m²]</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.irradianceLevelWm2 ?? ""}
              onChange={(e) => setField("irradianceLevelWm2", e.target.value)}
              className={inputCls}
              placeholder="e.g. 200"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={solarOn}
                onChange={(e) => setField("solarSimulatorUsed", e.target.checked)}
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-800">Solar simulator</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={naturalOn}
                onChange={(e) => setField("naturalSunlightUsed", e.target.checked)}
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
            </label>
          </div>
          <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Module temperature [°C]</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.moduleTempC ?? ""}
                onChange={(e) => setField("moduleTempC", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Ambient temperature [°C]</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.ambientTempC ?? ""}
                onChange={(e) => setField("ambientTempC", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:flex-wrap sm:gap-6">
              <label className="flex min-h-11 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.pulsedSimulator}
                  onChange={(e) => setField("pulsedSimulator", e.target.checked)}
                  className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800">Pulsed simulator</span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.steadyStateSimulator}
                  onChange={(e) => setField("steadyStateSimulator", e.target.checked)}
                  className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800">Steady-state simulator</span>
              </label>
            </div>
          </div>
        </section>
      ) : null}

      <section
        className={`border-t border-slate-200 pt-4 ${showMq07Equipment ? "mt-4" : "mt-2"}`}
      >
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
          {form.samples.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`perf-simple-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Sample {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => setSample(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Isc [A]</label>
                  <input
                    inputMode="decimal"
                    value={row.isc ?? ""}
                    onChange={(e) => setSample(idx, "isc", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Voc [V]</label>
                  <input
                    inputMode="decimal"
                    value={row.voc ?? ""}
                    onChange={(e) => setSample(idx, "voc", e.target.value)}
                    className={inputCls}
                  />
                </div>
                {showMq07Equipment ? (
                  <div
                    className={`sm:col-span-2 border-t border-slate-200 pt-2 text-[11px] font-semibold uppercase text-slate-500 ${
                      gateSolar ? "opacity-45" : ""
                    }`}
                  >
                    Solar simulator
                  </div>
                ) : null}
                <div>
                  <label className={labelCls}>Imp [A]</label>
                  <input
                    inputMode="decimal"
                    value={row.solarImp ?? ""}
                    onChange={(e) => setSample(idx, "solarImp", e.target.value)}
                    disabled={gateSolar}
                    className={`${inputCls} ${gateSolar ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Vmp [V]</label>
                  <input
                    inputMode="decimal"
                    value={row.solarVmp ?? ""}
                    onChange={(e) => setSample(idx, "solarVmp", e.target.value)}
                    disabled={gateSolar}
                    className={`${inputCls} ${gateSolar ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>
                {showMq07Equipment ? (
                  <div
                    className={`sm:col-span-2 border-t border-slate-200 pt-2 text-[11px] font-semibold uppercase text-slate-500 ${
                      gatePmaxFf ? "opacity-45" : ""
                    }`}
                  >
                    Pmax / FF (STC)
                  </div>
                ) : null}
                <div>
                  <label className={labelCls}>Pmax [W]</label>
                  <input
                    inputMode="decimal"
                    value={row.naturalPmax ?? ""}
                    onChange={(e) => setSample(idx, "naturalPmax", e.target.value)}
                    disabled={gatePmaxFf}
                    className={`${inputCls} ${gatePmaxFf ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>FF [%]</label>
                  <input
                    inputMode="decimal"
                    value={row.naturalFf ?? ""}
                    onChange={(e) => setSample(idx, "naturalFf", e.target.value)}
                    disabled={gatePmaxFf}
                    className={`${inputCls} ${gatePmaxFf ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => setSample(idx, "result", e.target.value)}
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
          value={form.supplementary ?? ""}
          onChange={(e) => setField("supplementary", e.target.value)}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>
    </div>
  );
}
