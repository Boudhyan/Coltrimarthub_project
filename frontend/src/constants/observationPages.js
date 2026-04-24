/** Legacy backend keys (migration in observationPageModel). */
export const PAGE_KEY_MQT_06_1_INI = "mqt_06_1_ini";
export const PAGE_KEY_MQT_19_1 = "mqt_19_1";

/** Same value as service_requests.service_type_key for MQT 06.1 template. */
export const SERVICE_TYPE_MQT_06_1_INI = "mqt_06_1_ini";

export function emptySampleRow() {
  return {
    sampleNo: "",
    isc: "",
    voc: "",
    solarImp: "",
    solarVmp: "",
    naturalPmax: "",
    naturalFf: "",
    result: "",
    /** Tables 03.1 / 03.3: measured vs min. calc. (per PDF columns for [A]/[V]/[W]) */
    iscMeas: "",
    iscMinCalc: "",
    vocMeas: "",
    vocMinCalc: "",
    solarImpMeas: "",
    solarImpMinCalc: "",
    solarVmpMeas: "",
    solarVmpMinCalc: "",
    naturalPmaxMeas: "",
    naturalPmaxMinCalc: "",
  };
}

function migrateStcSampleRow(s) {
  const o = { ...emptySampleRow(), ...s };
  if (!o.iscMeas && o.isc) o.iscMeas = o.isc;
  if (!o.vocMeas && o.voc) o.vocMeas = o.voc;
  if (!o.solarImpMeas && o.solarImp) o.solarImpMeas = o.solarImp;
  if (!o.solarVmpMeas && o.solarVmp) o.solarVmpMeas = o.solarVmp;
  if (!o.naturalPmaxMeas && o.naturalPmax) o.naturalPmaxMeas = o.naturalPmax;
  return o;
}

export function defaultPage2Form() {
  return {
    testMethod: "",
    solarSimulatorUsed: false,
    naturalSunlightUsed: false,
    /** BNPI tables (e.g. PDF page 3): front / back irradiance [W/m²] */
    bnpiFrontIrradianceWm2: "",
    bnpiBackIrradianceWm2: "",
    /** STC from back (table 03.2 / PDF p.10) */
    backsideIrradianceWm2: "",
    /** Reference irradiance on front (masked) when measuring from back */
    stcFrontReferenceIrradianceWm2: "",
    moduleTempC: "",
    pulsedSolarSimulator: false,
    steadyStateSolarSimulator: false,
    samples: [emptySampleRow()],
    supplementary: "",
  };
}

export function mergePage2Form(saved) {
  const d = defaultPage2Form();
  if (!saved || typeof saved !== "object") return d;
  return {
    testMethod:
      typeof saved.testMethod === "string" ? saved.testMethod : d.testMethod,
    solarSimulatorUsed:
      typeof saved.solarSimulatorUsed === "boolean"
        ? saved.solarSimulatorUsed
        : d.solarSimulatorUsed,
    naturalSunlightUsed:
      typeof saved.naturalSunlightUsed === "boolean"
        ? saved.naturalSunlightUsed
        : d.naturalSunlightUsed,
    bnpiFrontIrradianceWm2:
      typeof saved.bnpiFrontIrradianceWm2 === "string"
        ? saved.bnpiFrontIrradianceWm2
        : d.bnpiFrontIrradianceWm2,
    bnpiBackIrradianceWm2:
      typeof saved.bnpiBackIrradianceWm2 === "string"
        ? saved.bnpiBackIrradianceWm2
        : d.bnpiBackIrradianceWm2,
    backsideIrradianceWm2:
      typeof saved.backsideIrradianceWm2 === "string"
        ? saved.backsideIrradianceWm2
        : d.backsideIrradianceWm2,
    stcFrontReferenceIrradianceWm2:
      typeof saved.stcFrontReferenceIrradianceWm2 === "string"
        ? saved.stcFrontReferenceIrradianceWm2
        : d.stcFrontReferenceIrradianceWm2,
    moduleTempC:
      typeof saved.moduleTempC === "string" ? saved.moduleTempC : d.moduleTempC,
    pulsedSolarSimulator:
      typeof saved.pulsedSolarSimulator === "boolean"
        ? saved.pulsedSolarSimulator
        : d.pulsedSolarSimulator,
    steadyStateSolarSimulator:
      typeof saved.steadyStateSolarSimulator === "boolean"
        ? saved.steadyStateSolarSimulator
        : d.steadyStateSolarSimulator,
    samples:
      Array.isArray(saved.samples) && saved.samples.length > 0
        ? saved.samples.map((s) => migrateStcSampleRow(s))
        : d.samples,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}

function emptyMqt191Side() {
  return {
    integratedIrradiationKwhm2: "",
    irradianceWm2: "",
    moduleTempC: "",
    resistiveLoad: "",
    pmaxEndW: "",
    spreadPmaxPminPct: "",
    stableYesNo: "",
  };
}

export function emptyMqt191Row() {
  return {
    sampleNo: "",
    testCycle: "",
    solar: emptyMqt191Side(),
    natural: emptyMqt191Side(),
  };
}

export function defaultMqt191Form() {
  return {
    lightExposureSolar: false,
    lightExposureNatural: false,
    stabilizationCriterion: "",
    rows: [emptyMqt191Row()],
    supplementary: "",
  };
}

export function mergeMqt191Form(saved) {
  const d = defaultMqt191Form();
  if (!saved || typeof saved !== "object") return d;
  const mergeSide = (s, def) => ({
    ...def,
    ...(typeof s === "object" && s ? s : {}),
  });
  const mergeRow = (r) => {
    const base = emptyMqt191Row();
    if (!r || typeof r !== "object") return base;
    return {
      ...base,
      ...r,
      solar: mergeSide(r.solar, base.solar),
      natural: mergeSide(r.natural, base.natural),
    };
  };
  return {
    lightExposureSolar:
      typeof saved.lightExposureSolar === "boolean"
        ? saved.lightExposureSolar
        : d.lightExposureSolar,
    lightExposureNatural:
      typeof saved.lightExposureNatural === "boolean"
        ? saved.lightExposureNatural
        : d.lightExposureNatural,
    stabilizationCriterion:
      typeof saved.stabilizationCriterion === "string"
        ? saved.stabilizationCriterion
        : d.stabilizationCriterion,
    rows:
      Array.isArray(saved.rows) && saved.rows.length > 0
        ? saved.rows.map(mergeRow)
        : d.rows,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}
