/**
 * Empty/merge/sanitize for PDF pages 23–30 (PEL observation sheet).
 */

const emptyStcRow = () => ({
  sampleNo: "",
  isc: "",
  voc: "",
  imp: "",
  vmp: "",
  pmax: "",
  ff: "",
});

const emptyVisualRow = () => ({ sampleNo: "", findings: "" });

const emptyWetRow = () => ({
  sampleNo: "",
  measuredMohm: "",
  requiredMohm: "",
  result: "",
});

const emptyInsRow116 = () => ({
  sampleNo: "",
  measuredMohm: "",
  requiredMohm: "",
  breakdownYesDescription: "",
  breakdownNo: false,
});

const emptyT10Vfm = () => ({
  sampleNo: "",
  vfm: "",
  vfmRated: "",
  vfmWithinToleranceYes: false,
  vfmWithinToleranceNo: false,
  result: "",
});

const empty118b = () => ({
  sampleNo: "",
  ivCurveAfterShading: "",
  result: "",
});

const emptyMech13 = () => ({
  sampleNo: "",
  moduleTempC: "",
  maxPressurePa: "",
  pressureTolerancePa: "",
  monitorCurrentA: "",
  ratePerMin: "",
  numCycles: "",
  pressureProvider: "",
  cellBrokenNot: "",
  currentContinuous: "",
});

const emptyTc50 = () => ({
  sampleNo: "",
  openCircuitYes: false,
  openCircuitNo: false,
});

function trimRows(rows, isEmpty, empty) {
  const list = Array.isArray(rows) ? [...rows] : [empty()];
  while (list.length > 1 && isEmpty(list[list.length - 1])) list.pop();
  return list.length ? list : [empty()];
}

// ——— Page 23 ———

