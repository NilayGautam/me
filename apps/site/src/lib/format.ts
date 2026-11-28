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
 * Time spent so far, counted the way LinkedIn does: both the first and last month count,
 * so Oct 2025 to Nov 2026 is "1 yr 2 mos". A stint runs to its end or to the month of `today`,
 * whichever comes first, so the count grows with each rebuild and stops when the stint ends.
 * Returns null when the stint has not started yet.
 */
export function formatDuration(start: string, end: string | undefined, today: Date = new Date()) {
  const toIndex = (iso: string) => {
    const [year, month] = iso.split("-").map(Number);
    return (year ?? 0) * 12 + (month ?? 1) - 1;
  };
  const thisMonth = today.getUTCFullYear() * 12 + today.getUTCMonth();
  const last = end ? Math.min(toIndex(end), thisMonth) : thisMonth;
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

/**
 * Dates of a role. A role under way reads "Jan 2027 - Present" even when its end is planned, and
 * shows the end month once it is over or before it starts.
 */
export function formatPeriod(entry: {
  start: string;
  end?: string | undefined;
  period?: string | undefined;
  status?: "upcoming" | "current" | "past";
}) {
  if (entry.period) return entry.period;
  if (!entry.end || entry.status === "current") return `${formatMonth(entry.start)} - Present`;
  if (entry.start === entry.end) return formatMonth(entry.end);
  return `${formatMonth(entry.start)} - ${formatMonth(entry.end)}`;
}
