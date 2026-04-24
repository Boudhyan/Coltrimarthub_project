"""Build a professional PDF from stored observation data (lab report)."""
from __future__ import annotations

import re
import subprocess
import tempfile
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import Any, List, Literal, Optional, Tuple
from xml.sax.saxutils import escape

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

COMPANY_NAME = "Planet Electro labs"
REPORT_TEMPLATE_FILENAMES = (
    "Test_Report_format.pdf",
    "Test Report_format -  - .pdf",
)
TEMPLATE_SHIFT_DOWN_PT = 0
TEMPLATE_P1_SPLIT_DATE_PARTA_Y = 520
TEMPLATE_P1_SPLIT_PARTA_PARTB_Y = 420
TEMPLATE_P1_GAP_DATE_PARTA_PT = 16
TEMPLATE_P1_GAP_PARTA_PARTB_PT = 16
TEMPLATE_P1_FIELD_NUDGE_UP_PT = 14
TEMPLATE_P2_CONTENT_SHIFT_DOWN_PT = 84
TEMPLATE_P2_HEADER_BAND_PT = 112
TEMPLATE_P2_FOOTER_BAND_PT = 84
TEMPLATE_P2_SIGNOFF_DEST_Y0 = 96

RowSpec = Tuple[Literal["pair", "section"], str, str]

# --- Shared layout (data → text) ----------------------------------------------

_SPLIT_CAMEL_RE = re.compile(r"([a-z])([A-Z])")


def _split_camel(s: str) -> str:
    return _SPLIT_CAMEL_RE.sub(r"\1 \2", s)


def _human_field_label(key: str) -> str:
    k = str(key).strip()
    if not k:
        return "Field"
    k = k.replace("_", " ").replace("-", " ")
    k = _split_camel(k)
    return " ".join(w.capitalize() if w.islower() else w for w in k.split())


def _section_title_for_key(key: str) -> str:
    k = str(key)
    if k.startswith("page_"):
        return f"Observation — Page {k[5:]}"
    if k.startswith("svc_"):
        parts = k.split("_")
        if len(parts) >= 3:
            return f"Service {parts[1]} — Sheet {parts[2]}"
    return _human_field_label(k)


def _top_level_sort_key(key: str) -> tuple:
    k = str(key)
    if k.startswith("page_"):
        try:
            return (0, int(k[5:]), k)
        except ValueError:
            return (0, 9999, k)
    if k.startswith("svc_"):
        return (1, k)
    return (2, k)


def _scalar_to_lines(val: Any, max_len: int = 2000) -> List[str]:
    if val is None:
        return ["—"]
    if isinstance(val, bool):
        return ["Yes" if val else "No"]
    if isinstance(val, float):
        s = str(val)
        return [s if s not in ("nan", "inf", "-inf") else "—"]
    if isinstance(val, int) and not isinstance(val, bool):
        return [str(val)]
    s = str(val).strip()
    if not s:
        return ["—"]
    if len(s) > max_len:
        s = s[: max_len - 1] + "…"
    return [s]


def _format_cell_value(val: Any) -> str:
    lines = _scalar_to_lines(val, max_len=8000)
    return "<br/>".join(escape(ln) for ln in lines)


