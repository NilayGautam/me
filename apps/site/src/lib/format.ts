const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** `2026-11-26` to `26 Nov 2026`. Parsed by hand so the output never depends on time zones. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${monthNames[(month ?? 1) - 1]} ${year}`;
}

/** `2026-01` to `Jan 2026`. */
export function formatMonth(iso: string) {
  const [year, month] = iso.split("-").map(Number);
  return `${monthNames[(month ?? 1) - 1]} ${year}`;
}

/**
 * Length of a stint, counted the way LinkedIn does: both the first and last month count,
 * so Oct 2025 to Nov 2026 is "1 yr 2 mos". An open-ended stint runs to the month of `today`.
 * Returns null when the stint has not started and has no end to measure to.
 */
export function formatDuration(start: string, end: string | undefined, today: Date = new Date()) {
  const toIndex = (iso: string) => {
    const [year, month] = iso.split("-").map(Number);
    return (year ?? 0) * 12 + (month ?? 1) - 1;
  };
  const last = end ? toIndex(end) : today.getUTCFullYear() * 12 + today.getUTCMonth();
  const months = last - toIndex(start) + 1;
  if (months < 1) return null;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [
    years ? `${years} ${years === 1 ? "yr" : "yrs"}` : "",
    rest ? `${rest} ${rest === 1 ? "mo" : "mos"}` : "",
  ];
  return parts.filter(Boolean).join(" ");
}

export function formatPeriod(entry: {
  start: string;
  end?: string | undefined;
  period?: string | undefined;
}) {
  if (entry.period) return entry.period;
  if (!entry.end) return `${formatMonth(entry.start)} - Present`;
  if (entry.start === entry.end) return formatMonth(entry.end);
  // A range inside one year names the year once: `Jan - Aug 2027`.
  if (entry.start.slice(0, 4) === entry.end.slice(0, 4)) {
    return `${formatMonth(entry.start).split(" ")[0]} - ${formatMonth(entry.end)}`;
  }
  return `${formatMonth(entry.start)} - ${formatMonth(entry.end)}`;
}