export function emptyPage23Form() {
  return {
    table113: {
      testDate: "",
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table114: {
      header: { moduleTempC: "", irradianceWm2: "" },
      rows: [emptyStcRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

function isEmptyVisual(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" &&
      String(r.findings || "") === "")
  );
}

function isEmptyStc(r) {
  return (
    !r ||
    ["sampleNo", "isc", "voc", "imp", "vmp", "pmax", "ff"].every(
      (k) => String(r[k] || "") === "",
    )
  );
}

export function mergePage23Form(saved) {
  const d = emptyPage23Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table113 || saved.table114) {
    const t113 = saved.table113 && typeof saved.table113 === "object" ? saved.table113 : {};
    const t114 = saved.table114 && typeof saved.table114 === "object" ? saved.table114 : {};
    const r113 =
      Array.isArray(t113.rows) && t113.rows.length > 0
        ? t113.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
        : d.table113.rows;
    const r114 =
      Array.isArray(t114.rows) && t114.rows.length > 0
        ? t114.rows.map((r) => ({ ...emptyStcRow(), ...(r && typeof r === "object" ? r : {}) }))
        : d.table114.rows;
    return {
      table113: {
        testDate: typeof t113.testDate === "string" ? t113.testDate : "",
        rows: r113,
        supplementary: typeof t113.supplementary === "string" ? t113.supplementary : "",
      },
      table114: {
        header: {
          moduleTempC:
            typeof t114.header?.moduleTempC === "string"
              ? t114.header.moduleTempC
              : "",
          irradianceWm2:
            typeof t114.header?.irradianceWm2 === "string"
              ? t114.header.irradianceWm2
              : "",
        },
        rows: r114,
        supplementary: typeof t114.supplementary === "string" ? t114.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table113: {
      ...d.table113,
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              sampleNo: String(r?.sampleNo || ""),
              findings: [r?.col2, r?.col3, r?.result].filter(Boolean).join(" | "),
            }))
          : d.table113.rows,
      supplementary: "",
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage23Form(data) {
  const d = mergePage23Form(data);
  return {
    ...d,
    table113: {
      ...d.table113,
      rows: trimRows(d.table113.rows, isEmptyVisual, emptyVisualRow),
    },
    table114: {
      ...d.table114,
      rows: trimRows(d.table114.rows, isEmptyStc, emptyStcRow),
    },
  };
}

// ——— Page 24 ———

export function emptyPage24Form() {
  return {
    table115: {
      header: { moduleTempC: "", irradianceWm2: "" },
      rows: [emptyStcRow()],
      supplementary: "",
    },
    table116: {
      header: {
        testVoltage: "",
        moduleSizeM2: "",
        requiredResistanceMohm: "",
      },
      rows: [emptyInsRow116()],
      supplementary: "",
    },
    supplementary: "",
  };
}

function isEmptyIns116(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" &&
      String(r.measuredMohm || "") === "" &&
      String(r.requiredMohm || "") === "" &&
      String(r.breakdownYesDescription || "") === "" &&
      !r.breakdownNo)
  );
}

export function mergePage24Form(saved) {
  const d = emptyPage24Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table115 || saved.table116) {
    const t115 = saved.table115 && typeof saved.table115 === "object" ? saved.table115 : {};
    const t116 = saved.table116 && typeof saved.table116 === "object" ? saved.table116 : {};
    const r115 =
      Array.isArray(t115.rows) && t115.rows.length > 0
        ? t115.rows.map((r) => ({ ...emptyStcRow(), ...(r && typeof r === "object" ? r : {}) }))
        : d.table115.rows;
    const r116 =
      Array.isArray(t116.rows) && t116.rows.length > 0
        ? t116.rows.map((r) => ({
            ...emptyInsRow116(),
            ...(r && typeof r === "object" ? r : {}),
            breakdownNo: !!r?.breakdownNo,
          }))
        : d.table116.rows;
    return {
      table115: {
        header: {
          moduleTempC:
            typeof t115.header?.moduleTempC === "string" ? t115.header.moduleTempC : "",
          irradianceWm2:
            typeof t115.header?.irradianceWm2 === "string"
              ? t115.header.irradianceWm2
              : "",
        },
        rows: r115,
        supplementary: typeof t115.supplementary === "string" ? t115.supplementary : "",
      },
      table116: {
        header: {
          testVoltage:
            typeof t116.header?.testVoltage === "string" ? t116.header.testVoltage : "",
          moduleSizeM2:
            typeof t116.header?.moduleSizeM2 === "string" ? t116.header.moduleSizeM2 : "",
          requiredResistanceMohm:
            typeof t116.header?.requiredResistanceMohm === "string"
              ? t116.header.requiredResistanceMohm
              : "",
        },
        rows: r116,
        supplementary: typeof t116.supplementary === "string" ? t116.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table115: {
      ...d.table115,
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyStcRow(),
              sampleNo: String(r?.sampleNo || ""),
              isc: String(r?.col2 || ""),
              voc: String(r?.col3 || ""),
              pmax: String(r?.result || ""),
            }))
          : d.table115.rows,
    },
    table116: {
      ...d.table116,
      header: {
        ...d.table116.header,
        testVoltage: typeof h.testVoltage === "string" ? h.testVoltage : "",
        moduleSizeM2: typeof h.moduleSize === "string" ? h.moduleSize : "",
        requiredResistanceMohm:
          typeof h.solutionRes === "string" ? h.solutionRes : "",
      },
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage24Form(data) {
  const d = mergePage24Form(data);
  return {
    ...d,
    table115: {
      ...d.table115,
      rows: trimRows(d.table115.rows, isEmptyStc, emptyStcRow),
    },
    table116: {
      ...d.table116,
      rows: trimRows(d.table116.rows, isEmptyIns116, emptyInsRow116),
    },
  };
}

// ——— Page 25 ———

export function emptyPage25Form() {
  return {
    table117: {
      header: {
        testVoltage: "",
        solutionTemp: "",
        moduleSizeM2: "",
        solutionResistivity: "",
      },
      rows: [emptyWetRow()],
      supplementary: "",
    },
    table118a: {
      header: { ambientTempC: "", currentFlowA: "" },
      rows: [emptyT10Vfm()],
      supplementary: "",
    },
    table118b: {
      rows: [empty118b()],
      supplementary: "",
    },
    supplementary: "",
  };
}

function isEmpty118b(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" &&
      String(r.ivCurveAfterShading || "") === "" &&
      String(r.result || "") === "")
  );
}

function isEmptyT10Vfm(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" &&
      String(r.vfm || "") === "" &&
      String(r.vfmRated || "") === "" &&
      String(r.result || "") === "" &&
      !r.vfmWithinToleranceYes &&
      !r.vfmWithinToleranceNo)
  );
}

