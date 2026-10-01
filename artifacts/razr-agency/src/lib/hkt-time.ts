// London / GMT time helpers — independent of viewer's local timezone.

const UK_TZ = "Europe/London";

// Returns the current wall-clock parts in London.
function nowInHKT(): { year: number; month: number; day: number; hour: number; minute: number; weekday: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: UK_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: weekdayMap[get("weekday")] ?? 0,
  };
}

// Returns the UTC timestamp (ms) for a given London wall-clock time.
function hktWallToUtcMs(year: number, month: number, day: number, hour: number, minute: number): number {
  const asIfUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  return asIfUtc;
}

// Milliseconds until the next Sunday 23:59 GMT.
export function msUntilSundayMidnightHKT(): number {
  const hkt = nowInHKT();
  // Sunday = 0 in our map. We want the upcoming Sunday at 23:59.
  let daysAhead = (7 - hkt.weekday) % 7;
  if (daysAhead === 0 && (hkt.hour > 23 || (hkt.hour === 23 && hkt.minute >= 59))) {
    daysAhead = 7;
  }
  const targetMs = hktWallToUtcMs(hkt.year, hkt.month, hkt.day + daysAhead, 23, 59);
  const nowMs = hktWallToUtcMs(hkt.year, hkt.month, hkt.day, hkt.hour, hkt.minute);
  return Math.max(0, targetMs - nowMs);
}

// Returns "DDd HHh MMm" countdown string.
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00d 00h 00m";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}

export type HktSlot = {
  iso: string; // UTC ISO of slot
  timeLabel: string; // e.g. "11:00 AM GMT"
  dayLabel: string; // e.g. "Mon 26 May"
};

// Generates upcoming booking slots in GMT. Skips Sundays, requires ≥1hr lead time.
export function generateHktSlots(slotHours: number[] = [11, 14, 17], maxSlots = 6): HktSlot[] {
  const hkt = nowInHKT();
  const slots: HktSlot[] = [];
  const nowUtcMs = Date.now();
  const leadMs = 60 * 60 * 1000;

  // Walk forward day by day
  for (let offset = 0; offset < 10 && slots.length < maxSlots; offset++) {
    const dayWeekday = (hkt.weekday + offset) % 7;
    if (dayWeekday === 0) continue; // skip Sunday

    for (const h of slotHours) {
      if (slots.length >= maxSlots) break;
      const slotUtcMs = hktWallToUtcMs(hkt.year, hkt.month, hkt.day + offset, h, 0);
      if (slotUtcMs < nowUtcMs + leadMs) continue;

      const slotDate = new Date(slotUtcMs);
      const dayLabel = new Intl.DateTimeFormat("en-GB", {
        timeZone: UK_TZ,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(slotDate);
      const timeLabel =
        new Intl.DateTimeFormat("en-GB", {
          timeZone: UK_TZ,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(slotDate) + " GMT";

      slots.push({ iso: slotDate.toISOString(), timeLabel, dayLabel });
    }
  }
  return slots;
}
