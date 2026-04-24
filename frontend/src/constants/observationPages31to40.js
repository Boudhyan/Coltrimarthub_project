/**
 * Empty / merge / sanitize for PDF pages 31–40 (PEL observation sheet).
 */

import { mergeMqt191Form } from "./observationPages";

const emptyVisualRow = () => ({ sampleNo: "", findings: "" });

const emptyWetRow = () => ({
  sampleNo: "",
  measuredMohm: "",
  requiredMohm: "",
  result: "",
});

const emptyOpenCircuitRow = () => ({
  sampleNo: "",
  openCircuitYes: false,
  openCircuitNo: false,
});

const emptyStcBnpiRow = () => ({
  sampleNo: "",
  isc: "",
  voc: "",
  imp: "",
  vmp: "",
  pmax: "",
  ff: "",
  powerLabGateDegradation: "",
  result: "",
});

function trimRows(rows, isEmpty, empty) {
  const list = Array.isArray(rows) ? [...rows] : [empty()];
  while (list.length > 1 && isEmpty(list[list.length - 1])) list.pop();
  return list.length ? list : [empty()];
}

function isEmptyVisual(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" && String(r.findings || "") === "")
  );
}

function isEmptyWet(r) {
  return (
    !r ||
    ["sampleNo", "measuredMohm", "requiredMohm", "result"].every(
      (k) => String(r[k] || "") === "",
    )
  );
}

function isEmptyOpenCircuit(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" && !r.openCircuitYes && !r.openCircuitNo)
  );
}

function isEmptyStcBnpi(r) {
  return (
    !r ||
    [
      "sampleNo",
      "isc",
      "voc",
      "imp",
      "vmp",
      "pmax",
      "ff",
      "powerLabGateDegradation",
      "result",
    ].every((k) => String(r[k] || "") === "")
  );
}

// ——— Page 31 ———

