import { SHEET_PRESETS } from "./sheetPresets";
import {
  PDF_PAGE_MANIFEST,
  MANIFEST_BY_STORAGE_KEY,
  ALL_MANIFEST_STORAGE_KEYS,
} from "./pdfObservationManifest";
import {
  emptySampleRow,
  mergePage2Form,
  defaultPage2Form,
  emptyMqt191Row,
  mergeMqt191Form,
  defaultMqt191Form,
  PAGE_KEY_MQT_06_1_INI,
  PAGE_KEY_MQT_19_1,
} from "./observationPages";
import {
  emptyPage23Form,
  mergePage23Form,
  sanitizePage23Form,
  emptyPage24Form,
  mergePage24Form,
  sanitizePage24Form,
  emptyPage25Form,
  mergePage25Form,
  sanitizePage25Form,
  emptyPage26Form,
  mergePage26Form,
  sanitizePage26Form,
  emptyPage27Form,
  mergePage27Form,
  sanitizePage27Form,
  emptyPage28Form,
  mergePage28Form,
  sanitizePage28Form,
  emptyPage29Form,
  mergePage29Form,
  sanitizePage29Form,
} from "./observationPages23to30";
import {
  emptyPage31Form,
  mergePage31Form,
  sanitizePage31Form,
  emptyPage32Form,
  mergePage32Form,
  sanitizePage32Form,
  emptyPage33Form,
  mergePage33Form,
  sanitizePage33Form,
  emptyPage35Form,
  mergePage35Form,
  sanitizePage35Form,
  emptyPage36Form,
  mergePage36Form,
  sanitizePage36Form,
  emptyPage37Form,
  mergePage37Form,
  sanitizePage37Form,
  emptyPage38Form,
  mergePage38Form,
  sanitizePage38Form,
  emptyPage40Form,
  mergePage40Form,
  sanitizePage40Form,
} from "./observationPages31to40";
import {
  emptyPage41Form,
  mergePage41Form,
  sanitizePage41Form,
  emptyPage42Form,
  mergePage42Form,
  sanitizePage42Form,
  emptyPage43Form,
  mergePage43Form,
  sanitizePage43Form,
  emptyPage44Form,
  mergePage44Form,
  sanitizePage44Form,
  emptyPage47Form,
  mergePage47Form,
  sanitizePage47Form,
  emptyPage48Form,
  mergePage48Form,
  sanitizePage48Form,
  emptyPage49Form,
  mergePage49Form,
  sanitizePage49Form,
  emptyPage50A47Form,
  mergePage50A47Form,
  mergePage50A47Combined,
  sanitizePage50A47Form,
  emptyPage52Form,
  mergePage52Form,
  sanitizePage52Form,
  emptyPage53Form,
  mergePage53Form,
  sanitizePage53Form,
  emptyPage54Form,
  mergePage54Form,
  sanitizePage54Form,
} from "./observationPages41to54";

export const ALL_MANIFEST_PAGE_KEYS = ALL_MANIFEST_STORAGE_KEYS;

/** Do not round-trip these into `unknownPages`; canonical data lives in page_02 / page_04. */
const LEGACY_OBSERVATION_KEYS = new Set([
  PAGE_KEY_MQT_06_1_INI,
  PAGE_KEY_MQT_19_1,
]);
const SERVICE_15885_CUSTOM_PRESETS = new Set([
  "svc_15885_creepage_clearance",
  "svc_15885_electric_strength",
  "svc_15885_moisture_insulation",
  "svc_15885_heat_fire_tracking",
]);
const SERVICE_16102_CUSTOM_PRESETS = new Set([
  "svc_16102_cap_temperature_rise",
  "svc_16102_creepage_clearance",
  "svc_16102_insulation_electric_strength",
  "svc_16102_heat_fire_tracking",
]);
const SERVICE_16103_CUSTOM_PRESETS = new Set([
  "svc_16103_electric_strength",
  "svc_16103_moisture_insulation",
  "svc_16103_heat_fire_tracking",
]);
const SERVICE_10322_CUSTOM_PRESETS = new Set([
  "svc_10322_creepage_clearance",
  "svc_10322_endurance_thermal",
  "svc_10322_humidity_insulation",
  "svc_10322_earthing",
  "svc_10322_heat_fire_tracking",
  "svc_10322_temperature_measurement",
]);
const SERVICE_SPECIAL_CUSTOM_PRESETS = new Set([
  ...SERVICE_15885_CUSTOM_PRESETS,
  ...SERVICE_16102_CUSTOM_PRESETS,
  ...SERVICE_16103_CUSTOM_PRESETS,
  ...SERVICE_10322_CUSTOM_PRESETS,
]);

function isEmptyStringRecord(obj) {
  if (!obj || typeof obj !== "object") return true;
  return Object.values(obj).every(
    (v) => v == null || v === "" || (typeof v === "object" && isEmptyStringRecord(v)),
  );
}

function trimTrailingRows(rows, isEmptyRow, emptyRow) {
  const list = Array.isArray(rows) ? [...rows] : [emptyRow];
  while (list.length > 1 && isEmptyRow(list[list.length - 1])) {
    list.pop();
  }
  return list.length ? list : [emptyRow];
}

function trimTrailingStcLikeSamples(samples) {
  const empty = emptySampleRow();
  return trimTrailingRows(samples, isEmptyStringRecord, empty);
}

function isEmptyMqt191Side(side) {
  return isEmptyStringRecord(side);
}

function isEmptyMqt191Row(r) {
  if (!r || typeof r !== "object") return true;
  if (String(r.sampleNo || "") !== "" || String(r.testCycle || "") !== "") {
    return false;
  }
  return isEmptyMqt191Side(r.solar) && isEmptyMqt191Side(r.natural);
}

function trimTrailingMqt191Rows(rows) {
  const empty = emptyMqt191Row();
  return trimTrailingRows(rows, isEmptyMqt191Row, empty);
}

