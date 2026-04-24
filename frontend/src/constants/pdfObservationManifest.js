export const PDF_PAGE_COUNT = 54;

/**
 * @typedef {{
 *   pdfPage: number,
 *   pageKey: string,
 *   storageKey?: string,
 *   template: string,
 *   title: string,
 *   subtitle?: string,
 *   sheetPreset?: string,
 *   stcVariant?: "bnpi" | "backside",
 *   stcDualElectrical?: boolean,
 *   stcPage10Extras?: boolean,
 *   simpleVariant?: "mq07_front",
 *   wetVariant?:
 *     | "table142"
 *     | "table152"
 *     | "table162"
 *     | "table172"
 *     | "table182"
 *     | "table192"
 *     | "table212"
 *     | "table222"
 *     | "table2310",
 *   insulationVariant?: "initial_04" | "final_239",
 * }} PdfPageEntry
 */

function pe(page, template, title, opts = {}) {
  const pageKey = `page_${String(page).padStart(2, "0")}`;
  const { storageKey, ...rest } = opts;
  return {
    pdfPage: page,
    pageKey,
    storageKey: storageKey ?? pageKey,
    template,
    title,
    ...rest,
  };
}

/** Ordered list: PDF printed page 1 → index 0 → page_01 */
export const PDF_PAGE_MANIFEST = [
  pe(1, "visual", "TABLE 01 : MQT 01 ini : Initial Visual inspection"),
  pe(
    2,
    "stc",
    "TABLE 02.2 : MQT 06.1 ini — Performance at STC before initial stabilization (Backside)",
  ),
  pe(
    3,
    "stc",
    "TABLE 02.3 : MQT 06.1 ini — Performance at BNPI (front 1000 W/m², back irradiance)",
    { stcVariant: "bnpi" },
  ),
  pe(
    4,
    "stab",
    "TABLE 02.4 : MQT 19.1 — Initial stabilization procedure (PDF page 4)",
  ),
  pe(
    5,
    "stab",
    "TABLE 02.4 (continued) — Stabilization data (PDF page 5)",
    { storageKey: "page_04" },
  ),
  pe(
    6,
    "stab",
    "TABLE 02.4 (continued) — Stabilization data (PDF page 6)",
    { storageKey: "page_04" },
  ),
  pe(
    7,
    "stab",
    "TABLE 02.4 (continued) — Stabilization data (PDF page 7)",
    { storageKey: "page_04" },
  ),
  pe(
    8,
    "stab",
    "TABLE 02.4 (continued) — Stabilization data (PDF page 8)",
    { storageKey: "page_04" },
  ),
  pe(
    9,
    "stc",
    "TABLE 03.1 : MQT 06.1 — STC after initial stabilization (Front, 1000 W/m², 25 °C)",
    { stcDualElectrical: true },
  ),
  pe(
    10,
    "stc",
    "TABLE 03.2 : MQT 06.1 — STC after initial stabilization (Backside)",
    { stcVariant: "backside", stcPage10Extras: true },
  ),
  pe(
    11,
    "stc",
    "TABLE 03.3 : MQT 06.1 — BNPI after initial stabilization (front & back irradiance)",
    { stcVariant: "bnpi", stcDualElectrical: true },
  ),
  pe(12, "insulation", "TABLE 04 : MQT 03 — Initial insulation test", {
    insulationVariant: "initial_04",
  }),
  pe(13, "wet", "TABLE 05 : MQT 15 — Initial wet leakage current test"),
  pe(
    14,
    "simple",
    "TABLE 06.1 : MQT 07 — Performance at low irradiance (Front)",
    { simpleVariant: "mq07_front" },
  ),
  pe(
    15,
    "simple",
    "TABLE 06.2 : MQT 07 — Performance at low irradiance (Backside)",
    { storageKey: "page_14" },
  ),
  pe(16, "tempco", "TABLE 07 : MQT 04 — Measurement of temperature coefficients"),
  pe(
    17,
    "sheet",
    "TABLE 08 : MQT 08 — Outdoor exposure & TABLE 08.1 visual after outdoor",
    { sheetPreset: "outdoor_17" },
  ),
  pe(18, "sheet", "TABLE 09 : MQT 18 — Bypass diode thermal test", {
    sheetPreset: "bypass_18",
  }),
  pe(19, "sheet", "MQT 18 — Bypass diode (junction / VD data)", {
    sheetPreset: "bypass_19",
  }),
  pe(
    20,
    "sheet",
    "TABLE 09.1 & 09.2 — Visual after bypass thermal & wet leakage after",
    { sheetPreset: "combo_visual_wet" },
  ),
  pe(
    21,
    "sheet",
    "TABLE 10 / 10.1–10.3 — Bypass functionality, final stabilization, STC before final stab.",
    { sheetPreset: "table10_page21" },
  ),
  pe(22, "sheet", "TABLE 11 : MQT 09 — Hot-spot endurance test", {
    sheetPreset: "hot_spot_22",
  }),
  pe(
    23,
    "sheet",
    "TABLE 11.3 & 11.4 — Visual after hot-spot & MQT 02 max power after hot-spot",
    { sheetPreset: "page_23_hs_visual_stc" },
  ),
  pe(
    24,
    "sheet",
    "TABLE 11.5 & 11.6 — Max power BNPI after hot-spot & insulation after hot-spot",
    { sheetPreset: "page_24_bnpi_insulation" },
  ),
  pe(
    25,
    "sheet",
    "TABLE 11.7 & 11.8 — Wet leakage & bypass diode function after hot-spot",
    { sheetPreset: "page_25_wet_bypass_hs" },
  ),
  pe(26, "sheet", "TABLE 12.1 & 12.2 — UV preconditioning (front / back)", {
    sheetPreset: "page_26_uv_front_back",
  }),
  pe(
    27,
    "sheet",
    "TABLE 12.3 & 12.4 — Visual & wet leakage after UV preconditioning",
    { sheetPreset: "page_27_uv_followup" },
  ),
  pe(
    28,
    "sheet",
    "TABLE 13 / 13.1 / 13.2 — Cyclic mechanical load, visual, wet leakage",
    { sheetPreset: "page_28_mech_combo" },
  ),
  pe(
    29,
    "sheet",
    "TABLE 14 & 14.1 — Thermal cycling 50 & visual after",
    { sheetPreset: "page_29_tc50_visual" },
  ),
  pe(30, "wet", "TABLE 14.2 : MQT 15 — Wet leakage after thermal cycling 50", {
    wetVariant: "table142",
  }),
  pe(
    31,
    "sheet",
    "TABLE 15 / 15.1 / 15.2 — Humidity freeze 10, visual, wet leakage",
    { sheetPreset: "page_31_hf10_combo" },
  ),
  pe(
    32,
    "sheet",
    "TABLE 16 / 16.1 / 16.2 — Junction box retention, visual, wet leakage",
    { sheetPreset: "page_32_jbox_combo" },
  ),
  pe(33, "sheet", "TABLE 17 & 17.1 — Thermal cycling 200 & visual after", {
    sheetPreset: "page_33_tc200_visual",
  }),
  pe(34, "wet", "TABLE 17.2 : MQT 15 — Wet leakage after thermal cycling 200", {
    wetVariant: "table172",
  }),
  pe(
    35,
    "sheet",
    "TABLE 18 / 18.1 / 18.2 — Damp heat 1000, visual, wet leakage",
    { sheetPreset: "page_35_damp_heat_combo" },
  ),
  pe(
    36,
    "sheet",
    "TABLE 19 / 19.1 / 19.2 — Static mechanical load, visual, wet leakage",
    { sheetPreset: "page_36_static_mech_combo" },
  ),
  pe(
    37,
    "sheet",
    "TABLE 21 / 21.1 / 21.2 — Hail impact, visual, wet leakage",
    { sheetPreset: "page_37_hail_combo" },
  ),
  pe(
    38,
    "sheet",
    "TABLE 22 & 22.1 — PID test & visual after PID",
    { sheetPreset: "page_38_pid_combo" },
  ),
  pe(39, "wet", "TABLE 22.2 : MQT 15 — Wet leakage after PID", {
    wetVariant: "table222",
  }),
  pe(
    40,
    "sheet",
    "TABLE 23.3 : MQT 19.2 — Final stabilization (Method 2)",
    { sheetPreset: "page_40_final_stab_233" },
  ),
  pe(
    41,
    "sheet",
    "TABLE 23.4 : MQT 19.2 — Final stabilization (Method 4)",
    { sheetPreset: "page_41_final_stab_234" },
  ),
  pe(
    42,
    "sheet",
    "TABLE 23.6 : MQT 06.1 ini — Performance at STC after final stabilization (Front)",
    { sheetPreset: "page_42_stc_front_236" },
  ),
  pe(
    43,
    "sheet",
    "TABLE 23.7 : MQT 06.1 ini — Performance at STC after final stabilization (Back)",
    { sheetPreset: "page_43_stc_back_237" },
  ),
  pe(
    44,
    "sheet",
    "TABLE 23.8 : MQT 06.1 — Final performance at BNPI",
    { sheetPreset: "page_44_bnpi_final_238" },
  ),
  pe(45, "insulation", "TABLE 23.9 : MQT 03 — Final insulation test", {
    insulationVariant: "final_239",
  }),
  pe(46, "wet", "TABLE 23.10 : MQT 15 — Final wet leakage current test", {
    wetVariant: "table2310",
  }),
  pe(
    47,
    "sheet",
    "TABLE A.4.1 — Performance at STC before initial stabilization (Front)",
    { sheetPreset: "page_47_a41_front" },
  ),
  pe(
    48,
    "sheet",
    "TABLE A.4.4 — Performance at STC before initial stabilization (Back)",
    { sheetPreset: "page_48_a44_back" },
  ),
  pe(
    49,
    "sheet",
    "TABLE A.4.3 — Performance at BNPI before initial stabilization",
    { sheetPreset: "page_49_a43_bnpi" },
  ),
  pe(
    50,
    "sheet",
    "TABLE A.4.7 : MQT 19.1 ini — Initial stabilization procedure",
    { sheetPreset: "page_50_a47_ini" },
  ),
  pe(
    51,
    "sheet",
    "TABLE A.4.7 (continued) — Initial stabilization",
    { sheetPreset: "page_50_a47_ini", storageKey: "page_50" },
  ),
  pe(
    52,
    "sheet",
    "TABLE A.4.7 : MQT 6.1 — Performance at STC after initial stabilization (Front)",
    { sheetPreset: "page_52_a47_stc_front" },
  ),
  pe(
    53,
    "sheet",
    "TABLE A.4.8 : MQT 6.1 — Performance at STC after initial stabilization (Backside)",
    { sheetPreset: "page_53_a48_back" },
  ),
  pe(
    54,
    "sheet",
    "TABLE A.4.9 : MQT 6.1 — Performance at BNPI after initial stabilization",
    { sheetPreset: "page_54_a49_bnpi" },
  ),
];

