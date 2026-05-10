/** Month index 0 = January */
export function daysMatrix(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const pad = first.getDay();
  const len = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= len; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function weekdayLabels() {
  return WEEKDAYS;
}