/** Normalize values from API/DB (numbers, null) without dropping the row. */
function visualFieldToString(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

/** Resolve `rows` whether it is an array, JSON string, or misplaced `samples`. */
function normalizeRawVisualRows(saved) {
  let raw = saved?.rows;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = null;
    }
  }
  if (Array.isArray(raw) && raw.length > 0) return raw;
  let alt = saved?.samples;
  if (typeof alt === "string") {
    try {
      alt = JSON.parse(alt);
    } catch {
      alt = null;
    }
  }
  if (Array.isArray(alt) && alt.length > 0) return alt;
  return null;
}

function isEmptyWetRow(r) {
  if (!r || typeof r !== "object") return true;
  return ["sampleNo", "requiredMohm", "measuredMohm", "result"].every(
    (k) => String(r[k] || "") === "",
  );
}

function trimTrailingWetRows(rows) {
  const empty = {
    sampleNo: "",
    requiredMohm: "",
    measuredMohm: "",
    result: "",
  };
  return trimTrailingRows(rows, isEmptyWetRow, empty);
}

function isEmptyInsulationRow(r) {
  if (!r || typeof r !== "object") return true;
  const textEmpty = [
    "sampleNo",
    "requiredMohm",
    "measuredMohm",
    "result",
    "dielectricYesDescription",
    "breakdownYes",
    "breakdownNo",
  ].every((k) => String(r[k] || "") === "");
  return textEmpty && !r.dielectricNo;
}

function trimTrailingInsulationRows(rows) {
  const empty = {
    sampleNo: "",
    requiredMohm: "",
    measuredMohm: "",
    result: "",
    dielectricYesDescription: "",
    dielectricNo: false,
    breakdownYes: "",
    breakdownNo: "",
  };
  return trimTrailingRows(rows, isEmptyInsulationRow, empty);
}

function isEmptyTempcoRow(r) {
  if (!r || typeof r !== "object") return true;
  return ["sampleNo", "alpha", "beta", "delta"].every(
    (k) => String(r[k] || "") === "",
  );
}

function trimTrailingTempcoRows(rows) {
  const empty = { sampleNo: "", beta: "", delta: "" };
  return trimTrailingRows(rows, isEmptyTempcoRow, empty);
}

function trimTrailingSheetRows(rows, presetId) {
  const preset = SHEET_PRESETS[presetId] || SHEET_PRESETS.generic_8_6;
  const rowFields = preset.rowFields;
  const empty = emptySheetRow(rowFields);
  const isEmpty = (r) => {
    if (!r || typeof r !== "object") return true;
    return rowFields.every((f) => {
      if (f.type === "checkbox") return !r[f.key];
      return String(r[f.key] || "") === "";
    });
  };
  return trimTrailingRows(rows, isEmpty, empty);
}

/**
 * Trailing all-empty sample/row entries are removed before persist so the DB matches the UI.
 */
export function sanitizeObservationPageForSave(pageKey, data) {
  const entry = MANIFEST_BY_STORAGE_KEY[pageKey];
  if (!entry || !data || typeof data !== "object") return data;
  const d = { ...data };
  switch (entry.template) {
    case "stc":
    case "simple":
      d.samples = trimTrailingStcLikeSamples(d.samples);
      return d;
    case "stab":
      d.rows = trimTrailingMqt191Rows(d.rows);
      return d;
    case "visual":
      // Keep all rows the user added (including empty placeholders); trimming hid
      // "+ Sample" rows after save and made multi-sample visual inspection confusing.
      return d;
    case "wet":
      d.rows = trimTrailingWetRows(d.rows);
      return d;
    case "insulation":
      d.rows = trimTrailingInsulationRows(d.rows);
      return d;
    case "tempco":
      d.rows = trimTrailingTempcoRows(d.rows);
      return d;
    case "sheet":
    default: {
      if (SERVICE_SPECIAL_CUSTOM_PRESETS.has(entry.sheetPreset)) {
        return d;
      }
      if (entry.sheetPreset === "table10_page21") {
        return trimTable10Page21(d);
      }
      if (entry.sheetPreset === "hot_spot_22") {
        return d;
      }
      if (entry.sheetPreset === "page_23_hs_visual_stc") {
        return sanitizePage23Form(d);
      }
      if (entry.sheetPreset === "page_24_bnpi_insulation") {
        return sanitizePage24Form(d);
      }
      if (entry.sheetPreset === "page_25_wet_bypass_hs") {
        return sanitizePage25Form(d);
      }
      if (entry.sheetPreset === "page_26_uv_front_back") {
        return sanitizePage26Form(d);
      }
      if (entry.sheetPreset === "page_27_uv_followup") {
        return sanitizePage27Form(d);
      }
      if (entry.sheetPreset === "page_28_mech_combo") {
        return sanitizePage28Form(d);
      }
      if (entry.sheetPreset === "page_29_tc50_visual") {
        return sanitizePage29Form(d);
      }
      if (entry.sheetPreset === "page_31_hf10_combo") {
        return sanitizePage31Form(d);
      }
      if (entry.sheetPreset === "page_32_jbox_combo") {
        return sanitizePage32Form(d);
      }
      if (entry.sheetPreset === "page_33_tc200_visual") {
        return sanitizePage33Form(d);
      }
      if (entry.sheetPreset === "page_35_damp_heat_combo") {
        return sanitizePage35Form(d);
      }
      if (entry.sheetPreset === "page_36_static_mech_combo") {
        return sanitizePage36Form(d);
      }
      if (entry.sheetPreset === "page_37_hail_combo") {
        return sanitizePage37Form(d);
      }
      if (entry.sheetPreset === "page_38_pid_combo") {
        return sanitizePage38Form(d);
      }
      if (entry.sheetPreset === "page_40_final_stab_233") {
        return sanitizePage40Form(d);
      }
      if (entry.sheetPreset === "page_41_final_stab_234") {
        return sanitizePage41Form(d);
      }
      if (entry.sheetPreset === "page_42_stc_front_236") {
        return sanitizePage42Form(d);
      }
      if (entry.sheetPreset === "page_43_stc_back_237") {
        return sanitizePage43Form(d);
      }
      if (entry.sheetPreset === "page_44_bnpi_final_238") {
        return sanitizePage44Form(d);
      }
      if (entry.sheetPreset === "page_47_a41_front") {
        return sanitizePage47Form(d);
      }
      if (entry.sheetPreset === "page_48_a44_back") {
        return sanitizePage48Form(d);
      }
      if (entry.sheetPreset === "page_49_a43_bnpi") {
        return sanitizePage49Form(d);
      }
      if (entry.sheetPreset === "page_50_a47_ini") {
        return sanitizePage50A47Form(d);
      }
      if (entry.sheetPreset === "page_52_a47_stc_front") {
        return sanitizePage52Form(d);
      }
      if (entry.sheetPreset === "page_53_a48_back") {
        return sanitizePage53Form(d);
      }
      if (entry.sheetPreset === "page_54_a49_bnpi") {
        return sanitizePage54Form(d);
      }
      const pid = entry.sheetPreset || "generic_8_6";
      d.rows = trimTrailingSheetRows(d.rows, pid);
      return d;
    }
  }
}