/** First manifest row per API/storage key (used for merge + sanitize). */
export const MANIFEST_BY_STORAGE_KEY = (() => {
  const m = {};
  for (const e of PDF_PAGE_MANIFEST) {
    const sk = e.storageKey || e.pageKey;
    if (!m[sk]) m[sk] = e;
  }
  return m;
})();

/** @deprecated Prefer MANIFEST_BY_STORAGE_KEY or manifestRowForPdfPage. */
export const MANIFEST_BY_PAGE_KEY = MANIFEST_BY_STORAGE_KEY;

export const ALL_MANIFEST_STORAGE_KEYS = new Set(
  PDF_PAGE_MANIFEST.map((e) => e.storageKey || e.pageKey),
);

export function manifestRowForPdfPage(n) {
  return (
    PDF_PAGE_MANIFEST.find((e) => e.pdfPage === n) || PDF_PAGE_MANIFEST[0]
  );
}

/** API PATCH key for this printed PDF page (pp. 5–8 → page_04). */
export function storageKeyForPdfPage(n) {
  const row = manifestRowForPdfPage(n);
  return row.storageKey || row.pageKey;
}

export function manifestEntryForPdfPage(n) {
  return manifestRowForPdfPage(n);
}

export function pageKeyForPdfPage(n) {
  return storageKeyForPdfPage(n);
}

/** Parse `?page=` for workspace: always 1–54 printed PDF page index. */
export function parsePdfPageFromQuery(param) {
  if (param == null || param === "") return 1;
  const s = String(param).trim();
  if (s === "mqt_06_1_ini") return 2;
  if (s === "mqt_19_1") return 4;
  const n = parseInt(s, 10);
  if (Number.isFinite(n) && n >= 1 && n <= PDF_PAGE_COUNT) return n;
  const m = /^page_(\d{1,2})$/i.exec(s);
  if (m) {
    const num = parseInt(m[1], 10);
    if (num >= 1 && num <= PDF_PAGE_COUNT) return num;
  }
  return 1;
}

export function normalizeLegacyPageParam(param) {
  if (!param) return null;
  if (param === "mqt_06_1_ini") return "page_02";
  if (param === "mqt_19_1") return "page_04";
  if (param.startsWith("page_")) return param;
  const n = parseInt(String(param), 10);
  if (Number.isFinite(n) && n >= 1 && n <= PDF_PAGE_COUNT) {
    return `page_${String(n).padStart(2, "0")}`;
  }
  return null;
}
