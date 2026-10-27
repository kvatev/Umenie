import { ServiceData } from "@/lib/services-data";
import { ServiceOverride } from "@/lib/types/site-settings";

export interface Dictionary {
  nav: {
    home: string;
    services: string;
    about: string;
    schedule: string;
    blog: string;
    callUs: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    whyChooseTitle: string;
    servicesTitle: string;
    servicesSubtitle: string;
    galleryTitle: string;
    reviewsTitle: string;
    blogTitle: string;
  };
  services: {
    title: string;
    subtitle: string;
    exploreBtn: string;
    scheduleBtn: string;
  };
  about: {
    title: string;
    whyChooseUs: string;
    missionTitle: string;
    reviewsTitle: string;
  };
  schedule: {
    title: string;
    subtitle: string;
    bookBtn: string;
    allCategories: string;
    allDays: string;
  };
  contacts: {
    title: string;
    phoneLabel: string;
    locationLabel: string;
    haveQuestions: string;
    where: string;
    workHours: string;
  };
}

export const DEFAULT_DICTIONARY_BG: Dictionary = {
  nav: {
    home: "Начало",
    services: "Услуги",
    about: "За нас",
    schedule: "График",
    blog: "Блог",
    callUs: "Обади се",
  },
  home: {
    heroTitle: "УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА",
    heroSubtitle: "Образователен клуб „УМеНИе“ – Бургас, к-с Славейков",
    heroCta: "ВИЖТЕ УСЛУГИТЕ",
    whyChooseTitle: "ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?",
    servicesTitle: "УСЛУГИ И ЗАНИМАНИЯ",
    servicesSubtitle: "Изберете занимание, за да научите повече",
    galleryTitle: "ДЕЦА С УМЕНИЯ",
    reviewsTitle: "КАКВО КАЗВАТ РОДИТЕЛИТЕ ЗА НАС",
    blogTitle: "ПОЛЕЗНИ СТАТИИ И СЪВЕТИ",
  },
  services: {
    title: "УСЛУГИ",
    subtitle: "Изберете занимание, за да научите повече.",
    exploreBtn: "Научи повече",
    scheduleBtn: "Вижте графика за седмицата",
  },
  about: {
    title: "ЗА НАС",
    whyChooseUs: "ЗАЩО ДА ИЗБЕРЕТЕ УМЕНИЕ?",
    missionTitle: "НАШАТА МИСИЯ",
    reviewsTitle: "ОТЗИВИ ОТ РОДИТЕЛИ",
  },
  schedule: {
    title: "ГРАФИК",
    subtitle: "Седмична програма на занятията и онлайн записване",
    bookBtn: "Запиши се",
    allCategories: "Всички дейности",
    allDays: "Всички дни",
  },
  contacts: {
    title: "КОНТАКТИ",
    phoneLabel: "Телефон за връзка",
    locationLabel: "Адрес и локация",
    haveQuestions: "ИМАТЕ ВЪПРОСИ?",
    where: "КЪДЕ?",
    workHours: "Понеделник – Събота: 09:00 – 19:00 ч.",
  },
};