export function sanitizeAllPagesForSave(pagesState) {
  const out = {};
  for (const [k, v] of Object.entries(pagesState || {})) {
    out[k] = sanitizeObservationPageForSave(k, v);
  }
  return out;
}

export function emptySheetRow(rowFields) {
  return Object.fromEntries(
    rowFields.map((f) => [f.key, f.type === "checkbox" ? false : ""]),
  );
}

export function emptySheetForm(presetId) {
  const preset = SHEET_PRESETS[presetId] || SHEET_PRESETS.generic_8_6;
  const header = Object.fromEntries(
    preset.headerFields.map((f) => [
      f.key,
      f.type === "checkbox" ? false : "",
    ]),
  );
  const footer = Object.fromEntries(
    (preset.footerFields || []).map((f) => [
      f.key,
      f.type === "checkbox" ? false : "",
    ]),
  );
  return {
    header,
    rows: [emptySheetRow(preset.rowFields)],
    footer,
    supplementary: "",
  };
}

function mergeSheetHeaderField(header, f, savedHeader) {
  const v = savedHeader?.[f.key];
  if (f.type === "checkbox") {
    header[f.key] = v === true || v === "true" || v === "yes";
    return;
  }
  if (typeof v === "string") header[f.key] = v;
  else if (v != null && typeof v !== "object") header[f.key] = String(v);
}

/** Old bypass_18: all inputs lived in `header`; rows only had `notes`. */
function migrateBypass18OldFormat(saved, preset, merged) {
  const h = saved.header;
  if (!h || typeof h !== "object") return merged;
  const first = merged.rows[0] || {};
  const hadHeaderMeasurements =
    typeof h.moduleTemp === "string" &&
    h.moduleTemp !== "" &&
    (!first.moduleTemp || first.moduleTemp === "");
  if (!hadHeaderMeasurements) return merged;
  const base = emptySheetRow(preset.rowFields);
  for (const f of preset.rowFields) {
    if (f.key === "notes") {
      base[f.key] = typeof first.notes === "string" ? first.notes : "";
    } else if (typeof h[f.key] === "string") {
      base[f.key] = h[f.key];
    }
  }
  return {
    ...merged,
    header: {
      moduleSerial: merged.header?.moduleSerial ?? "",
    },
    rows: [base, ...merged.rows.slice(1)],
  };
}

/** Map legacy row keys (pre–PDF-alignment) onto current `bypass_19` keys. */
function migrateBypass19RowKeys(rows) {
  return rows.map((r) => {
    if (!r || typeof r !== "object") return r;
    const o = { ...r };
    if (o.tjmax != null && o.tjmax !== "" && !o.tjmaxDatasheet) {
      o.tjmaxDatasheet = String(o.tjmax);
    }
    if (o.tjMeasured != null && o.tjMeasured !== "" && !o.tjcalc) {
      o.tjcalc = String(o.tjMeasured);
    }
    if (o.ifForward != null && o.ifForward !== "" && !o.currentFlowApplied) {
      o.currentFlowApplied = String(o.ifForward);
    }
    if (o.ifForward != null && o.ifForward !== "" && !o.currentFlow125Isc) {
      o.currentFlow125Isc = String(o.ifForward);
    }
    return o;
  });
}

/** Old bypass_19: VD / TJmax lived in `header`; rows only had `remarks`. */
function migrateBypass19OldFormat(saved, preset, merged) {
  const h = saved.header;
  if (!h || typeof h !== "object") return merged;
  const first = merged.rows[0] || {};
  if (typeof h.vd === "string" && h.vd !== "" && !first.vd) {
    const base = emptySheetRow(preset.rowFields);
    for (const f of preset.rowFields) {
      if (f.key === "remarks") {
        base[f.key] = typeof first.remarks === "string" ? first.remarks : "";
      } else if (f.key === "tjmaxDatasheet" && typeof h.tjmax === "string") {
        base[f.key] = h.tjmax;
      } else if (typeof h[f.key] === "string") {
        base[f.key] = h[f.key];
      }
    }
    return {
      ...merged,
      header: {
        moduleSerial: merged.header?.moduleSerial ?? "",
      },
      rows: [base, ...merged.rows.slice(1)],
    };
  }
  return merged;
}

const EMPTY_T10_ROW = () => ({
  sampleNo: "",
  vfm: "",
  vfmRated: "",
  vfmWithinToleranceYes: false,
  vfmWithinToleranceNo: false,
  result: "",
});

const EMPTY_T102_ROW = () => ({
  sampleNo: "",
  isc: "",
  voc: "",
  imp: "",
  vmp: "",
  pmax: "",
  ff: "",
});

const EMPTY_T103_ROW = () => ({
  sampleNo: "",
  testCycle: "",
  integratedIrradiationKwhm2: "",
  irradianceWm2: "",
  moduleTempC: "",
  resistiveLoad: "",
  pmaxEndCycle: "",
  pmaxDeltaPercent: "",
  stableYes: false,
  stableNo: false,
});

function isEmptyT10Row(r) {
  if (!r || typeof r !== "object") return true;
  return (
    String(r.sampleNo || "") === "" &&
    String(r.vfm || "") === "" &&
    String(r.vfmRated || "") === "" &&
    String(r.result || "") === "" &&
    !r.vfmWithinToleranceYes &&
    !r.vfmWithinToleranceNo
  );
}

