export function joinWithAnd(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

export function buildFlightText(flights: string[]) {
  if (!flights.length) return undefined;
  return `Flying with you on ${joinWithAnd(flights)}`;
}

export function buildLayoverText(layovers: string[]) {
  if (!layovers.length) return undefined;

  const label =
    layovers.length === 1
      ? "Has a layover with you at"
      : "Has layovers with you at";

  return `${label} ${joinWithAnd(layovers)}`;
}
