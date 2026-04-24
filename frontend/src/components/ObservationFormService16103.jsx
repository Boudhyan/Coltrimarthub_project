import { inputCls, labelCls } from "../observation/formStyles";

const H_FIELDS = [
  ["sampleCode", "SAMPLE CODE/ JOB ORDER NO."],
  ["sampleDescription", "SAMPLE DESCRIPTION"],
  ["envTemp", "ENVIRONMENTAL CONDITIONS - TEMP."],
  ["envHumidity", "ENVIRONMENTAL CONDITIONS - HUMIDITY"],
  ["testStart", "DATE OF TESTING - START"],
  ["testEnd", "DATE OF TESTING - END"],
  ["refStandardMethod", "REF.STANDARD/TEST METHOD"],
  ["equipmentUsed", "EQUIPMENT USED (EQUIP.ID)"],
];

function s(v) {
  return typeof v === "string" ? v : "";
}

function Field({ value, onChange, k, label }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={s(value[k])}
        onChange={(e) => onChange({ ...value, [k]: e.target.value })}
      />
    </div>
  );
}

export default function ObservationFormService16103({
  value,
  onChange,
  variant,
  showHeader = true,
  showFooter = false,
}) {
  const v = value && typeof value === "object" ? value : {};

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {showHeader ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {H_FIELDS.map(([k, l]) => (
            <Field key={k} value={v} onChange={onChange} k={k} label={l} />
          ))}
        </section>
      ) : null}

      <section className={showHeader ? "mt-5 border-t border-slate-200 pt-4" : ""}>
        {variant === "electricStrength" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              12 (12) - Electric strength
            </h3>
            <Field
              value={v}
              onChange={onChange}
              k="afterClause11"
              label="Immediately after clause 11 electric strength test for 1 min"
            />
            <Field
              value={v}
              onChange={onChange}
              k="working42"
              label="Working voltage 42 V, test voltage 500 V"
            />
            <Field
              value={v}
              onChange={onChange}
              k="workingGt42"
              label="Working voltage > 42 V 1000 V, test voltage (V)"
            />
            <Field value={v} onChange={onChange} k="basicIns" label="Basic insulation, 2U + 1000 V" />
            <Field value={v} onChange={onChange} k="suppIns" label="Supplementary insulation, 2U + 1000 V" />
            <Field value={v} onChange={onChange} k="reinIns" label="Double or reinforced insulation, 4U + 2000 V" />
            <Field value={v} onChange={onChange} k="flashover" label="No flashover or breakdown" />
          </div>
        ) : null}

        {variant === "moistureInsulation" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              11 - Moisture resistance and insulation
            </h3>
            <Field
              value={v}
              onChange={onChange}
              k="condition"
              label="After storage 48 h at 91-95% RH and 20-30 C, insulation resistance with DC 500 V (M)"
            />
            <Field
              value={v}
              onChange={onChange}
              k="basicInsulation"
              label="For basic insulation 2 MΩ"
            />
            <Field
              value={v}
              onChange={onChange}
              k="doubleOrReinforced"
              label="For double or reinforced insulation 4 MΩ"
            />
            <Field value={v} onChange={onChange} k="result" label="Result / observation" />
          </div>
        ) : null}

        {variant === "heatFireTracking" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              18 - Resistance to heat, fire and tracking
            </h3>
            <Field value={v} onChange={onChange} k="ballPressure" label="(18.1) Ball-pressure test" />
            <Field value={v} onChange={onChange} k="ballPartTemp" label="- part tested; temperature (C)" />
            <Field value={v} onChange={onChange} k="printedBoards" label="(18.2) Test of printed boards - part tested" />
            <Field value={v} onChange={onChange} k="glowwire" label="(18.3) Glowwire test (650C) - part tested" />
            <Field value={v} onChange={onChange} k="needleFlame" label="(18.4) Needle flame test (10 s) - part tested" />
            <Field value={v} onChange={onChange} k="tracking" label="(18.5) Tracking test - part tested" />
            <Field value={v} onChange={onChange} k="result" label="Result / observation" />
          </div>
        ) : null}
      </section>

      {showFooter ? (
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="mb-3 text-xs font-bold uppercase text-slate-700">
            Tested by / Checked by
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field value={v} onChange={onChange} k="testedBySign" label="Tested By - Sign." />
            <Field value={v} onChange={onChange} k="checkedBySign" label="Checked By - Sign." />
            <Field value={v} onChange={onChange} k="testedByName" label="Tested By - Name" />
            <Field value={v} onChange={onChange} k="checkedByName" label="Checked By - Name" />
            <Field value={v} onChange={onChange} k="testedByDate" label="Tested By - Date" />
            <Field value={v} onChange={onChange} k="checkedByDate" label="Checked By - Date" />
          </div>
        </section>
      ) : null}
    </div>
  );
}