def _extract_table_rows(obj: Any, prefix: str = "") -> List[RowSpec]:
    """Flatten nested observation JSON into table row specs (label/value pairs and section rows)."""
    out: List[RowSpec] = []
    if obj is None:
        out.append(("pair", prefix or "Field", "—"))
        return out
    if isinstance(obj, dict):
        if not obj:
            out.append(("pair", prefix or "Section", "(empty)"))
            return out
        keys = sorted(obj.keys(), key=lambda x: _top_level_sort_key(str(x)))
        for sk in keys:
            sub = obj[sk]
            label = _human_field_label(sk)
            full = f"{prefix}{label}" if prefix else label
            if isinstance(sub, dict):
                out.extend(_extract_table_rows(sub, f"{full} — " if full else ""))
            elif isinstance(sub, list):
                if not sub:
                    out.append(("pair", full, "(no entries)"))
                else:
                    for j, item in enumerate(sub):
                        title = f"{full} — Entry {j + 1}"
                        out.append(("section", title, ""))
                        if isinstance(item, dict):
                            out.extend(_extract_table_rows(item, ""))
                        elif isinstance(item, list):
                            out.extend(_extract_table_rows({"items": item}, ""))
                        else:
                            out.append(("pair", "Value", _format_cell_value(item)))
            else:
                out.append(("pair", full, _format_cell_value(sub)))
        return out
    if isinstance(obj, list):
        if not obj:
            out.append(("pair", prefix or "List", "(no entries)"))
            return out
        for j, item in enumerate(obj):
            base = prefix.rstrip(" —").strip() if prefix else ""
            title = f"{base} — Entry {j + 1}" if base else f"Entry {j + 1}"
            out.append(("section", title, ""))
            if isinstance(item, dict):
                out.extend(_extract_table_rows(item, ""))
            elif isinstance(item, list):
                out.extend(_extract_table_rows(item, ""))
            else:
                out.append(("pair", "Value", _format_cell_value(item)))
        return out
    out.append(("pair", prefix or "Value", _format_cell_value(obj)))
    return out


# --- PDF (Platypus) -------------------------------------------------------------

_PRIMARY = colors.HexColor("#5f3b00")
_ACCENT = colors.HexColor("#b87900")
_SECTION_BG = colors.HexColor("#fff7cc")
_GRID = colors.HexColor("#e8c66a")
_LABEL_COL = colors.HexColor("#d99a00")
_ENTRY_BAND = colors.HexColor("#ffefad")
_ENTRY_TITLE = colors.HexColor("#7a4e00")

_FOOTER_MARGIN = 16 * mm
# Must not be snapshotted into per-page state (shallow copy would shrink the list).
_SKIP_PAGE_SNAPSHOT_KEYS = frozenset({"_saved_page_states", "_footer_draw"})


def _snapshot_canvas_page_state(c: pdf_canvas.Canvas) -> dict[str, Any]:
    return {
        k: v
        for k, v in c.__dict__.items()
        if k not in _SKIP_PAGE_SNAPSHOT_KEYS
    }


class LastPageFooterCanvas(pdf_canvas.Canvas):
    """
    ReportLab defers real showPage until save(), so we can draw the sign-off block
    only on the final page (same idea as the lab observation sheet: approvals at end).
    """

    def __init__(self, *args, footer_draw=None, **kwargs):
        self._footer_draw = footer_draw
        self._saved_page_states: list[dict[str, Any]] = []
        pdf_canvas.Canvas.__init__(self, *args, **kwargs)

    def showPage(self):
        self._saved_page_states.append(_snapshot_canvas_page_state(self))
        self._startPage()

    def save(self):
        # Platypus does not call showPage after the final frame; mirror Canvas.save
        # so the last page is captured like the others.
        if len(self._code):
            self._saved_page_states.append(_snapshot_canvas_page_state(self))
        n = len(self._saved_page_states)
        keep_footer = self._footer_draw
        keep_snapshots = self._saved_page_states
        for i, state in enumerate(self._saved_page_states):
            self.__dict__.update(state)
            self._footer_draw = keep_footer
            self._saved_page_states = keep_snapshots
            if self._footer_draw and (i + 1 == n):
                self._footer_draw(self)
            pdf_canvas.Canvas.showPage(self)
        pdf_canvas.Canvas.save(self)


def _fmt_observation_timestamp(dt: Optional[datetime]) -> str:
    if not dt:
        return "—"
    if dt.tzinfo is not None:
        return dt.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    return dt.strftime("%Y-%m-%d %H:%M")


def _form_val(form_data: Optional[dict], *keys: str, default: str = "") -> str:
    fd = form_data if isinstance(form_data, dict) else {}
    for key in keys:
        value = fd.get(key)
        if value is None:
            continue
        text = str(value).strip()
        if text:
            return text
    return default


