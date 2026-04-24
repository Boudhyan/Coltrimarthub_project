import { emptyHotSpot22Form } from "../constants/observationPageModel";
import { inputCls, labelCls } from "../observation/formStyles";

const COL_KEYS = ["low1", "low2", "low3", "high", "permanent"];
const COL_LABELS = ["Low", "Low", "Low", "High", "Permanent"];

const ROW_DEFS = [
  { key: "selectedHotspotCells", label: "Selected hot-spot cells" },
  { key: "shadingRate", label: "Shading rate [%]" },
  { key: "maxCellTemp", label: "Max. measured cell temperature in each cell [°C]" },
  { key: "testDurationH", label: "Test duration of each shading [h]" },
  { key: "irradianceWm2", label: "Irradiance during shading [W/m²]" },
];

export default function ObservationFormHotSpotPage22({ value: form, onChange }) {
  const d = form && form.header && form.wbt ? form : emptyHotSpot22Form();
  const header = d.header;
  const wbt = d.wbt;

  const setHeader = (key, v) => onChange({ ...d, header: { ...header, [key]: v } });
  const setCol = (colKey, fieldKey, v) =>
    onChange({
      ...d,
      wbt: {
        ...wbt,
        [colKey]: { ...wbt[colKey], [fieldKey]: v },
      },
    });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 11 : MQT 09 — Hot-spot endurance test
        </h2>

        <div className="mb-4">
          <label className={labelCls}>Sample #</label>
          <input
            value={header.sampleNo ?? ""}
            onChange={(e) => setHeader("sampleNo", e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Procedure of technology</p>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2">
              <input
                type="checkbox"
                checked={!!header.techWbt}
                onChange={(e) => setHeader("techWbt", e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">
                Wafer-based technologies (WBT) MQT 09.1
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2">
              <input
                type="checkbox"
                checked={!!header.techMli}
                onChange={(e) => setHeader("techMli", e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">
                Monolithically integrated (MLI) thin film technologies MQT 09.2
              </span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Cell interconnection circuit</p>
          <div className="flex flex-wrap gap-6">
            {[
              ["cellCircuitS", "S"],
              ["cellCircuitSp", "SP"],
              ["cellCircuitPs", "PS"],
            ].map(([k, lab]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!header[k]}
                  onChange={(e) => setHeader(k, e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm font-medium text-slate-800">{lab}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Type of light source</p>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={!!header.lightPulse}
                onChange={(e) => setHeader("lightPulse", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">Pulse solar simulator</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={!!header.lightSteady}
                onChange={(e) => setHeader("lightSteady", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">Steady state solar simulator</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={!!header.lightNatural}
                onChange={(e) => setHeader("lightNatural", e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelCls}>Module temperature at thermal equilibrium [°C]</label>
          <input
            value={header.moduleTempEquilibrium ?? ""}
            onChange={(e) => setHeader("moduleTempEquilibrium", e.target.value)}
            className={inputCls}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-900">
          TABLE 11.1 : MQT 09 — Hot-spot endurance test for WBT
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-slate-100 px-2 py-2 text-left font-semibold text-slate-800" />
                {COL_KEYS.map((ck, i) => (
                  <th
                    key={ck}
                    className="border border-slate-200 bg-slate-100 px-2 py-2 text-center font-semibold text-slate-800"
                  >
                    {COL_LABELS[i]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROW_DEFS.map((rd) => (
                <tr key={rd.key}>
                  <td className="border border-slate-200 bg-slate-50/80 px-2 py-2 align-top text-slate-800">
                    {rd.label}
                  </td>
                  {COL_KEYS.map((ck) => (
                    <td key={ck} className="border border-slate-200 p-1 align-top">
                      <input
                        value={wbt[ck]?.[rd.key] ?? ""}
                        onChange={(e) => setCol(ck, rd.key, e.target.value)}
                        className={`${inputCls} min-h-9 text-sm`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Supplementary information</label>
          <textarea
            rows={4}
            value={d.supplementary ?? ""}
            onChange={(e) => onChange({ ...d, supplementary: e.target.value })}
            className={`${inputCls} min-h-[6rem] resize-y`}
          />
        </div>
      </section>
    </div>
  );
}
