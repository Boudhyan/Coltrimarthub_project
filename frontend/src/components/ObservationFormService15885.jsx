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

function text(v) {
  return typeof v === "string" ? v : "";
}

function T({ value, onChange, k, label }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={text(value[k])}
        onChange={(e) => onChange({ ...value, [k]: e.target.value })}
      />
    </div>
  );
}

export default function ObservationFormService15885({
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
            <T key={k} value={v} onChange={onChange} k={k} label={l} />
          ))}
        </section>
      ) : null}

      <section className={showHeader ? "mt-5 border-t border-slate-200 pt-4" : ""}>
        {variant === "creepage" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              7 (16) - Creepage distances and clearances
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <T value={v} onChange={onChange} k="modelNo" label="Model no." />
              <T value={v} onChange={onChange} k="tableRef" label="Table 3 reference" />
            </div>
            {[
              ["crBasic", "Measured creepage - basic insulation (live parts diff polarity)"],
              ["crRein", "Measured creepage - reinforced insulation (live parts vs fixing cover)"],
              ["clBasic", "Measured clearance - basic insulation (live parts diff polarity)"],
              ["clRein", "Measured clearance - reinforced insulation (live parts vs fixing cover)"],
            ].map(([k, l]) => (
              <T key={k} value={v} onChange={onChange} k={k} label={l} />
            ))}
            <T
              value={v}
              onChange={onChange}
              k="remarks"
              label="Result / remarks"
            />
          </div>
        ) : null}

        {variant === "electric" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              12 (12) - Electric strength
            </h3>
            <T
              value={v}
              onChange={onChange}
              k="afterClause11"
              label="Immediately after clause 11 electric strength test for 1 min"
            />
            <T
              value={v}
              onChange={onChange}
              k="working42"
              label="Working voltage 42 V, test voltage 500 V"
            />
            <T
              value={v}
              onChange={onChange}
              k="workingGt42"
              label="Working voltage > 42 V 1000 V, test voltage (V)"
            />
            <T value={v} onChange={onChange} k="basicIns" label="Basic insulation, 2U + 1000 V" />
            <T value={v} onChange={onChange} k="suppIns" label="Supplementary insulation, 2U + 1000 V" />
            <T value={v} onChange={onChange} k="reinIns" label="Double/reinforced insulation, 4U + 2000 V" />
            <T value={v} onChange={onChange} k="flashover" label="No flashover or breakdown" />
          </div>
        ) : null}

        {variant === "moisture" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              11 (11) - Moisture resistance and insulation
            </h3>
            <T
              value={v}
              onChange={onChange}
              k="condition"
              label="After storage 48 h at 91-95% RH and 20-30 C, insulation resistance with DC 500 V, 1 min (M)"
            />
            <T
              value={v}
              onChange={onChange}
              k="basicInsulation"
              label="For basic insulation 2 MΩ"
            />
            <T value={v} onChange={onChange} k="result" label="Result / observation" />
          </div>
        ) : null}

        {variant === "heat" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              19 (18) - Resistance to heat, fire and tracking
            </h3>
            {[
              ["ballPressure", "(18.1) Ball-pressure test"],
              ["ballPart1", "Part tested / temperature 1"],
              ["ballPart2", "Part tested / temperature 2"],
              ["printedBoards", "(18.2) Test of printed boards - part tested"],
              ["glowwire", "(18.3) Glowwire test (650C) - part tested"],
              ["needleFlame", "(18.4) Needle flame test (10 s) - part tested"],
              ["tracking", "(18.5) Tracking test - part tested"],
            ].map(([k, l]) => (
              <T key={k} value={v} onChange={onChange} k={k} label={l} />
            ))}
            <T value={v} onChange={onChange} k="result" label="Result / observation" />
          </div>
        ) : null}
      </section>

      {showFooter ? (
        <section className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="mb-3 text-xs font-bold uppercase text-slate-700">
            Tested by / Checked by
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <T value={v} onChange={onChange} k="testedBySign" label="Tested By - Sign." />
            <T value={v} onChange={onChange} k="checkedBySign" label="Checked By - Sign." />
            <T value={v} onChange={onChange} k="testedByName" label="Tested By - Name" />
            <T value={v} onChange={onChange} k="checkedByName" label="Checked By - Name" />
            <T value={v} onChange={onChange} k="testedByDate" label="Tested By - Date" />
            <T value={v} onChange={onChange} k="checkedByDate" label="Checked By - Date" />
          </div>
        </section>
      ) : null}
    </div>
  );
}

