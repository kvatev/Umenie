import { ScheduleItem } from "@/lib/schedule-data";
import { Locale } from "./types";

const DAY_NAMES_EN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TITLE_TRANSLATIONS: Record<string, string> = {
  "Учебна занималня": "Study Hall",
  "Математика": "Mathematics",
  "Четене с разбиране": "Reading Comprehension",
  "Арт занимания": "Art Activities",
  "Арт занимания & Шах": "Art Activities & Chess",
  "Английски 3-7 клас": "English Grade 3-7",
  "Английски език": "English Language",
  "Английски език (малки групи)": "English Language (small groups)",
  "БЕЛ и Математика": "Bulgarian & Mathematics",
  "БЕЛ и Математика (курсове)": "Bulgarian & Math (Courses)",
  "Шах": "Chess",
  "Шах за начинаещи": "Chess for Beginners",
  "Шах за напреднали": "Chess for Advanced",
  "Плетиво": "Knitting",
  "Читателски клуб „Лигериа“": "Ligeria Book Club",
  "Читателски клуб Лигериа": "Ligeria Book Club",
  "Читателски клуб": "Book Club",
  "STEM & Роботика": "STEM & Robotics",
  "Роботика": "Robotics",
};

export function translateAgeGroup(ageGroup: string, locale: Locale): string {
  if (locale !== "en" || !ageGroup) return ageGroup;

  const trimmed = ageGroup.trim();

  if (trimmed.toLowerCase() === "възрастни") return "Adults";

  // e.g. "1 - 4 клас" -> "Grades 1-4"
  const classRange = trimmed.match(/^(\d+)\s*[-–]\s*(\d+)\s*клас$/i);
  if (classRange) {
    return `Grades ${classRange[1]}-${classRange[2]}`;
  }

  // e.g. "4 клас" -> "Grade 4"
  const classSingle = trimmed.match(/^(\d+)\s*клас$/i);
  if (classSingle) {
    return `Grade ${classSingle[1]}`;
  }

  // e.g. "6 - 11 години" -> "Ages 6-11"
  const ageRange = trimmed.match(/^(\d+)\s*[-–]\s*(\d+)\s*години$/i);
  if (ageRange) {
    return `Ages ${ageRange[1]}-${ageRange[2]}`;
  }

  // e.g. "13+ години" -> "Ages 13+"
  const agePlus = trimmed.match(/^(\d+)\+\s*години$/i);
  if (agePlus) {
    return `Ages ${agePlus[1]}+`;
  }

  // e.g. "5 години" -> "Age 5"
  const ageSingle = trimmed.match(/^(\d+)\s*години$/i);
  if (ageSingle) {
    return `Age ${ageSingle[1]}`;
  }

  return trimmed;
}

export function translateScheduleTitle(title: string, locale: Locale): string {
  if (locale !== "en" || !title) return title;
  const trimmed = title.trim();
  if (TITLE_TRANSLATIONS[trimmed]) {
    return TITLE_TRANSLATIONS[trimmed];
  }

  // Substring checks for composite titles
  for (const [bg, en] of Object.entries(TITLE_TRANSLATIONS)) {
    if (trimmed.toLowerCase().includes(bg.toLowerCase())) {
      return trimmed.replace(new RegExp(bg, "gi"), en);
    }
  }

  return trimmed;
}

export function translateScheduleEvent(event: ScheduleItem, locale: Locale): ScheduleItem {
  if (locale !== "en") {
    return event;
  }

  const translatedDayName =
    event.dayOfWeek >= 1 && event.dayOfWeek <= 7
      ? DAY_NAMES_EN[event.dayOfWeek - 1]
      : event.dayName;

  const translatedLocation = event.location
    ? event.location.replace(/Славейков/gi, "Slaveykov").replace(/блок/gi, "bl.").replace(/партер/gi, "ground floor")
    : event.location;

  return {
    ...event,
    title: event.titleEn?.trim() || (event as any).title_en?.trim() || translateScheduleTitle(event.title, locale),
    ageGroup: translateAgeGroup(event.ageGroup, locale),
    dayName: translatedDayName,
    location: translatedLocation,
  };
}