export const DEFAULT_DICTIONARY_EN: Dictionary = {
  nav: {
    home: "Home",
    services: "Services",
    about: "About Us",
    schedule: "Schedule",
    blog: "Blog",
    callUs: "Call Us",
  },
  home: {
    heroTitle: "LESSONS, COURSES AND ACTIVITIES FOR SUCCESSFUL CHILDREN",
    heroSubtitle: "Educational Club 'Umenie' – Burgas, Slaveykov complex",
    heroCta: "VIEW SERVICES",
    whyChooseTitle: "WHY CHOOSE UMENIE?",
    servicesTitle: "SERVICES & ACTIVITIES",
    servicesSubtitle: "Select an activity to learn more",
    galleryTitle: "CHILDREN WITH SKILLS",
    reviewsTitle: "WHAT PARENTS SAY ABOUT US",
    blogTitle: "HELPFUL ARTICLES & TIPS",
  },
  services: {
    title: "SERVICES",
    subtitle: "Select an activity to learn more.",
    exploreBtn: "Learn More",
    scheduleBtn: "View Weekly Schedule",
  },
  about: {
    title: "ABOUT US",
    whyChooseUs: "WHY CHOOSE UMENIE?",
    missionTitle: "OUR MISSION",
    reviewsTitle: "PARENT TESTIMONIALS",
  },
  schedule: {
    title: "SCHEDULE",
    subtitle: "Weekly schedule of activities and online booking",
    bookBtn: "Sign Up",
    allCategories: "All Activities",
    allDays: "All Days",
  },
  contacts: {
    title: "CONTACTS",
    phoneLabel: "Phone",
    locationLabel: "Address & Location",
    haveQuestions: "HAVE QUESTIONS?",
    where: "WHERE?",
    workHours: "Monday – Saturday: 09:00 – 19:00",
  },
};

/**
 * Strict Localization Resolver
 *
 * Rule:
 * - When locale === 'bg':
 *     Always resolve as: settings?.fieldBg || defaultDictionaryBg
 * - When locale === 'en':
 *     Always resolve as: settings?.fieldEn || defaultDictionaryEn
 * - NEVER allow dictionaries.ts or services-data.ts to take priority over a non-empty value stored in site_settings!
 */
export function resolveLocalized(
  locale: string = "bg",
  adminValBg?: string | null,
  adminValEn?: string | null,
  defaultBg: string = "",
  defaultEn: string = ""
): string {
  const isEn = locale?.toLowerCase() === "en";

  if (isEn) {
    if (adminValEn && adminValEn.trim() !== "") {
      return adminValEn.trim();
    }
    if (defaultEn && defaultEn.trim() !== "") {
      return defaultEn.trim();
    }
    if (adminValBg && adminValBg.trim() !== "") {
      return adminValBg.trim();
    }
    return defaultBg;
  }

  // Bulgarian (default)
  if (adminValBg && adminValBg.trim() !== "") {
    return adminValBg.trim();
  }
  return defaultBg;
}

/**
 * Normalizes all property name aliases bidirectionally and resolves localized service data.
 * Zero mismatch between Admin and Frontend!
 */
