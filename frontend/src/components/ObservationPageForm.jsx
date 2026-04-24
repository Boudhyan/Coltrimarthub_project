import ObservationFormMQT061Ini from "./ObservationFormMQT061Ini";
import ObservationFormMQT191 from "./ObservationFormMQT191";
import ObservationFormGenericSheet from "./ObservationFormGenericSheet";
import ObservationFormSheetTable10Page21 from "./ObservationFormSheetTable10Page21";
import ObservationFormHotSpotPage22 from "./ObservationFormHotSpotPage22";
import {
  ObservationFormPage23,
  ObservationFormPage24,
  ObservationFormPage25,
  ObservationFormPage26,
  ObservationFormPage27,
  ObservationFormPage28,
  ObservationFormPage29,
} from "./ObservationFormsPages23to30";
import {
  ObservationFormPage31,
  ObservationFormPage32,
  ObservationFormPage33,
  ObservationFormPage35,
  ObservationFormPage36,
  ObservationFormPage37,
  ObservationFormPage38,
  ObservationFormPage40,
} from "./ObservationFormsPages31to40";
import {
  ObservationFormPage41,
  ObservationFormPage42,
  ObservationFormPage43,
  ObservationFormPage44,
  ObservationFormPage47,
  ObservationFormPage48,
  ObservationFormPage49,
  ObservationFormPage50A47,
  ObservationFormPage52,
  ObservationFormPage53,
  ObservationFormPage54,
} from "./ObservationFormsPages41to54";
import ObservationFormPerformanceSimple from "./ObservationFormPerformanceSimple";
import ObservationFormWetLeakage from "./ObservationFormWetLeakage";
import ObservationFormInsulation from "./ObservationFormInsulation";
import ObservationFormTempCoeff from "./ObservationFormTempCoeff";
import ObservationFormVisualInspection from "./ObservationFormVisualInspection";
import ObservationFormService15885 from "./ObservationFormService15885";
import ObservationFormService16102 from "./ObservationFormService16102";
import ObservationFormService16103 from "./ObservationFormService16103";
import ObservationFormService10322 from "./ObservationFormService10322";