export function mergePage25Form(saved) {
  const d = emptyPage25Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table117 || saved.table118a || saved.table118b) {
    const t117 = saved.table117 && typeof saved.table117 === "object" ? saved.table117 : {};
    const t118a = saved.table118a && typeof saved.table118a === "object" ? saved.table118a : {};
    const t118b = saved.table118b && typeof saved.table118b === "object" ? saved.table118b : {};
    return {
      table117: {
        header: {
          testVoltage:
            typeof t117.header?.testVoltage === "string" ? t117.header.testVoltage : "",
          solutionTemp:
            typeof t117.header?.solutionTemp === "string" ? t117.header.solutionTemp : "",
          moduleSizeM2:
            typeof t117.header?.moduleSizeM2 === "string" ? t117.header.moduleSizeM2 : "",
          solutionResistivity:
            typeof t117.header?.solutionResistivity === "string"
              ? t117.header.solutionResistivity
              : "",
        },
        rows:
          Array.isArray(t117.rows) && t117.rows.length > 0
            ? t117.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table117.rows,
        supplementary: typeof t117.supplementary === "string" ? t117.supplementary : "",
      },
      table118a: {
        header: {
          ambientTempC:
            typeof t118a.header?.ambientTempC === "string" ? t118a.header.ambientTempC : "",
          currentFlowA:
            typeof t118a.header?.currentFlowA === "string" ? t118a.header.currentFlowA : "",
        },
        rows:
          Array.isArray(t118a.rows) && t118a.rows.length > 0
            ? t118a.rows.map((r) => ({
                ...emptyT10Vfm(),
                ...(r && typeof r === "object" ? r : {}),
                vfmWithinToleranceYes: !!r?.vfmWithinToleranceYes,
                vfmWithinToleranceNo: !!r?.vfmWithinToleranceNo,
              }))
            : d.table118a.rows,
        supplementary: typeof t118a.supplementary === "string" ? t118a.supplementary : "",
      },
      table118b: {
        rows:
          Array.isArray(t118b.rows) && t118b.rows.length > 0
            ? t118b.rows.map((r) => ({
                ...empty118b(),
                ...(r && typeof r === "object" ? r : {}),
              }))
            : d.table118b.rows,
        supplementary: typeof t118b.supplementary === "string" ? t118b.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table117: {
      ...d.table117,
      header: {
        ...d.table117.header,
        testVoltage: typeof h.testVoltage === "string" ? h.testVoltage : "",
        solutionTemp: typeof h.solutionTemp === "string" ? h.solutionTemp : "",
        moduleSizeM2: typeof h.moduleSize === "string" ? h.moduleSize : "",
        solutionResistivity:
          typeof h.solutionRes === "string" ? h.solutionRes : "",
      },
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              ...emptyWetRow(),
              sampleNo: String(r?.sampleNo || ""),
              measuredMohm: String(r?.col2 || r?.measuredMohm || ""),
              requiredMohm: String(r?.col3 || r?.requiredMohm || ""),
              result: String(r?.result || ""),
            }))
          : d.table117.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage25Form(data) {
  const d = mergePage25Form(data);
  return {
    ...d,
    table117: {
      ...d.table117,
      rows: trimRows(d.table117.rows, (r) => {
        if (!r || typeof r !== "object") return true;
        return (
          String(r.sampleNo || "") === "" &&
          String(r.measuredMohm || "") === "" &&
          String(r.requiredMohm || "") === "" &&
          String(r.result || "") === ""
        );
      }, emptyWetRow),
    },
    table118a: {
      ...d.table118a,
      rows: trimRows(d.table118a.rows, isEmptyT10Vfm, emptyT10Vfm),
    },
    table118b: {
      ...d.table118b,
      rows: trimRows(d.table118b.rows, isEmpty118b, empty118b),
    },
  };
}

// ——— Page 26 ———

export function emptyPage26Form() {
  return {
    table121: {
      header: {
        moduleTempC: "",
        uvIrradiance280_400: "",
        uvDose280_320: "",
        shortCircuited: false,
        openCircuited: false,
      },
      supplementary: "",
    },
    table122: {
      header: {
        moduleTempC: "",
        uvIrradiance280_400: "",
        uvDose280_320: "",
        shortCircuited: false,
        openCircuited: false,
      },
      supplementary: "",
    },
    supplementary: "",
  };
}

export function mergePage26Form(saved) {
  const d = emptyPage26Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table121 || saved.table122) {
    const g = (t, def) => ({
      header: {
        moduleTempC:
          typeof t?.header?.moduleTempC === "string"
            ? t.header.moduleTempC
            : def.header.moduleTempC,
        uvIrradiance280_400:
          typeof t?.header?.uvIrradiance280_400 === "string"
            ? t.header.uvIrradiance280_400
            : def.header.uvIrradiance280_400,
        uvDose280_320:
          typeof t?.header?.uvDose280_320 === "string"
            ? t.header.uvDose280_320
            : def.header.uvDose280_320,
        shortCircuited: !!t?.header?.shortCircuited,
        openCircuited: !!t?.header?.openCircuited,
      },
      supplementary: typeof t?.supplementary === "string" ? t.supplementary : "",
    });
    const t121 = saved.table121 && typeof saved.table121 === "object" ? saved.table121 : {};
    const t122 = saved.table122 && typeof saved.table122 === "object" ? saved.table122 : {};
    return {
      table121: g(t121, d.table121),
      table122: g(t122, d.table122),
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const h = saved.header || {};
  const shared = {
    moduleTempC: typeof h.moduleTemp === "string" ? h.moduleTemp : "",
    uvIrradiance280_400: typeof h.irradiance === "string" ? h.irradiance : "",
    uvDose280_320: typeof h.testMethod === "string" ? h.testMethod : "",
    shortCircuited: false,
    openCircuited: false,
  };
  return {
    ...d,
    table121: {
      ...d.table121,
      header: { ...d.table121.header, ...shared },
    },
    table122: {
      ...d.table122,
      header: { ...d.table122.header, ...shared },
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage26Form(data) {
  return mergePage26Form(data);
}

// ——— Page 27 ———

export function emptyPage27Form() {
  return {
    table123: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table124: {
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

export function mergePage27Form(saved) {
  const d = emptyPage27Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table123 || saved.table124) {
    const t123 = saved.table123 && typeof saved.table123 === "object" ? saved.table123 : {};
    const t124 = saved.table124 && typeof saved.table124 === "object" ? saved.table124 : {};
    return {
      table123: {
        rows:
          Array.isArray(t123.rows) && t123.rows.length > 0
            ? t123.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table123.rows,
        supplementary: typeof t123.supplementary === "string" ? t123.supplementary : "",
      },
      table124: {
        header: {
          testVoltage:
            typeof t124.header?.testVoltage === "string" ? t124.header.testVoltage : "",
          solutionTemp:
            typeof t124.header?.solutionTemp === "string" ? t124.header.solutionTemp : "",
          moduleSizeM2:
            typeof t124.header?.moduleSizeM2 === "string" ? t124.header.moduleSizeM2 : "",
          solutionResistivity:
            typeof t124.header?.solutionResistivity === "string"
              ? t124.header.solutionResistivity
              : "",
        },
        rows:
          Array.isArray(t124.rows) && t124.rows.length > 0
            ? t124.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table124.rows,
        supplementary: typeof t124.supplementary === "string" ? t124.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  return {
    ...d,
    table123: {
      ...d.table123,
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              sampleNo: String(r?.sampleNo || ""),
              findings: [r?.col2, r?.col3, r?.result].filter(Boolean).join(" | "),
            }))
          : d.table123.rows,
    },
    table124: {
      ...d.table124,
      header: {
        ...d.table124.header,
        testVoltage: typeof h.testVoltage === "string" ? h.testVoltage : "",
        solutionTemp: typeof h.solutionTemp === "string" ? h.solutionTemp : "",
        moduleSizeM2: typeof h.moduleSize === "string" ? h.moduleSize : "",
        solutionResistivity:
          typeof h.solutionRes === "string" ? h.solutionRes : "",
      },
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage27Form(data) {
  const d = mergePage27Form(data);
  return {
    ...d,
    table123: {
      ...d.table123,
      rows: trimRows(d.table123.rows, isEmptyVisual, emptyVisualRow),
    },
    table124: {
      ...d.table124,
      rows: trimRows(
        d.table124.rows,
        (r) =>
          !r ||
          (String(r.sampleNo || "") === "" &&
            String(r.measuredMohm || "") === "" &&
            String(r.requiredMohm || "") === "" &&
            String(r.result || "") === ""),
        emptyWetRow,
      ),
    },
  };
}

// ——— Page 28 ———

export function emptyPage28Form() {
  return {
    table13: {
      rows: [emptyMech13()],
      supplementary: "",
    },
    table131: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    table132: {
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

function isEmptyMech13(r) {
  return (
    !r ||
    [
      "sampleNo",
      "moduleTempC",
      "maxPressurePa",
      "pressureTolerancePa",
      "monitorCurrentA",
      "ratePerMin",
      "numCycles",
      "pressureProvider",
      "cellBrokenNot",
      "currentContinuous",
    ].every((k) => String(r[k] || "") === "")
  );
}

export function mergePage28Form(saved) {
  const d = emptyPage28Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table13 || saved.table131 || saved.table132) {
    const t13 = saved.table13 && typeof saved.table13 === "object" ? saved.table13 : {};
    const t131 = saved.table131 && typeof saved.table131 === "object" ? saved.table131 : {};
    const t132 = saved.table132 && typeof saved.table132 === "object" ? saved.table132 : {};
    return {
      table13: {
        rows:
          Array.isArray(t13.rows) && t13.rows.length > 0
            ? t13.rows.map((r) => ({ ...emptyMech13(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table13.rows,
        supplementary: typeof t13.supplementary === "string" ? t13.supplementary : "",
      },
      table131: {
        rows:
          Array.isArray(t131.rows) && t131.rows.length > 0
            ? t131.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table131.rows,
        supplementary: typeof t131.supplementary === "string" ? t131.supplementary : "",
      },
      table132: {
        header: {
          testVoltage:
            typeof t132.header?.testVoltage === "string" ? t132.header.testVoltage : "",
          solutionTemp:
            typeof t132.header?.solutionTemp === "string" ? t132.header.solutionTemp : "",
          moduleSizeM2:
            typeof t132.header?.moduleSizeM2 === "string" ? t132.header.moduleSizeM2 : "",
          solutionResistivity:
            typeof t132.header?.solutionResistivity === "string"
              ? t132.header.solutionResistivity
              : "",
        },
        rows:
          Array.isArray(t132.rows) && t132.rows.length > 0
            ? t132.rows.map((r) => ({ ...emptyWetRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table132.rows,
        supplementary: typeof t132.supplementary === "string" ? t132.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  const h = saved.header || {};
  const first = rows[0] || {};
  const sup13 =
    typeof first.cycleNote === "string" && first.cycleNote
      ? first.cycleNote
      : "";
  return {
    ...d,
    table13: {
      ...d.table13,
      rows: [
        {
          ...emptyMech13(),
          sampleNo: String(first.sampleNo || ""),
          moduleTempC: typeof h.moduleTemp === "string" ? h.moduleTemp : "",
          maxPressurePa: typeof h.maxPressure === "string" ? h.maxPressure : "",
          pressureTolerancePa: typeof h.pressureTol === "string" ? h.pressureTol : "",
          monitorCurrentA: typeof h.monitorCurrent === "string" ? h.monitorCurrent : "",
          ratePerMin: typeof h.ratePerMin === "string" ? h.ratePerMin : "",
          numCycles: typeof h.numCycles === "string" ? h.numCycles : "",
          pressureProvider: typeof h.pressureProvider === "string" ? h.pressureProvider : "",
          cellBrokenNot: typeof h.cellBroken === "string" ? h.cellBroken : "",
          currentContinuous:
            typeof h.currentContinuous === "string" ? h.currentContinuous : "",
        },
      ],
      supplementary: sup13,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage28Form(data) {
  const d = mergePage28Form(data);
  return {
    ...d,
    table13: {
      ...d.table13,
      rows: trimRows(d.table13.rows, isEmptyMech13, emptyMech13),
    },
    table131: {
      ...d.table131,
      rows: trimRows(d.table131.rows, isEmptyVisual, emptyVisualRow),
    },
    table132: {
      ...d.table132,
      rows: trimRows(
        d.table132.rows,
        (r) =>
          !r ||
          (String(r.sampleNo || "") === "" &&
            String(r.measuredMohm || "") === "" &&
            String(r.requiredMohm || "") === "" &&
            String(r.result || "") === ""),
        emptyWetRow,
      ),
    },
  };
}

// ——— Page 29 ———

export function emptyPage29Form() {
  return {
    table14: {
      header: {
        totalCycles50: "",
        weightN: "",
        appliedCurrentA: "",
        dwellHigh: "",
        dwellLow: "",
      },
      rows: [emptyTc50()],
      supplementary: "",
    },
    table141: {
      rows: [emptyVisualRow()],
      supplementary: "",
    },
    supplementary: "",
  };
}

function isEmptyTc50(r) {
  return (
    !r ||
    (String(r.sampleNo || "") === "" &&
      !r.openCircuitYes &&
      !r.openCircuitNo)
  );
}

export function mergePage29Form(saved) {
  const d = emptyPage29Form();
  if (!saved || typeof saved !== "object") return d;

  if (saved.table14 || saved.table141) {
    const t14 = saved.table14 && typeof saved.table14 === "object" ? saved.table14 : {};
    const t141 = saved.table141 && typeof saved.table141 === "object" ? saved.table141 : {};
    return {
      table14: {
        header: {
          totalCycles50:
            typeof t14.header?.totalCycles50 === "string" ? t14.header.totalCycles50 : "",
          weightN: typeof t14.header?.weightN === "string" ? t14.header.weightN : "",
          appliedCurrentA:
            typeof t14.header?.appliedCurrentA === "string" ? t14.header.appliedCurrentA : "",
          dwellHigh: typeof t14.header?.dwellHigh === "string" ? t14.header.dwellHigh : "",
          dwellLow: typeof t14.header?.dwellLow === "string" ? t14.header.dwellLow : "",
        },
        rows:
          Array.isArray(t14.rows) && t14.rows.length > 0
            ? t14.rows.map((r) => ({
                ...emptyTc50(),
                ...(r && typeof r === "object" ? r : {}),
                openCircuitYes: !!r?.openCircuitYes,
                openCircuitNo: !!r?.openCircuitNo,
              }))
            : d.table14.rows,
        supplementary: typeof t14.supplementary === "string" ? t14.supplementary : "",
      },
      table141: {
        rows:
          Array.isArray(t141.rows) && t141.rows.length > 0
            ? t141.rows.map((r) => ({ ...emptyVisualRow(), ...(r && typeof r === "object" ? r : {}) }))
            : d.table141.rows,
        supplementary: typeof t141.supplementary === "string" ? t141.supplementary : "",
      },
      supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
    };
  }

  const rows = Array.isArray(saved.rows) ? saved.rows : [];
  return {
    ...d,
    table141: {
      ...d.table141,
      rows:
        rows.length > 0
          ? rows.map((r) => ({
              sampleNo: String(r?.sampleNo || ""),
              findings: [r?.col2, r?.col3, r?.result].filter(Boolean).join(" | "),
            }))
          : d.table141.rows,
    },
    supplementary: typeof saved.supplementary === "string" ? saved.supplementary : "",
  };
}

export function sanitizePage29Form(data) {
  const d = mergePage29Form(data);
  return {
    ...d,
    table14: {
      ...d.table14,
      rows: trimRows(d.table14.rows, isEmptyTc50, emptyTc50),
    },
    table141: {
      ...d.table141,
      rows: trimRows(d.table141.rows, isEmptyVisual, emptyVisualRow),
    },
  };
}