def _draw_observation_sheet_signoff(canvas: pdf_canvas.Canvas) -> None:
    """
    Bottom sign-off aligned with the project observation sheet (Tested By / Checked By,
    with Sign., Name., Date. lines under each column).
    """
    canvas.saveState()
    page_w, _page_h = canvas._pagesize
    left = _FOOTER_MARGIN
    right = page_w - _FOOTER_MARGIN
    col_mid = page_w * 0.5
    col_gap = 5 * mm
    l1 = col_mid - col_gap
    r0 = col_mid + col_gap
    ink = colors.HexColor("#0f172a")
    line = colors.HexColor("#64748b")
    canvas.setStrokeColor(line)
    canvas.setFillColor(ink)
    canvas.setLineWidth(0.35)

    y_title = 26 * mm
    y_sig = 20 * mm
    y_name = 14 * mm
    y_date = 8 * mm
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.drawString(left, y_title, "Tested By:")
    canvas.drawString(r0, y_title, "Checked By:")

    canvas.setFont("Helvetica", 7.5)
    label_w = 16 * mm
    for y in (y_sig, y_name, y_date):
        canvas.line(left + label_w, y - 0.8 * mm, l1, y - 0.8 * mm)
        canvas.line(r0 + label_w, y - 0.8 * mm, right, y - 0.8 * mm)

    canvas.drawString(left, y_sig, "Sign.:")
    canvas.drawString(left, y_name, "Name:")
    canvas.drawString(left, y_date, "Date:")
    canvas.drawString(r0, y_sig, "Sign.:")
    canvas.drawString(r0, y_name, "Name:")
    canvas.drawString(r0, y_date, "Date:")

    canvas.setStrokeColor(_GRID)
    canvas.setLineWidth(0.5)
    canvas.line(left, y_title + 4 * mm, right, y_title + 4 * mm)
    canvas.restoreState()


def _draw_template_signoff_table(canvas: pdf_canvas.Canvas, y0: float) -> None:
    """
    Draw the template-style 3-column sign-off table (Tested by / Reviewed /
    Issued By) directly on page 2 to avoid duplicated raster overlays.
    """
    canvas.saveState()
    x0 = 54.0
    x1 = 558.0
    w = x1 - x0
    col_w = w / 3.0
    y = y0
    h_header = 18.0
    h_body = 78.0
    h_name = 16.0
    h_desg = 16.0
    h_date = 16.0
    total_h = h_header + h_body + h_name + h_desg + h_date

    line_col = colors.HexColor("#4b5563")
    text_col = colors.HexColor("#111111")
    canvas.setStrokeColor(line_col)
    canvas.setFillColor(text_col)
    canvas.setLineWidth(0.55)
    canvas.rect(x0, y, w, total_h, stroke=1, fill=0)
    canvas.line(x0 + col_w, y, x0 + col_w, y + total_h)
    canvas.line(x0 + 2 * col_w, y, x0 + 2 * col_w, y + total_h)

    y1 = y + h_date
    y2 = y1 + h_desg
    y3 = y2 + h_name
    y4 = y3 + h_body
    for yy in (y1, y2, y3, y4):
        canvas.line(x0, yy, x1, yy)

    canvas.setFont("Times-Bold", 10)
    canvas.drawCentredString(x0 + col_w * 0.5, y4 + 6.0, "Tested by")
    canvas.drawCentredString(x0 + col_w * 1.5, y4 + 6.0, "Reviewed and Authorized by")
    canvas.drawCentredString(x0 + col_w * 2.5, y4 + 6.0, "Issued By")

    canvas.setFont("Times-Bold", 9.5)
    canvas.drawCentredString(x0 + col_w * 0.5, y2 + 4.5, "NAME")
    canvas.drawCentredString(x0 + col_w * 0.5, y1 + 4.5, "DESIGATION")
    canvas.drawCentredString(x0 + col_w * 0.5, y + 4.5, "DATE")
    canvas.restoreState()


