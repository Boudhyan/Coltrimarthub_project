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

function t(v) {
  return typeof v === "string" ? v : "";
}

function Field({ value, onChange, k, label }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={t(value[k])}
        onChange={(e) => onChange({ ...value, [k]: e.target.value })}
      />
    </div>
  );
}

export default function ObservationFormService16102({
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
        {variant === "capTempRise" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              10 - Cap temperature rise
            </h3>
            <Field
              value={v}
              onChange={onChange}
              k="requirement"
              label="The cap temperature rise Δts of the lamp shall not exceed 120 K."
            />
            <Field value={v} onChange={onChange} k="measuredDeltaTs" label="Measured Δts (K)" />
            <Field value={v} onChange={onChange} k="result" label="Result / observation" />
          </div>
        ) : null}

        {variant === "creepageClearance" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              14 - Clearance and creepage distance measurements
            </h3>
            {[
              ["lnUp", "Between Line-neutral - UP (V)"],
              ["lnUrms", "Between Line-neutral - Urms (V)"],
              ["lnReqCl", "Between Line-neutral - Required cl (mm)"],
              ["lnMeasCl", "Between Line-neutral - Measured cl (mm)"],
              ["lnReqCr", "Between Line-neutral - Required cr (mm)"],
              ["lnMeasCr", "Between Line-neutral - Measured cr (mm)"],
              ["laUp", "Between Live and accessible conductive part - UP (V)"],
              ["laUrms", "Between Live and accessible conductive part - Urms (V)"],
              ["laReqCl", "Between Live and accessible conductive part - Required cl (mm)"],
              ["laMeasCl", "Between Live and accessible conductive part - Measured cl (mm)"],
              ["laReqCr", "Between Live and accessible conductive part - Required cr (mm)"],
              ["laMeasCr", "Between Live and accessible conductive part - Measured cr (mm)"],
            ].map(([k, l]) => (
              <Field key={k} value={v} onChange={onChange} k={k} label={l} />
            ))}
            <Field
              value={v}
              onChange={onChange}
              k="supplementaryInfo"
              label="Supplementary information"
            />
          </div>
        ) : null}

        {variant === "insulationElectric" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              8 - Insulation resistance and electric strength
            </h3>
            <Field
              value={v}
              onChange={onChange}
              k="insulationCondition"
              label="8.1.1 After 48 h at 91-95% RH and 25-35C, insulation resistance with DC 500 V (M)"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insBtwLiveAccessible"
              label="4 M between live part and accessible part"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insB22ShellContacts"
              label="5 M between shell and contacts of B22 cap"
            />
            <Field
              value={v}
              onChange={onChange}
              k="electricStrengthCondition"
              label="8.2 Electric strength test for 1 min immediately after insulation test"
            />
            <Field value={v} onChange={onChange} k="basicInsulation" label="Basic insulation, 2U + 1000" />
            <Field value={v} onChange={onChange} k="reinforcedInsulation" label="Reinforced insulation, 4U + 2750 V" />
            <Field value={v} onChange={onChange} k="flashover" label="No flashover or breakdown" />
          </div>
        ) : null}

        {variant === "heatFireTracking" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              11 & 12 - Ball pressure / Glow wire
            </h3>
            <Field
              value={v}
              onChange={onChange}
              k="allowedImpression"
              label="Allowed impression diameter (mm)"
            />
            <Field value={v} onChange={onChange} k="ballPart" label="Ball pressure - Part" />
            <Field value={v} onChange={onChange} k="ballTemp" label="Ball pressure - Test temperature (C)" />
            <Field
              value={v}
              onChange={onChange}
              k="ballImpression"
              label="Ball pressure - Impression diameter (mm)"
            />
            <Field value={v} onChange={onChange} k="glowPart" label="Glow wire - Part" />
            <Field value={v} onChange={onChange} k="glowTemp" label="Glow wire - Test temperature (C)" />
            <Field
              value={v}
              onChange={onChange}
              k="glowExtinguish"
              label="Glow wire - Time to self-extinguished flame"
            />
            <Field
              value={v}
              onChange={onChange}
              k="supplementaryInfo"
              label="Supplementary information"
            />
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