export default function ObservationPageForm({ entry, value, onChange }) {
  if (!entry) return null;

  switch (entry.template) {
    case "stc": {
      const showBnpiIrradiance =
        entry.stcVariant === "bnpi" ||
        entry.pdfPage === 3 ||
        entry.pdfPage === 11;
      const showBacksideIrradiance =
        entry.stcVariant === "backside" || entry.pdfPage === 10;
      return (
        <ObservationFormMQT061Ini
          value={value}
          onChange={onChange}
          showBnpiIrradiance={showBnpiIrradiance}
          showBacksideIrradiance={showBacksideIrradiance}
          showStcPage10Extras={entry.stcPage10Extras === true}
          stcDualElectrical={entry.stcDualElectrical === true}
        />
      );
    }
    case "stab":
      return <ObservationFormMQT191 value={value} onChange={onChange} />;
    case "simple":
      return (
        <ObservationFormPerformanceSimple
          value={value}
          onChange={onChange}
          showMq07Equipment={entry.simpleVariant === "mq07_front"}
        />
      );
    case "visual":
      return <ObservationFormVisualInspection value={value} onChange={onChange} />;
    case "wet":
      return (
        <ObservationFormWetLeakage
          value={value}
          onChange={onChange}
          variant={entry.wetVariant}
        />
      );
    case "insulation":
      return (
        <ObservationFormInsulation
          value={value}
          onChange={onChange}
          variant={entry.insulationVariant}
        />
      );
    case "tempco":
      return <ObservationFormTempCoeff value={value} onChange={onChange} />;
    case "sheet":
      if (entry.sheetPreset === "svc_15885_creepage_clearance") {
        return (
          <ObservationFormService15885
            value={value}
            onChange={onChange}
            variant="creepage"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_15885_electric_strength") {
        return (
          <ObservationFormService15885
            value={value}
            onChange={onChange}
            variant="electric"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_15885_moisture_insulation") {
        return (
          <ObservationFormService15885
            value={value}
            onChange={onChange}
            variant="moisture"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_15885_heat_fire_tracking") {
        return (
          <ObservationFormService15885
            value={value}
            onChange={onChange}
            variant="heat"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16102_cap_temperature_rise") {
        return (
          <ObservationFormService16102
            value={value}
            onChange={onChange}
            variant="capTempRise"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16102_creepage_clearance") {
        return (
          <ObservationFormService16102
            value={value}
            onChange={onChange}
            variant="creepageClearance"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16102_insulation_electric_strength") {
        return (
          <ObservationFormService16102
            value={value}
            onChange={onChange}
            variant="insulationElectric"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16102_heat_fire_tracking") {
        return (
          <ObservationFormService16102
            value={value}
            onChange={onChange}
            variant="heatFireTracking"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16103_electric_strength") {
        return (
          <ObservationFormService16103
            value={value}
            onChange={onChange}
            variant="electricStrength"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16103_moisture_insulation") {
        return (
          <ObservationFormService16103
            value={value}
            onChange={onChange}
            variant="moistureInsulation"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_16103_heat_fire_tracking") {
        return (
          <ObservationFormService16103
            value={value}
            onChange={onChange}
            variant="heatFireTracking"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_10322_creepage_clearance") {
        return (
          <ObservationFormService10322
            value={value}
            onChange={onChange}
            variant="creepageClearance"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_10322_endurance_thermal") {
        return (
          <ObservationFormService10322
            value={value}
            onChange={onChange}
            variant="enduranceThermal"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_10322_humidity_insulation") {
        return (
          <ObservationFormService10322
            value={value}
            onChange={onChange}
            variant="humidityInsulation"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_10322_earthing") {
        return (
          <ObservationFormService10322
            value={value}
            onChange={onChange}
            variant="earthing"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_10322_heat_fire_tracking") {
        return (
          <ObservationFormService10322
            value={value}
            onChange={onChange}
            variant="heatFireTracking"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "svc_10322_temperature_measurement") {
        return (
          <ObservationFormService10322
            value={value}
            onChange={onChange}
            variant="temperatureMeasurement"
            showHeader={entry.showHeader !== false}
            showFooter={false}
          />
        );
      }
      if (entry.sheetPreset === "table10_page21") {
        return <ObservationFormSheetTable10Page21 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "hot_spot_22") {
        return <ObservationFormHotSpotPage22 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_23_hs_visual_stc") {
        return <ObservationFormPage23 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_24_bnpi_insulation") {
        return <ObservationFormPage24 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_25_wet_bypass_hs") {
        return <ObservationFormPage25 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_26_uv_front_back") {
        return <ObservationFormPage26 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_27_uv_followup") {
        return <ObservationFormPage27 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_28_mech_combo") {
        return <ObservationFormPage28 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_29_tc50_visual") {
        return <ObservationFormPage29 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_31_hf10_combo") {
        return <ObservationFormPage31 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_32_jbox_combo") {
        return <ObservationFormPage32 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_33_tc200_visual") {
        return <ObservationFormPage33 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_35_damp_heat_combo") {
        return <ObservationFormPage35 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_36_static_mech_combo") {
        return <ObservationFormPage36 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_37_hail_combo") {
        return <ObservationFormPage37 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_38_pid_combo") {
        return <ObservationFormPage38 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_40_final_stab_233") {
        return <ObservationFormPage40 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_41_final_stab_234") {
        return <ObservationFormPage41 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_42_stc_front_236") {
        return <ObservationFormPage42 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_43_stc_back_237") {
        return <ObservationFormPage43 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_44_bnpi_final_238") {
        return <ObservationFormPage44 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_47_a41_front") {
        return <ObservationFormPage47 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_48_a44_back") {
        return <ObservationFormPage48 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_49_a43_bnpi") {
        return <ObservationFormPage49 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_50_a47_ini") {
        return (
          <ObservationFormPage50A47
            value={value}
            onChange={onChange}
            pdfPage={entry.pdfPage}
          />
        );
      }
      if (entry.sheetPreset === "page_52_a47_stc_front") {
        return <ObservationFormPage52 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_53_a48_back") {
        return <ObservationFormPage53 value={value} onChange={onChange} />;
      }
      if (entry.sheetPreset === "page_54_a49_bnpi") {
        return <ObservationFormPage54 value={value} onChange={onChange} />;
      }
      return (
        <ObservationFormGenericSheet
          value={value}
          onChange={onChange}
          sheetPreset={entry.sheetPreset}
          showHeader={entry.showHeader !== false}
          showFooter={false}
        />
      );
    default:
      return (
        <ObservationFormGenericSheet
          value={value}
          onChange={onChange}
          sheetPreset="generic_8_6"
        />
      );
  }
}
