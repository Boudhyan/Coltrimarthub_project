/**
 * Empty / merge / sanitize for PDF pages 41–54 (PEL observation sheet).
 */

import { mergePage2Form, mergeMqt191Form } from "./observationPages";
import {
  emptyPage40Form,
  mergePage40Form,
  sanitizePage40Form,
} from "./observationPages31to40";

export const mergePage41Form = mergePage40Form;
export const emptyPage41Form = emptyPage40Form; // same shape as page 40 (Method 4 vs Method 2 in UI only)
export const sanitizePage41Form = sanitizePage40Form;

// ——— STC-style rows (single test-method header, unified electrical columns) ———

export function emptyStcSimpleRow() {
  return {
    sampleNo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    pmax: "",
    ff: "",
    result: "",
  };
}

export function emptyStcBackPhiRow() {
  return {
    ...emptyStcSimpleRow(),
    phiIsc: "",
    phiVoc: "",
    phiPmax: "",
  };
}

export function emptyBnpiFinal238Row() {
  return {
    sampleNo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    pmax: "",
    ff: "",
    powerLabGateNo1: "",
    degradationPct: "",
    result: "",
  };
}

export function emptyLabStcFrontRow() {
  return emptyStcSimpleRow();
}

export function emptyLabStcBackRow() {
  return emptyStcBackPhiRow();
}

export function emptyLabBnpiAfterRow() {
  return emptyStcSimpleRow();
}

function mergeTestMethodHeader(saved) {
  const h = saved?.header;
  return {
    testMethodSolarSimulator: !!(h && h.testMethodSolarSimulator),
    testMethodNaturalSunlight: !!(h && h.testMethodNaturalSunlight),
  };
}

/** Legacy `stc` template (mergePage2Form) → unified STC row columns. */
export function migratePage2SamplesToStcSimple(samples) {
  if (!Array.isArray(samples)) return [emptyStcSimpleRow()];
  const rows = samples.map((s) => ({
    sampleNo: String(s?.sampleNo ?? ""),
    isc: String(s?.iscMeas ?? s?.isc ?? ""),
    voc: String(s?.vocMeas ?? s?.voc ?? ""),
    imp: String(s?.solarImpMeas ?? s?.solarImp ?? ""),
    vmp: String(s?.solarVmpMeas ?? s?.solarVmp ?? ""),
    pmax: String(s?.naturalPmaxMeas ?? s?.naturalPmax ?? ""),
    ff: String(s?.naturalFf ?? ""),
    result: String(s?.result ?? ""),
  }));
  return rows.length ? rows : [emptyStcSimpleRow()];
}

function mergeStcSimpleFromLegacyPage2(saved) {
  const m = mergePage2Form(saved);
  return {
    header: {
      testMethodSolarSimulator: m.solarSimulatorUsed,
      testMethodNaturalSunlight: m.naturalSunlightUsed,
    },
    rows: migratePage2SamplesToStcSimple(m.samples),
    supplementary: m.supplementary || "",
  };
}

function trimRows(rows, isEmpty, empty) {
  const list = Array.isArray(rows) ? [...rows] : [empty()];
  while (list.length > 1 && isEmpty(list[list.length - 1])) list.pop();
  return list.length ? list : [empty()];
}

function isEmptyStcSimple(r) {
  if (!r || typeof r !== "object") return true;
  return Object.keys(emptyStcSimpleRow()).every((k) => String(r[k] ?? "") === "");
}

function isEmptyStcPhi(r) {
  if (!isEmptyStcSimple(r)) return false;
  return ["phiIsc", "phiVoc", "phiPmax"].every((k) => String(r[k] ?? "") === "");
}

function isEmptyBnpi238(r) {
  if (!isEmptyStcSimple(r)) return false;
  return (
    String(r.powerLabGateNo1 ?? "") === "" &&
    String(r.degradationPct ?? "") === ""
  );
}

// ——— Page 42 TABLE 23.6 ———

export function emptyPage42Form() {
  return {
    header: mergeTestMethodHeader({}),
    rows: [emptyStcSimpleRow()],
    supplementary: "",
  };
}

