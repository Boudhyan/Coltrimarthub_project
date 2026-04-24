const SERVICE_10322_ENTRIES = [
  {
    title: "Creepage And Clearances",
    sheetPreset: "svc_10322_creepage_clearance",
  },
  {
    title: "Endurance Test and Thermal Test",
    sheetPreset: "svc_10322_endurance_thermal",
  },
  {
    title: "Humidity Test and Insulation Resistance",
    sheetPreset: "svc_10322_humidity_insulation",
  },
  {
    title: "Provision For Earthing",
    sheetPreset: "svc_10322_earthing",
  },
  {
    title: "Resistance to Heat, Fire and Tracking",
    sheetPreset: "svc_10322_heat_fire_tracking",
  },
  {
    title: "Temperature Measurement",
    sheetPreset: "svc_10322_temperature_measurement",
  },
];

const SERVICE_15885_ENTRIES = [
  {
    title: "Creepage Distances And Clearances",
    sheetPreset: "svc_15885_creepage_clearance",
  },
  {
    title: "Electric Strength",
    sheetPreset: "svc_15885_electric_strength",
  },
  {
    title: "Moisture Resistance and Insulation",
    sheetPreset: "svc_15885_moisture_insulation",
  },
  {
    title: "Resistance to Heat, Fire and Tracking",
    sheetPreset: "svc_15885_heat_fire_tracking",
  },
];

const SERVICE_16102_ENTRIES = [
  {
    title: "CAP Temperature Rise",
    sheetPreset: "svc_16102_cap_temperature_rise",
  },
  {
    title: "Creepage Distances And Clearances",
    sheetPreset: "svc_16102_creepage_clearance",
  },
  {
    title: "Insulation Resistance and Electric Strength",
    sheetPreset: "svc_16102_insulation_electric_strength",
  },
  {
    title: "Resistance to Heat, Fire and Tracking",
    sheetPreset: "svc_16102_heat_fire_tracking",
  },
];

const SERVICE_16103_ENTRIES = [
  {
    title: "Electric Strength",
    sheetPreset: "svc_16103_electric_strength",
  },
  {
    title: "Moisture Resistance and Insulation",
    sheetPreset: "svc_16103_moisture_insulation",
  },
  {
    title: "Resistance to Heat, Fire and Tracking",
    sheetPreset: "svc_16103_heat_fire_tracking",
  },
];

function profileEntries(serviceId, entries) {
  return entries.map((entry, index) => ({
    pdfPage: index + 1,
    pageKey: `svc_${serviceId}_${String(index + 1).padStart(2, "0")}`,
    storageKey: `svc_${serviceId}_${String(index + 1).padStart(2, "0")}`,
    template: "sheet",
    sheetPreset: entry.sheetPreset || "generic_8_6",
    title: `Service ${serviceId} - ${entry.title}`,
    subtitle: "Observation sheet",
    showHeader: entry.showHeader !== false,
    showFooter: entry.showFooter === true,
  }));
}

export const SERVICE_OBSERVATION_PROFILES = {
  "10322": {
    serviceId: "10322",
    entries: profileEntries(
      "10322",
      SERVICE_10322_ENTRIES.map((entry, idx, arr) => ({
        ...entry,
        showHeader: idx === 0,
        showFooter: idx === arr.length - 1,
      })),
    ),
  },
  "15885": {
    serviceId: "15885",
    entries: profileEntries(
      "15885",
      SERVICE_15885_ENTRIES.map((entry, idx, arr) => ({
        ...entry,
        showHeader: idx === 0,
        showFooter: idx === arr.length - 1,
      })),
    ),
  },
  "16102": {
    serviceId: "16102",
    entries: profileEntries(
      "16102",
      SERVICE_16102_ENTRIES.map((entry, idx, arr) => ({
        ...entry,
        showHeader: idx === 0,
        showFooter: idx === arr.length - 1,
      })),
    ),
  },
  "16103": {
    serviceId: "16103",
    entries: profileEntries(
      "16103",
      SERVICE_16103_ENTRIES.map((entry, idx, arr) => ({
        ...entry,
        showHeader: idx === 0,
        showFooter: idx === arr.length - 1,
      })),
    ),
  },
};

export const LEGACY_54_PAGE_SERVICE_CODE = "14286";

export function detectServiceProfile(serviceTypeKey) {
  const raw = String(serviceTypeKey || "").trim();
  if (!raw) return null;
  const m = raw.match(/(10322|15885|16102|16103)/);
  if (!m) return null;
  return SERVICE_OBSERVATION_PROFILES[m[1]] || null;
}

export function resolveObservationSheetMode(serviceTypeKey) {
  const raw = String(serviceTypeKey || "").trim();
  if (!raw) {
    return { kind: "none", profile: null };
  }
  if (raw.includes(LEGACY_54_PAGE_SERVICE_CODE)) {
    return { kind: "legacy54", profile: null };
  }
  const profile = detectServiceProfile(raw);
  if (profile) {
    return { kind: "profile", profile };
  }
  return { kind: "none", profile: null };
}

