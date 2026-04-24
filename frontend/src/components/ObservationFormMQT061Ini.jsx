import {
  emptySampleRow,
  defaultPage2Form,
} from "../constants/observationPages";
import { inputCls, labelCls } from "../observation/formStyles";
import { useScrollToNewEntry } from "../observation/useScrollToNewEntry";

function MeasMinCalcPair({
  label,
  unit,
  measValue,
  minValue,
  onMeas,
  onMin,
  disabled,
}) {
  return (
    <div className="sm:col-span-2">
      <p className={`${labelCls} mb-1`}>
        {label} [{unit}]
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="mb-0.5 block text-[10px] font-medium uppercase text-slate-500">
            Measured
          </span>
          <input
            inputMode="decimal"
            value={measValue ?? ""}
            onChange={(e) => onMeas(e.target.value)}
            disabled={disabled}
            className={`${inputCls} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          />
        </div>
        <div>
          <span className="mb-0.5 block text-[10px] font-medium uppercase text-slate-500">
            Min calc.
          </span>
          <input
            inputMode="decimal"
            value={minValue ?? ""}
            onChange={(e) => onMin(e.target.value)}
            disabled={disabled}
            className={`${inputCls} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   value: object,
 *   onChange: (next: object) => void,
 *   showBnpiIrradiance?: boolean,
 *   showBacksideIrradiance?: boolean,
 *   showStcPage10Extras?: boolean,
 *   stcDualElectrical?: boolean,
 * }} props
 */
export default function ObservationFormMQT061Ini({
  value,
  onChange,
  showBnpiIrradiance = false,
  showBacksideIrradiance = false,
  showStcPage10Extras = false,
  stcDualElectrical = false,
}) {
  const base = defaultPage2Form();
  const form =
    value && typeof value === "object"
      ? { ...base, ...value, samples: value.samples ?? base.samples }
      : base;

  const setField = (path, v) => onChange({ ...form, [path]: v });

  const setSample = (index, field, v) => {
    const samples = [...form.samples];
    samples[index] = { ...samples[index], [field]: v };
    onChange({ ...form, samples });
  };

  const markScrollSample = useScrollToNewEntry(form.samples.length, "mqt061");

  const addSample = () => {
    markScrollSample(form.samples.length);
    onChange({ ...form, samples: [...form.samples, emptySampleRow()] });
  };

  const removeLastSample = () => {
    if (form.samples.length <= 1) return;
    onChange({ ...form, samples: form.samples.slice(0, -1) });
  };

  const solarOff = !form.solarSimulatorUsed;
  /** Pmax / FF apply to STC outputs; allow entry when either simulator or natural is selected. */
  const pmaxFfOff = !form.solarSimulatorUsed && !form.naturalSunlightUsed;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <section>
        <label className={labelCls}>Test method</label>
        <input
          type="text"
          value={form.testMethod}
          onChange={(e) => setField("testMethod", e.target.value)}
          className={`${inputCls} mb-4`}
          placeholder="Test method…"
        />

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-800">
            Equipment / conditions (as on sheet)
          </p>

          {showBnpiIrradiance ? (
            <div className="mb-4 grid gap-3 border-b border-slate-200 pb-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Front irradiance [W/m²]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.bnpiFrontIrradianceWm2 ?? ""}
                  onChange={(e) =>
                    setField("bnpiFrontIrradianceWm2", e.target.value)
                  }
                  className={inputCls}
                  placeholder="e.g. 1000"
                />
              </div>
              <div>
                <label className={labelCls}>Back irradiance [W/m²]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.bnpiBackIrradianceWm2 ?? ""}
                  onChange={(e) =>
                    setField("bnpiBackIrradianceWm2", e.target.value)
                  }
                  className={inputCls}
                  placeholder="Measured at back"
                />
              </div>
              <p className="text-[11px] leading-snug text-slate-600 sm:col-span-2">
                BNPI: record front irradiance (often 1000 W/m²) and back-of-module
                irradiance as on the observation sheet.
              </p>
            </div>
          ) : null}

          {showBacksideIrradiance ? (
            <div className="mb-4 border-b border-slate-200 pb-4">
              <label className={labelCls}>Rear / back irradiance [W/m²]</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.backsideIrradianceWm2 ?? ""}
                onChange={(e) => setField("backsideIrradianceWm2", e.target.value)}
                className={inputCls}
                placeholder="Irradiance on rear (table 03.2)"
              />
              <p className="mt-2 text-[11px] leading-snug text-slate-600">
                STC from the back: enter rear-side irradiance per the sheet.
              </p>
            </div>
          ) : null}

          {showStcPage10Extras ? (
            <div className="mb-4 grid gap-3 border-b border-slate-200 pb-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Front reference / masked irradiance [W/m²]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.stcFrontReferenceIrradianceWm2 ?? ""}
                  onChange={(e) =>
                    setField("stcFrontReferenceIrradianceWm2", e.target.value)
                  }
                  className={inputCls}
                  placeholder="As on sheet"
                />
              </div>
              <div>
                <label className={labelCls}>Module temperature [°C]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.moduleTempC ?? ""}
                  onChange={(e) => setField("moduleTempC", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:flex-wrap sm:gap-6">
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.pulsedSolarSimulator}
                    onChange={(e) =>
                      setField("pulsedSolarSimulator", e.target.checked)
                    }
                    className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Pulsed solar simulator
                  </span>
                </label>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.steadyStateSolarSimulator}
                    onChange={(e) =>
                      setField("steadyStateSolarSimulator", e.target.checked)
                    }
                    className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Steady-state solar simulator
                  </span>
                </label>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.solarSimulatorUsed}
                onChange={(e) => setField("solarSimulatorUsed", e.target.checked)}
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-800">Solar simulator</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.naturalSunlightUsed}
                onChange={(e) => setField("naturalSunlightUsed", e.target.checked)}
                className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-800">Natural sunlight</span>
            </label>
          </div>
        </div>
      </section>

      <section className="mt-5 border-t border-slate-200 pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase text-slate-700">Measurements</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addSample}
              className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-medium text-white active:bg-slate-900"
            >
              + Sample
            </button>
            <button
              type="button"
              onClick={removeLastSample}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 active:bg-slate-50"
            >
              − Last
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {form.samples.map((row, idx) => (
            <div
              key={idx}
              data-obs-entry={`mqt061-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold text-slate-600">Sample {idx + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Sample #</label>
                  <input
                    value={row.sampleNo}
                    onChange={(e) => setSample(idx, "sampleNo", e.target.value)}
                    className={inputCls}
                  />
                </div>

                {stcDualElectrical ? (
                  <>
                    <MeasMinCalcPair
                      label="Isc"
                      unit="A"
                      measValue={row.iscMeas}
                      minValue={row.iscMinCalc}
                      onMeas={(v) => setSample(idx, "iscMeas", v)}
                      onMin={(v) => setSample(idx, "iscMinCalc", v)}
                      disabled={false}
                    />
                    <MeasMinCalcPair
                      label="Voc"
                      unit="V"
                      measValue={row.vocMeas}
                      minValue={row.vocMinCalc}
                      onMeas={(v) => setSample(idx, "vocMeas", v)}
                      onMin={(v) => setSample(idx, "vocMinCalc", v)}
                      disabled={false}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelCls}>Isc [A]</label>
                      <input
                        inputMode="decimal"
                        value={row.isc}
                        onChange={(e) => setSample(idx, "isc", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Voc [V]</label>
                      <input
                        inputMode="decimal"
                        value={row.voc}
                        onChange={(e) => setSample(idx, "voc", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </>
                )}

                <div
                  className={`sm:col-span-2 border-t border-slate-200 pt-2 text-[11px] font-semibold uppercase text-slate-500 ${
                    solarOff ? "opacity-45" : ""
                  }`}
                >
                  Solar simulator
                </div>

                {stcDualElectrical ? (
                  <>
                    <MeasMinCalcPair
                      label="Imp"
                      unit="A"
                      measValue={row.solarImpMeas}
                      minValue={row.solarImpMinCalc}
                      onMeas={(v) => setSample(idx, "solarImpMeas", v)}
                      onMin={(v) => setSample(idx, "solarImpMinCalc", v)}
                      disabled={solarOff}
                    />
                    <MeasMinCalcPair
                      label="Vmp"
                      unit="V"
                      measValue={row.solarVmpMeas}
                      minValue={row.solarVmpMinCalc}
                      onMeas={(v) => setSample(idx, "solarVmpMeas", v)}
                      onMin={(v) => setSample(idx, "solarVmpMinCalc", v)}
                      disabled={solarOff}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelCls}>Imp [A]</label>
                      <input
                        inputMode="decimal"
                        value={row.solarImp}
                        onChange={(e) => setSample(idx, "solarImp", e.target.value)}
                        disabled={solarOff}
                        className={`${inputCls} ${solarOff ? "cursor-not-allowed opacity-50" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Vmp [V]</label>
                      <input
                        inputMode="decimal"
                        value={row.solarVmp}
                        onChange={(e) => setSample(idx, "solarVmp", e.target.value)}
                        disabled={solarOff}
                        className={`${inputCls} ${solarOff ? "cursor-not-allowed opacity-50" : ""}`}
                      />
                    </div>
                  </>
                )}

                <div
                  className={`sm:col-span-2 border-t border-slate-200 pt-2 text-[11px] font-semibold uppercase text-slate-500 ${
                    pmaxFfOff ? "opacity-45" : ""
                  }`}
                >
                  Pmax / FF (STC)
                </div>

                {stcDualElectrical ? (
                  <MeasMinCalcPair
                    label="Pmax"
                    unit="W"
                    measValue={row.naturalPmaxMeas}
                    minValue={row.naturalPmaxMinCalc}
                    onMeas={(v) => setSample(idx, "naturalPmaxMeas", v)}
                    onMin={(v) => setSample(idx, "naturalPmaxMinCalc", v)}
                    disabled={pmaxFfOff}
                  />
                ) : (
                  <div>
                    <label className={labelCls}>Pmax [W]</label>
                    <input
                      inputMode="decimal"
                      value={row.naturalPmax}
                      onChange={(e) => setSample(idx, "naturalPmax", e.target.value)}
                      disabled={pmaxFfOff}
                      className={`${inputCls} ${pmaxFfOff ? "cursor-not-allowed opacity-50" : ""}`}
                    />
                  </div>
                )}

                <div>
                  <label className={labelCls}>FF [%]</label>
                  <input
                    inputMode="decimal"
                    value={row.naturalFf}
                    onChange={(e) => setSample(idx, "naturalFf", e.target.value)}
                    disabled={pmaxFfOff}
                    className={`${inputCls} ${pmaxFfOff ? "cursor-not-allowed opacity-50" : ""}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Result</label>
                  <input
                    value={row.result}
                    onChange={(e) => setSample(idx, "result", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <label className={labelCls}>Supplementary information</label>
        <textarea
          rows={4}
          value={form.supplementary}
          onChange={(e) => setField("supplementary", e.target.value)}
          className={`${inputCls} min-h-[6rem] resize-y`}
        />
      </section>
    </div>
  );
}