export function mergePage42Form(saved) {
  const d = emptyPage42Form();
  if (!saved || typeof saved !== "object") return d;
  if (Array.isArray(saved.rows)) {
    return {
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyStcSimpleRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  return { ...mergeStcSimpleFromLegacyPage2(saved) };
}

export function sanitizePage42Form(data) {
  const d = mergePage42Form(data);
  return { ...d, rows: trimRows(d.rows, isEmptyStcSimple, emptyStcSimpleRow) };
}

// ——— Page 43 TABLE 23.7 ———

export function emptyPage43Form() {
  return {
    header: mergeTestMethodHeader({}),
    rows: [emptyStcBackPhiRow()],
    supplementary: "",
  };
}

export function mergePage43Form(saved) {
  const d = emptyPage43Form();
  if (!saved || typeof saved !== "object") return d;
  if (Array.isArray(saved.rows)) {
    return {
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyStcBackPhiRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const leg = mergeStcSimpleFromLegacyPage2(saved);
  return {
    header: leg.header,
    rows: leg.rows.map((r) => ({ ...emptyStcBackPhiRow(), ...r })),
    supplementary: leg.supplementary,
  };
}

export function sanitizePage43Form(data) {
  const d = mergePage43Form(data);
  return { ...d, rows: trimRows(d.rows, isEmptyStcPhi, emptyStcBackPhiRow) };
}

// ——— Page 44 TABLE 23.8 ———

export function emptyPage44Form() {
  return {
    header: mergeTestMethodHeader({}),
    rows: [emptyBnpiFinal238Row()],
    supplementary: "",
  };
}

export function mergePage44Form(saved) {
  const d = emptyPage44Form();
  if (!saved || typeof saved !== "object") return d;
  if (Array.isArray(saved.rows)) {
    return {
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({
              ...emptyBnpiFinal238Row(),
              ...r,
              powerLabGateNo1:
                r.powerLabGateNo1 ?? r.powerLabGateDegradation ?? "",
            }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const leg = mergeStcSimpleFromLegacyPage2(saved);
  return {
    header: leg.header,
    rows: leg.rows.map((r) => ({
      ...emptyBnpiFinal238Row(),
      ...r,
      powerLabGateNo1: r.powerLabGateDegradation ?? r.powerLabGateNo1 ?? "",
    })),
    supplementary: leg.supplementary,
  };
}

export function sanitizePage44Form(data) {
  const d = mergePage44Form(data);
  return { ...d, rows: trimRows(d.rows, isEmptyBnpi238, emptyBnpiFinal238Row) };
}

// ——— Pages 47–49 (Annex A.4.1, A.4.4, A.4.3) ———

export function emptyPage47Form() {
  return emptyPage42Form();
}

export function mergePage47Form(saved) {
  return mergePage42Form(saved);
}

export function sanitizePage47Form(data) {
  return sanitizePage42Form(data);
}

export function emptyPage48Form() {
  return emptyPage42Form();
}

export function mergePage48Form(saved) {
  return mergePage42Form(saved);
}

export function sanitizePage48Form(data) {
  return sanitizePage42Form(data);
}

export function emptyPage49Form() {
  return emptyPage42Form();
}

export function mergePage49Form(saved) {
  return mergePage42Form(saved);
}

export function sanitizePage49Form(data) {
  return sanitizePage42Form(data);
}

// ——— Lab header + STC (pages 52–54) ———

export function emptyLabBlock52() {
  return {
    pmaxLabW1: "",
    pmaxLabW2: "",
    pmax4LabW: "",
    vocLabV: "",
    iscLabA: "",
  };
}

export function emptyLabBlock53() {
  return {
    pmaxLabW1: "",
    pmaxLabW2: "",
    vocLabV: "",
    iscLabA: "",
  };
}

export function emptyPage52Form() {
  return {
    lab: emptyLabBlock52(),
    header: mergeTestMethodHeader({}),
    rows: [emptyLabStcFrontRow()],
    supplementary: "",
  };
}

export function mergePage52Form(saved) {
  const d = emptyPage52Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.lab && Array.isArray(saved.rows)) {
    return {
      lab: { ...emptyLabBlock52(), ...saved.lab },
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyLabStcFrontRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  if (Array.isArray(saved.rows) && !saved.lab) {
    return {
      lab: emptyLabBlock52(),
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyLabStcFrontRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const leg = mergeStcSimpleFromLegacyPage2(saved);
  return {
    lab: emptyLabBlock52(),
    header: leg.header,
    rows: leg.rows,
    supplementary: leg.supplementary,
  };
}

export function sanitizePage52Form(data) {
  const d = mergePage52Form(data);
  return { ...d, rows: trimRows(d.rows, isEmptyStcSimple, emptyStcSimpleRow) };
}

export function emptyPage53Form() {
  return {
    lab: emptyLabBlock53(),
    header: mergeTestMethodHeader({}),
    rows: [emptyLabStcBackRow()],
    supplementary: "",
  };
}

export function mergePage53Form(saved) {
  const d = emptyPage53Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.lab && Array.isArray(saved.rows)) {
    return {
      lab: { ...emptyLabBlock53(), ...saved.lab },
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyLabStcBackRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  if (Array.isArray(saved.rows) && !saved.lab) {
    return {
      lab: emptyLabBlock53(),
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyLabStcBackRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const leg = mergeStcSimpleFromLegacyPage2(saved);
  return {
    lab: emptyLabBlock53(),
    header: leg.header,
    rows: leg.rows.map((r) => ({ ...emptyLabStcBackRow(), ...r })),
    supplementary: leg.supplementary,
  };
}

export function sanitizePage53Form(data) {
  const d = mergePage53Form(data);
  return { ...d, rows: trimRows(d.rows, isEmptyStcPhi, emptyStcBackPhiRow) };
}

export function emptyPage54Form() {
  return {
    lab: emptyLabBlock53(),
    header: mergeTestMethodHeader({}),
    rows: [emptyLabBnpiAfterRow()],
    supplementary: "",
  };
}

export function mergePage54Form(saved) {
  const d = emptyPage54Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.lab && Array.isArray(saved.rows)) {
    return {
      lab: { ...emptyLabBlock53(), ...saved.lab },
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyLabBnpiAfterRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  if (Array.isArray(saved.rows) && !saved.lab) {
    return {
      lab: emptyLabBlock53(),
      header: mergeTestMethodHeader(saved),
      rows:
        saved.rows.length > 0
          ? saved.rows.map((r) => ({ ...emptyLabBnpiAfterRow(), ...r }))
          : d.rows,
      supplementary:
        typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const leg = mergeStcSimpleFromLegacyPage2(saved);
  return {
    lab: emptyLabBlock53(),
    header: leg.header,
    rows: leg.rows,
    supplementary: leg.supplementary,
  };
}

export function sanitizePage54Form(data) {
  const d = mergePage54Form(data);
  return { ...d, rows: trimRows(d.rows, isEmptyStcSimple, emptyStcSimpleRow) };
}

// ——— Page 50–51 TABLE A.4.7 initial stabilization (single-track rows, 4 blocks) ———

export function emptyA47SingleRow() {
  return {
    sampleNo: "",
    testCycle: "",
    integratedIrradiationKwhm2: "",
    irradianceWm2: "",
    moduleTempC: "",
    resistiveLoad: "",
    pmaxEndW: "",
    spreadPmaxPminPct: "",
    stableYes: false,
    stableNo: false,
  };
}

function isEmptyA47Single(r) {
  if (!r || typeof r !== "object") return true;
  const keys = Object.keys(emptyA47SingleRow());
  return keys.every((k) => {
    if (k === "stableYes" || k === "stableNo") return !r[k];
    return String(r[k] ?? "") === "";
  });
}

export function emptyPage50A47Form() {
  const block = () => ({ rows: [emptyA47SingleRow()] });
  return {
    header: {
      lightExposureSolar: false,
      lightExposureNatural: false,
      stabilizationCriterion: "",
    },
    blocks: [block(), block(), block(), block()],
    supplementary: "",
  };
}

function mqt191SideToA47(s, r, tag) {
  const yes = String(s?.stableYesNo || "").toLowerCase();
  return {
    sampleNo: r.sampleNo ? (tag ? `${r.sampleNo} (${tag})` : r.sampleNo) : "",
    testCycle: r.testCycle || "",
    integratedIrradiationKwhm2: s?.integratedIrradiationKwhm2 || "",
    irradianceWm2: s?.irradianceWm2 || "",
    moduleTempC: s?.moduleTempC || "",
    resistiveLoad: s?.resistiveLoad || "",
    pmaxEndW: s?.pmaxEndW || "",
    spreadPmaxPminPct: s?.spreadPmaxPminPct || "",
    stableYes: yes === "yes",
    stableNo: yes === "no",
  };
}

function mqt191RowToA47Rows(r) {
  if (!r || typeof r !== "object") return [emptyA47SingleRow()];
  const out = [];
  if (r.solar && typeof r.solar === "object") {
    out.push(mqt191SideToA47(r.solar, r, "Solar"));
  }
  if (r.natural && typeof r.natural === "object") {
    out.push(mqt191SideToA47(r.natural, r, "Natural"));
  }
  if (out.length === 0) {
    out.push({
      ...emptyA47SingleRow(),
      sampleNo: r.sampleNo || "",
      testCycle: r.testCycle || "",
    });
  }
  return out;
}

function normalizeBlocks(saved) {
  const d = emptyPage50A47Form();
  const blocks = Array.isArray(saved.blocks) ? saved.blocks : [];
  return {
    header: {
      lightExposureSolar: !!saved.header?.lightExposureSolar,
      lightExposureNatural: !!saved.header?.lightExposureNatural,
      stabilizationCriterion:
        typeof saved.header?.stabilizationCriterion === "string"
          ? saved.header.stabilizationCriterion
          : "",
    },
    blocks: d.blocks.map((def, i) => {
      const b = blocks[i];
      const rows =
        b?.rows && Array.isArray(b.rows) && b.rows.length > 0
          ? b.rows.map((row) => ({ ...emptyA47SingleRow(), ...row }))
          : def.rows;
      return { rows };
    }),
    supplementary:
      typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function mergePage50A47Form(saved) {
  const d = emptyPage50A47Form();
  if (!saved || typeof saved !== "object") return d;

  if (Array.isArray(saved.blocks)) {
    return normalizeBlocks(saved);
  }

  /** Legacy MQT 19.1 dual-column shape (old `stab` template). */
  if (saved.rows && !saved.blocks) {
    const leg = mergeMqt191Form(saved);
    const flat = (leg.rows || []).flatMap(mqt191RowToA47Rows);
    return {
      header: {
        lightExposureSolar: leg.lightExposureSolar,
        lightExposureNatural: leg.lightExposureNatural,
        stabilizationCriterion: leg.stabilizationCriterion || "",
      },
      blocks: [
        { rows: flat.length ? flat : [emptyA47SingleRow()] },
        { rows: [emptyA47SingleRow()] },
        { rows: [emptyA47SingleRow()] },
        { rows: [emptyA47SingleRow()] },
      ],
      supplementary: leg.supplementary || "",
    };
  }

  return d;
}

/** Merge `page_50` + optional legacy `page_51` stab blob (same PDF table continued). */
export function mergePage50A47Combined(raw) {
  const base = mergePage50A47Form(raw?.page_50);
  const extra = raw?.page_51;
  if (!extra || typeof extra !== "object") return base;
  const leg = mergeMqt191Form(extra);
  const extraRows = (leg.rows || []).flatMap(mqt191RowToA47Rows);
  if (extraRows.length === 0) {
    return {
      ...base,
      supplementary: [base.supplementary, leg.supplementary].filter(Boolean).join("\n\n"),
    };
  }
  const blocks = base.blocks.map((b) => ({ ...b, rows: [...b.rows] }));
  const cur = blocks[3].rows;
  const onlyPlaceholder =
    cur.length === 1 && isEmptyA47Single(cur[0]);
  blocks[3].rows = onlyPlaceholder ? [...extraRows] : [...cur, ...extraRows];
  while (
    blocks[3].rows.length > 1 &&
    isEmptyA47Single(blocks[3].rows[blocks[3].rows.length - 1])
  ) {
    blocks[3].rows.pop();
  }
  return {
    ...base,
    blocks,
    supplementary: [base.supplementary, leg.supplementary].filter(Boolean).join("\n\n"),
  };
}

export function sanitizePage50A47Form(data) {
  const d = mergePage50A47Form(data);
  return {
    ...d,
    blocks: d.blocks.map((b) => ({
      ...b,
      rows: trimRows(b.rows, isEmptyA47Single, emptyA47SingleRow),
    })),
  };
}
