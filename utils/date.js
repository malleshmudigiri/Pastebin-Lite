export function safeISO(timestamp) {
  if (
    timestamp !== null &&
    typeof timestamp === "number" &&
    Number.isFinite(timestamp)
  ) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}