export function emptyPage31Form() {
  return {
    table15: {
      header: {
        totalCycles10: "",
        appliedCurrentA: "",
        dwellHigh: "",
        dwellLow: "",
      },
      rows: [emptyOpenCircuitRow()],
      supplementary: "",
    },
    table151: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table152: {
      header: {
        testVoltage: "",
        solutionTemp: "",
        moduleSizeM2: "",
        solutionResistivity: "",
      },
      rows: [emptyWetRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage31Form(saved) {
  const d = emptyPage31Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table15 || saved.table151 || saved.table152) {
    const t15 = saved.table15 || {};
    const t151 = saved.table151 || {};
    const t152 = saved.table152 || {};
    return {
      table15: {
        header: {
          totalCycles10: String(t15.header?.totalCycles10 ?? ""),
          appliedCurrentA: String(t15.header?.appliedCurrentA ?? ""),
          dwellHigh: String(t15.header?.dwellHigh ?? ""),
          dwellLow: String(t15.header?.dwellLow ?? ""),
        },
        rows:
          Array.isArray(t15.rows) && t15.rows.length > 0
            ? t15.rows.map((r) => ({
                ...emptyOpenCircuitRow(),
                ...(r && typeof r === "object" ? r : {}),
                openCircuitYes: !!r?.openCircuitYes,
                openCircuitNo: !!r?.openCircuitNo,
              }))
            : d.table15.rows,
        supplementary: typeof t15.supplementary === "string" ? t15.supplementary : "",
      },
      table151: {
        rows:
          Array.isArray(t151.rows) && t151.rows.length > 0
            ? t151.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table151.rows,
        supplementary: typeof t151.supplementary === "string" ? t151.supplementary : "",
      },
      table152: {
        header: {
          testVoltage: String(t152.header?.testVoltage ?? ""),
          solutionTemp: String(t152.header?.solutionTemp ?? ""),
          moduleSizeM2: String(t152.header?.moduleSizeM2 ?? ""),
          solutionResistivity: String(t152.header?.solutionResistivity ?? ""),
        },
        rows:
          Array.isArray(t152.rows) && t152.rows.length > 0
            ? t152.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table152.rows,
        supplementary: typeof t152.supplementary === "string" ? t152.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table152: {
      ...d.table152,
      header: {
        ...d.table152.header,
        testVoltage: String(h.testVoltage ?? ""),
        solutionTemp: String(h.solutionTemp ?? ""),
        moduleSizeM2: String(h.moduleSize ?? ""),
        solutionResistivity: String(h.solutionRes ?? h.solutionResistivity ?? ""),
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyWetRow(),
              sampleNo: String(r?.sampleNo ?? ""),
              measuredMohm: String(r?.col2 ?? r?.measuredMohm ?? ""),
              requiredMohm: String(r?.col3 ?? r?.requiredMohm ?? ""),
              result: String(r?.result ?? ""),
            }))
          : d.table152.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage31Form(data) {
  const d = mergePage31Form(data);
  return {
    ...d,
    table15: {
      ...d.table15,
      rows: trimRows(d.table15.rows, isEmptyOpenCircuit, emptyOpenCircuitRow),
    },
    table151: {
      ...d.table151,
      rows: trimRows(d.table151.rows, isEmptyVisual, emptyVisualRow),
    },
    table152: {
      ...d.table152,
      rows: trimRows(d.table152.rows, isEmptyWet, emptyWetRow),
    },
  };
}

// ——— Page 32 ———

export function emptyPage32Form() {
  return {
    table16: {
      rows: [emptyVisualRow()],
      testForceAppliedN: "40",
      supplementary: "",
    },
    table161: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table162: {
      header: {
        testVoltage: "",
        solutionTemp: "",
        moduleSizeM2: "",
        solutionResistivity: "",
      },
      rows: [emptyWetRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage32Form(saved) {
  const d = emptyPage32Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table16 || saved.table161 || saved.table162) {
    const t16 = saved.table16 || {};
    const t161 = saved.table161 || {};
    const t162 = saved.table162 || {};
    return {
      table16: {
        rows:
          Array.isArray(t16.rows) && t16.rows.length > 0
            ? t16.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table16.rows,
        testForceAppliedN:
          typeof t16.testForceAppliedN === "string" ? t16.testForceAppliedN : "40",
        supplementary: typeof t16.supplementary === "string" ? t16.supplementary : "",
      },
      table161: {
        rows:
          Array.isArray(t161.rows) && t161.rows.length > 0
            ? t161.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table161.rows,
        supplementary: typeof t161.supplementary === "string" ? t161.supplementary : "",
      },
      table162: {
        header: {
          testVoltage: String(t162.header?.testVoltage ?? ""),
          solutionTemp: String(t162.header?.solutionTemp ?? ""),
          moduleSizeM2: String(t162.header?.moduleSizeM2 ?? ""),
          solutionResistivity: String(t162.header?.solutionResistivity ?? ""),
        },
        rows:
          Array.isArray(t162.rows) && t162.rows.length > 0
            ? t162.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table162.rows,
        supplementary: typeof t162.supplementary === "string" ? t162.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table162: {
      ...d.table162,
      header: {
        ...d.table162.header,
        testVoltage: String(h.testVoltage ?? ""),
        solutionTemp: String(h.solutionTemp ?? ""),
        moduleSizeM2: String(h.moduleSize ?? ""),
        solutionResistivity: String(h.solutionRes ?? ""),
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyWetRow(),
              sampleNo: String(r?.sampleNo ?? ""),
              measuredMohm: String(r?.col2 ?? ""),
              requiredMohm: String(r?.col3 ?? ""),
              result: String(r?.result ?? ""),
            }))
          : d.table162.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage32Form(data) {
  const d = mergePage32Form(data);
  return {
    ...d,
    table16: {
      ...d.table16,
      rows: trimRows(d.table16.rows, isEmptyVisual, emptyVisualRow),
    },
    table161: {
      ...d.table161,
      rows: trimRows(d.table161.rows, isEmptyVisual, emptyVisualRow),
    },
    table162: {
      ...d.table162,
      rows: trimRows(d.table162.rows, isEmptyWet, emptyWetRow),
    },
  };
}

// ——— Page 33 ———

export function emptyPage33Form() {
  return {
    table17: {
      header: {
        totalCycles96: "",
        weightN: "",
        appliedCurrentA: "",
        dwellHigh: "",
        dwellLow: "",
      },
      rows: [emptyOpenCircuitRow()],
      supplementary: "",
    },
    table171: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage33Form(saved) {
  const d = emptyPage33Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table17 || saved.table171) {
    const t17 = saved.table17 || {};
    const t171 = saved.table171 || {};
    return {
      table17: {
        header: {
          totalCycles96: String(t17.header?.totalCycles96 ?? ""),
          weightN: String(t17.header?.weightN ?? ""),
          appliedCurrentA: String(t17.header?.appliedCurrentA ?? ""),
          dwellHigh: String(t17.header?.dwellHigh ?? ""),
          dwellLow: String(t17.header?.dwellLow ?? ""),
        },
        rows:
          Array.isArray(t17.rows) && t17.rows.length > 0
            ? t17.rows.map((r) => ({
                ...emptyOpenCircuitRow(),
                ...(r && typeof r === "object" ? r : {}),
                openCircuitYes: !!r?.openCircuitYes,
                openCircuitNo: !!r?.openCircuitNo,
              }))
            : d.table17.rows,
        supplementary: typeof t17.supplementary === "string" ? t17.supplementary : "",
      },
      table171: {
        rows:
          Array.isArray(t171.rows) && t171.rows.length > 0
            ? t171.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table171.rows,
        supplementary: typeof t171.supplementary === "string" ? t171.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  return {
    ...d,
    table171: {
      ...d.table171,
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              sampleNo: String(r?.sampleNo ?? ""),
              findings: [r?.col2, r?.col3, r?.result].filter(Boolean).join(" | "),
            }))
          : d.table171.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage33Form(data) {
  const d = mergePage33Form(data);
  return {
    ...d,
    table17: {
      ...d.table17,
      rows: trimRows(d.table17.rows, isEmptyOpenCircuit, emptyOpenCircuitRow),
    },
    table171: {
      ...d.table171,
      rows: trimRows(d.table171.rows, isEmptyVisual, emptyVisualRow),
    },
  };
}

// ——— Page 35 ———

const emptyDhSampleRow = () => ({ sampleNo: "" });

function isEmptyDhSample(r) {
  return !r || String(r.sampleNo || "") === "";
}

export function emptyPage35Form() {
  return {
    table18: {
      header: { totalHours1000: "" },
      rows: [emptyDhSampleRow()],
      supplementary: "",
    },
    table181: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table182: {
      header: {
        testVoltage: "",
        solutionTemp: "",
        moduleSizeM2: "",
        solutionResistivity: "",
      },
      rows: [emptyWetRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage35Form(saved) {
  const d = emptyPage35Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table18 || saved.table181 || saved.table182) {
    const t18 = saved.table18 || {};
    const t181 = saved.table181 || {};
    const t182 = saved.table182 || {};
    return {
      table18: {
        header: { totalHours1000: String(t18.header?.totalHours1000 ?? "") },
        rows:
          Array.isArray(t18.rows) && t18.rows.length > 0
            ? t18.rows.map((r) => ({ ...emptyDhSampleRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table18.rows,
        supplementary: typeof t18.supplementary === "string" ? t18.supplementary : "",
      },
      table181: {
        rows:
          Array.isArray(t181.rows) && t181.rows.length > 0
            ? t181.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table181.rows,
        supplementary: typeof t181.supplementary === "string" ? t181.supplementary : "",
      },
      table182: {
        header: {
          testVoltage: String(t182.header?.testVoltage ?? ""),
          solutionTemp: String(t182.header?.solutionTemp ?? ""),
          moduleSizeM2: String(t182.header?.moduleSizeM2 ?? ""),
          solutionResistivity: String(t182.header?.solutionResistivity ?? ""),
        },
        rows:
          Array.isArray(t182.rows) && t182.rows.length > 0
            ? t182.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table182.rows,
        supplementary: typeof t182.supplementary === "string" ? t182.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table182: {
      ...d.table182,
      header: {
        ...d.table182.header,
        testVoltage: String(h.testVoltage ?? ""),
        solutionTemp: String(h.solutionTemp ?? ""),
        moduleSizeM2: String(h.moduleSize ?? ""),
        solutionResistivity: String(h.solutionRes ?? ""),
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyWetRow(),
              sampleNo: String(r?.sampleNo ?? ""),
              measuredMohm: String(r?.col2 ?? ""),
              requiredMohm: String(r?.col3 ?? ""),
              result: String(r?.result ?? ""),
            }))
          : d.table182.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage35Form(data) {
  const d = mergePage35Form(data);
  return {
    ...d,
    table18: {
      ...d.table18,
      rows: trimRows(d.table18.rows, isEmptyDhSample, emptyDhSampleRow),
    },
    table181: {
      ...d.table181,
      rows: trimRows(d.table181.rows, isEmptyVisual, emptyVisualRow),
    },
    table182: {
      ...d.table182,
      rows: trimRows(d.table182.rows, isEmptyWet, emptyWetRow),
    },
  };
}

// ——— Page 36 ———

const emptyStaticMechRow = () => ({
  sampleNo: "",
  designLoadFrontBack: "",
  safetyFactors: "",
  mountingMethod: "",
  loadAppliedTo: "",
  mechanicalLoadPa: "",
  firstCycleStartEnd: "",
  intermittentOc1Yes: false,
  intermittentOc1No: false,
  secondCycleStartEnd: "",
  intermittentOc2Yes: false,
  intermittentOc2No: false,
  thirdCycleStartEnd: "",
  intermittentOc3Yes: false,
  intermittentOc3No: false,
});

function isEmptyStaticMech(r) {
  if (!r || typeof r !== "object") return true;
  return (
    String(r.sampleNo || "") === "" &&
    String(r.designLoadFrontBack || "") === "" &&
    String(r.safetyFactors || "") === "" &&
    String(r.mountingMethod || "") === "" &&
    String(r.loadAppliedTo || "") === "" &&
    String(r.mechanicalLoadPa || "") === "" &&
    String(r.firstCycleStartEnd || "") === "" &&
    String(r.secondCycleStartEnd || "") === "" &&
    String(r.thirdCycleStartEnd || "") === "" &&
    !r.intermittentOc1Yes &&
    !r.intermittentOc1No &&
    !r.intermittentOc2Yes &&
    !r.intermittentOc2No &&
    !r.intermittentOc3Yes &&
    !r.intermittentOc3No
  );
}

export function emptyPage36Form() {
  return {
    table19: {
      rows: [emptyStaticMechRow()],
      supplementary: "",
    },
    table191: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table192: {
      header: {
        testVoltage: "",
        solutionTemp: "",
        moduleSizeM2: "",
        solutionResistivity: "",
      },
      rows: [emptyWetRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage36Form(saved) {
  const d = emptyPage36Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table19 || saved.table191 || saved.table192) {
    const t19 = saved.table19 || {};
    const t191 = saved.table191 || {};
    const t192 = saved.table192 || {};
    return {
      table19: {
        rows:
          Array.isArray(t19.rows) && t19.rows.length > 0
            ? t19.rows.map((r) => ({
                ...emptyStaticMechRow(),
                ...(r && typeof r === "object" ? r : {}),
                intermittentOc1Yes: !!r?.intermittentOc1Yes,
                intermittentOc1No: !!r?.intermittentOc1No,
                intermittentOc2Yes: !!r?.intermittentOc2Yes,
                intermittentOc2No: !!r?.intermittentOc2No,
                intermittentOc3Yes: !!r?.intermittentOc3Yes,
                intermittentOc3No: !!r?.intermittentOc3No,
              }))
            : d.table19.rows,
        supplementary: typeof t19.supplementary === "string" ? t19.supplementary : "",
      },
      table191: {
        rows:
          Array.isArray(t191.rows) && t191.rows.length > 0
            ? t191.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table191.rows,
        supplementary: typeof t191.supplementary === "string" ? t191.supplementary : "",
      },
      table192: {
        header: {
          testVoltage: String(t192.header?.testVoltage ?? ""),
          solutionTemp: String(t192.header?.solutionTemp ?? ""),
          moduleSizeM2: String(t192.header?.moduleSizeM2 ?? ""),
          solutionResistivity: String(t192.header?.solutionResistivity ?? ""),
        },
        rows:
          Array.isArray(t192.rows) && t192.rows.length > 0
            ? t192.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table192.rows,
        supplementary: typeof t192.supplementary === "string" ? t192.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table192: {
      ...d.table192,
      header: {
        ...d.table192.header,
        testVoltage: String(h.testVoltage ?? ""),
        solutionTemp: String(h.solutionTemp ?? ""),
        moduleSizeM2: String(h.moduleSize ?? ""),
        solutionResistivity: String(h.solutionRes ?? ""),
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyWetRow(),
              sampleNo: String(r?.sampleNo ?? ""),
              measuredMohm: String(r?.col2 ?? ""),
              requiredMohm: String(r?.col3 ?? ""),
              result: String(r?.result ?? ""),
            }))
          : d.table192.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage36Form(data) {
  const d = mergePage36Form(data);
  return {
    ...d,
    table19: {
      ...d.table19,
      rows: trimRows(d.table19.rows, isEmptyStaticMech, emptyStaticMechRow),
    },
    table191: {
      ...d.table191,
      rows: trimRows(d.table191.rows, isEmptyVisual, emptyVisualRow),
    },
    table192: {
      ...d.table192,
      rows: trimRows(d.table192.rows, isEmptyWet, emptyWetRow),
    },
  };
}

// ——— Page 37 ———

export function emptyPage37Form() {
  return {
    table21: {
      header: {
        iceBallSizeMm: "",
        iceBallWeightG: "",
        iceBallVelocityMps: "",
        numImpactLocations: "",
      },
      rows: [emptyDhSampleRow()],
      supplementary: "",
    },
    table211: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table212: {
      header: {
        testVoltage: "",
        solutionTemp: "",
        moduleSizeM2: "",
        solutionResistivity: "",
      },
      rows: [emptyWetRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage37Form(saved) {
  const d = emptyPage37Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table21 || saved.table211 || saved.table212) {
    const t21 = saved.table21 || {};
    const t211 = saved.table211 || {};
    const t212 = saved.table212 || {};
    return {
      table21: {
        header: {
          iceBallSizeMm: String(t21.header?.iceBallSizeMm ?? ""),
          iceBallWeightG: String(t21.header?.iceBallWeightG ?? ""),
          iceBallVelocityMps: String(t21.header?.iceBallVelocityMps ?? ""),
          numImpactLocations: String(t21.header?.numImpactLocations ?? ""),
        },
        rows:
          Array.isArray(t21.rows) && t21.rows.length > 0
            ? t21.rows.map((r) => ({ ...emptyDhSampleRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table21.rows,
        supplementary: typeof t21.supplementary === "string" ? t21.supplementary : "",
      },
      table211: {
        rows:
          Array.isArray(t211.rows) && t211.rows.length > 0
            ? t211.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table211.rows,
        supplementary: typeof t211.supplementary === "string" ? t211.supplementary : "",
      },
      table212: {
        header: {
          testVoltage: String(t212.header?.testVoltage ?? ""),
          solutionTemp: String(t212.header?.solutionTemp ?? ""),
          moduleSizeM2: String(t212.header?.moduleSizeM2 ?? ""),
          solutionResistivity: String(t212.header?.solutionResistivity ?? ""),
        },
        rows:
          Array.isArray(t212.rows) && t212.rows.length > 0
            ? t212.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table212.rows,
        supplementary: typeof t212.supplementary === "string" ? t212.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table212: {
      ...d.table212,
      header: {
        ...d.table212.header,
        testVoltage: String(h.testVoltage ?? ""),
        solutionTemp: String(h.solutionTemp ?? ""),
        moduleSizeM2: String(h.moduleSize ?? ""),
        solutionResistivity: String(h.solutionRes ?? ""),
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyWetRow(),
              sampleNo: String(r?.sampleNo ?? ""),
              measuredMohm: String(r?.col2 ?? r?.c1 ?? ""),
              requiredMohm: String(r?.col3 ?? ""),
              result: String(r?.result ?? ""),
            }))
          : d.table212.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage37Form(data) {
  const d = mergePage37Form(data);
  return {
    ...d,
    table21: {
      ...d.table21,
      rows: trimRows(d.table21.rows, isEmptyDhSample, emptyDhSampleRow),
    },
    table211: {
      ...d.table211,
      rows: trimRows(d.table211.rows, isEmptyVisual, emptyVisualRow),
    },
    table212: {
      ...d.table212,
      rows: trimRows(d.table212.rows, isEmptyWet, emptyWetRow),
    },
  };
}

// ——— Page 38 ———

const emptyPidRow = () => ({
  sampleNo: "",
  appliedVoltageStressPolarities: "",
});

function isEmptyPid(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" &&
      String(r.appliedVoltageStressPolarities || "") === "")
  );
}

export function emptyPage38Form() {
  return {
    table22: {
      header: {
        chamberAirTempC: "",
        chamberRhPct: "",
        testDurationH: "",
      },
      rows: [emptyPidRow()],
      supplementary: "",
    },
    table221: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage38Form(saved) {
  const d = emptyPage38Form();
  if (!saved || typeof saved !== "object") return d;
  if (saved.table22 || saved.table221) {
    const t22 = saved.table22 || {};
    const t221 = saved.table221 || {};
    return {
      table22: {
        header: {
          chamberAirTempC: String(t22.header?.chamberAirTempC ?? ""),
          chamberRhPct: String(t22.header?.chamberRhPct ?? ""),
          testDurationH: String(t22.header?.testDurationH ?? ""),
        },
        rows:
          Array.isArray(t22.rows) && t22.rows.length > 0
            ? t22.rows.map((r) => ({ ...emptyPidRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table22.rows,
        supplementary: typeof t22.supplementary === "string" ? t22.supplementary : "",
      },
      table221: {
        rows:
          Array.isArray(t221.rows) && t221.rows.length > 0
            ? t221.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table221.rows,
        supplementary: typeof t221.supplementary === "string" ? t221.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }
  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table22: {
      ...d.table22,
      header: {
        ...d.table22.header,
        chamberAirTempC: String(h.h1 ?? ""),
        chamberRhPct: String(h.h2 ?? ""),
        testDurationH: String(h.h3 ?? ""),
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyPidRow(),
              sampleNo: String(r?.sampleNo ?? ""),
              appliedVoltageStressPolarities: [r?.col2, r?.col3, r?.result].filter(Boolean).join(" | "),
            }))
          : d.table22.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage38Form(data) {
  const d = mergePage38Form(data);
  return {
    ...d,
    table22: {
      ...d.table22,
      rows: trimRows(d.table22.rows, isEmptyPid, emptyPidRow),
    },
    table221: {
      ...d.table221,
      rows: trimRows(d.table221.rows, isEmptyVisual, emptyVisualRow),
    },
  };
}

// ——— Page 40 ———

export function emptyPage40Form() {
  return {
    monoStc: {
      header: { testMethodSolarSimulator: false, testMethodNaturalSunlight: false },
      rows: [emptyStcBnpiRow()],
      supplementary: "",
    },
    bnpi: {
      header: { testMethodSolarSimulator: false, testMethodNaturalSunlight: false },
      rows: [emptyStcBnpiRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage40Form(saved) {
  const d = emptyPage40Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.monoStc || saved.bnpi) {
    const m = saved.monoStc || {};
    const b = saved.bnpi || {};
    const mapRows = (rows) =>
      Array.isArray(rows) && rows.length > 0
        ? rows.map((r) => ({
            ...emptyStcBnpiRow(),
            ...(r && typeof r === "object" ? r : {}),
          }))
        : undefined;
    return {
      monoStc: {
        header: {
          testMethodSolarSimulator: !!m.header?.testMethodSolarSimulator,
          testMethodNaturalSunlight: !!m.header?.testMethodNaturalSunlight,
        },
        rows: mapRows(m.rows) || d.monoStc.rows,
        supplementary: typeof m.supplementary === "string" ? m.supplementary : "",
      },
      bnpi: {
        header: {
          testMethodSolarSimulator: !!b.header?.testMethodSolarSimulator,
          testMethodNaturalSunlight: !!b.header?.testMethodNaturalSunlight,
        },
        rows: mapRows(b.rows) || d.bnpi.rows,
        supplementary: typeof b.supplementary === "string" ? b.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  /** Legacy `stab` (MQT 19.2 cycle) shape — preserve as page supplementary text. */
  if (Array.isArray(saved.rows) && saved.rows.length > 0) {
    const mergedLegacy = mergeMqt191Form(saved);
    const note =
      "— Imported from previous TABLE 23.3 stabilization (stab) layout —\n" +
      JSON.stringify(mergedLegacy, null, 2).slice(0, 15000);
    return {
      ...d,
      supplementary: [saved.supplementary, note].filter(Boolean).join("\n\n"),
    };
  }

  return {
    ...d,
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage40Form(data) {
  const d = mergePage40Form(data);
  return {
    ...d,
    monoStc: {
      ...d.monoStc,
      rows: trimRows(d.monoStc.rows, isEmptyStcBnpi, emptyStcBnpiRow),
    },
    bnpi: {
      ...d.bnpi,
      rows: trimRows(d.bnpi.rows, isEmptyStcBnpi, emptyStcBnpiRow),
    },
  };
}
