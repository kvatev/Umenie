export interface ScheduleItem {
  id: string;
  title: string;
  category: "english" | "math" | "knitting" | "art" | "reading" | "chess" | "stem" | "study_hall";
  dayOfWeek: number; // 1 = Понеделник, 7 = Неделя
  dayName: string;
  startTime: string;
  endTime: string;
  ageGroup: string;
  location: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
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
    title: "Английски 3 клас",
    category: "english",
    dayOfWeek: 2,
    dayName: "Вторник",
    startTime: "16:00",
    endTime: "17:00",
    ageGroup: "3 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },
  {
    id: "tue-2",
    title: "Шах",
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
    startTime: "18:00",
    endTime: "19:30",
    ageGroup: "6 - 10 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
    badgeBorder: "border-pink-300",
  },
  {
    id: "tue-4",
    title: "STEM клуб",
    category: "stem",
    dayOfWeek: 2,
    dayName: "Вторник",
    startTime: "19:00",
    endTime: "20:00",
    ageGroup: "8 - 12 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-800",
    badgeBorder: "border-indigo-300",
  },

  // Сряда (3)
  {
    id: "wed-1",
    title: "Английски 1 клас",
    category: "english",
    dayOfWeek: 3,
    dayName: "Сряда",
    startTime: "16:00",
    endTime: "17:00",
    ageGroup: "1 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },
  {
    id: "wed-2",
    title: "Математика",
    category: "math",
    dayOfWeek: 3,
    dayName: "Сряда",
    startTime: "17:00",
    endTime: "18:00",
    ageGroup: "3 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-300",
  },
  {
    id: "wed-3",
    title: "Плетиво",
    category: "knitting",
    dayOfWeek: 3,
    dayName: "Сряда",
    startTime: "18:00",
    endTime: "19:30",
    ageGroup: "7 - 14 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
    badgeBorder: "border-pink-300",
  },
  {
    id: "wed-4",
    title: "Шах",
    category: "chess",
    dayOfWeek: 3,
    dayName: "Сряда",
    startTime: "19:00",
    endTime: "20:00",
    ageGroup: "Всички нива",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-300",
  },

  // Четвъртък (4)
  {
    id: "thu-1",
    title: "Четене с разбиране",
    category: "reading",
    dayOfWeek: 4,
    dayName: "Четвъртък",
    startTime: "16:00",
    endTime: "17:00",
    ageGroup: "1 - 3 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-300",
  },
  {
    id: "thu-2",
    title: "Арт занимания",
    category: "art",
    dayOfWeek: 4,
    dayName: "Четвъртък",
    startTime: "17:00",
    endTime: "18:30",
    ageGroup: "6 - 10 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    badgeBorder: "border-yellow-300",
  },
  {
    id: "thu-3",
    title: "Английски 1 клас",
    category: "english",
    dayOfWeek: 4,
    dayName: "Четвъртък",
    startTime: "18:00",
    endTime: "19:00",
    ageGroup: "1 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },
  {
    id: "thu-4",
    title: "Шах",
    category: "chess",
    dayOfWeek: 4,
    dayName: "Четвъртък",
    startTime: "18:30",
    endTime: "19:30",
    ageGroup: "7 - 14 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-300",
  },

  // Петък (5)
  {
    id: "fri-1",
    title: "STEM клуб",
    category: "stem",
    dayOfWeek: 5,
    dayName: "Петък",
    startTime: "16:00",
    endTime: "17:30",
    ageGroup: "8 - 12 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-800",
    badgeBorder: "border-indigo-300",
  },
  {
    id: "fri-2",
    title: "Математика",
    category: "math",
    dayOfWeek: 5,
    dayName: "Петък",
    startTime: "17:30",
    endTime: "18:30",
    ageGroup: "2 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-300",
  },
  {
    id: "fri-3",
    title: "Творческа работилница",
    category: "art",
    dayOfWeek: 5,
    dayName: "Петък",
    startTime: "18:30",
    endTime: "20:00",
    ageGroup: "7 - 12 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    badgeBorder: "border-yellow-300",
  },

  // Събота (6)
  {
    id: "sat-1",
    title: "Арт занимания",
    category: "art",
    dayOfWeek: 6,
    dayName: "Събота",
    startTime: "10:00",
    endTime: "11:30",
    ageGroup: "5 - 9 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    badgeBorder: "border-yellow-300",
  },
  {
    id: "sat-2",
    title: "Плетиво",
    category: "knitting",
    dayOfWeek: 6,
    dayName: "Събота",
    startTime: "11:30",
    endTime: "13:00",
    ageGroup: "7 - 14 години",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
    badgeBorder: "border-pink-300",
  },
  {
    id: "sat-3",
    title: "Шах",
    category: "chess",
    dayOfWeek: 6,
    dayName: "Събота",
    startTime: "13:00",
    endTime: "14:30",
    ageGroup: "Всички нива",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-300",
  },
  {
    id: "sat-4",
    title: "Английски 2 клас",
    category: "english",
    dayOfWeek: 6,
    dayName: "Събота",
    startTime: "14:30",
    endTime: "15:30",
    ageGroup: "2 клас",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-300",
  },

  // Неделя (7)
  {
    id: "sun-1",
    title: "Читателски клуб „Лигериа“",
    category: "reading",
    dayOfWeek: 7,
    dayName: "Неделя",
    startTime: "17:00",
    endTime: "19:30",
    ageGroup: "Възрастни",
    location: "Славейков, блок 48, партер",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-300",
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

export function mapRowToScheduleItem(row: {
  id: string;
  title: string;
  category: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  age_group: string;
  location?: string;
}): ScheduleItem {
  const dayName = DAYS_OF_WEEK.find((d) => d.dayNumber === row.day_of_week)?.name || "Понеделник";
  const cat = (row.category || "art") as ScheduleItem["category"];
  const styles = CATEGORY_STYLES[cat] || { bg: "bg-brand-purple/10", text: "text-brand-purple", border: "border-brand-purple/20" };

  // Format time if it has seconds (e.g., '16:00:00' -> '16:00')
  const startTime = row.start_time?.slice(0, 5) || "16:00";
  const endTime = row.end_time?.slice(0, 5) || "17:30";

  return {
    id: row.id,
    title: row.title,
    category: cat,
    dayOfWeek: row.day_of_week,
    dayName,
    startTime,
    endTime,
    ageGroup: row.age_group,
    location: row.location || "Славейков, блок 48, партер",
    badgeBg: styles.bg,
    badgeText: styles.text,
    badgeBorder: styles.border,
  };
}

