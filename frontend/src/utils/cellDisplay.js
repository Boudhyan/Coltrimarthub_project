/** Table cell: show an em dash when value is null, undefined, or blank. */
export function cell(value) {
  if (value === null || value === undefined) return "—";
  const s = String(value).trim();
  if (s === "") return "—";
  return s;
}
