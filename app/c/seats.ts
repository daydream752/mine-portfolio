export function parseSeatParam(seat: string, seatCount: number): number | null {
  const n = Number.parseInt(seat, 10);
  if (!Number.isFinite(n) || n < 1 || n > seatCount) return null;
  return n;
}
