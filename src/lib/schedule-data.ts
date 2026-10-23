export type RecurrenceType =
  | "none"         // Single occurrence (on selected date) or legacy standard weekly
  | "weekly_eoy"   // Every week on this day until end of year
  | "weekly_count" // For N weeks (e.g., for 2 weeks, 4 weeks)
  | "biweekly"     // Every other week (every 14 days)
  | "custom_until"; // Every week until custom end date

export interface RecurrenceRule {
  type: RecurrenceType;
  count?: number;        // e.g. 2, 4, 8
  untilDate?: string;    // "YYYY-MM-DD"
  biweeklySpan?: "eoy" | "count" | "until";
}

export interface ScheduleItem {
  id: string;
  title: string;
  titleEn?: string;
  title_en?: string;
  category: "english" | "math" | "knitting" | "art" | "reading" | "chess" | "stem" | "study_hall";
  dayOfWeek: number; // 1 = Понеделник, 7 = Неделя
  dayName: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  ageGroup: string;
  location: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  date?: string | null;           // "YYYY-MM-DD"
  recurrence?: RecurrenceRule | null;
  seriesId?: string | null;       // Shared UUID for recurring series
  capacity?: number;
  isActive?: boolean;
  excludedDates?: string[]; // Array of "YYYY-MM-DD" dates excluded from this recurrence series
}

