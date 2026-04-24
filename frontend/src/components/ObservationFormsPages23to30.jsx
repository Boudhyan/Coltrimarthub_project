import { useEffect, useRef } from "react";
import { inputCls, labelCls } from "../observation/formStyles";

function Section({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-sm font-bold leading-snug text-slate-900">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

function RowControls({ onAdd, onRemoveLast, label = "Rows", scrollPrefix, rowCount }) {
  const pendingIdx = useRef(null);
  useEffect(() => {
    if (!scrollPrefix || pendingIdx.current === null) return;
    const idx = pendingIdx.current;
    pendingIdx.current = null;
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-obs-entry="${scrollPrefix}-${idx}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [rowCount, scrollPrefix]);

  const handleAdd = () => {
    if (scrollPrefix != null && typeof rowCount === "number") {
      pendingIdx.current = rowCount;
    }
    onAdd();
  };

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-bold uppercase text-slate-700">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
        >
          + Row
        </button>
        <button
          type="button"
          onClick={onRemoveLast}
          className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
        >
          − Last
        </button>
      </div>
    </div>
  );
}

/** PDF page 23 — TABLE 11.3 + 11.4 */
export function ObservationFormPage23({ value: form, onChange }) {
  const t113 = form.table113;
  const t114 = form.table114;
  const set = (patch) => onChange({ ...form, ...patch });
  const set113 = (patch) => set({ table113: { ...t113, ...patch } });
  const set114 = (patch) => set({ table114: { ...t114, ...patch } });
  const set113Row = (i, k, v) => {
    const rows = [...t113.rows];
    rows[i] = { ...rows[i], [k]: v };
    set113({ rows });
  };
  const set114Row = (i, k, v) => {
    const rows = [...t114.rows];
    rows[i] = { ...rows[i], [k]: v };
    set114({ rows });
  };
  const emptyV = () => ({ sampleNo: "", findings: "" });
  const emptyS = () => ({
    sampleNo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    pmax: "",
    ff: "",
  });

  return (
    <div className="space-y-6">
      <Section title="TABLE 11.3: MQT 01 — Visual inspection after hot-spot endurance test">
        <div className="mb-4">
          <label className={labelCls}>Test date [YYYY-MM-DD]</label>
          <input
            value={t113.testDate ?? ""}
            onChange={(e) => set113({ testDate: e.target.value })}
            className={inputCls}
          />
        </div>
        <RowControls
          scrollPrefix="p23-t113"
          rowCount={t113.rows.length}
          onAdd={() => set113({ rows: [...t113.rows, emptyV()] })}
          onRemoveLast={() =>
            t113.rows.length > 1 && set113({ rows: t113.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t113.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p23-t113-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set113Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Nature and position of initial findings — comments or attach photos
                  </label>
                  <textarea
                    rows={3}
                    value={row.findings ?? ""}
                    onChange={(e) => set113Row(idx, "findings", e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
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
            value={t113.supplementary ?? ""}
            onChange={(e) => set113({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 11.4: MQT 02 — Maximum power determination after hot-spot endurance test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Module temperature [°C]</label>
            <input
              value={t114.header?.moduleTempC ?? ""}
              onChange={(e) =>
                set114({ header: { ...t114.header, moduleTempC: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Irradiance [W/m²]</label>
            <input
              value={t114.header?.irradianceWm2 ?? ""}
              onChange={(e) =>
                set114({ header: { ...t114.header, irradianceWm2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p23-t114"
          rowCount={t114.rows.length}
          onAdd={() => set114({ rows: [...t114.rows, emptyS()] })}
          onRemoveLast={() =>
            t114.rows.length > 1 && set114({ rows: t114.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t114.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p23-t114-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["sampleNo", "Sample #"],
                  ["isc", "Isc [A]"],
                  ["voc", "Voc [V]"],
                  ["imp", "Imp [A]"],
                  ["vmp", "Vmp [V]"],
                  ["pmax", "Pmax [W]"],
                  ["ff", "FF [%]"],
                ].map(([k, lab]) => (
                  <div key={k}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => set114Row(idx, k, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t114.supplementary ?? ""}
            onChange={(e) => set114({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}

/** PDF page 24 — TABLE 11.5 + 11.6 */
export function ObservationFormPage24({ value: form, onChange }) {
  const t115 = form.table115;
  const t116 = form.table116;
  const set = (patch) => onChange({ ...form, ...patch });
  const set115 = (patch) => set({ table115: { ...t115, ...patch } });
  const set116 = (patch) => set({ table116: { ...t116, ...patch } });
  const emptyS = () => ({
    sampleNo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    pmax: "",
    ff: "",
  });
  const emptyIns = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    breakdownYesDescription: "",
    breakdownNo: false,
  });
  const set115Row = (i, k, v) => {
    const rows = [...t115.rows];
    rows[i] = { ...rows[i], [k]: v };
    set115({ rows });
  };
  const set116Row = (i, k, v) => {
    const rows = [...t116.rows];
    rows[i] = { ...rows[i], [k]: v };
    set116({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 11.5: MQT 02 — Maximum power determination after hot-spot endurance test (at BNPI)">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Module temperature [°C]</label>
            <input
              value={t115.header?.moduleTempC ?? ""}
              onChange={(e) =>
                set115({ header: { ...t115.header, moduleTempC: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Irradiance [W/m²]</label>
            <input
              value={t115.header?.irradianceWm2 ?? ""}
              onChange={(e) =>
                set115({ header: { ...t115.header, irradianceWm2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p24-t115"
          rowCount={t115.rows.length}
          onAdd={() => set115({ rows: [...t115.rows, emptyS()] })}
          onRemoveLast={() =>
            t115.rows.length > 1 && set115({ rows: t115.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t115.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p24-t115-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["sampleNo", "Sample #"],
                  ["isc", "Isc [A]"],
                  ["voc", "Voc [V]"],
                  ["imp", "Imp [A]"],
                  ["vmp", "Vmp [V]"],
                  ["pmax", "Pmax [W]"],
                  ["ff", "FF [%]"],
                ].map(([k, lab]) => (
                  <div key={k}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => set115Row(idx, k, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t115.supplementary ?? ""}
            onChange={(e) => set115({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 11.6: MQT 03 — Insulation test after hot-spot endurance test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Test voltage applied [V]</label>
            <input
              value={t116.header?.testVoltage ?? ""}
              onChange={(e) =>
                set116({ header: { ...t116.header, testVoltage: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Size of module [m²]</label>
            <input
              value={t116.header?.moduleSizeM2 ?? ""}
              onChange={(e) =>
                set116({ header: { ...t116.header, moduleSizeM2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Required resistance [MΩ]</label>
            <input
              value={t116.header?.requiredResistanceMohm ?? ""}
              onChange={(e) =>
                set116({ header: { ...t116.header, requiredResistanceMohm: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p24-t116"
          rowCount={t116.rows.length}
          onAdd={() => set116({ rows: [...t116.rows, emptyIns()] })}
          onRemoveLast={() =>
            t116.rows.length > 1 && set116({ rows: t116.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t116.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p24-t116-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set116Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm ?? ""}
                    onChange={(e) => set116Row(idx, "measuredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Required [MΩ]</label>
                  <input
                    value={row.requiredMohm ?? ""}
                    onChange={(e) => set116Row(idx, "requiredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Dielectric breakdown — Yes (description)</label>
                  <textarea
                    rows={2}
                    value={row.breakdownYesDescription ?? ""}
                    onChange={(e) => set116Row(idx, "breakdownYesDescription", e.target.value)}
                    className={`${inputCls} min-h-[4rem] resize-y`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!row.breakdownNo}
                      onChange={(e) => set116Row(idx, "breakdownNo", e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-800">Dielectric breakdown — No</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t116.supplementary ?? ""}
            onChange={(e) => set116({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}

/** PDF page 25 — TABLE 11.7 + 11.8 */
export function ObservationFormPage25({ value: form, onChange }) {
  const t117 = form.table117;
  const t118a = form.table118a;
  const t118b = form.table118b;
  const set = (patch) => onChange({ ...form, ...patch });
  const set117 = (patch) => set({ table117: { ...t117, ...patch } });
  const set118a = (patch) => set({ table118a: { ...t118a, ...patch } });
  const set118b = (patch) => set({ table118b: { ...t118b, ...patch } });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const emptyVfm = () => ({
    sampleNo: "",
    vfm: "",
    vfmRated: "",
    vfmWithinToleranceYes: false,
    vfmWithinToleranceNo: false,
    result: "",
  });
  const emptyB = () => ({ sampleNo: "", ivCurveAfterShading: "", result: "" });
  const set117Row = (i, k, v) => {
    const rows = [...t117.rows];
    rows[i] = { ...rows[i], [k]: v };
    set117({ rows });
  };
  const set118aRow = (i, k, v) => {
    const rows = [...t118a.rows];
    rows[i] = { ...rows[i], [k]: v };
    set118a({ rows });
  };
  const set118bRow = (i, k, v) => {
    const rows = [...t118b.rows];
    rows[i] = { ...rows[i], [k]: v };
    set118b({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 11.7: MQT 15 — Wet leakage current test after hot-spot endurance test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Test voltage applied [V]</label>
            <input
              value={t117.header?.testVoltage ?? ""}
              onChange={(e) =>
                set117({ header: { ...t117.header, testVoltage: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution temperature [°C]</label>
            <input
              value={t117.header?.solutionTemp ?? ""}
              onChange={(e) =>
                set117({ header: { ...t117.header, solutionTemp: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Size of module [m²]</label>
            <input
              value={t117.header?.moduleSizeM2 ?? ""}
              onChange={(e) =>
                set117({ header: { ...t117.header, moduleSizeM2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution resistivity [Ω·cm]</label>
            <input
              value={t117.header?.solutionResistivity ?? ""}
              onChange={(e) =>
                set117({ header: { ...t117.header, solutionResistivity: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p25-t117"
          rowCount={t117.rows.length}
          onAdd={() => set117({ rows: [...t117.rows, emptyW()] })}
          onRemoveLast={() =>
            t117.rows.length > 1 && set117({ rows: t117.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t117.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p25-t117-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set117Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm ?? ""}
                    onChange={(e) => set117Row(idx, "measuredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Limit [MΩ]</label>
                  <input
                    value={row.requiredMohm ?? ""}
                    onChange={(e) => set117Row(idx, "requiredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => set117Row(idx, "result", e.target.value)}
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
            value={t117.supplementary ?? ""}
            onChange={(e) => set117({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 11.8: MQT 18.2 — Bypass diode functionality test after hot-spot endurance test">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Method A</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Ambient temperature [°C]</label>
            <input
              value={t118a.header?.ambientTempC ?? ""}
              onChange={(e) =>
                set118a({ header: { ...t118a.header, ambientTempC: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Current flow applied [A]</label>
            <input
              value={t118a.header?.currentFlowA ?? ""}
              onChange={(e) =>
                set118a({ header: { ...t118a.header, currentFlowA: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p25-t118a"
          rowCount={t118a.rows.length}
          onAdd={() => set118a({ rows: [...t118a.rows, emptyVfm()] })}
          onRemoveLast={() =>
            t118a.rows.length > 1 && set118a({ rows: t118a.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t118a.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p25-t118a-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set118aRow(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>VFM</label>
                  <input
                    value={row.vfm ?? ""}
                    onChange={(e) => set118aRow(idx, "vfm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>VFM rated</label>
                  <input
                    value={row.vfmRated ?? ""}
                    onChange={(e) => set118aRow(idx, "vfmRated", e.target.value)}
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
                        onChange={(e) => set118aRow(idx, "vfmWithinToleranceYes", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.vfmWithinToleranceNo}
                        onChange={(e) => set118aRow(idx, "vfmWithinToleranceNo", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => set118aRow(idx, "result", e.target.value)}
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
            value={t118a.supplementary ?? ""}
            onChange={(e) => set118a({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>

        <h3 className="mb-3 mt-8 text-sm font-semibold text-slate-800">Method B</h3>
        <RowControls
          scrollPrefix="p25-t118b"
          rowCount={t118b.rows.length}
          onAdd={() => set118b({ rows: [...t118b.rows, emptyB()] })}
          onRemoveLast={() =>
            t118b.rows.length > 1 && set118b({ rows: t118b.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t118b.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p25-t118b-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set118bRow(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>IV curve after shading</label>
                  <textarea
                    rows={3}
                    value={row.ivCurveAfterShading ?? ""}
                    onChange={(e) => set118bRow(idx, "ivCurveAfterShading", e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => set118bRow(idx, "result", e.target.value)}
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
            value={t118b.supplementary ?? ""}
            onChange={(e) => set118b({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}

/** PDF page 26 — TABLE 12.1 + 12.2 */
export function ObservationFormPage26({ value: form, onChange }) {
  const t121 = form.table121;
  const t122 = form.table122;
  const set = (patch) => onChange({ ...form, ...patch });
  const set121 = (patch) => set({ table121: { ...t121, ...patch } });
  const set122 = (patch) => set({ table122: { ...t122, ...patch } });

  const uvBlock = (label, t, setT) => (
    <Section title={label}>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Module temperature [°C]</label>
          <input
            value={t.header?.moduleTempC ?? ""}
            onChange={(e) =>
              setT({ header: { ...t.header, moduleTempC: e.target.value } })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>UV irradiance (280–400 nm) [W/m²]</label>
          <input
            value={t.header?.uvIrradiance280_400 ?? ""}
            onChange={(e) =>
              setT({ header: { ...t.header, uvIrradiance280_400: e.target.value } })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>UV dose (280–320 nm) [kWh/m²]</label>
          <input
            value={t.header?.uvDose280_320 ?? ""}
            onChange={(e) =>
              setT({ header: { ...t.header, uvDose280_320: e.target.value } })
            }
            className={inputCls}
          />
        </div>
      </div>
      <p className="mb-2 text-sm font-semibold text-slate-800">Module operation condition</p>
      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={!!t.header?.shortCircuited}
            onChange={(e) =>
              setT({ header: { ...t.header, shortCircuited: e.target.checked } })
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm font-medium">Short circuited</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={!!t.header?.openCircuited}
            onChange={(e) =>
              setT({ header: { ...t.header, openCircuited: e.target.checked } })
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm font-medium">Open circuited</span>
        </label>
      </div>
      <div className="mt-4">
        <label className={labelCls}>Supplementary information</label>
        <textarea
          rows={3}
          value={t.supplementary ?? ""}
          onChange={(e) => setT({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </div>
    </Section>
  );

  return (
    <div className="space-y-6">
      {uvBlock(
        "TABLE 12.1: MQT 10 — UV preconditioning test (Frontside)",
        t121,
        set121,
      )}
      {uvBlock(
        "TABLE 12.2: MQT 10 — UV preconditioning test (Backside)",
        t122,
        set122,
      )}
      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}

/** PDF page 27 — TABLE 12.3 + 12.4 */
export function ObservationFormPage27({ value: form, onChange }) {
  const t123 = form.table123;
  const t124 = form.table124;
  const set = (patch) => onChange({ ...form, ...patch });
  const set123 = (patch) => set({ table123: { ...t123, ...patch } });
  const set124 = (patch) => set({ table124: { ...t124, ...patch } });
  const emptyV = () => ({ sampleNo: "", findings: "" });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set123Row = (i, k, v) => {
    const rows = [...t123.rows];
    rows[i] = { ...rows[i], [k]: v };
    set123({ rows });
  };
  const set124Row = (i, k, v) => {
    const rows = [...t124.rows];
    rows[i] = { ...rows[i], [k]: v };
    set124({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 12.3: MQT 01 — Visual inspection after UV preconditioning test">
        <RowControls
          scrollPrefix="p27-t123"
          rowCount={t123.rows.length}
          onAdd={() => set123({ rows: [...t123.rows, emptyV()] })}
          onRemoveLast={() =>
            t123.rows.length > 1 && set123({ rows: t123.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t123.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p27-t123-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set123Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Nature and position of initial findings — comments or attach photos
                  </label>
                  <textarea
                    rows={3}
                    value={row.findings ?? ""}
                    onChange={(e) => set123Row(idx, "findings", e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
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
            value={t123.supplementary ?? ""}
            onChange={(e) => set123({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 12.4: MQT 15 — Wet leakage current test after UV preconditioning test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Test voltage applied [V]</label>
            <input
              value={t124.header?.testVoltage ?? ""}
              onChange={(e) =>
                set124({ header: { ...t124.header, testVoltage: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution temperature [°C]</label>
            <input
              value={t124.header?.solutionTemp ?? ""}
              onChange={(e) =>
                set124({ header: { ...t124.header, solutionTemp: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Size of module [m²]</label>
            <input
              value={t124.header?.moduleSizeM2 ?? ""}
              onChange={(e) =>
                set124({ header: { ...t124.header, moduleSizeM2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution resistivity [Ω·cm]</label>
            <input
              value={t124.header?.solutionResistivity ?? ""}
              onChange={(e) =>
                set124({ header: { ...t124.header, solutionResistivity: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p27-t124"
          rowCount={t124.rows.length}
          onAdd={() => set124({ rows: [...t124.rows, emptyW()] })}
          onRemoveLast={() =>
            t124.rows.length > 1 && set124({ rows: t124.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t124.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p27-t124-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set124Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm ?? ""}
                    onChange={(e) => set124Row(idx, "measuredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Required resistance [MΩ]</label>
                  <input
                    value={row.requiredMohm ?? ""}
                    onChange={(e) => set124Row(idx, "requiredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => set124Row(idx, "result", e.target.value)}
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
            value={t124.supplementary ?? ""}
            onChange={(e) => set124({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}

/** PDF page 28 — TABLE 13 + 13.1 + 13.2 */
export function ObservationFormPage28({ value: form, onChange }) {
  const t13 = form.table13;
  const t131 = form.table131;
  const t132 = form.table132;
  const set = (patch) => onChange({ ...form, ...patch });
  const set13 = (patch) => set({ table13: { ...t13, ...patch } });
  const set131 = (patch) => set({ table131: { ...t131, ...patch } });
  const set132 = (patch) => set({ table132: { ...t132, ...patch } });
  const emptyM = () => ({
    sampleNo: "",
    moduleTempC: "",
    maxPressurePa: "",
    pressureTolerancePa: "",
    monitorCurrentA: "",
    ratePerMin: "",
    numCycles: "",
    pressureProvider: "",
    cellBrokenNot: "",
    currentContinuous: "",
  });
  const emptyV = () => ({ sampleNo: "", findings: "" });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set13Row = (i, k, v) => {
    const rows = [...t13.rows];
    rows[i] = { ...rows[i], [k]: v };
    set13({ rows });
  };
  const set131Row = (i, k, v) => {
    const rows = [...t131.rows];
    rows[i] = { ...rows[i], [k]: v };
    set131({ rows });
  };
  const set132Row = (i, k, v) => {
    const rows = [...t132.rows];
    rows[i] = { ...rows[i], [k]: v };
    set132({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 13: MQT 20 — Cyclic (dynamic) mechanical load test">
        <RowControls
          scrollPrefix="p28-t13"
          rowCount={t13.rows.length}
          onAdd={() => set13({ rows: [...t13.rows, emptyM()] })}
          onRemoveLast={() =>
            t13.rows.length > 1 && set13({ rows: t13.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t13.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p28-t13-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["sampleNo", "Sample #"],
                  ["moduleTempC", "Temperature of tested module [°C]"],
                  ["maxPressurePa", "Maximum pressure [Pa]"],
                  ["pressureTolerancePa", "Pressure tolerance [Pa]"],
                  ["monitorCurrentA", "Monitoring current [A]"],
                  ["ratePerMin", "Rate per minute (cycles)"],
                  ["numCycles", "Number of cycles"],
                  ["pressureProvider", "Pressure provider (air pressure or vacuum)"],
                  ["cellBrokenNot", "Cell and a live part broken / not"],
                  ["currentContinuous", "Current continuous (continuous / disconnection occurred)"],
                ].map(([k, lab]) => (
                  <div key={k} className={k === "currentContinuous" ? "sm:col-span-2" : ""}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => set13Row(idx, k, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t13.supplementary ?? ""}
            onChange={(e) => set13({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 13.1: MQT 01 — Visual inspection after cyclic (dynamic) mechanical load test">
        <RowControls
          scrollPrefix="p28-t131"
          rowCount={t131.rows.length}
          onAdd={() => set131({ rows: [...t131.rows, emptyV()] })}
          onRemoveLast={() =>
            t131.rows.length > 1 && set131({ rows: t131.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t131.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p28-t131-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set131Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Nature and position of initial findings — comments or attach photos
                  </label>
                  <textarea
                    rows={3}
                    value={row.findings ?? ""}
                    onChange={(e) => set131Row(idx, "findings", e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
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
            value={t131.supplementary ?? ""}
            onChange={(e) => set131({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 13.2: MQT 15 — Wet leakage current test after cyclic (dynamic) mechanical load test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Test voltage applied [V]</label>
            <input
              value={t132.header?.testVoltage ?? ""}
              onChange={(e) =>
                set132({ header: { ...t132.header, testVoltage: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution temperature [°C]</label>
            <input
              value={t132.header?.solutionTemp ?? ""}
              onChange={(e) =>
                set132({ header: { ...t132.header, solutionTemp: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Size of module [m²]</label>
            <input
              value={t132.header?.moduleSizeM2 ?? ""}
              onChange={(e) =>
                set132({ header: { ...t132.header, moduleSizeM2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution resistivity [Ω·cm]</label>
            <input
              value={t132.header?.solutionResistivity ?? ""}
              onChange={(e) =>
                set132({ header: { ...t132.header, solutionResistivity: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p28-t132"
          rowCount={t132.rows.length}
          onAdd={() => set132({ rows: [...t132.rows, emptyW()] })}
          onRemoveLast={() =>
            t132.rows.length > 1 && set132({ rows: t132.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t132.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p28-t132-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set132Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm ?? ""}
                    onChange={(e) => set132Row(idx, "measuredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Required resistance [MΩ]</label>
                  <input
                    value={row.requiredMohm ?? ""}
                    onChange={(e) => set132Row(idx, "requiredMohm", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => set132Row(idx, "result", e.target.value)}
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
            value={t132.supplementary ?? ""}
            onChange={(e) => set132({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}

/** PDF page 29 — TABLE 14 + 14.1 */
export function ObservationFormPage29({ value: form, onChange }) {
  const t14 = form.table14;
  const t141 = form.table141;
  const set = (patch) => onChange({ ...form, ...patch });
  const set14 = (patch) => set({ table14: { ...t14, ...patch } });
  const set141 = (patch) => set({ table141: { ...t141, ...patch } });
  const emptyTc = () => ({
    sampleNo: "",
    openCircuitYes: false,
    openCircuitNo: false,
  });
  const emptyV = () => ({ sampleNo: "", findings: "" });
  const set14Row = (i, k, v) => {
    const rows = [...t14.rows];
    rows[i] = { ...rows[i], [k]: v };
    set14({ rows });
  };
  const set141Row = (i, k, v) => {
    const rows = [...t141.rows];
    rows[i] = { ...rows[i], [k]: v };
    set141({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 14: MQT 11 — Thermal cycling 50 test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["totalCycles50", "Total cycles (50)"],
            ["weightN", "Weight attached [N]"],
            ["appliedCurrentA", "Applied current [A]"],
            ["dwellHigh", "Dwell time at high temperature"],
            ["dwellLow", "Dwell time at low temperature"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t14.header?.[k] ?? ""}
                onChange={(e) =>
                  set14({ header: { ...t14.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p29-t14"
          rowCount={t14.rows.length}
          onAdd={() => set14({ rows: [...t14.rows, emptyTc()] })}
          onRemoveLast={() =>
            t14.rows.length > 1 && set14({ rows: t14.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t14.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p29-t14-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set14Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-semibold text-slate-700">Open circuits</p>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.openCircuitYes}
                        onChange={(e) => set14Row(idx, "openCircuitYes", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!row.openCircuitNo}
                        onChange={(e) => set14Row(idx, "openCircuitNo", e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm font-medium">No</span>
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
            value={t14.supplementary ?? ""}
            onChange={(e) => set14({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="TABLE 14.1: MQT 01 — Visual inspection after thermal cycling 50 test">
        <RowControls
          scrollPrefix="p29-t141"
          rowCount={t141.rows.length}
          onAdd={() => set141({ rows: [...t141.rows, emptyV()] })}
          onRemoveLast={() =>
            t141.rows.length > 1 && set141({ rows: t141.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t141.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p29-t141-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set141Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Nature and position of initial findings — comments or attach photos
                  </label>
                  <textarea
                    rows={3}
                    value={row.findings ?? ""}
                    onChange={(e) => set141Row(idx, "findings", e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
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
            value={t141.supplementary ?? ""}
            onChange={(e) => set141({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={3}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </Section>
    </div>
  );
}