function isEmptyT102Row(r) {
  if (!r || typeof r !== "object") return true;
  return ["sampleNo", "isc", "voc", "imp", "vmp", "pmax", "ff"].every(
    (k) => String(r[k] || "") === "",
  );
}

function isEmptyT103Row(r) {
  if (!r || typeof r !== "object") return true;
  return (
    ["sampleNo", "testCycle", "integratedIrradiationKwhm2", "irradianceWm2", "moduleTempC", "resistiveLoad", "pmaxEndCycle", "pmaxDeltaPercent"].every(
      (k) => String(r[k] || "") === "",
    ) &&
    !r.stableYes &&
    !r.stableNo
  );
}

export function emptyTable10Page21Form() {
  return {
    table10: {
      header: { ambientTempC: "", currentFlowA: "" },
      rows: [EMPTY_T10_ROW()],
      supplementary: "",
    },
    table102: {
      header: { testMethodSolarSimulator: false, testMethodNaturalSunlight: false },
      rows: [EMPTY_T102_ROW()],
      supplementary: "",
    },
    table103: {
      header: {
        lightExposureSolar: false,
        lightExposureNatural: false,
        stabilizationCriterion: "",
      },
      rows: [EMPTY_T103_ROW()],
      supplementary: "",
    },
    supplementary: "",
  };
}

function mergeTable10SectionHeader(h, keys, defaults) {
  const out = { ...defaults };
  if (!h || typeof h !== "object") return out;
  for (const k of keys) {
    if (typeof h[k] === "boolean") out[k] = h[k];
    else if (typeof h[k] === "string") out[k] = h[k];
  }
  return out;
}