export const DAYS_OF_WEEK = [
  { dayNumber: 1, name: "Понеделник", shortName: "Пон" },
  { dayNumber: 2, name: "Вторник", shortName: "Вто" },
  { dayNumber: 3, name: "Сряда", shortName: "Сря" },
  { dayNumber: 4, name: "Четвъртък", shortName: "Чет" },
  { dayNumber: 5, name: "Петък", shortName: "Пет" },
  { dayNumber: 6, name: "Събота", shortName: "Съб" },
  { dayNumber: 7, name: "Неделя", shortName: "Нед" },
];

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  // Понеделник (1)
  {
    id: "mon-1",
    title: "Математика",
    category: "math",
    dayOfWeek: 1,
    dayName: "Понеделник",
    startTime: "16:00",
    endTime: "17:00",
    ageGroup: "4 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-300",
  },
  {
    id: "mon-2",
    title: "Четене с разбиране",
    category: "reading",
    dayOfWeek: 1,
    dayName: "Понеделник",
    startTime: "17:00",
    endTime: "18:00",
    ageGroup: "2 - 4 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-300",
  },
  {
    id: "mon-3",
    title: "Арт занимания",
    category: "art",
    dayOfWeek: 1,
    dayName: "Понеделник",
    startTime: "18:00",
    endTime: "19:30",
    ageGroup: "6 - 11 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    badgeBorder: "border-yellow-300",
  },

  // Вторник (2)
  {
    id: "tue-1",
    title: "Английски 3-7 клас",
    category: "english",
    dayOfWeek: 2,
    dayName: "Вторник",
    startTime: "14:00",
    endTime: "18:00",
    ageGroup: "3-7 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },
  {
    id: "tue-2",
    title: "Шахмат",
    category: "chess",
    dayOfWeek: 2,
    dayName: "Вторник",
    startTime: "17:00",
    endTime: "18:00",
    ageGroup: "6 - 12 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-300",
  },
  {
    id: "tue-3",
    title: "Плетиво",
    category: "knitting",
    dayOfWeek: 2,
    dayName: "Вторник",
    startTime: "17:30",
    endTime: "19:30",
    ageGroup: "7 - 14 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
    badgeBorder: "border-pink-300",
  },

  // Сряда (3)
  {
    id: "wed-1",
    title: "Английски 2 - 8 клас",
    category: "english",
    dayOfWeek: 3,
    dayName: "Сряда",
    startTime: "14:00",
    endTime: "18:00",
    ageGroup: "2 - 8 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },

  // Четвъртък (4)
  {
    id: "thu-1",
    title: "Английски 2 - 8 клас",
    category: "english",
    dayOfWeek: 4,
    dayName: "Четвъртък",
    startTime: "14:00",
    endTime: "18:00",
    ageGroup: "2 - 8 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },

  // Петък (5)
  {
    id: "fri-1",
    title: "Английски 2 - 8 клас",
    category: "english",
    dayOfWeek: 5,
    dayName: "Петък",
    startTime: "14:00",
    endTime: "18:00",
    ageGroup: "2 - 8 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },

  // Събота (6)
  {
    id: "sat-1",
    title: "Плетиво",
    category: "knitting",
    dayOfWeek: 6,
    dayName: "Събота",
    startTime: "10:30",
    endTime: "12:30",
    ageGroup: "7 - 14 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
    badgeBorder: "border-pink-300",
  },
  {
    id: "sat-2",
    title: "Шах",
    category: "chess",
    dayOfWeek: 6,
    dayName: "Събота",
    startTime: "10:30",
    endTime: "12:30",
    ageGroup: "6 - 12 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-300",
  },
];

export const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  english: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  math: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  knitting: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
  art: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  reading: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  chess: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  stem: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300" },
  study_hall: { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-300" },
};

export function deduceCategory(title: string): ScheduleItem["category"] {
  const norm = (title || "").toLowerCase();
  if (norm.includes("шах")) return "chess";
  if (norm.includes("плет")) return "knitting";
  if (norm.includes("мат")) return "math";
  if (norm.includes("англ")) return "english";
  if (norm.includes("занимал")) return "study_hall";
  if (norm.includes("stem") || norm.includes("стем")) return "stem";
  if (norm.includes("чит") || norm.includes("лигериа") || norm.includes("книг")) return "reading";
  return "art";
}

export function mapRowToScheduleItem(row: {
  id: string;
  title: string;
  title_en?: string | null;
  titleEn?: string | null;
  category?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group?: string;
  location?: string;
  date?: string | null;
  event_date?: string | null;
  recurrence?: RecurrenceRule | null;
  recurrence_type?: string | null;
  recurrence_count?: number | null;
  recurrence_until?: string | null;
  series_id?: string | null;
  seriesId?: string | null;
  capacity?: number;
  is_active?: boolean;
  excluded_dates?: string[] | null;
  excludedDates?: string[] | null;
}): ScheduleItem {
  const dayName = DAYS_OF_WEEK.find((d) => d.dayNumber === row.day_of_week)?.name || "Понеделник";
  const cat = (row.category || deduceCategory(row.title)) as ScheduleItem["category"];
  const styles = CATEGORY_STYLES[cat] || { bg: "bg-brand-purple/10", text: "text-brand-purple", border: "border-brand-purple/20" };

  const startTime = row.start_time?.slice(0, 5) || "16:00";
  const endTime = row.end_time?.slice(0, 5) || "17:30";

  let recRule: RecurrenceRule | null = row.recurrence || null;
  if (!recRule && row.recurrence_type && row.recurrence_type !== "none") {
    recRule = {
      type: row.recurrence_type as RecurrenceType,
      count: row.recurrence_count || undefined,
      untilDate: row.recurrence_until || undefined,
    };
  }

  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en || row.titleEn || undefined,
    title_en: row.title_en || row.titleEn || undefined,
    category: cat,
    dayOfWeek: row.day_of_week,
    dayName,
    startTime,
    endTime,
    ageGroup: row.age_group || "Всички възрасти",
    location: row.location || "Славейков, блок 48, партер",
    badgeBg: styles.bg,
    badgeText: styles.text,
    badgeBorder: styles.border,
    date: row.date || row.event_date || null,
    recurrence: recRule,
    seriesId: row.seriesId || row.series_id || null,
    capacity: row.capacity || 10,
    isActive: row.is_active !== false,
    excludedDates: Array.isArray(row.excluded_dates) ? row.excluded_dates : (Array.isArray(row.excludedDates) ? row.excludedDates : []),
  };
}

// ====================================================================
// TIMEZONE-SAFE CALENDAR & DATE HELPERS (Local Bulgarian Time)
// Avoids toISOString() UTC date-shift issues.
// ====================================================================

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getDayOfWeekNumber(date: Date): number {
  const dow = date.getDay();
  return dow === 0 ? 7 : dow; // Monday = 1 ... Sunday = 7
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const BG_MONTH_NAMES = [
  "януари", "февруари", "март", "април", "май", "юни",
  "юли", "август", "септември", "октомври", "ноември", "декември"
];

export function formatDateHumanBg(val: Date | string): string {
  const d = typeof val === "string" ? parseDateKey(val) : val;
  const dayName = DAYS_OF_WEEK.find((item) => item.dayNumber === getDayOfWeekNumber(d))?.name || "";
  return `${dayName}, ${d.getDate()} ${BG_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()} г.`;
}

/**
 * Safely calculates calendar day difference (targetDate - startDate)
 * using UTC to completely avoid DST / timezone shifts.
 */
export function getDaysDifference(startDateStr: string, targetDateStr: string): number {
  const [sy, sm, sd] = startDateStr.split("-").map(Number);
  const [ty, tm, td] = targetDateStr.split("-").map(Number);
  const startUTC = Date.UTC(sy, sm - 1, sd);
  const targetUTC = Date.UTC(ty, tm - 1, td);
  return Math.round((targetUTC - startUTC) / (1000 * 60 * 60 * 24));
}

/**
 * Adds an exact number of calendar days to a YYYY-MM-DD date key in UTC.
 */
export function addDaysToDateKey(dateKey: string, daysToAdd: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dateUTC = new Date(Date.UTC(y, m - 1, d + daysToAdd));
  const resY = dateUTC.getUTCFullYear();
  const resM = String(dateUTC.getUTCMonth() + 1).padStart(2, "0");
  const resD = String(dateUTC.getUTCDate()).padStart(2, "0");
  return `${resY}-${resM}-${resD}`;
}

/**
 * Checks whether an event occurs on a specific calendar target date.
 * Strict Filtering Rule:
 * 1. Never render before startDate (diffDays < 0).
 * 2. Respect untilDate.
 * 3. Exact recurrence intervals:
 *    - "none": diffDays === 0
 *    - "weekly", "weekly_eoy", "custom_until": diffDays % 7 === 0
 *    - "biweekly": diffDays >= 0 && diffDays % 14 === 0 (Strictly hidden on Day 7, Day 21, Day 35!)
 *    - "weekly_count": diffDays >= 0 && diffDays % 7 === 0 && (diffDays / 7) < count
 */
export function isEventOnDate(
  item: {
    dayOfWeek?: number;
    day_of_week?: number;
    date?: string | null;
    startDate?: string | null;
    event_date?: string | null;
    recurrence?: RecurrenceRule | null;
    recurrence_type?: string | null;
    recurrenceCount?: number | null;
    recurrence_count?: number | null;
    untilDate?: string | null;
    recurrence_until?: string | null;
    isActive?: boolean;
    is_active?: boolean;
    excludedDates?: string[];
    excluded_dates?: string[];
  },
  targetDate: Date | string
): boolean {
  if (item.isActive === false || item.is_active === false) return false;

  const targetDateStr = typeof targetDate === "string" ? targetDate : formatDateKey(targetDate);
  const excluded = item.excludedDates || item.excluded_dates;
  if (Array.isArray(excluded) && excluded.includes(targetDateStr)) {
    return false;
  }

  const startDateStr = item.startDate || item.date || item.event_date;

  // 1. If the event has a startDate (or event_date):
  if (startDateStr) {
    const diffDays = getDaysDifference(startDateStr, targetDateStr);

    // RULE A — NEVER RENDER BEFORE START DATE:
    if (diffDays < 0) return false;

    // RULE B — RESPECT END DATE (untilDate):
    const untilDate = item.recurrence?.untilDate || item.untilDate || item.recurrence_until;
    if (untilDate && getDaysDifference(untilDate, targetDateStr) > 0) {
      return false;
    }

    // RULE C — EXACT RECURRENCE INTERVALS:
    const recType = item.recurrence?.type || item.recurrence_type || "none";

    // Single occurrence (no recurrence)
    if (recType === "none" || !recType) {
      return diffDays === 0;
    }

    // Weekly
    if (recType === "weekly" || recType === "weekly_eoy" || recType === "custom_until") {
      return diffDays % 7 === 0;
    }

    // Biweekly (През седмица / на всеки 2 седмици / 14 дни):
    // Return diffDays >= 0 && diffDays % 14 === 0!
    if (recType === "biweekly") {
      if (diffDays % 14 !== 0) return false;
      const biweekIndex = diffDays / 14;
      const count = item.recurrence?.count || item.recurrenceCount || item.recurrence_count;
      if (item.recurrence?.biweeklySpan === "count" && count) {
        return biweekIndex >= 0 && biweekIndex < count;
      }
      return true;
    }

    // Weekly count: repeat for N weeks (e.g. only for 2 weeks)
    if (recType === "weekly_count") {
      const maxCount = item.recurrence?.count || item.recurrenceCount || item.recurrence_count || 2;
      return diffDays % 7 === 0 && (diffDays / 7) < maxCount;
    }

    return diffDays === 0;
  }

  // 2. Legacy baseline templates with NO start date: match by day of week
  const dow = item.dayOfWeek ?? item.day_of_week ?? 1;
  const [ty, tm, td] = targetDateStr.split("-").map(Number);
  const targetDateObj = new Date(Date.UTC(ty, tm - 1, td));
  const targetDow = targetDateObj.getUTCDay() === 0 ? 7 : targetDateObj.getUTCDay();

  return dow === targetDow;
}

/**
 * Returns all events scheduled for a specific date, sorted chronologically.
 */

/**
 * Calculates all occurrence dates for an event based on its start date and recurrence rule.
 * Returns array of "YYYY-MM-DD" strings in chronological order.
 * @param item Event data containing date, recurrence, dayOfWeek, and optional excludedDates
 * @param includeExcluded If true, returns all rule-generated dates; if false (default), excludes dates in item.excludedDates
 * @param maxDates Limit max occurrences (default 52)
 */
export function getEventOccurrenceDates(
  item: {
    date?: string | null;
    startDate?: string | null;
    event_date?: string | null;
    recurrence?: RecurrenceRule | null;
    dayOfWeek?: number;
    day_of_week?: number;
    excludedDates?: string[];
    excluded_dates?: string[];
  },
  includeExcluded = false,
  maxDates = 52
): string[] {
  const dates: string[] = [];
  const excluded = new Set(item.excludedDates || item.excluded_dates || []);

  const startDateStr = item.startDate || item.date || (item as any).event_date;
  if (!startDateStr) {
    const dow = item.dayOfWeek ?? item.day_of_week ?? 1;
    const now = new Date();
    const currentDow = getDayOfWeekNumber(now);
    const startOffset = (dow - currentDow + 7) % 7;
    const firstDate = new Date(now);
    firstDate.setDate(firstDate.getDate() + startOffset);

    const limit = Math.min(maxDates, 12);
    for (let i = 0; i < limit; i++) {
      const d = new Date(firstDate);
      d.setDate(d.getDate() + i * 7);
      const k = formatDateKey(d);
      if (includeExcluded || !excluded.has(k)) {
        dates.push(k);
      }
    }
    return dates;
  }

  const anchorDate = parseDateKey(startDateStr);
  const rule = item.recurrence;

  if (!rule || rule.type === "none") {
    const k = formatDateKey(anchorDate);
    if (includeExcluded || !excluded.has(k)) {
      dates.push(k);
    }
    return dates;
  }

  const anchorYear = anchorDate.getFullYear();

  switch (rule.type) {
    case "weekly_count": {
      const count = rule.count && rule.count > 0 ? rule.count : 2;
      for (let i = 0; i < count; i++) {
        const d = new Date(anchorDate);
        d.setDate(d.getDate() + i * 7);
        const k = formatDateKey(d);
        if (includeExcluded || !excluded.has(k)) {
          dates.push(k);
        }
      }
      break;
    }

    case "weekly_eoy": {
      let current = new Date(anchorDate);
      let count = 0;
      while (current.getFullYear() === anchorYear && count < maxDates) {
        const k = formatDateKey(current);
        if (includeExcluded || !excluded.has(k)) {
          dates.push(k);
        }
        current = new Date(current);
        current.setDate(current.getDate() + 7);
        count++;
      }
      break;
    }

    case "biweekly": {
      if (rule.biweeklySpan === "count" && rule.count) {
        const count = rule.count;
        for (let i = 0; i < count; i++) {
          const d = new Date(anchorDate);
          d.setDate(d.getDate() + i * 14);
          const k = formatDateKey(d);
          if (includeExcluded || !excluded.has(k)) {
            dates.push(k);
          }
        }
      } else if (rule.untilDate) {
        let current = new Date(anchorDate);
        let count = 0;
        while (formatDateKey(current) <= rule.untilDate && count < maxDates) {
          const k = formatDateKey(current);
          if (includeExcluded || !excluded.has(k)) {
            dates.push(k);
          }
          current = new Date(current);
          current.setDate(current.getDate() + 14);
          count++;
        }
      } else {
        let current = new Date(anchorDate);
        let count = 0;
        while (current.getFullYear() === anchorYear && count < maxDates) {
          const k = formatDateKey(current);
          if (includeExcluded || !excluded.has(k)) {
            dates.push(k);
          }
          current = new Date(current);
          current.setDate(current.getDate() + 14);
          count++;
        }
      }
      break;
    }

    case "custom_until": {
      const untilKey = rule.untilDate;
      let current = new Date(anchorDate);
      let count = 0;
      while (count < maxDates) {
        const k = formatDateKey(current);
        if (untilKey && k > untilKey) break;
        if (includeExcluded || !excluded.has(k)) {
          dates.push(k);
        }
        current = new Date(current);
        current.setDate(current.getDate() + 7);
        count++;
      }
      break;
    }

    default: {
      const k = formatDateKey(anchorDate);
      if (includeExcluded || !excluded.has(k)) {
        dates.push(k);
      }
      break;
    }
  }

  return dates;
}

export function getEventsForDate(events: ScheduleItem[], targetDate: Date): ScheduleItem[] {
  return events
    .filter((e) => isEventOnDate(e, targetDate))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getRecurrenceBadgeText(
  rule: RecurrenceRule | null | undefined,
  startDateStr?: string | null
): string {
  if (!rule || rule.type === "none") return "Еднократно";
  if (rule.type === "weekly_eoy") return "Всяка седмица (до края на годината)";
  if (rule.type === "weekly_count") return `Седмично (${rule.count || 2} седмици)`;
  if (rule.type === "biweekly") return "През седмица (на 14 дни)";
  if (rule.type === "custom_until") return `Всяка седмица (до ${rule.untilDate || "крайна дата"})`;
  return "Повтарящо се";
}

export function getRecurrenceHumanSummary(
  ruleOrTitle: RecurrenceRule | null | undefined | string,
  startDateOrStartTime?: string | null,
  endTime?: string,
  startDateStr?: string,
  rule?: RecurrenceRule | null | undefined,
  dayOfWeek?: number
): string {
  if (typeof ruleOrTitle !== "string") {
    return getRecurrenceBadgeText(ruleOrTitle, startDateOrStartTime);
  }

  const title = ruleOrTitle;
  const startTime = startDateOrStartTime || "16:00";
  const eTime = endTime || "17:30";
  const sDateStr = startDateStr || formatDateKey(new Date());
  const rRule = rule;
  const dow = dayOfWeek || 1;

  const startDate = parseDateKey(sDateStr);
  const dayName = DAYS_OF_WEEK.find((d) => d.dayNumber === dow)?.name || `Ден ${dow}`;
  const timeFormatted = `${startTime} – ${eTime} ч.`;

  if (!rRule || rRule.type === "none") {
    return `Еднократно занятие: ${dayName}, ${startDate.getDate()} ${BG_MONTH_NAMES[startDate.getMonth()]} ${startDate.getFullYear()} г., от ${timeFormatted}`;
  }

  if (rRule.type === "weekly_eoy") {
    const endOfYear = `31 декември ${startDate.getFullYear()} г.`;
    return `Всяка седмица: всеки ${dayName} от ${timeFormatted}, започвайки от ${formatDateHumanBg(startDate)} до ${endOfYear}`;
  }

  if (rRule.type === "weekly_count") {
    const count = rRule.count && rRule.count > 0 ? rRule.count : 2;
    const finalDate = new Date(startDate);
    finalDate.setDate(finalDate.getDate() + (count - 1) * 7);
    return `Серия от ${count} ${count === 1 ? "занятие" : "занятия"}: всеки ${dayName} от ${timeFormatted}, от ${formatDateHumanBg(startDate)} до ${formatDateHumanBg(finalDate)}`;
  }

  if (rRule.type === "biweekly") {
    if (rRule.biweeklySpan === "count" && rRule.count) {
      const count = rRule.count;
      const finalDate = new Date(startDate);
      finalDate.setDate(finalDate.getDate() + (count - 1) * 14);
      return `През седмица (на всеки 14 дни) за ${count} пъти: ${dayName} от ${timeFormatted}, от ${formatDateHumanBg(startDate)} до ${formatDateHumanBg(finalDate)}`;
    }
    if (rRule.untilDate) {
      const untilD = parseDateKey(rRule.untilDate);
      return `През седмица (на всеки 14 дни): ${dayName} от ${timeFormatted}, от ${formatDateHumanBg(startDate)} до ${formatDateHumanBg(untilD)}`;
    }
    return `През седмица (на всеки 14 дни) до края на годината: всеки ${dayName} от ${timeFormatted}, започвайки от ${formatDateHumanBg(startDate)}`;
  }

  if (rRule.type === "custom_until" && rRule.untilDate) {
    const untilD = parseDateKey(rRule.untilDate);
    return `Всяка седмица: всеки ${dayName} от ${timeFormatted}, от ${formatDateHumanBg(startDate)} до ${formatDateHumanBg(untilD)}`;
  }

  return `Повтарящо се занятие: всеки ${dayName} от ${timeFormatted}`;
}

export function itemToRecord(item: ScheduleItem): {
  id: string;
  title: string;
  title_en?: string;
  titleEn?: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
  capacity?: number;
  is_active: boolean;
  date?: string | null;
  recurrence?: RecurrenceRule | null;
  seriesId?: string | null;
  series_id?: string | null;
  excludedDates?: string[];
  excluded_dates?: string[];
} {
  return {
    id: item.id,
    title: item.title,
    title_en: item.titleEn || item.title_en || undefined,
    titleEn: item.titleEn || item.title_en || undefined,
    category: item.category,
    day_of_week: item.dayOfWeek,
    start_time: item.startTime,
    end_time: item.endTime,
    age_group: item.ageGroup,
    location: item.location,
    capacity: item.capacity,
    is_active: item.isActive !== false,
    date: item.date,
    recurrence: item.recurrence,
    seriesId: item.seriesId,
    series_id: item.seriesId,
    excludedDates: item.excludedDates || [],
    excluded_dates: item.excludedDates || [],
  };
}
