import { useEffect, useRef } from "react";
import { inputCls, labelCls } from "../observation/formStyles";

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {title ? (
        <h2 className="mb-4 text-sm font-bold leading-snug text-slate-900">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

function RowControls({ onAdd, onRemoveLast, scrollPrefix, rowCount }) {
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
      <p className="text-xs font-bold uppercase text-slate-700">Rows</p>
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

function OpenCircuitRow({ row, idx, setRow }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={labelCls}>Sample #</label>
        <input
          value={row.sampleNo ?? ""}
          onChange={(e) => setRow(idx, "sampleNo", e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-semibold text-slate-700">Open circuits (yes/no)</p>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!row.openCircuitYes}
              onChange={(e) => setRow(idx, "openCircuitYes", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium">Yes</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!row.openCircuitNo}
              onChange={(e) => setRow(idx, "openCircuitNo", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium">No</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function VisualBlock({ title, table, setTable, emptyRow, scrollPrefix }) {
  const setRow = (i, k, v) => {
    const rows = [...table.rows];
    rows[i] = { ...rows[i], [k]: v };
    setTable({ rows });
  };
  return (
    <Section title={title}>
      <RowControls
        scrollPrefix={scrollPrefix}
        rowCount={table.rows.length}
        onAdd={() => setTable({ rows: [...table.rows, emptyRow()] })}
        onRemoveLast={() =>
          table.rows.length > 1 && setTable({ rows: table.rows.slice(0, -1) })
        }
      />
      <div className="space-y-4">
        {table.rows.map((row, idx) => (
          <div
            key={idx}
            data-obs-entry={`${scrollPrefix}-${idx}`}
            className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
          >
            <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
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
                  Nature and position of initial findings — comments or attach photos
                </label>
                <textarea
                  rows={3}
                  value={row.findings ?? ""}
                  onChange={(e) => setRow(idx, "findings", e.target.value)}
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
          value={table.supplementary ?? ""}
          onChange={(e) => setTable({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </div>
    </Section>
  );
}

/** PDF page 31 */
export function ObservationFormPage31({ value: form, onChange }) {
  const t15 = form.table15;
  const t151 = form.table151;
  const t152 = form.table152;
  const set = (p) => onChange({ ...form, ...p });
  const set15 = (p) => set({ table15: { ...t15, ...p } });
  const set151 = (p) => set({ table151: { ...t151, ...p } });
  const set152 = (p) => set({ table152: { ...t152, ...p } });
  const emptyOc = () => ({ sampleNo: "", openCircuitYes: false, openCircuitNo: false });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set15Row = (i, k, v) => {
    const rows = [...t15.rows];
    rows[i] = { ...rows[i], [k]: v };
    set15({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 15: MQT 12 — Humidity freeze 10 test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["totalCycles10", "Total cycles (10)"],
            ["appliedCurrentA", "Applied current [A]"],
            ["dwellHigh", "Dwell time at high temperature"],
            ["dwellLow", "Dwell time at low temperature"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t15.header?.[k] ?? ""}
                onChange={(e) =>
                  set15({ header: { ...t15.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p31-t15"
          rowCount={t15.rows.length}
          onAdd={() => set15({ rows: [...t15.rows, emptyOc()] })}
          onRemoveLast={() =>
            t15.rows.length > 1 && set15({ rows: t15.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t15.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p31-t15-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <OpenCircuitRow row={row} idx={idx} setRow={set15Row} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t15.supplementary ?? ""}
            onChange={(e) => set15({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 15.1: MQT 01 — Visual inspection after humidity freeze 10 test"
        table={t151}
        setTable={set151}
        emptyRow={() => ({ sampleNo: "", findings: "" })}
        scrollPrefix="p31-t151"
      />

      <Section title="TABLE 15.2: MQT 15 — Wet leakage current test after humidity freeze 10 test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Test voltage applied [V]</label>
            <input
              value={t152.header?.testVoltage ?? ""}
              onChange={(e) =>
                set152({ header: { ...t152.header, testVoltage: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution temperature [°C]</label>
            <input
              value={t152.header?.solutionTemp ?? ""}
              onChange={(e) =>
                set152({ header: { ...t152.header, solutionTemp: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Size of module [m²]</label>
            <input
              value={t152.header?.moduleSizeM2 ?? ""}
              onChange={(e) =>
                set152({ header: { ...t152.header, moduleSizeM2: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Solution resistivity [Ω·cm]</label>
            <input
              value={t152.header?.solutionResistivity ?? ""}
              onChange={(e) =>
                set152({ header: { ...t152.header, solutionResistivity: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p31-t152"
          rowCount={t152.rows.length}
          onAdd={() => set152({ rows: [...t152.rows, emptyW()] })}
          onRemoveLast={() =>
            t152.rows.length > 1 && set152({ rows: t152.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t152.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p31-t152-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => {
                      const rows = [...t152.rows];
                      rows[idx] = { ...rows[idx], sampleNo: e.target.value };
                      set152({ rows });
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Measured [MΩ]</label>
                  <input
                    value={row.measuredMohm ?? ""}
                    onChange={(e) => {
                      const rows = [...t152.rows];
                      rows[idx] = { ...rows[idx], measuredMohm: e.target.value };
                      set152({ rows });
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Limit [MΩ]</label>
                  <input
                    value={row.requiredMohm ?? ""}
                    onChange={(e) => {
                      const rows = [...t152.rows];
                      rows[idx] = { ...rows[idx], requiredMohm: e.target.value };
                      set152({ rows });
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result ?? ""}
                    onChange={(e) => {
                      const rows = [...t152.rows];
                      rows[idx] = { ...rows[idx], result: e.target.value };
                      set152({ rows });
                    }}
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
            value={t152.supplementary ?? ""}
            onChange={(e) => set152({ supplementary: e.target.value })}
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

/** PDF page 32 */
export function ObservationFormPage32({ value: form, onChange }) {
  const t16 = form.table16;
  const t161 = form.table161;
  const t162 = form.table162;
  const set = (p) => onChange({ ...form, ...p });
  const set16 = (p) => set({ table16: { ...t16, ...p } });
  const set161 = (p) => set({ table161: { ...t161, ...p } });
  const set162 = (p) => set({ table162: { ...t162, ...p } });
  const emptyV = () => ({ sampleNo: "", findings: "" });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set16Row = (i, k, v) => {
    const rows = [...t16.rows];
    rows[i] = { ...rows[i], [k]: v };
    set16({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 16: MQT 14.1 — Retention of junction box on mounting surface">
        <RowControls
          scrollPrefix="p32-t16"
          rowCount={t16.rows.length}
          onAdd={() => set16({ rows: [...t16.rows, emptyV()] })}
          onRemoveLast={() =>
            t16.rows.length > 1 && set16({ rows: t16.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t16.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p32-t16-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set16Row(idx, "sampleNo", e.target.value)}
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
                    onChange={(e) => set16Row(idx, "findings", e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 mt-4">
          <label className={labelCls}>Test force applied [N]</label>
          <input
            value={t16.testForceAppliedN ?? "40"}
            onChange={(e) => set16({ testForceAppliedN: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t16.supplementary ?? ""}
            onChange={(e) => set16({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 16.1: MQT 01 — Visual inspection after retention of junction box on mounting surface"
        table={t161}
        setTable={set161}
        emptyRow={emptyV}
        scrollPrefix="p32-t161"
      />

      <Section title="TABLE 16.2: MQT 15 — Wet leakage current test after retention of junction box on mounting surface">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["testVoltage", "Test voltage applied [V]"],
            ["solutionTemp", "Solution temperature [°C]"],
            ["moduleSizeM2", "Size of module [m²]"],
            ["solutionResistivity", "Solution resistivity [Ω·cm]"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t162.header?.[k] ?? ""}
                onChange={(e) =>
                  set162({ header: { ...t162.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p32-t162"
          rowCount={t162.rows.length}
          onAdd={() => set162({ rows: [...t162.rows, emptyW()] })}
          onRemoveLast={() =>
            t162.rows.length > 1 && set162({ rows: t162.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t162.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p32-t162-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["sampleNo", "Sample #"],
                  ["measuredMohm", "Measured [MΩ]"],
                  ["requiredMohm", "Limit [MΩ]"],
                  ["result", "Result"],
                ].map(([k, lab]) => (
                  <div key={k}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => {
                        const rows = [...t162.rows];
                        rows[idx] = { ...rows[idx], [k]: e.target.value };
                        set162({ rows });
                      }}
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
            value={t162.supplementary ?? ""}
            onChange={(e) => set162({ supplementary: e.target.value })}
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

/** PDF page 33 */
export function ObservationFormPage33({ value: form, onChange }) {
  const t17 = form.table17;
  const t171 = form.table171;
  const set = (p) => onChange({ ...form, ...p });
  const set17 = (p) => set({ table17: { ...t17, ...p } });
  const set171 = (p) => set({ table171: { ...t171, ...p } });
  const emptyOc = () => ({ sampleNo: "", openCircuitYes: false, openCircuitNo: false });
  const set17Row = (i, k, v) => {
    const rows = [...t17.rows];
    rows[i] = { ...rows[i], [k]: v };
    set17({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 17: MQT 11 — Thermal cycling 200 test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["totalCycles96", "Total cycles (96)"],
            ["weightN", "Weight attached [N]"],
            ["appliedCurrentA", "Applied current [A]"],
            ["dwellHigh", "Dwell time at high temperature"],
            ["dwellLow", "Dwell time at low temperature"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t17.header?.[k] ?? ""}
                onChange={(e) =>
                  set17({ header: { ...t17.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p33-t17"
          rowCount={t17.rows.length}
          onAdd={() => set17({ rows: [...t17.rows, emptyOc()] })}
          onRemoveLast={() =>
            t17.rows.length > 1 && set17({ rows: t17.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t17.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p33-t17-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <OpenCircuitRow row={row} idx={idx} setRow={set17Row} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t17.supplementary ?? ""}
            onChange={(e) => set17({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 17.1: MQT 01 — Visual inspection after thermal cycling 200 test"
        table={t171}
        setTable={set171}
        emptyRow={() => ({ sampleNo: "", findings: "" })}
        scrollPrefix="p33-t171"
      />

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

/** PDF page 35 */
export function ObservationFormPage35({ value: form, onChange }) {
  const t18 = form.table18;
  const t181 = form.table181;
  const t182 = form.table182;
  const set = (p) => onChange({ ...form, ...p });
  const set18 = (p) => set({ table18: { ...t18, ...p } });
  const set181 = (p) => set({ table181: { ...t181, ...p } });
  const set182 = (p) => set({ table182: { ...t182, ...p } });
  const emptyS = () => ({ sampleNo: "" });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set18Row = (i, k, v) => {
    const rows = [...t18.rows];
    rows[i] = { ...rows[i], [k]: v };
    set18({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 18: MQT 13 — Damp heat 1000 test">
        <div className="mb-4">
          <label className={labelCls}>Total hours (1000 h)</label>
          <input
            value={t18.header?.totalHours1000 ?? ""}
            onChange={(e) =>
              set18({ header: { ...t18.header, totalHours1000: e.target.value } })
            }
            className={inputCls}
          />
        </div>
        <RowControls
          scrollPrefix="p35-t18"
          rowCount={t18.rows.length}
          onAdd={() => set18({ rows: [...t18.rows, emptyS()] })}
          onRemoveLast={() =>
            t18.rows.length > 1 && set18({ rows: t18.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t18.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p35-t18-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div>
                <label className={labelCls}>Sample #</label>
                <input
                  value={row.sampleNo ?? ""}
                  onChange={(e) => set18Row(idx, "sampleNo", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t18.supplementary ?? ""}
            onChange={(e) => set18({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 18.1: MQT 01 — Visual inspection after damp heat 1000 test"
        table={t181}
        setTable={set181}
        emptyRow={() => ({ sampleNo: "", findings: "" })}
        scrollPrefix="p35-t181"
      />

      <Section title="TABLE 18.2: MQT 15 — Wet leakage current test after damp heat 1000 test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["testVoltage", "Test voltage applied [V]"],
            ["solutionTemp", "Solution temperature [°C]"],
            ["moduleSizeM2", "Size of module [m²]"],
            ["solutionResistivity", "Solution resistivity [Ω·cm]"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t182.header?.[k] ?? ""}
                onChange={(e) =>
                  set182({ header: { ...t182.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p35-t182"
          rowCount={t182.rows.length}
          onAdd={() => set182({ rows: [...t182.rows, emptyW()] })}
          onRemoveLast={() =>
            t182.rows.length > 1 && set182({ rows: t182.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t182.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p35-t182-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["sampleNo", "Sample #"],
                  ["measuredMohm", "Measured [MΩ]"],
                  ["requiredMohm", "Limit [MΩ]"],
                  ["result", "Result"],
                ].map(([k, lab]) => (
                  <div key={k}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => {
                        const rows = [...t182.rows];
                        rows[idx] = { ...rows[idx], [k]: e.target.value };
                        set182({ rows });
                      }}
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
            value={t182.supplementary ?? ""}
            onChange={(e) => set182({ supplementary: e.target.value })}
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

function OcYesNo({ label, row, idx, setRow, prefix }) {
  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-xs font-semibold text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={!!row[`${prefix}Yes`]}
            onChange={(e) => setRow(idx, `${prefix}Yes`, e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm font-medium">Yes</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={!!row[`${prefix}No`]}
            onChange={(e) => setRow(idx, `${prefix}No`, e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm font-medium">No</span>
        </label>
      </div>
    </div>
  );
}

/** PDF page 36 */
export function ObservationFormPage36({ value: form, onChange }) {
  const t19 = form.table19;
  const t191 = form.table191;
  const t192 = form.table192;
  const set = (p) => onChange({ ...form, ...p });
  const set19 = (p) => set({ table19: { ...t19, ...p } });
  const set191 = (p) => set({ table191: { ...t191, ...p } });
  const set192 = (p) => set({ table192: { ...t192, ...p } });
  const emptyM = () => ({
    sampleNo: "",
    designLoadFrontBack: "",
    safetyFactors: "",
    mountingMethod: "",
    loadAppliedTo: "",
    mechanicalLoadPa: "",
    firstCycleStartEnd: "",
    intermittentOc1Yes: false,
    intermittentOc1No: false,
    secondCycleStartEnd: "",
    intermittentOc2Yes: false,
    intermittentOc2No: false,
    thirdCycleStartEnd: "",
    intermittentOc3Yes: false,
    intermittentOc3No: false,
  });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set19Row = (i, k, v) => {
    const rows = [...t19.rows];
    rows[i] = { ...rows[i], [k]: v };
    set19({ rows });
  };

  const fields = [
    ["sampleNo", "Sample #"],
    ["designLoadFrontBack", "Design load (front side / back side)"],
    ["safetyFactors", "Safety factors"],
    ["mountingMethod", "Mounting method"],
    ["loadAppliedTo", "Load applied to"],
    ["mechanicalLoadPa", "Mechanical load [Pa]"],
    ["firstCycleStartEnd", "First cycle time (start/end)"],
    ["secondCycleStartEnd", "Second cycle time (start/end)"],
    ["thirdCycleStartEnd", "Third cycle time (start/end)"],
  ];

  return (
    <div className="space-y-6">
      <Section title="TABLE 19: MQT 16 — Static mechanical load test">
        <RowControls
          scrollPrefix="p36-t19"
          rowCount={t19.rows.length}
          onAdd={() => set19({ rows: [...t19.rows, emptyM()] })}
          onRemoveLast={() =>
            t19.rows.length > 1 && set19({ rows: t19.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t19.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p36-t19-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(([k, lab]) => (
                  <div key={k} className={k.includes("Cycle") ? "sm:col-span-2" : ""}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => set19Row(idx, k, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
                <OcYesNo
                  label="Intermittent open-circuit (1st cycle — yes/no)"
                  row={row}
                  idx={idx}
                  setRow={set19Row}
                  prefix="intermittentOc1"
                />
                <OcYesNo
                  label="Intermittent open-circuit (2nd cycle — yes/no)"
                  row={row}
                  idx={idx}
                  setRow={set19Row}
                  prefix="intermittentOc2"
                />
                <OcYesNo
                  label="Intermittent open-circuit (3rd cycle — yes/no)"
                  row={row}
                  idx={idx}
                  setRow={set19Row}
                  prefix="intermittentOc3"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t19.supplementary ?? ""}
            onChange={(e) => set19({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 19.1: MQT 01 — Visual inspection after static mechanical load test"
        table={t191}
        setTable={set191}
        emptyRow={() => ({ sampleNo: "", findings: "" })}
        scrollPrefix="p36-t191"
      />

      <Section title="TABLE 19.2: MQT 15 — Wet leakage current test after static mechanical load test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["testVoltage", "Test voltage applied [V]"],
            ["solutionTemp", "Solution temperature [°C]"],
            ["moduleSizeM2", "Size of module [m²]"],
            ["solutionResistivity", "Solution resistivity [Ω·cm]"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t192.header?.[k] ?? ""}
                onChange={(e) =>
                  set192({ header: { ...t192.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p36-t192"
          rowCount={t192.rows.length}
          onAdd={() => set192({ rows: [...t192.rows, emptyW()] })}
          onRemoveLast={() =>
            t192.rows.length > 1 && set192({ rows: t192.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t192.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p36-t192-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["sampleNo", "Sample #"],
                  ["measuredMohm", "Measured [MΩ]"],
                  ["requiredMohm", "Limit [MΩ]"],
                  ["result", "Result"],
                ].map(([k, lab]) => (
                  <div key={k}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => {
                        const rows = [...t192.rows];
                        rows[idx] = { ...rows[idx], [k]: e.target.value };
                        set192({ rows });
                      }}
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
            value={t192.supplementary ?? ""}
            onChange={(e) => set192({ supplementary: e.target.value })}
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

/** PDF page 37 */
export function ObservationFormPage37({ value: form, onChange }) {
  const t21 = form.table21;
  const t211 = form.table211;
  const t212 = form.table212;
  const set = (p) => onChange({ ...form, ...p });
  const set21 = (p) => set({ table21: { ...t21, ...p } });
  const set211 = (p) => set({ table211: { ...t211, ...p } });
  const set212 = (p) => set({ table212: { ...t212, ...p } });
  const emptyS = () => ({ sampleNo: "" });
  const emptyW = () => ({
    sampleNo: "",
    measuredMohm: "",
    requiredMohm: "",
    result: "",
  });
  const set21Row = (i, k, v) => {
    const rows = [...t21.rows];
    rows[i] = { ...rows[i], [k]: v };
    set21({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 21: MQT 17 — Hail impact test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["iceBallSizeMm", "Ice ball size [mm]"],
            ["iceBallWeightG", "Ice ball weight [g]"],
            ["iceBallVelocityMps", "Ice ball velocity [m/s]"],
            ["numImpactLocations", "Number of impact locations"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t21.header?.[k] ?? ""}
                onChange={(e) =>
                  set21({ header: { ...t21.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p37-t21"
          rowCount={t21.rows.length}
          onAdd={() => set21({ rows: [...t21.rows, emptyS()] })}
          onRemoveLast={() =>
            t21.rows.length > 1 && set21({ rows: t21.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t21.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p37-t21-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div>
                <label className={labelCls}>Sample #</label>
                <input
                  value={row.sampleNo ?? ""}
                  onChange={(e) => set21Row(idx, "sampleNo", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={t21.supplementary ?? ""}
            onChange={(e) => set21({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 21.1: MQT 01 — Visual inspection after hail impact test"
        table={t211}
        setTable={set211}
        emptyRow={() => ({ sampleNo: "", findings: "" })}
        scrollPrefix="p37-t211"
      />

      <Section title="TABLE 21.2: MQT 15 — Wet leakage current test after hail impact test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            ["testVoltage", "Test voltage applied [V]"],
            ["solutionTemp", "Solution temperature [°C]"],
            ["moduleSizeM2", "Size of module [m²]"],
            ["solutionResistivity", "Solution resistivity [Ω·cm]"],
          ].map(([k, lab]) => (
            <div key={k}>
              <label className={labelCls}>{lab}</label>
              <input
                value={t212.header?.[k] ?? ""}
                onChange={(e) =>
                  set212({ header: { ...t212.header, [k]: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <RowControls
          scrollPrefix="p37-t212"
          rowCount={t212.rows.length}
          onAdd={() => set212({ rows: [...t212.rows, emptyW()] })}
          onRemoveLast={() =>
            t212.rows.length > 1 && set212({ rows: t212.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t212.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p37-t212-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["sampleNo", "Sample #"],
                  ["measuredMohm", "Measured [MΩ]"],
                  ["requiredMohm", "Required resistance [MΩ]"],
                  ["result", "Result"],
                ].map(([k, lab]) => (
                  <div key={k}>
                    <label className={labelCls}>{lab}</label>
                    <input
                      value={row[k] ?? ""}
                      onChange={(e) => {
                        const rows = [...t212.rows];
                        rows[idx] = { ...rows[idx], [k]: e.target.value };
                        set212({ rows });
                      }}
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
            value={t212.supplementary ?? ""}
            onChange={(e) => set212({ supplementary: e.target.value })}
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

/** PDF page 38 */
export function ObservationFormPage38({ value: form, onChange }) {
  const t22 = form.table22;
  const t221 = form.table221;
  const set = (p) => onChange({ ...form, ...p });
  const set22 = (p) => set({ table22: { ...t22, ...p } });
  const set221 = (p) => set({ table221: { ...t221, ...p } });
  const emptyP = () => ({ sampleNo: "", appliedVoltageStressPolarities: "" });
  const set22Row = (i, k, v) => {
    const rows = [...t22.rows];
    rows[i] = { ...rows[i], [k]: v };
    set22({ rows });
  };

  return (
    <div className="space-y-6">
      <Section title="TABLE 22: MQT 21 — Potential induced degradation test">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Chamber air temperature [°C]</label>
            <input
              value={t22.header?.chamberAirTempC ?? ""}
              onChange={(e) =>
                set22({ header: { ...t22.header, chamberAirTempC: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Chamber relative humidity [%RH]</label>
            <input
              value={t22.header?.chamberRhPct ?? ""}
              onChange={(e) =>
                set22({ header: { ...t22.header, chamberRhPct: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Test duration [h]</label>
            <input
              value={t22.header?.testDurationH ?? ""}
              onChange={(e) =>
                set22({ header: { ...t22.header, testDurationH: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
        <RowControls
          scrollPrefix="p38-t22"
          rowCount={t22.rows.length}
          onAdd={() => set22({ rows: [...t22.rows, emptyP()] })}
          onRemoveLast={() =>
            t22.rows.length > 1 && set22({ rows: t22.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {t22.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p38-t22-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3">
                <div>
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo ?? ""}
                    onChange={(e) => set22Row(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Applied voltage stress [V] and polarities
                  </label>
                  <textarea
                    rows={3}
                    value={row.appliedVoltageStressPolarities ?? ""}
                    onChange={(e) =>
                      set22Row(idx, "appliedVoltageStressPolarities", e.target.value)
                    }
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
            value={t22.supplementary ?? ""}
            onChange={(e) => set22({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>

      <VisualBlock
        title="TABLE 22.1: MQT 01 — Visual inspection after potential induced degradation test"
        table={t221}
        setTable={set221}
        emptyRow={() => ({ sampleNo: "", findings: "" })}
        scrollPrefix="p38-t221"
      />

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

function StcBnpiSection({ title, subtitle, table, setTable, emptyRow, scrollPrefix }) {
  const setRow = (i, k, v) => {
    const rows = [...table.rows];
    rows[i] = { ...rows[i], [k]: v };
    setTable({ ...table, rows });
  };
  return (
    <Section title={title}>
      {subtitle ? (
        <p className="mb-3 text-sm font-semibold text-slate-800">{subtitle}</p>
      ) : null}
      <div className="mb-4 flex flex-wrap gap-6">
        <span className="text-sm font-semibold text-slate-800">Test method</span>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={!!table.header?.testMethodSolarSimulator}
            onChange={(e) =>
              setTable({
                ...table,
                header: {
                  ...table.header,
                  testMethodSolarSimulator: e.target.checked,
                },
              })
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm font-medium">Solar simulator</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={!!table.header?.testMethodNaturalSunlight}
            onChange={(e) =>
              setTable({
                ...table,
                header: {
                  ...table.header,
                  testMethodNaturalSunlight: e.target.checked,
                },
              })
            }
            className="h-5 w-5 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm font-medium">Natural sunlight</span>
        </label>
      </div>
      <RowControls
        scrollPrefix={scrollPrefix}
        rowCount={table.rows.length}
        onAdd={() => setTable({ ...table, rows: [...table.rows, emptyRow()] })}
        onRemoveLast={() =>
          table.rows.length > 1 &&
          setTable({ ...table, rows: table.rows.slice(0, -1) })
        }
      />
      <div className="space-y-4">
        {table.rows.map((row, idx) => (
          <div
            key={idx}
            data-obs-entry={`${scrollPrefix}-${idx}`}
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
                [
                  "powerLabGateDegradation",
                  "Pmax [W] — Power (Lab Gate Degradation No. 1)",
                ],
                ["result", "Result"],
              ].map(([k, lab]) => (
                <div key={k} className={k === "powerLabGateDegradation" ? "sm:col-span-2" : ""}>
                  <label className={labelCls}>{lab}</label>
                  <input
                    value={row[k] ?? ""}
                    onChange={(e) => setRow(idx, k, e.target.value)}
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
          value={table.supplementary ?? ""}
          onChange={(e) => setTable({ ...table, supplementary: e.target.value })}
          className={`${inputCls} min-h-[5rem] resize-y`}
        />
      </div>
    </Section>
  );
}

/** PDF page 40 — TABLE 23.3 (Method 2); page 41 — TABLE 23.4 (Method 4), same columns. */
export function ObservationFormPage40({ value: form, onChange, variant = "40" }) {
  const emptyR = () => ({
    sampleNo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    pmax: "",
    ff: "",
    powerLabGateDegradation: "",
    result: "",
  });
  const mono = form.monoStc;
  const bnpi = form.bnpi;
  const set = (p) => onChange({ ...form, ...p });
  const setMono = (p) => set({ monoStc: { ...mono, ...p } });
  const setBnpi = (p) => set({ bnpi: { ...bnpi, ...p } });

  const tableTitle =
    variant === "41"
      ? "TABLE 23.4: MQT 19.2 — Final stabilization"
      : "TABLE 23.3: MQT 19.2 — Final stabilization";
  const methodLine =
    variant === "41"
      ? "IS 14286 (Part 1 / Sec 1) — Method 4"
      : "IS 14286 (Part 1 / Sec 1) — Method 2";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 text-sm font-bold text-slate-900">{tableTitle}</h2>
        <p className="mb-4 text-sm text-slate-700">{methodLine}</p>
      </section>

      <StcBnpiSection
        title="Performance at STC before final stabilization — mono facial modules"
        subtitle=""
        table={mono}
        setTable={setMono}
        emptyRow={emptyR}
        scrollPrefix={`${variant}-stc-mono`}
      />

      <StcBnpiSection
        title="Performance at BNPI before final stabilization — bifacial modules"
        subtitle=""
        table={bnpi}
        setTable={setBnpi}
        emptyRow={emptyR}
        scrollPrefix={`${variant}-stc-bnpi`}
      />

      <Section title="">
        <label className={labelCls}>Additional supplementary information (page)</label>
        <textarea
          rows={4}
          value={form.supplementary ?? ""}
          onChange={(e) => set({ supplementary: e.target.value })}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </Section>
    </div>
  );
}
