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

export function formatPeriod(entry: {
  start: string;
  end?: string | undefined;
  period?: string | undefined;
}) {
  if (entry.period) return entry.period;
  return `${formatMonth(entry.start)} - ${entry.end ? formatMonth(entry.end) : "Present"}`;
}
