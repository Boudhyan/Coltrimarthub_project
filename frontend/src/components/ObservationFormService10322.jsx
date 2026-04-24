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

export default function ObservationFormService10322({
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
        {variant === "creepageClearance" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              8 (11) - Creepage distances and clearances
            </h3>
            <Field value={v} onChange={onChange} k="workingVoltage" label="8 (11.2) Working voltage (V)" />
            <Field value={v} onChange={onChange} k="voltageForm" label="Voltage form" />
            <Field value={v} onChange={onChange} k="pti" label="PTI" />
            <Field
              value={v}
              onChange={onChange}
              k="impulseCategory"
              label="Impulse withstand category (Normal category II / Category III Annex U)"
            />
            <Field
              value={v}
              onChange={onChange}
              k="currentCarrying"
              label="Current-carrying parts of different polarity: cr (mm); cl (mm)"
            />
            <Field value={v} onChange={onChange} k="result" label="Test result / observation" />
          </div>
        ) : null}

        {variant === "enduranceThermal" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              13 (12) - Endurance test and thermal test
            </h3>
            <Field value={v} onChange={onChange} k="enduranceTest" label="Endurance test" />
            <Field value={v} onChange={onChange} k="mountingPosition" label="Mounting position" />
            <Field value={v} onChange={onChange} k="testTemperature" label="Test temperature (C)" />
            <Field value={v} onChange={onChange} k="totalDuration" label="Total duration (h)" />
            <Field
              value={v}
              onChange={onChange}
              k="supplyVoltage"
              label="Supply voltage: Un factor; calculated voltage (V)"
            />
            <Field
              value={v}
              onChange={onChange}
              k="thermalTestNormal"
              label="13 (12.4) Thermal test (normal operation)"
            />
            <Field value={v} onChange={onChange} k="result" label="Test result / observation" />
          </div>
        ) : null}

        {variant === "humidityInsulation" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              14 (9) and 15 (10) - Humidity / insulation / electric strength
            </h3>
            <Field value={v} onChange={onChange} k="humidity48h" label="14 (9.3) Humidity test 48 h" />
            <Field
              value={v}
              onChange={onChange}
              k="insulationSelvPolarity"
              label="SELV: between current-carrying parts of different polarity"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insulationSelvMounting"
              label="SELV: between current-carrying parts and mounting surface"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insulationSelvMetal"
              label="SELV: between current-carrying parts and metal parts"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insulationNonSelvPolarity"
              label="Other than SELV: between live parts of different polarity"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insulationNonSelvMounting"
              label="Other than SELV: between live parts and mounting surface"
            />
            <Field
              value={v}
              onChange={onChange}
              k="insulationNonSelvMetal"
              label="Other than SELV: between live parts and metal parts"
            />
            <Field value={v} onChange={onChange} k="electricSelvPolarity" label="Electric strength SELV: parts of different polarity" />
            <Field value={v} onChange={onChange} k="electricSelvMounting" label="Electric strength SELV: parts and mounting surface" />
            <Field value={v} onChange={onChange} k="electricSelvMetal" label="Electric strength SELV: parts and metal parts" />
            <Field value={v} onChange={onChange} k="electricNonSelvPolarity" label="Electric strength other than SELV: live parts of different polarity" />
            <Field value={v} onChange={onChange} k="electricNonSelvMounting" label="Electric strength other than SELV: live parts and mounting surface" />
            <Field value={v} onChange={onChange} k="electricNonSelvMetal" label="Electric strength other than SELV: live parts and metal parts" />
            <Field value={v} onChange={onChange} k="touchCurrent" label="15 (10.3) Touch current / protective conductor current (mA)" />
            <Field value={v} onChange={onChange} k="result" label="Test result / observation" />
          </div>
        ) : null}

        {variant === "earthing" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              9 (7) - Provision for earthing
            </h3>
            <Field value={v} onChange={onChange} k="resistanceRequirement" label="Resistance < 0.5 Ω" />
            <Field value={v} onChange={onChange} k="measuredResistance" label="Measured resistance" />
            <Field value={v} onChange={onChange} k="result" label="Test result / observation" />
          </div>
        ) : null}

        {variant === "heatFireTracking" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              16 (13) - Resistance to heat, fire and tracking
            </h3>
            <Field value={v} onChange={onChange} k="ballPart1" label="16 (13.2.1) Ball-pressure test: part tested; temperature (C) - 1" />
            <Field value={v} onChange={onChange} k="ballPart2" label="16 (13.2.1) Ball-pressure test: part tested; temperature (C) - 2" />
            <Field value={v} onChange={onChange} k="needleFlame" label="16 (13.3.1) Needle-flame test (10 s): part tested" />
            <Field value={v} onChange={onChange} k="glowwire1" label="16 (13.3.2) Glowwire test (650C): part tested - 1" />
            <Field value={v} onChange={onChange} k="glowwire2" label="16 (13.3.2) Glowwire test (650C): part tested - 2" />
            <Field value={v} onChange={onChange} k="tracking" label="16 (13.4.1) Tracking test: part tested" />
            <Field value={v} onChange={onChange} k="result" label="Test result / observation" />
          </div>
        ) : null}

        {variant === "temperatureMeasurement" ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Annex 2 - Temperature measurements
            </h3>
            <Field value={v} onChange={onChange} k="typeReference" label="Type reference" />
            <Field value={v} onChange={onChange} k="lampUsed" label="Lamp used" />
            <Field value={v} onChange={onChange} k="lampControlGear" label="Lamp control gear used" />
            <Field value={v} onChange={onChange} k="mountingPosition" label="Mounting position of luminaire" />
            <Field value={v} onChange={onChange} k="supplyWattage" label="Supply wattage (W)" />
            <Field value={v} onChange={onChange} k="supplyCurrent" label="Supply current (A)" />
            <Field value={v} onChange={onChange} k="powerFactor" label="Calculated power factor" />
            <Field value={v} onChange={onChange} k="test1RatedVoltage" label="Test 1: rated voltage" />
            <Field value={v} onChange={onChange} k="test2OverVoltage" label="Test 2: 1.06x rated voltage or 1.05x rated wattage" />
            <Field value={v} onChange={onChange} k="part" label="Part" />
            <Field value={v} onChange={onChange} k="normalTest1" label="Clause 12.4 normal - test 1" />
            <Field value={v} onChange={onChange} k="normalTest2" label="Clause 12.4 normal - test 2" />
            <Field value={v} onChange={onChange} k="limit" label="Limit" />
            <Field value={v} onChange={onChange} k="supplementaryInfo" label="Supplementary information" />
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