export function mergeTable10Page21Form(saved) {
  const d = emptyTable10Page21Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table10 || saved.table102 || saved.table103) {
    const t10 = saved.table10 && typeof saved.table10 === "object" ? saved.table10 : {};
    const t102 = saved.table102 && typeof saved.table102 === "object" ? saved.table102 : {};
    const t103 = saved.table103 && typeof saved.table103 === "object" ? saved.table103 : {};

    const t10Rows =
      Array.isArray(t10.rows) && t10.rows.length > 0
        ? t10.rows.map((r) => ({ ...EMPTY_T10_ROW(), ...(r && typeof r === "object" ? r : {}) }))
        : d.table10.rows;
    const t102Rows =
      Array.isArray(t102.rows) && t102.rows.length > 0
        ? t102.rows.map((r) => ({ ...EMPTY_T102_ROW(), ...(r && typeof r === "object" ? r : {}) }))
        : d.table102.rows;
    const t103Rows =
      Array.isArray(t103.rows) && t103.rows.length > 0
        ? t103.rows.map((r) => ({ ...EMPTY_T103_ROW(), ...(r && typeof r === "object" ? r : {}) }))
        : d.table103.rows;

    return {
      table10: {
        header: mergeTable10SectionHeader(t10.header, ["ambientTempC", "currentFlowA"], d.table10.header),
        rows: t10Rows.map((r) => ({
          ...EMPTY_T10_ROW(),
          ...r,
          vfmWithinToleranceYes: !!r.vfmWithinToleranceYes,
          vfmWithinToleranceNo: !!r.vfmWithinToleranceNo,
        })),
        supplementary: typeof t10.supplementary === "string" ? t10.supplementary : "",
      },
      table102: {
        header: mergeTable10SectionHeader(t102.header, ["testMethodSolarSimulator", "testMethodNaturalSunlight"], d.table102.header),
        rows: t102Rows,
        supplementary: typeof t102.supplementary === "string" ? t102.supplementary : "",
      },
      table103: {
        header: {
          ...d.table103.header,
          ...mergeTable10SectionHeader(t103.header, ["lightExposureSolar", "lightExposureNatural", "stabilizationCriterion"], d.table103.header),
        },
        rows: t103Rows.map((r) => ({
          ...EMPTY_T103_ROW(),
          ...r,
          stableYes: !!r.stableYes,
          stableNo: !!r.stableNo,
        })),
        supplementary: typeof t103.supplementary === "string" ? t103.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  /** Legacy `table10_bypass_final` single-table shape */
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  if (rows.length > 0) {
    const mergedRows = rows.map((r) => ({
      ...EMPTY_T10_ROW(),
      sampleNo: typeof r?.subsection === "string" ? r.subsection : "",
      result: typeof r?.passFail === "string" ? r.passFail : "",
      vfmWithinToleranceYes: !!r?.bypassOk,
      vfmWithinToleranceNo: false,
    }));
    return {
      ...d,
      table10: {
        ...d.table10,
        rows: mergedRows.length ? mergedRows : d.table10.rows,
        supplementary: rows
          .map((r) => [r.bypassDetail, r.stabDetail].filter(Boolean).join("\n"))
          .filter(Boolean)
          .join("\n\n"),
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  return {
    ...d,
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

function trimTable10Page21(data) {
  const base = emptyTable10Page21Form();
  const t10 = { ...base.table10, ...(data.table10 || {}) };
  const t102 = { ...base.table102, ...(data.table102 || {}) };
  const t103 = { ...base.table103, ...(data.table103 || {}) };
  let r10 = Array.isArray(t10.rows) ? [...t10.rows] : [EMPTY_T10_ROW()];
  let r102 = Array.isArray(t102.rows) ? [...t102.rows] : [EMPTY_T102_ROW()];
  let r103 = Array.isArray(t103.rows) ? [...t103.rows] : [EMPTY_T103_ROW()];
  while (r10.length > 1 && isEmptyT10Row(r10[r10.length - 1])) r10.pop();
  while (r102.length > 1 && isEmptyT102Row(r102[r102.length - 1])) r102.pop();
  while (r103.length > 1 && isEmptyT103Row(r103[r103.length - 1])) r103.pop();
  return {
    ...data,
    supplementary: typeof data.supplementary === "string" ? data.supplementary : "",
    table10: { ...t10, rows: r10.length ? r10 : [EMPTY_T10_ROW()] },
    table102: { ...t102, rows: r102.length ? r102 : [EMPTY_T102_ROW()] },
    table103: { ...t103, rows: r103.length ? r103 : [EMPTY_T103_ROW()] },
  };
}

const EMPTY_HOTSPOT_COL = () => ({
  selectedHotspotCells: "",
  shadingRate: "",
  maxCellTemp: "",
  testDurationH: "",
  irradianceWm2: "",
});

export function emptyHotSpot22Form() {
  const col = () => ({ ...EMPTY_HOTSPOT_COL() });
  return {
    header: {
      sampleNo: "",
      techWbt: false,
      techMli: false,
      cellCircuitS: false,
      cellCircuitSp: false,
      cellCircuitPs: false,
      lightPulse: false,
      lightSteady: false,
      lightNatural: false,
      moduleTempEquilibrium: "",
    },
    wbt: {
      low1: col(),
      low2: col(),
      low3: col(),
      high: col(),
      permanent: col(),
    },
    supplementary: "",
  };
}

export function mergeHotSpot22Form(saved) {
  const d = emptyHotSpot22Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.header && saved.wbt && typeof saved.wbt === "object") {
    const h = saved.header;
    const w = saved.wbt;
    const mergeCol = (key) => ({ ...EMPTY_HOTSPOT_COL(), ...(w[key] && typeof w[key] === "object" ? w[key] : {}) });
    return {
      header: {
        sampleNo: typeof h.sampleNo === "string" ? h.sampleNo : "",
        techWbt: !!h.techWbt,
        techMli: !!h.techMli,
        cellCircuitS: !!h.cellCircuitS,
        cellCircuitSp: !!h.cellCircuitSp,
        cellCircuitPs: !!h.cellCircuitPs,
        lightPulse: !!h.lightPulse,
        lightSteady: !!h.lightSteady,
        lightNatural: !!h.lightNatural,
        moduleTempEquilibrium:
          typeof h.moduleTempEquilibrium === "string" ? h.moduleTempEquilibrium : "",
      },
      wbt: {
        low1: mergeCol("low1"),
        low2: mergeCol("low2"),
        low3: mergeCol("low3"),
        high: mergeCol("high"),
        permanent: mergeCol("permanent"),
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  /** Legacy generic-sheet rows */
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  if (rows.length > 0 && saved.header) {
    const r0 = rows[0] || {};
    return {
      ...d,
      header: {
        ...d.header,
        sampleNo: typeof r0.sampleNo === "string" ? r0.sampleNo : "",
        moduleTempEquilibrium:
          typeof saved.header.substrateTemp === "string"
            ? saved.header.substrateTemp
            : d.header.moduleTempEquilibrium,
      },
      wbt: {
        ...d.wbt,
        low1: {
          ...EMPTY_HOTSPOT_COL(),
          selectedHotspotCells: typeof r0.sampleNo === "string" ? r0.sampleNo : "",
          maxCellTemp: typeof r0.tcell === "string" ? r0.tcell : "",
          testDurationH: typeof r0.exposureTime === "string" ? r0.exposureTime : "",
          irradianceWm2: typeof saved.header.irradiance === "string" ? saved.header.irradiance : "",
        },
      },
      supplementary: [r0.result, r0.remarks, saved.header?.shading].filter(Boolean).join("\n"),
    };
  }

  return {
    ...d,
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function mergeSheetForm(saved, presetId) {
  const preset = SHEET_PRESETS[presetId] || SHEET_PRESETS.generic_8_6;
  const d = emptySheetForm(presetId);
  if (!saved || typeof saved !== "object") return d;
  const header = { ...d.header };
  for (const f of preset.headerFields) {
    mergeSheetHeaderField(header, f, saved.header);
  }
  let rows = d.rows;
  if (Array.isArray(saved.rows) && saved.rows.length > 0) {
    rows = saved.rows.map((r) => {
      const src =
        presetId === "bypass_19" && r && typeof r === "object"
          ? migrateBypass19RowKeys([r])[0]
          : r;
      const o = emptySheetRow(preset.rowFields);
      if (src && typeof src === "object") {
        for (const f of preset.rowFields) {
          if (f.type === "checkbox") {
            const v = src[f.key];
            o[f.key] = v === true || v === "true" || v === "yes";
          } else if (typeof src[f.key] === "string") {
            o[f.key] = src[f.key];
          } else if (
            src[f.key] != null &&
            typeof src[f.key] !== "object" &&
            typeof src[f.key] !== "boolean"
          ) {
            o[f.key] = String(src[f.key]);
          }
        }
      }
      return o;
    });
  }
  let merged = {
    header,
    rows,
    footer: { ...d.footer },
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
  if (saved.footer && typeof saved.footer === "object") {
    for (const f of preset.footerFields || []) {
      const v = saved.footer[f.key];
      if (f.type === "checkbox") {
        merged.footer[f.key] = v === true || v === "true" || v === "yes";
      } else if (typeof v === "string") {
        merged.footer[f.key] = v;
      } else if (v != null && typeof v !== "object") {
        merged.footer[f.key] = String(v);
      }
    }
  }
  if (presetId === "bypass_18") {
    merged = migrateBypass18OldFormat(saved, preset, merged);
  }
  if (presetId === "bypass_19") {
    merged = migrateBypass19OldFormat(saved, preset, merged);
  }
  return merged;
}

export function defaultVisualForm() {
  return {
    rows: [{ sampleNo: "", findings: "" }],
    supplementary: "",
  };
}

export function mergeVisualForm(saved) {
  const d = defaultVisualForm();
  if (!saved || typeof saved !== "object") return d;
  const rawRows = normalizeRawVisualRows(saved);
  let rows = d.rows;
  if (rawRows) {
    rows = rawRows.map((r) => ({
      sampleNo: visualFieldToString(r?.sampleNo),
      findings: visualFieldToString(r?.findings),
    }));
  }
  return {
    rows,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}

export function defaultSimplePerformanceForm() {
  return {
    testMethod: "",
    irradianceLevelWm2: "",
    solarSimulatorUsed: false,
    naturalSunlightUsed: false,
    moduleTempC: "",
    ambientTempC: "",
    pulsedSimulator: false,
    steadyStateSimulator: false,
    samples: [emptySampleRow()],
    supplementary: "",
  };
}

export function mergeSimplePerformanceForm(saved) {
  const d = defaultSimplePerformanceForm();
  if (!saved || typeof saved !== "object") return d;
  const samples =
    Array.isArray(saved.samples) && saved.samples.length > 0
      ? saved.samples.map((s) => ({ ...emptySampleRow(), ...s }))
      : d.samples;
  return {
    testMethod:
      typeof saved.testMethod === "string" ? saved.testMethod : d.testMethod,
    irradianceLevelWm2:
      typeof saved.irradianceLevelWm2 === "string"
        ? saved.irradianceLevelWm2
        : d.irradianceLevelWm2,
    solarSimulatorUsed:
      typeof saved.solarSimulatorUsed === "boolean"
        ? saved.solarSimulatorUsed
        : d.solarSimulatorUsed,
    naturalSunlightUsed:
      typeof saved.naturalSunlightUsed === "boolean"
        ? saved.naturalSunlightUsed
        : d.naturalSunlightUsed,
    moduleTempC:
      typeof saved.moduleTempC === "string" ? saved.moduleTempC : d.moduleTempC,
    ambientTempC:
      typeof saved.ambientTempC === "string" ? saved.ambientTempC : d.ambientTempC,
    pulsedSimulator:
      typeof saved.pulsedSimulator === "boolean"
        ? saved.pulsedSimulator
        : d.pulsedSimulator,
    steadyStateSimulator:
      typeof saved.steadyStateSimulator === "boolean"
        ? saved.steadyStateSimulator
        : d.steadyStateSimulator,
    samples,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}

export function defaultWetLeakageForm() {
  return {
    testVoltage: "",
    solutionTemp: "",
    solutionResistivity: "",
    moduleSize: "",
    rows: [
      {
        sampleNo: "",
        requiredMohm: "",
        measuredMohm: "",
        result: "",
      },
    ],
    supplementary: "",
  };
}

export function mergeWetLeakageForm(saved) {
  const d = defaultWetLeakageForm();
  if (!saved || typeof saved !== "object") return d;
  let rows = d.rows;
  if (Array.isArray(saved.rows) && saved.rows.length > 0) {
    rows = saved.rows.map((r) => ({
      sampleNo: typeof r?.sampleNo === "string" ? r.sampleNo : "",
      requiredMohm: typeof r?.requiredMohm === "string" ? r.requiredMohm : "",
      measuredMohm: typeof r?.measuredMohm === "string" ? r.measuredMohm : "",
      result: typeof r?.result === "string" ? r.result : "",
    }));
  }
  return {
    testVoltage:
      typeof saved.testVoltage === "string" ? saved.testVoltage : d.testVoltage,
    solutionTemp:
      typeof saved.solutionTemp === "string" ? saved.solutionTemp : d.solutionTemp,
    solutionResistivity:
      typeof saved.solutionResistivity === "string"
        ? saved.solutionResistivity
        : d.solutionResistivity,
    moduleSize:
      typeof saved.moduleSize === "string" ? saved.moduleSize : d.moduleSize,
    rows,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}

export function defaultInsulationForm() {
  return {
    testVoltage: "",
    moduleSize: "",
    requiredResistanceMohm: "",
    rows: [
      {
        sampleNo: "",
        requiredMohm: "",
        measuredMohm: "",
        result: "",
        dielectricYesDescription: "",
        dielectricNo: false,
        breakdownYes: "",
        breakdownNo: "",
      },
    ],
    supplementary: "",
  };
}

export function mergeInsulationForm(saved) {
  const d = defaultInsulationForm();
  if (!saved || typeof saved !== "object") return d;
  let rows = d.rows;
  if (Array.isArray(saved.rows) && saved.rows.length > 0) {
    rows = saved.rows.map((r) => {
      const yesDesc =
        typeof r?.dielectricYesDescription === "string"
          ? r.dielectricYesDescription
          : typeof r?.breakdownYes === "string"
            ? r.breakdownYes
            : "";
      const legacyNo =
        typeof r?.breakdownNo === "string" ? r.breakdownNo.trim() : "";
      return {
        sampleNo: typeof r?.sampleNo === "string" ? r.sampleNo : "",
        requiredMohm: typeof r?.requiredMohm === "string" ? r.requiredMohm : "",
        measuredMohm: typeof r?.measuredMohm === "string" ? r.measuredMohm : "",
        result: typeof r?.result === "string" ? r.result : "",
        dielectricYesDescription: yesDesc,
        dielectricNo: !!r?.dielectricNo || legacyNo !== "",
        breakdownYes: typeof r?.breakdownYes === "string" ? r.breakdownYes : "",
        breakdownNo: typeof r?.breakdownNo === "string" ? r.breakdownNo : "",
      };
    });
  }
  return {
    testVoltage:
      typeof saved.testVoltage === "string" ? saved.testVoltage : d.testVoltage,
    moduleSize:
      typeof saved.moduleSize === "string" ? saved.moduleSize : d.moduleSize,
    requiredResistanceMohm:
      typeof saved.requiredResistanceMohm === "string"
        ? saved.requiredResistanceMohm
        : d.requiredResistanceMohm,
    rows,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}

export function defaultTempCoeffForm() {
  return {
    ambientHighLow: "",
    irradianceHighLow: "",
    moduleTempHighLow: "",
    /** α [%/°C] is per sample on the sheet (with β, δ). */
    rows: [{ sampleNo: "", alpha: "", beta: "", delta: "" }],
    supplementary: "",
  };
}

export function mergeTempCoeffForm(saved) {
  const d = defaultTempCoeffForm();
  if (!saved || typeof saved !== "object") return d;
  let rows = d.rows;
  if (Array.isArray(saved.rows) && saved.rows.length > 0) {
    rows = saved.rows.map((r) => ({
      sampleNo: typeof r?.sampleNo === "string" ? r.sampleNo : "",
      alpha: typeof r?.alpha === "string" ? r.alpha : "",
      beta: typeof r?.beta === "string" ? r.beta : "",
      delta: typeof r?.delta === "string" ? r.delta : "",
    }));
  }
  if (
    typeof saved.alpha === "string" &&
    saved.alpha !== "" &&
    rows[0] &&
    !rows[0].alpha
  ) {
    rows = rows.map((r, i) => (i === 0 ? { ...r, alpha: saved.alpha } : r));
  }
  return {
    ambientHighLow:
      typeof saved.ambientHighLow === "string"
        ? saved.ambientHighLow
        : d.ambientHighLow,
    irradianceHighLow:
      typeof saved.irradianceHighLow === "string"
        ? saved.irradianceHighLow
        : d.irradianceHighLow,
    moduleTempHighLow:
      typeof saved.moduleTempHighLow === "string"
        ? saved.moduleTempHighLow
        : d.moduleTempHighLow,
    rows,
    supplementary:
      typeof saved.supplementary === "string"
        ? saved.supplementary
        : d.supplementary,
  };
}

export function defaultDataForEntry(entry) {
  if (!entry) return {};
  switch (entry.template) {
    case "stc":
      return defaultPage2Form();
    case "stab":
      return defaultMqt191Form();
    case "simple":
      return defaultSimplePerformanceForm();
    case "visual":
      return defaultVisualForm();
    case "wet":
      return defaultWetLeakageForm();
    case "insulation":
      return defaultInsulationForm();
    case "tempco":
      return defaultTempCoeffForm();
    case "sheet":
      if (SERVICE_SPECIAL_CUSTOM_PRESETS.has(entry.sheetPreset)) {
        return {};
      }
      if (entry.sheetPreset === "table10_page21") {
        return emptyTable10Page21Form();
      }
      if (entry.sheetPreset === "hot_spot_22") {
        return emptyHotSpot22Form();
      }
      if (entry.sheetPreset === "page_23_hs_visual_stc") {
        return emptyPage23Form();
      }
      if (entry.sheetPreset === "page_24_bnpi_insulation") {
        return emptyPage24Form();
      }
      if (entry.sheetPreset === "page_25_wet_bypass_hs") {
        return emptyPage25Form();
      }
      if (entry.sheetPreset === "page_26_uv_front_back") {
        return emptyPage26Form();
      }
      if (entry.sheetPreset === "page_27_uv_followup") {
        return emptyPage27Form();
      }
      if (entry.sheetPreset === "page_28_mech_combo") {
        return emptyPage28Form();
      }
      if (entry.sheetPreset === "page_29_tc50_visual") {
        return emptyPage29Form();
      }
      if (entry.sheetPreset === "page_31_hf10_combo") {
        return emptyPage31Form();
      }
      if (entry.sheetPreset === "page_32_jbox_combo") {
        return emptyPage32Form();
      }
      if (entry.sheetPreset === "page_33_tc200_visual") {
        return emptyPage33Form();
      }
      if (entry.sheetPreset === "page_35_damp_heat_combo") {
        return emptyPage35Form();
      }
      if (entry.sheetPreset === "page_36_static_mech_combo") {
        return emptyPage36Form();
      }
      if (entry.sheetPreset === "page_37_hail_combo") {
        return emptyPage37Form();
      }
      if (entry.sheetPreset === "page_38_pid_combo") {
        return emptyPage38Form();
      }
      if (entry.sheetPreset === "page_40_final_stab_233") {
        return emptyPage40Form();
      }
      if (entry.sheetPreset === "page_41_final_stab_234") {
        return emptyPage41Form();
      }
      if (entry.sheetPreset === "page_42_stc_front_236") {
        return emptyPage42Form();
      }
      if (entry.sheetPreset === "page_43_stc_back_237") {
        return emptyPage43Form();
      }
      if (entry.sheetPreset === "page_44_bnpi_final_238") {
        return emptyPage44Form();
      }
      if (entry.sheetPreset === "page_47_a41_front") {
        return emptyPage47Form();
      }
      if (entry.sheetPreset === "page_48_a44_back") {
        return emptyPage48Form();
      }
      if (entry.sheetPreset === "page_49_a43_bnpi") {
        return emptyPage49Form();
      }
      if (entry.sheetPreset === "page_50_a47_ini") {
        return emptyPage50A47Form();
      }
      if (entry.sheetPreset === "page_52_a47_stc_front") {
        return emptyPage52Form();
      }
      if (entry.sheetPreset === "page_53_a48_back") {
        return emptyPage53Form();
      }
      if (entry.sheetPreset === "page_54_a49_bnpi") {
        return emptyPage54Form();
      }
      return emptySheetForm(entry.sheetPreset || "generic_8_6");
    default:
      return emptySheetForm("generic_8_6");
  }
}

/** Merge MQT 07 low-irradiance front (page_14) + legacy page_15 into one storage blob. */
export function mergeMq07LowIrrCombined(raw) {
  const a = raw?.page_14 ? mergeSimplePerformanceForm(raw.page_14) : null;
  const b = raw?.page_15 ? mergeSimplePerformanceForm(raw.page_15) : null;
  if (a && !b) return a;
  if (!a && b) return b;
  if (!a && !b) return mergeSimplePerformanceForm(undefined);
  return {
    ...a,
    ...b,
    samples:
      [...(a.samples || []), ...(b.samples || [])].length > 0
        ? [...(a.samples || []), ...(b.samples || [])]
        : a.samples,
    supplementary: [a.supplementary, b.supplementary].filter(Boolean).join("\n\n"),
  };
}

/** Merge page_04…page_08 stab JSON (same table continued on PDF) into one form. */
export function mergeInitialStabObservationPages(raw) {
  const keys = ["page_04", "page_05", "page_06", "page_07", "page_08"];
  const chunks = keys
    .map((k) => raw?.[k])
    .filter((x) => x && typeof x === "object");
  if (chunks.length === 0) return mergeMqt191Form(raw?.page_04);
  const supplementaryParts = [];
  let lightExposureSolar = false;
  let lightExposureNatural = false;
  let stabilizationCriterion = "";
  const rowBuckets = [];
  for (const c of chunks) {
    const m = mergeMqt191Form(c);
    rowBuckets.push(...m.rows);
    if (m.supplementary?.trim()) supplementaryParts.push(m.supplementary.trim());
    lightExposureSolar = lightExposureSolar || m.lightExposureSolar;
    lightExposureNatural = lightExposureNatural || m.lightExposureNatural;
    stabilizationCriterion = stabilizationCriterion || m.stabilizationCriterion;
  }
  while (
    rowBuckets.length > 1 &&
    isEmptyMqt191Row(rowBuckets[rowBuckets.length - 1])
  ) {
    rowBuckets.pop();
  }
  const rows =
    rowBuckets.length > 0 ? rowBuckets : defaultMqt191Form().rows;
  return mergeMqt191Form({
    lightExposureSolar,
    lightExposureNatural,
    stabilizationCriterion,
    rows,
    supplementary: supplementaryParts.join("\n\n"),
  });
}

export function mergeDataForEntry(entry, saved) {
  if (!entry) return {};
  switch (entry.template) {
    case "stc":
      return mergePage2Form(saved);
    case "stab":
      return mergeMqt191Form(saved);
    case "simple":
      return mergeSimplePerformanceForm(saved);
    case "visual":
      return mergeVisualForm(saved);
    case "wet":
      return mergeWetLeakageForm(saved);
    case "insulation":
      return mergeInsulationForm(saved);
    case "tempco":
      return mergeTempCoeffForm(saved);
    case "sheet":
      if (SERVICE_SPECIAL_CUSTOM_PRESETS.has(entry.sheetPreset)) {
        return saved && typeof saved === "object" ? saved : {};
      }
      if (entry.sheetPreset === "table10_page21") {
        return mergeTable10Page21Form(saved);
      }
      if (entry.sheetPreset === "hot_spot_22") {
        return mergeHotSpot22Form(saved);
      }
      if (entry.sheetPreset === "page_23_hs_visual_stc") {
        return mergePage23Form(saved);
      }
      if (entry.sheetPreset === "page_24_bnpi_insulation") {
        return mergePage24Form(saved);
      }
      if (entry.sheetPreset === "page_25_wet_bypass_hs") {
        return mergePage25Form(saved);
      }
      if (entry.sheetPreset === "page_26_uv_front_back") {
        return mergePage26Form(saved);
      }
      if (entry.sheetPreset === "page_27_uv_followup") {
        return mergePage27Form(saved);
      }
      if (entry.sheetPreset === "page_28_mech_combo") {
        return mergePage28Form(saved);
      }
      if (entry.sheetPreset === "page_29_tc50_visual") {
        return mergePage29Form(saved);
      }
      if (entry.sheetPreset === "page_31_hf10_combo") {
        return mergePage31Form(saved);
      }
      if (entry.sheetPreset === "page_32_jbox_combo") {
        return mergePage32Form(saved);
      }
      if (entry.sheetPreset === "page_33_tc200_visual") {
        return mergePage33Form(saved);
      }
      if (entry.sheetPreset === "page_35_damp_heat_combo") {
        return mergePage35Form(saved);
      }
      if (entry.sheetPreset === "page_36_static_mech_combo") {
        return mergePage36Form(saved);
      }
      if (entry.sheetPreset === "page_37_hail_combo") {
        return mergePage37Form(saved);
      }
      if (entry.sheetPreset === "page_38_pid_combo") {
        return mergePage38Form(saved);
      }
      if (entry.sheetPreset === "page_40_final_stab_233") {
        return mergePage40Form(saved);
      }
      if (entry.sheetPreset === "page_41_final_stab_234") {
        return mergePage41Form(saved);
      }
      if (entry.sheetPreset === "page_42_stc_front_236") {
        return mergePage42Form(saved);
      }
      if (entry.sheetPreset === "page_43_stc_back_237") {
        return mergePage43Form(saved);
      }
      if (entry.sheetPreset === "page_44_bnpi_final_238") {
        return mergePage44Form(saved);
      }
      if (entry.sheetPreset === "page_47_a41_front") {
        return mergePage47Form(saved);
      }
      if (entry.sheetPreset === "page_48_a44_back") {
        return mergePage48Form(saved);
      }
      if (entry.sheetPreset === "page_49_a43_bnpi") {
        return mergePage49Form(saved);
      }
      if (entry.sheetPreset === "page_50_a47_ini") {
        return mergePage50A47Form(saved);
      }
      if (entry.sheetPreset === "page_52_a47_stc_front") {
        return mergePage52Form(saved);
      }
      if (entry.sheetPreset === "page_53_a48_back") {
        return mergePage53Form(saved);
      }
      if (entry.sheetPreset === "page_54_a49_bnpi") {
        return mergePage54Form(saved);
      }
      return mergeSheetForm(saved, entry.sheetPreset || "generic_8_6");
    default:
      return mergeSheetForm(saved, "generic_8_6");
  }
}

export function mergeAllObservationPages(raw) {
  const out = {};
  const seenStorage = new Set();
  for (const entry of PDF_PAGE_MANIFEST) {
    const sk = entry.storageKey || entry.pageKey;
    if (seenStorage.has(sk)) continue;
    seenStorage.add(sk);
    if (sk === "page_04" && entry.template === "stab") {
      out.page_04 = mergeInitialStabObservationPages(raw || {});
      continue;
    }
    if (sk === "page_14" && entry.template === "simple") {
      out.page_14 = mergeMq07LowIrrCombined(raw || {});
      continue;
    }
    if (sk === "page_50" && entry.sheetPreset === "page_50_a47_ini") {
      out.page_50 = mergePage50A47Combined(raw || {});
      continue;
    }
    out[sk] = mergeDataForEntry(entry, raw?.[sk]);
  }
  if (raw?.mqt_06_1_ini && raw.page_02 === undefined) {
    out.page_02 = mergePage2Form(raw.mqt_06_1_ini);
  }
  if (raw?.mqt_19_1 && raw.page_04 === undefined) {
    out.page_04 = mergeMqt191Form(raw.mqt_19_1);
  }
  return out;
}

export function splitUnknownObservationKeys(raw) {
  const unknown = {};
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw)) {
      if (ALL_MANIFEST_PAGE_KEYS.has(k)) continue;
      if (LEGACY_OBSERVATION_KEYS.has(k)) continue;
      unknown[k] = v;
    }
  }
  return unknown;
}