def _draw_attachment_page_chrome(canvas: pdf_canvas.Canvas, doc) -> None:
    """
    Use the exact header/footer look from template page-1 on each generated
    attachment page by drawing the template page as background, then opening
    a white content body area in the middle.
    """
    template_path = _get_report_template_path()
    if not template_path.exists():
        return
    with tempfile.TemporaryDirectory(prefix="obs_attach_bg_") as td:
        tmp_dir = Path(td)
        bg_png = tmp_dir / "template_p1_bg.png"
        subprocess.run(
            [
                "pdftoppm",
                "-f",
                "1",
                "-l",
                "1",
                "-singlefile",
                "-r",
                "220",
                "-png",
                str(template_path),
                str(bg_png.with_suffix("")),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        page_w, page_h = doc.pagesize
        bg = ImageReader(str(bg_png))
        # Draw only very thin top/footer bands from template and blank out center body.
        # Keep these bands narrow so "TEST REPORT" and date table are never visible
        # behind observation tables.
        top_band_h = 72
        bottom_band_h = 68

        canvas.saveState()
        p_top = canvas.beginPath()
        p_top.rect(0, page_h - top_band_h, page_w, top_band_h)
        canvas.clipPath(p_top, stroke=0, fill=0)
        canvas.drawImage(
            bg,
            0,
            0,
            width=page_w,
            height=page_h,
            preserveAspectRatio=False,
            mask="auto",
        )
        canvas.restoreState()

        canvas.saveState()
        p_bottom = canvas.beginPath()
        p_bottom.rect(0, 0, page_w, bottom_band_h)
        canvas.clipPath(p_bottom, stroke=0, fill=0)
        canvas.drawImage(
            bg,
            0,
            0,
            width=page_w,
            height=page_h,
            preserveAspectRatio=False,
            mask="auto",
        )
        canvas.restoreState()

        canvas.saveState()
        canvas.setFillColor(colors.white)
        canvas.rect(
            0,
            bottom_band_h,
            page_w,
            page_h - top_band_h - bottom_band_h,
            fill=1,
            stroke=0,
        )
        canvas.restoreState()


def _get_report_template_path() -> Path:
    # backend/app/utils/observation_pdf.py -> repo root = parents[3]
    root = Path(__file__).resolve().parents[3]
    for name in REPORT_TEMPLATE_FILENAMES:
        p = root / name
        if p.exists():
            return p
    # Fall back to the preferred filename path when nothing exists yet.
    return root / REPORT_TEMPLATE_FILENAMES[0]


def _merge_with_template_pdf(attachment_pdf: bytes) -> bytes:
    template_path = _get_report_template_path()
    if not template_path.exists():
        return attachment_pdf
    with tempfile.TemporaryDirectory(prefix="obs_pdf_merge_") as td:
        tmp_dir = Path(td)
        in_template = tmp_dir / "template.pdf"
        in_attachment = tmp_dir / "attachment.pdf"
        out_merged = tmp_dir / "merged.pdf"
        in_template.write_bytes(template_path.read_bytes())
        in_attachment.write_bytes(attachment_pdf)
        subprocess.run(
            [
                "pdfunite",
                str(in_template),
                str(in_attachment),
                str(out_merged),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        return out_merged.read_bytes()


def _build_filled_template_page1_overlay_pdf(
    service_request_id: int,
    service_type_key: str,
    observation_data_updated_at: Optional[datetime],
    service_request_form_data: Optional[dict],
) -> bytes:
    out = BytesIO()
    c = pdf_canvas.Canvas(out, pagesize=letter)

    text_color = colors.HexColor("#111827")
    c.setFillColor(text_color)

    customer = _form_val(
        service_request_form_data, "customerName", "customer_name", default=""
    )
    customer_addr = _form_val(
        service_request_form_data, "customerAddress", "address", default=""
    )
    name_addr = f"{customer}, {customer_addr}".strip(", ")
    sample = _form_val(
        service_request_form_data, "productDetails", "product", default=""
    )
    qty = _form_val(service_request_form_data, "quantity", default="")
    condition = _form_val(service_request_form_data, "condition", default="")
    brand = _form_val(service_request_form_data, "brand", "modelNo", default="")
    sample_dt = _form_val(service_request_form_data, "sampleDate", default="")
    end_dt = _form_val(service_request_form_data, "deliveryDate", default="")
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    c.setFont("Times-Roman", 8.4)
    # Keep a single alignment knob for quick calibration against template cells.
    p1_nudge_y = TEMPLATE_P1_FIELD_NUDGE_UP_PT
    p1_nudge_x = 0
    c.drawString(160 + p1_nudge_x, 650 + p1_nudge_y, f"PEL-SR-{service_request_id:05d}")  # TEST REPORT NO
    if name_addr:
        line1 = name_addr[:52]
        line2 = name_addr[52:104]
        c.drawString(388 + p1_nudge_x, 630 + p1_nudge_y, line1)
        if line2:
            c.drawString(388 + p1_nudge_x, 614 + p1_nudge_y, line2)
    c.drawString(88 + p1_nudge_x, 630 + p1_nudge_y, f"PEL/{service_request_id:04d}")  # UIN
    c.drawString(222 + p1_nudge_x, 608 + p1_nudge_y, generated)  # DATE OF ISSUE
    c.drawString(160 + p1_nudge_x, 583 + p1_nudge_y, sample_dt)  # Date of Sample Receipt
    c.drawString(270 + p1_nudge_x, 583 + p1_nudge_y, sample_dt)  # Start of Test Date
    c.drawString(376 + p1_nudge_x, 583 + p1_nudge_y, end_dt)  # End of Test Date

    c.setFont("Times-Roman", 8.0)
    c.drawString(344 + p1_nudge_x, 532 + p1_nudge_y, sample[:52])  # NATURE OF SAMPLE
    c.drawString(344 + p1_nudge_x, 438 + p1_nudge_y, brand[:52])  # Brand Name/Model No.
    c.drawString(344 + p1_nudge_x, 416 + p1_nudge_y, qty[:24])  # Quantity of Samples
    c.drawString(344 + p1_nudge_x, 402 + p1_nudge_y, condition[:52])  # Condition when received
    c.drawString(344 + p1_nudge_x, 388 + p1_nudge_y, (service_type_key or "")[:52])  # Standard Reference
    c.drawString(344 + p1_nudge_x, 374 + p1_nudge_y, "")  # Environmental Conditions (blank when unavailable)

    c.showPage()
    c.save()
    return out.getvalue()


def _build_shifted_template_page2_pdf() -> bytes:
    template_path = _get_report_template_path()
    with tempfile.TemporaryDirectory(prefix="obs_tpl_p2_shift_") as td:
        tmp_dir = Path(td)
        bg_png = tmp_dir / "template_p2.png"
        out_pdf = tmp_dir / "template_p2_shifted.pdf"
        subprocess.run(
            [
                "pdftoppm",
                "-f",
                "2",
                "-l",
                "2",
                "-singlefile",
                "-r",
                "300",
                "-png",
                str(template_path),
                str(bg_png.with_suffix("")),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        bg = ImageReader(str(bg_png))
        c = pdf_canvas.Canvas(str(out_pdf), pagesize=letter)
        pw, ph = letter

        # Keep template header/footer fixed and move only middle content downward
        # so it uses the blank space above footer without disturbing chrome.
        header_y0 = ph - TEMPLATE_P2_HEADER_BAND_PT
        footer_y1 = TEMPLATE_P2_FOOTER_BAND_PT

        def _draw_shifted_band(src_y0: float, src_y1: float, shift_down: float) -> None:
            if src_y1 <= src_y0:
                return
            dst_y0 = src_y0 - shift_down
            dst_y1 = src_y1 - shift_down
            if dst_y1 <= 0:
                return
            clip_y0 = max(0.0, dst_y0)
            clip_y1 = min(ph, dst_y1)
            if clip_y1 <= clip_y0:
                return
            c.saveState()
            p = c.beginPath()
            p.rect(0, clip_y0, pw, clip_y1 - clip_y0)
            c.clipPath(p, stroke=0, fill=0)
            c.drawImage(
                bg,
                0,
                -shift_down,
                width=pw,
                height=ph,
                preserveAspectRatio=False,
                mask="auto",
            )
            c.restoreState()

        _draw_shifted_band(header_y0, ph, 0)  # keep header fixed
        _draw_shifted_band(
            footer_y1,
            header_y0,
            TEMPLATE_P2_CONTENT_SHIFT_DOWN_PT,
        )  # move middle down
        _draw_shifted_band(0, footer_y1, 0)  # keep footer fixed

        _draw_template_signoff_table(c, TEMPLATE_P2_SIGNOFF_DEST_Y0)
        c.showPage()
        c.save()
        return out_pdf.read_bytes()


def _merge_template_with_filled_fields_and_attachment(
    service_request_id: int,
    service_type_key: str,
    observation_data_updated_at: Optional[datetime],
    service_request_form_data: Optional[dict],
    attachment_pdf: bytes,
) -> bytes:
    template_path = _get_report_template_path()
    if not template_path.exists():
        return attachment_pdf
    try:
        template_reader = PdfReader(BytesIO(template_path.read_bytes()))
        attachment_reader = PdfReader(BytesIO(attachment_pdf))
        overlay_reader = PdfReader(
            BytesIO(
                _build_filled_template_page1_overlay_pdf(
                    service_request_id=service_request_id,
                    service_type_key=service_type_key,
                    observation_data_updated_at=observation_data_updated_at,
                    service_request_form_data=service_request_form_data,
                )
            )
        )

        writer = PdfWriter()
        if len(template_reader.pages) > 0:
            first_page = template_reader.pages[0]
            if len(overlay_reader.pages) > 0:
                first_page.merge_page(overlay_reader.pages[0])
            writer.add_page(first_page)
            for idx in range(1, len(template_reader.pages)):
                writer.add_page(template_reader.pages[idx])
        for p in attachment_reader.pages:
            writer.add_page(p)

        out = BytesIO()
        writer.write(out)
        return out.getvalue()
    except Exception:
        # Never block report delivery because of local PDF utility/tooling issues.
        # Fallback: prepend the original template as-is, then attachment pages.
        return _merge_with_template_pdf(attachment_pdf)


def _observation_specs_table(
    specs: List[RowSpec],
    page_w: float,
    styles,
    sid: int,
) -> Table:
    label_w = page_w * 0.34
    value_w = page_w * 0.66
    pair_label_style = ParagraphStyle(
        name=f"tblLbl_{sid}",
        parent=styles["Normal"],
        fontName="Times-Bold",
        fontSize=9,
        leading=11.5,
        textColor=colors.white,
    )
    value_style = ParagraphStyle(
        name=f"tblVal_{sid}",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=9,
        leading=11.5,
        textColor=colors.HexColor("#1e293b"),
    )
    section_row_style = ParagraphStyle(
        name=f"tblSec_{sid}",
        parent=styles["Normal"],
        fontName="Times-Bold",
        fontSize=9.5,
        leading=12,
        textColor=_ENTRY_TITLE,
        leftIndent=2,
    )
    table_data: list = []
    ts_rows: list = []
    r = 0
    for kind, a, b in specs:
        if kind == "section":
            table_data.append(
                [Paragraph(escape(a), section_row_style), ""],
            )
            ts_rows.extend(
                [
                    ("SPAN", (0, r), (-1, r)),
                    ("BACKGROUND", (0, r), (-1, r), _ENTRY_BAND),
                    ("ALIGN", (0, r), (-1, r), "LEFT"),
                ]
            )
            r += 1
        else:
            val = b if (b and str(b).strip()) else escape("—")
            table_data.append(
                [
                    Paragraph(escape(a), pair_label_style),
                    Paragraph(val, value_style),
                ],
            )
            ts_rows.extend(
                [
                    ("BACKGROUND", (0, r), (0, r), _LABEL_COL),
                    ("BACKGROUND", (1, r), (1, r), colors.white),
                ]
            )
            r += 1
    tbl = Table(table_data, colWidths=[label_w, value_w])
    base_ts = [
        ("GRID", (0, 0), (-1, -1), 0.5, _GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]
    tbl.setStyle(TableStyle(base_ts + ts_rows))
    return tbl


def build_observations_pdf_bytes(
    service_request_id: int,
    service_type_key: str,
    observations: dict,
    *,
    observation_data_updated_at: Optional[datetime] = None,
    service_request_form_data: Optional[dict] = None,
    include_template_pages: bool = True,
) -> bytes:
    buf = BytesIO()
    _sid = id(buf)

    def _canvas_maker(*args, **kwargs):
        return LastPageFooterCanvas(
            *args,
            footer_draw=None,
            **kwargs,
        )

    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=44 * mm,
        bottomMargin=24 * mm,
    )
    page_w = doc.width
    styles = getSampleStyleSheet()

    company_style = ParagraphStyle(
        name=f"obsCompany_{_sid}",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=21,
        textColor=_PRIMARY,
        spaceAfter=2,
        spaceBefore=0,
    )
    company_sub = ParagraphStyle(
        name=f"obsCompanySub_{_sid}",
        parent=styles["Normal"],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748b"),
        spaceBefore=0,
        spaceAfter=0,
    )

    title_white = ParagraphStyle(
        name=f"obsTitleWhite_{_sid}",
        parent=styles["Heading1"],
        fontSize=16,
        leading=20,
        textColor=colors.white,
        spaceAfter=0,
        spaceBefore=0,
    )
    subtitle_white = ParagraphStyle(
        name=f"obsSubWhite_{_sid}",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#e2e8f0"),
        spaceBefore=4,
    )
    section_hdr = ParagraphStyle(
        name=f"obsSectionHdr_{_sid}",
        parent=styles["Heading2"],
        fontSize=10.5,
        leading=14,
        textColor=_PRIMARY,
        spaceBefore=0,
        spaceAfter=0,
    )
    small = ParagraphStyle(
        name=f"obsSmall_{_sid}",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=_PRIMARY,
    )
    tiny = ParagraphStyle(
        name=f"obsTiny_{_sid}",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#334155"),
    )

    story: list = []
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    last_edit = _fmt_observation_timestamp(observation_data_updated_at)

    # Header/meta is rendered on every page by canvas callback.
    # Keep first heading/table well below template header chrome.
    story.append(Spacer(1, 30))

    obs = observations or {}
    if not obs:
        story.append(
            Paragraph(
                '<font color="#64748b"><i>No observation data on file.</i></font>',
                styles["Normal"],
            )
        )
    else:
        keys = sorted(obs.keys(), key=_top_level_sort_key)
        for idx, page_key in enumerate(keys):
            if idx:
                story.append(Spacer(1, 26))
            title = escape(_section_title_for_key(page_key))
            sec = Table(
                [[Paragraph(f"<b>{title}</b>", section_hdr)]],
                colWidths=[page_w],
            )
            sec.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), _SECTION_BG),
                        ("LINELEFT", (0, 0), (-1, -1), 4, _ACCENT),
                        ("LEFTPADDING", (0, 0), (-1, -1), 12),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                        ("TOPPADDING", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ]
                )
            )
            story.append(sec)
            story.append(Spacer(1, 22))

            specs = _extract_table_rows(obs[page_key], "")
            if not specs:
                story.append(
                    Paragraph(
                        '<font color="#64748b"><i>(empty)</i></font>',
                        styles["Normal"],
                    )
                )
            else:
                story.append(_observation_specs_table(specs, page_w, styles, _sid))
            story.append(Spacer(1, 28))

    def _on_page(c, d):
        _draw_attachment_page_chrome(c, d)

    doc.build(
        story,
        onFirstPage=_on_page,
        onLaterPages=_on_page,
        canvasmaker=_canvas_maker,
    )
    attachment_pdf = buf.getvalue()
    if not include_template_pages:
        return attachment_pdf
    # Prepend test-report format pages, then attach generated observation pages.
    return _merge_template_with_filled_fields_and_attachment(
        service_request_id=service_request_id,
        service_type_key=service_type_key,
        observation_data_updated_at=observation_data_updated_at,
        service_request_form_data=service_request_form_data,
        attachment_pdf=attachment_pdf,
    )
