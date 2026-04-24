import { emptyTable10Page21Form } from "../constants/observationPageModel";
import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

const proto = () => emptyTable10Page21Form();

export default function ObservationFormSheetTable10Page21({ value: form, onChange }) {
  const t10 = form.table10 || proto().table10;
  const t102 = form.table102 || proto().table102;
  const t103 = form.table103 || proto().table103;

  const setRoot = (patch) => onChange({ ...form, ...patch });
  const setT10 = (patch) => setRoot({ table10: { ...t10, ...patch } });
  const setT102 = (patch) => setRoot({ table102: { ...t102, ...patch } });
  const setT103 = (patch) => setRoot({ table103: { ...t103, ...patch } });

  const setT10Header = (key, v) => setT10({ header: { ...t10.header, [key]: v } });
  const setT102Header = (key, v) => setT102({ header: { ...t102.header, [key]: v } });
  const setT103Header = (key, v) => setT103({ header: { ...t103.header, [key]: v } });

  const setT10Row = (idx, key, v) => {
    const rows = [...t10.rows];
    rows[idx] = { ...rows[idx], [key]: v };
    setT10({ rows });
  };
  const setT102Row = (idx, key, v) => {
    const rows = [...t102.rows];
    rows[idx] = { ...rows[idx], [key]: v };
    setT102({ rows });
  };
  const setT103Row = (idx, key, v) => {
    const rows = [...t103.rows];
    rows[idx] = { ...rows[idx], [key]: v };
    setT103({ rows });
  };

  const markT10 = useScrollToNewEntry(t10.rows.length, "p21-t10");
  const markT102 = useScrollToNewEntry(t102.rows.length, "p21-t102");
  const markT103 = useScrollToNewEntry(t103.rows.length, "p21-t103");

  const addT10 = () => {
    markT10(t10.rows.length);
    setT10({ rows: [...t10.rows, { ...proto().table10.rows[0] }] });
  };
  const addT102 = () => {
    markT102(t102.rows.length);
    setT102({ rows: [...t102.rows, { ...proto().table102.rows[0] }] });
  };
  const addT103 = () => {
    markT103(t103.rows.length);
    setT103({ rows: [...t103.rows, { ...proto().table103.rows[0] }] });
  };

  const rmLast = (which) => {
    if (which === "t10" && t10.rows.length > 1) setT10({ rows: t10.rows.slice(0, -1) });
    if (which === "t102" && t102.rows.length > 1) setT102({ rows: t102.rows.slice(0, -1) });
    if (which === "t103" && t103.rows.length > 1) setT103({ rows: t103.rows.slice(0, -1) });
  };

  const sectionCls = "rounded-xl border border-slate-200 bg-white p-4 shadow-sm";

  return (
    <div className="space-y-6">
      <section className={sectionCls}>
        <h2 className="mb-1 text-sm font-bold text-slate-900">
          TABLE 10 : MQT 18.2 — Bypass diode functionality test after bypass diode thermal test
        </h2>
        <p className="mb-4 text-sm font-semibold text-slate-700">Method A</p>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Ambient temperature [°C]</label>
            <input
              value={t10.header?.ambientTempC ?? ""}
              onChange={(e) => setT10Header("ambientTempC", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Current flow applied [A]</label>
            <input
              value={t10.header?.currentFlowA ?? ""}
              onChange={(e) => setT10Header("currentFlowA", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase text-slate-700">Rows</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addT10}
              className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={() => rmLast("t10")}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
            >
              − Last
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {t10.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p21-t10-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => setT10Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>VFM</label>
                  <input
                    value={row.vfm ?? ""}
                    onChange={(e) => setT10Row(idx, "vfm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>VFM rated</label>
                  <input
                    value={row.vfmRated ?? ""}
                    onChange={(e) => setT10Row(idx, "vfmRated", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="mb-2 text-xs font-semibold text-slate-700">
                    VFM = (N × VFM<sub>rated</sub>) ± 10%
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.vfmWithinToleranceYes}
                        onChange={(e) => setT10Row(idx, "vfmWithinToleranceYes", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-800">Yes</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.vfmWithinToleranceNo}
                        onChange={(e) => setT10Row(idx, "vfmWithinToleranceNo", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-800">No</span>
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => setT10Row(idx, "result", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t10.supplementary ?? ""}
            onChange={(e) => setT10({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className="mb-1 text-sm font-bold text-slate-900">
          TABLE 10.1 : MQT 19.1 — Final stabilization
        </h2>
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 10.2 : MQT 06.1 — Performance at STC before final stabilization
        </h2>

        <div className="mb-4 flex flex-wrap gap-6">
          <span className="text-sm font-semibold text-slate-800">Test method</span>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!t102.header?.testMethodSolarSimulator}
              onChange={(e) => setT102Header("testMethodSolarSimulator", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-800">Solar simulator</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!t102.header?.testMethodNaturalSunlight}
              onChange={(e) => setT102Header("testMethodNaturalSunlight", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
          </label>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase text-slate-700">Rows</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addT102}
              className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={() => rmLast("t102")}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
            >
              − Last
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {t102.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p21-t102-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => setT102Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Isc [A]</label>
                  <input
                    value={row.isc ?? ""}
                    onChange={(e) => setT102Row(idx, "isc", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Voc [V]</label>
                  <input
                    value={row.voc ?? ""}
                    onChange={(e) => setT102Row(idx, "voc", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Imp [A] (solar simulator)</label>
                  <input
                    value={row.imp ?? ""}
                    onChange={(e) => setT102Row(idx, "imp", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Vmp [V] (solar simulator)</label>
                  <input
                    value={row.vmp ?? ""}
                    onChange={(e) => setT102Row(idx, "vmp", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Pmax [W] (natural sunlight)</label>
                  <input
                    value={row.pmax ?? ""}
                    onChange={(e) => setT102Row(idx, "pmax", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>FF [%]</label>
                  <input
                    value={row.ff ?? ""}
                    onChange={(e) => setT102Row(idx, "ff", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t102.supplementary ?? ""}
            onChange={(e) => setT102({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 10.3 : MQT 19.1 — Final stabilization procedure
        </h2>

        <div className="mb-4 flex flex-wrap gap-6">
          <span className="text-sm font-semibold text-slate-800">Light exposure method</span>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!t103.header?.lightExposureSolar}
              onChange={(e) => setT103Header("lightExposureSolar", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-800">Solar simulator</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!t103.header?.lightExposureNatural}
              onChange={(e) => setT103Header("lightExposureNatural", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
          </label>
        </div>

        <div className="mb-4">
          <label className={labelCls}>
            Stabilization criterion per IS 14286 (Part 1 / Sec 1)
          </label>
          <textarea
            rows={3}
            value={t103.header?.stabilizationCriterion ?? ""}
            onChange={(e) => setT103Header("stabilizationCriterion", e.target.value)}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase text-slate-700">Rows</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addT103}
              className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={() => rmLast("t103")}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
            >
              − Last
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {t103.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p21-t103-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => setT103Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Test cycle</label>
                  <input
                    value={row.testCycle ?? ""}
                    onChange={(e) => setT103Row(idx, "testCycle", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Integrated irradiation [kWh/m²]</label>
                  <input
                    value={row.integratedIrradiationKwhm2 ?? ""}
                    onChange={(e) => setT103Row(idx, "integratedIrradiationKwhm2", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Irradiance [W/m²]</label>
                  <input
                    value={row.irradianceWm2 ?? ""}
                    onChange={(e) => setT103Row(idx, "irradianceWm2", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Module temperature [°C]</label>
                  <input
                    value={row.moduleTempC ?? ""}
                    onChange={(e) => setT103Row(idx, "moduleTempC", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Resistive load</label>
                  <input
                    value={row.resistiveLoad ?? ""}
                    onChange={(e) => setT103Row(idx, "resistiveLoad", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Pmax [W] at the end of cycle</label>
                  <input
                    value={row.pmaxEndCycle ?? ""}
                    onChange={(e) => setT103Row(idx, "pmaxEndCycle", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>(Pmax − Pmin) / Paverage [%]</label>
                  <input
                    value={row.pmaxDeltaPercent ?? ""}
                    onChange={(e) => setT103Row(idx, "pmaxDeltaPercent", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-semibold text-slate-700">Stable</p>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.stableYes}
                        onChange={(e) => setT103Row(idx, "stableYes", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-800">Yes</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.stableNo}
                        onChange={(e) => setT103Row(idx, "stableNo", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-800">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t103.supplementary ?? ""}
            onChange={(e) => setT103({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </section>

      <section className={sectionCls}>
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => setRoot({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </section>
    </div>
  );
}
