import { SHEET_PRESETS } from "../constants/sheetPresets";
import { emptySheetRow, mergeSheetForm } from "../constants/observationPageModel";
import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

function isWideRowField(f) {
  if (f.type === "textarea") return true;
  return [
    "findings",
    "remarks",
    "visualFindings",
    "prepProcedure",
    "vdchar1",
    "vdchar2",
    "vdchar3",
    "notes",
    "vdVsTj",
    "bypassDetail",
    "stabDetail",
    "result",
    "shading",
    "preconditioning",
  ].includes(f.key);
}

export default function ObservationFormGenericSheet({
  value,
  onChange,
  sheetPreset = "generic_8_6",
  showHeader = true,
  showFooter = false,
}) {
  const preset = SHEET_PRESETS[sheetPreset] || SHEET_PRESETS.generic_8_6;
  const form = mergeSheetForm(value, sheetPreset);
  const scrollPrefix = `gen-${sheetPreset}`;
  const markScrollRow = useScrollToNewEntry(form.rows.length, scrollPrefix);

  const setHeader = (key, v) =>
    onChange({ ...form, header: { ...form.header, [key]: v } });

  const setCell = (rowIdx, key, v) => {
    const rows = [...form.rows];
    rows[rowIdx] = { ...rows[rowIdx], [key]: v };
    onChange({ ...form, rows });
  };

  const addRow = () => {
    markScrollRow(form.rows.length);
    onChange({
      ...form,
      rows: [...form.rows, emptySheetRow(preset.rowFields)],
    });
  };

  const removeLast = () => {
    if (form.rows.length <= 1) return;
    onChange({ ...form, rows: form.rows.slice(0, -1) });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {showHeader && preset.headerFields.length > 0 ? (
        <section className="space-y-3">
          {preset.headerFields.map((f) =>
            f.type === "checkbox" ? (
              <label
                key={f.key}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2"
              >
                <input
                  type="checkbox"
                  checked={!!form.header[f.key]}
                  onChange={(e) => setHeader(f.key, e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-800">{f.label}</span>
              </label>
            ) : (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  value={form.header[f.key] ?? ""}
                  onChange={(e) => setHeader(f.key, e.target.value)}
                  className={inputCls}
                />
              </div>
            ),
          )}
        </section>
      ) : null}

      <section
        className={
          preset.headerFields.length > 0
            ? "mt-5 border-t border-slate-200 pt-4"
            : ""
        }
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase text-slate-700">Entries</h2>
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
              onClick={removeLast}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
            >
              − Last
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {form.rows.map((row, idx) => {
            const bypass19 = sheetPreset === "bypass_19";
            const fieldsPart1 = bypass19 ? preset.rowFields.slice(0, 3) : preset.rowFields;
            const fieldsPart2 = bypass19 ? preset.rowFields.slice(3) : [];

            const renderField = (f) =>
              f.type === "checkbox" ? (
                <label
                  key={f.key}
                  className={`flex min-h-11 cursor-pointer items-start gap-3 sm:col-span-2 ${isWideRowField(f) ? "sm:col-span-2" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={!!row[f.key]}
                    onChange={(e) => setCell(idx, f.key, e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-800">{f.label}</span>
                </label>
              ) : isWideRowField(f) ? (
                <div key={f.key} className="sm:col-span-2">
                  <label className={labelCls}>{f.label}</label>
                  <textarea
                    rows={3}
                    value={row[f.key] ?? ""}
                    onChange={(e) => setCell(idx, f.key, e.target.value)}
                    className={`${inputCls} min-h-[5rem] resize-y`}
                  />
                </div>
              ) : (
                <div
                  key={f.key}
                  className={f.key === "findings" ? "sm:col-span-2" : ""}
                >
                  <label className={labelCls}>{f.label}</label>
                  <input
                    value={row[f.key] ?? ""}
                    onChange={(e) => setCell(idx, f.key, e.target.value)}
                    className={inputCls}
                  />
                </div>
              );

            return (
              <div
                key={idx}
                data-obs-entry={`${scrollPrefix}-${idx}`}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
              >
                <p className="mb-3 text-xs font-bold text-slate-600">Entry {idx + 1}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {fieldsPart1.map(renderField)}
                  {bypass19 ? (
                    <div className="sm:col-span-2 border-t border-slate-200 pt-3">
                      <p className="text-sm font-semibold text-slate-900">
                        Step 2, Bypass diode thermal test
                      </p>
                    </div>
                  ) : null}
                  {fieldsPart2.map(renderField)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <label className={labelCls}>Supplementary information</label>
        <textarea
          rows={4}
          value={form.supplementary ?? ""}
          onChange={(e) => onChange({ ...form, supplementary: e.target.value })}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>

      {showFooter && (preset.footerFields || []).length > 0 ? (
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="mb-3 text-xs font-bold uppercase text-slate-700">
            Tested by / Checked by
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {(preset.footerFields || []).map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  value={form.footer?.[f.key] ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      footer: {
                        ...(form.footer || {}),
                        [f.key]: e.target.value,
                      },
                    })
                  }
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
