import { useEffect, useRef } from "react";
import { inputCls, labelCls } from "../observation/formStyles";
import { ObservationFormPage40 } from "./ObservationFormsPages31to40";
import {
  emptyA47SingleRow,
  emptyBnpiFinal238Row,
  emptyLabStcBackRow,
  emptyStcBackPhiRow,
  emptyStcSimpleRow,
} from "../constants/observationPages41to54";

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

function TestMethodHeader({ header, setHeader }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        Test method
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!header.testMethodSolarSimulator}
            onChange={(e) =>
              setHeader({ ...header, testMethodSolarSimulator: e.target.checked })
            }
            className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-800">Solar simulator</span>
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={!!header.testMethodNaturalSunlight}
            onChange={(e) =>
              setHeader({ ...header, testMethodNaturalSunlight: e.target.checked })
            }
            className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
        </label>
        <span className="text-sm text-slate-500">—</span>
      </div>
    </div>
  );
}

/** PDF page 41 — TABLE 23.4 Method 4 (same fields as page 40). */
export function ObservationFormPage41(props) {
  return <ObservationFormPage40 {...props} variant="41" />;
}

/** TABLE 23.6 — Front after final stabilization */
export function ObservationFormPage42({ value: form, onChange }) {
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcSimpleRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <p className="mb-2 text-sm font-medium text-slate-800">For bifacial modules</p>
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 23.6: MQT 06.1 ini — Performance at STC after final stabilization (Front side)
        </h2>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p42-stc-front"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p42-stc-front-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, lab]) => (
                  <div key={k}>
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE 23.7 — Back after final stabilization */
export function ObservationFormPage43({ value: form, onChange }) {
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcBackPhiRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["phiIsc", "φIsc"],
    ["phiVoc", "φVoc"],
    ["phiPmax", "φPmax"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 23.7: MQT 06.1 ini — Performance at STC after final stabilization (Back side)
        </h2>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p43-stc-back"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p43-stc-back-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, lab]) => (
                  <div key={k}>
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE 23.8 — Final BNPI */
export function ObservationFormPage44({ value: form, onChange }) {
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyBnpiFinal238Row();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    [
      "powerLabGateNo1",
      "Pmax [W] — Power (Lab Gate Degradation No. 1)",
    ],
    ["result", "Result"],
    ["degradationPct", "Degradation n [%]"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 23.8: MQT 06.1 — Final performance at BNPI
        </h2>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p44-bnpi-final"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p44-bnpi-final-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, lab]) => (
                  <div
                    key={k}
                    className={
                      k === "powerLabGateNo1" || k === "degradationPct"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE A.4.1 — Front before initial stabilization */
export function ObservationFormPage47({ value: form, onChange }) {
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcSimpleRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <p className="mb-3 text-sm text-slate-700">
          Annex 3: Lower and Higher Output Power Modules
        </p>
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.1 — Performance at STC before initial stabilization (Front side)
        </h2>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p47-a41-front"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p47-a41-front-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, lab]) => (
                  <div key={k}>
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
          <label className={labelCls}>Supplementary Information</label>
          <textarea
            rows={3}
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE A.4.4 — Back before initial stabilization */
export function ObservationFormPage48({ value: form, onChange }) {
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcSimpleRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.4 — Performance at STC before initial stabilization (Back side)
        </h2>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p48-a44-back"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p48-a44-back-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, lab]) => (
                  <div key={k}>
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
          <label className={labelCls}>Supplementary Information</label>
          <textarea
            rows={3}
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE A.4.3 — BNPI before initial stabilization */
export function ObservationFormPage49({ value: form, onChange }) {
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcSimpleRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.3 — Performance at BNPI before initial stabilization
        </h2>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p49-a43-bnpi"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p49-a43-bnpi-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, lab]) => (
                  <div key={k}>
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

function A47RowFields({ row, idx, setRow }) {
  const fields = [
    ["sampleNo", "Sample #"],
    ["testCycle", "Test cycle"],
    ["integratedIrradiationKwhm2", "Integrated irradiation [kWh/m²]"],
    ["irradianceWm2", "Irradiance [W/m²]"],
    ["moduleTempC", "Module temperature [°C]"],
    ["resistiveLoad", "Resistive load"],
    ["pmaxEndW", "Pmax [W] at the end of cycle"],
    ["spreadPmaxPminPct", "(Pmax − Pmin) / Paverage [%]"],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map(([k, lab]) => (
        <div key={k} className={k === "spreadPmaxPminPct" ? "sm:col-span-2" : ""}>
          <label className={labelCls}>{lab}</label>
          <input
            value={row[k] ?? ""}
            onChange={(e) => setRow(idx, k, e.target.value)}
            className={inputCls}
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-semibold text-slate-700">Stable (Yes/No)</p>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!row.stableYes}
              onChange={(e) => setRow(idx, "stableYes", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium">Yes</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!!row.stableNo}
              onChange={(e) => setRow(idx, "stableNo", e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm font-medium">No</span>
          </label>
        </div>
      </div>
    </div>
  );
}

/** TABLE A.4.7 — Initial stabilization (pages 50–51, four sub-tables). */
export function ObservationFormPage50A47({ value: form, onChange, pdfPage }) {
  const hdr = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setHdr = (header) => set({ header });
  const setBlockRow = (bi, ri, k, v) => {
    const blocks = form.blocks.map((b) => ({ ...b, rows: [...b.rows] }));
    blocks[bi].rows[ri] = { ...blocks[bi].rows[ri], [k]: v };
    set({ blocks });
  };
  const addRow = (bi) => {
    const blocks = form.blocks.map((b, i) =>
      i === bi ? { ...b, rows: [...b.rows, emptyA47SingleRow()] } : b,
    );
    set({ blocks });
  };
  const removeLast = (bi) => {
    const blocks = form.blocks.map((b, i) => {
      if (i !== bi || b.rows.length <= 1) return b;
      return { ...b, rows: b.rows.slice(0, -1) };
    });
    set({ blocks });
  };
  const blockLabels = [
    "Section 1 — (PDF page 50, first table)",
    "Section 2 — (PDF page 50, second table)",
    "Section 3 — (PDF page 50, third table)",
    "Section 4 — (PDF page 51, continued)",
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.7: MQT 19.1 ini — Initial stabilization procedure
        </h2>
        {pdfPage === 51 ? (
          <p className="mb-3 text-xs text-slate-600">
            Same observation data as page 50 (storage key <code className="rounded bg-slate-100 px-1">page_50</code>
            ); section 4 matches the continued table on PDF page 51.
          </p>
        ) : null}
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Light exposure method
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={!!hdr.lightExposureSolar}
                onChange={(e) =>
                  setHdr({ ...hdr, lightExposureSolar: e.target.checked })
                }
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium">Solar simulator</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={!!hdr.lightExposureNatural}
                onChange={(e) =>
                  setHdr({ ...hdr, lightExposureNatural: e.target.checked })
                }
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium">Natural sunlight</span>
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label className={labelCls}>
            Stabilization criterion x per IS 14286 (Part 1 / Sec x)
          </label>
          <textarea
            rows={2}
            value={hdr.stabilizationCriterion ?? ""}
            onChange={(e) =>
              setHdr({ ...hdr, stabilizationCriterion: e.target.value })
            }
            className={`${inputCls} min-h-[4rem] resize-y`}
          />
        </div>

        {form.blocks.map((block, bi) => (
          <div
            key={bi}
            className="mb-8 rounded-lg border border-slate-200 bg-slate-50/40 p-3 last:mb-0"
          >
            <p className="mb-3 text-xs font-bold uppercase text-slate-700">
              {blockLabels[bi]}
            </p>
            <RowControls
              scrollPrefix={`p50a47-b${bi}`}
              rowCount={block.rows.length}
              onAdd={() => addRow(bi)}
              onRemoveLast={() => removeLast(bi)}
            />
            <div className="space-y-4">
              {block.rows.map((row, ri) => (
                <div
                  key={ri}
                  data-obs-entry={`p50a47-b${bi}-${ri}`}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <p className="mb-3 text-xs font-bold text-slate-600">
                    Row {ri + 1}
                  </p>
                  <A47RowFields
                    row={row}
                    idx={ri}
                    setRow={(i, k, v) => setBlockRow(bi, i, k, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={3}
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE A.4.7 — STC after initial stab (Front) */
export function ObservationFormPage52({ value: form, onChange }) {
  const lab = form.lab;
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setLab = (lk, v) => set({ lab: { ...lab, [lk]: v } });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcSimpleRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.7: MQT 6.1 — Performance at STC after initial stabilization (Front side)
        </h2>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Pmax (lab) [W] — line 1</label>
            <input
              value={lab.pmaxLabW1 ?? ""}
              onChange={(e) => setLab("pmaxLabW1", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pmax (lab) [W] — line 2</label>
            <input
              value={lab.pmaxLabW2 ?? ""}
              onChange={(e) => setLab("pmaxLabW2", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pmax4 (lab) [W]</label>
            <input
              value={lab.pmax4LabW ?? ""}
              onChange={(e) => setLab("pmax4LabW", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Voc (lab) [V]</label>
            <input
              value={lab.vocLabV ?? ""}
              onChange={(e) => setLab("vocLabV", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Isc (lab) [A]</label>
            <input
              value={lab.iscLabA ?? ""}
              onChange={(e) => setLab("iscLabA", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p52-a47-stc-front"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p52-a47-stc-front-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, labl]) => (
                  <div key={k}>
                    <label className={labelCls}>{labl}</label>
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE A.4.8 — Back after initial stab */
export function ObservationFormPage53({ value: form, onChange }) {
  const lab = form.lab;
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setLab = (lk, v) => set({ lab: { ...lab, [lk]: v } });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyLabStcBackRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["phiIsc", "φIsc"],
    ["phiVoc", "φVoc"],
    ["phiPmax", "φPmax"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.8: MQT 6.1 — Performance at STC after initial stabilization (Backside)
        </h2>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Pmax (lab) [W] — line 1</label>
            <input
              value={lab.pmaxLabW1 ?? ""}
              onChange={(e) => setLab("pmaxLabW1", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pmax (lab) [W] — line 2</label>
            <input
              value={lab.pmaxLabW2 ?? ""}
              onChange={(e) => setLab("pmaxLabW2", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Voc (lab) [V]</label>
            <input
              value={lab.vocLabV ?? ""}
              onChange={(e) => setLab("vocLabV", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Isc (lab) [A]</label>
            <input
              value={lab.iscLabA ?? ""}
              onChange={(e) => setLab("iscLabA", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p53-a48-stc-back"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p53-a48-stc-back-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, labl]) => (
                  <div key={k}>
                    <label className={labelCls}>{labl}</label>
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}

/** TABLE A.4.9 — BNPI after initial stabilization */
export function ObservationFormPage54({ value: form, onChange }) {
  const lab = form.lab;
  const h = form.header;
  const set = (p) => onChange({ ...form, ...p });
  const setLab = (lk, v) => set({ lab: { ...lab, [lk]: v } });
  const setHeader = (header) => set({ header });
  const setRow = (i, k, v) => {
    const rows = [...form.rows];
    rows[i] = { ...rows[i], [k]: v };
    set({ rows });
  };
  const empty = () => emptyStcSimpleRow();
  const cols = [
    ["sampleNo", "Sample #"],
    ["isc", "Isc [A]"],
    ["voc", "Voc [V]"],
    ["imp", "Imp [A]"],
    ["vmp", "Vmp [V]"],
    ["pmax", "Pmax [W]"],
    ["ff", "FF [%]"],
    ["result", "Result"],
  ];
  return (
    <div className="space-y-6">
      <Section title="">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE A.4.9: MQT 6.1 — Performance at BNPI after initial stabilization
        </h2>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Pmax (lab) [W] — line 1</label>
            <input
              value={lab.pmaxLabW1 ?? ""}
              onChange={(e) => setLab("pmaxLabW1", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pmax (lab) [W] — line 2</label>
            <input
              value={lab.pmaxLabW2 ?? ""}
              onChange={(e) => setLab("pmaxLabW2", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Voc (lab) [V]</label>
            <input
              value={lab.vocLabV ?? ""}
              onChange={(e) => setLab("vocLabV", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Isc (lab) [A]</label>
            <input
              value={lab.iscLabA ?? ""}
              onChange={(e) => setLab("iscLabA", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <TestMethodHeader header={h} setHeader={setHeader} />
        <RowControls
          scrollPrefix="p54-a49-bnpi"
          rowCount={form.rows.length}
          onAdd={() => set({ rows: [...form.rows, empty()] })}
          onRemoveLast={() =>
            form.rows.length > 1 && set({ rows: form.rows.slice(0, -1) })
          }
        />
        <div className="space-y-4">
          {form.rows.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`p54-a49-bnpi-${idx}`}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Row {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cols.map(([k, labl]) => (
                  <div key={k}>
                    <label className={labelCls}>{labl}</label>
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
            value={form.supplementary ?? ""}
            onChange={(e) => set({ supplementary: e.target.value })}
            className={`${inputCls} min-h-[5rem] resize-y`}
          />
        </div>
      </Section>
    </div>
  );
}