export function resolveServiceData(
  baseService: ServiceData,
  override: ServiceOverride | undefined,
  locale: string = "bg"
) {
  const isEn = locale?.toLowerCase() === "en";

  // Bidirectional alias unification
  const titleBg = override?.title?.trim() || baseService.title;
  const titleEn = override?.titleEn?.trim() || (baseService as any).titleEn || "";

  // badge <-> shortTitle
  const badgeBg =
    override?.badge?.trim() ||
    override?.shortTitle?.trim() ||
    baseService.shortTitle;
  const badgeEn =
    override?.badgeEn?.trim() ||
    override?.shortTitleEn?.trim() ||
    (baseService as any).shortTitleEn ||
    "";

  // shortDescription
  const shortDescBg =
    override?.shortDescription?.trim() ||
    override?.introNarrative?.trim() ||
    override?.intro?.trim() ||
    baseService.shortDescription;
  const shortDescEn =
    override?.shortDescriptionEn?.trim() ||
    override?.introNarrativeEn?.trim() ||
    override?.introEn?.trim() ||
    (baseService as any).shortDescriptionEn ||
    "";

  // sloganPart1 & sloganPart2
  const sloganPart1Bg = override?.sloganPart1?.trim() || baseService.sloganPart1;
  const sloganPart1En = override?.sloganPart1En?.trim() || (baseService as any).sloganPart1En || "";
  const sloganPart2Bg = override?.sloganPart2?.trim() || baseService.sloganPart2;
  const sloganPart2En = override?.sloganPart2En?.trim() || (baseService as any).sloganPart2En || "";

  // introNarrative <-> intro
  const introBg =
    override?.introNarrative?.trim() ||
    override?.intro?.trim() ||
    baseService.intro;
  const introEn =
    override?.introNarrativeEn?.trim() ||
    override?.introEn?.trim() ||
    (baseService as any).introEn ||
    "";

  // bullets <-> bulletPoints
  const bulletsBg =
    (override?.bullets && override.bullets.length > 0)
      ? override.bullets
      : (override?.bulletPoints && override.bulletPoints.length > 0)
      ? override.bulletPoints
      : baseService.bulletPoints;

  const bulletsEn =
    (override?.bulletsEn && override.bulletsEn.length > 0)
      ? override.bulletsEn
      : (override?.bulletPointsEn && override.bulletPointsEn.length > 0)
      ? override.bulletPointsEn
      : (baseService as any).bulletPointsEn || [];

  // page1Image & page2Image <-> pageImages
  const page1 =
    override?.page1Image ||
    override?.pageImages?.[0] ||
    baseService.pageImages[0];
  const page2 =
    override?.page2Image ||
    override?.pageImages?.[1] ||
    baseService.pageImages[1] ||
    page1;

  // Slider toggle & images
  const hasSlider =
    override?.hasSlider !== undefined ? override.hasSlider : baseService.hasSlider;
  const sliderImages =
    override?.sliderImages && override.sliderImages.length > 0
      ? override.sliderImages
      : baseService.sliderImages;

  return {
    ...baseService,
    title: resolveLocalized(locale, titleBg, titleEn, baseService.title, (baseService as any).titleEn || baseService.title),
    titleBg,
    titleEn,
    shortTitle: resolveLocalized(locale, badgeBg, badgeEn, baseService.shortTitle, (baseService as any).shortTitleEn || baseService.shortTitle),
    badge: resolveLocalized(locale, badgeBg, badgeEn, baseService.shortTitle, (baseService as any).shortTitleEn || baseService.shortTitle),
    shortDescription: resolveLocalized(locale, shortDescBg, shortDescEn, baseService.shortDescription, (baseService as any).shortDescriptionEn || baseService.shortDescription),
    sloganPart1: resolveLocalized(locale, sloganPart1Bg, sloganPart1En, baseService.sloganPart1, (baseService as any).sloganPart1En || baseService.sloganPart1),
    sloganPart2: resolveLocalized(locale, sloganPart2Bg, sloganPart2En, baseService.sloganPart2, (baseService as any).sloganPart2En || baseService.sloganPart2),
    intro: resolveLocalized(locale, introBg, introEn, baseService.intro, (baseService as any).introEn || baseService.intro),
    introNarrative: resolveLocalized(locale, introBg, introEn, baseService.intro, (baseService as any).introEn || baseService.intro),
    bulletPoints: (isEn && bulletsEn.length > 0 ? bulletsEn : bulletsBg) as string[],
    bullets: (isEn && bulletsEn.length > 0 ? bulletsEn : bulletsBg) as string[],
    pageImages: [page1, page2],
    page1Image: page1,
    page2Image: page2,
    hasSlider,
    sliderImages,
    sliderImageSettings: override?.sliderImageSettings || {},
    galleryTitle: override?.galleryTitle || baseService.galleryTitle,
    videos: override?.videos && override.videos.length > 0 ? override.videos : baseService.videos,
    videoPosters: override?.videoPosters && override.videoPosters.length > 0 ? override.videoPosters : baseService.videoPosters,
  };
}


/**
 * Helper for Server Component pages to get the current locale from searchParams or cookie.
 */
export async function getLocaleFromContext(
  searchParams?: Promise<{ lang?: string }> | { lang?: string }
): Promise<"bg" | "en"> {
  if (searchParams) {
    const sp = (typeof (searchParams as any)?.then === "function" ? await searchParams : searchParams) as { lang?: string } | undefined;
    if (sp?.lang?.toLowerCase() === "en") return "en";
    if (sp?.lang?.toLowerCase() === "bg") return "bg";
  }
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const val = cookieStore.get("umenie_lang")?.value;
    if (val?.toLowerCase() === "en") return "en";
  } catch {}
  return "bg";
}
