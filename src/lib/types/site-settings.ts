import { SITE_CONFIG } from "@/lib/constants";

export interface AboutTextItem {
  title: string;
  titleEn?: string;
  text: string;
  textEn?: string;
}

export interface SlideViewSetting {
  fit?: "cover" | "contain";
  position?: string;
  scale?: number;
}

export interface ServiceOverride {
  title?: string;
  titleEn?: string;
  shortTitle?: string;
  shortTitleEn?: string;
  badge?: string;
  badgeEn?: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  sloganPart1?: string;
  sloganPart1En?: string;
  sloganPart2?: string;
  sloganPart2En?: string;
  intro?: string;
  introEn?: string;
  introNarrative?: string;
  introNarrativeEn?: string;
  bulletPoints?: string[];
  bulletPointsEn?: string[];
  bullets?: string[];
  bulletsEn?: string[];
  pageImages?: string[];
  page1Image?: string;
  page2Image?: string;
  sliderImages?: string[];
  galleryTitle?: string;
  hasSlider?: boolean;
  sliderImageSettings?: Record<string, SlideViewSetting>;
  videos?: string[];
  videoPosters?: string[];
  showVideos?: boolean;
}

export interface SiteSettings {
  phoneDisplay: string;
  phoneFull: string;
  phoneRaw: string;
  locationShort: string;
  locationShortEn?: string;
  locationFull: string;
  locationFullEn?: string;
  googleMapsUrl: string;
  email: string;
  tagline: string;
  taglineEn?: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  // Hero Banner settings
  heroTitle?: string;
  heroTitleEn?: string;
  heroSubtitle?: string;
  heroSubtitleEn?: string;
  heroBannerUrl?: string;
  heroImageUrl?: string;
  heroVideoUrl?: string;
  heroMediaType?: "image" | "video";
  // Review Screenshot setting (single or multiple)
  reviewScreenshotUrl?: string;
  reviewScreenshots?: string[];
  // Kids Gallery slide order
  kidsGalleryOrder?: string[];
  // Weekly Schedule File (PDF/Image)
  scheduleFileUrl?: string;
  scheduleFileName?: string;
  // About Page texts
  aboutValues?: AboutTextItem[];
  aboutFeatures?: AboutTextItem[];
  // Services Overrides
  servicesOverrides?: Record<string, ServiceOverride>;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phoneDisplay: SITE_CONFIG.phoneDisplay,
  phoneFull: SITE_CONFIG.phoneFull,
  phoneRaw: SITE_CONFIG.phoneRaw,
  locationShort: SITE_CONFIG.locationShort,
  locationShortEn: "Burgas, Slaveykov, bl. 48",
  locationFull: SITE_CONFIG.locationFull,
  locationFullEn: "Slaveykov complex, block 48, ground floor, Burgas",
  googleMapsUrl: SITE_CONFIG.googleMapsUrl,
  email: SITE_CONFIG.email,
  tagline: SITE_CONFIG.tagline,
  taglineEn: "Educational club for successful children in Burgas",
  heroTitle: "УРОЦИ, КУРСОВЕ И ЗАНИМАНИЯ ЗА УСПЕШНИ ДЕЦА",
  heroTitleEn: "LESSONS, COURSES AND ACTIVITIES FOR SUCCESSFUL CHILDREN",
  heroSubtitle: "Образователен клуб „УМеНИе“ – Бургас, к-с Славейков",
  heroSubtitleEn: "Educational Club 'Umenie' – Burgas, Slaveykov complex",
  facebookUrl: SITE_CONFIG.social.facebook,
  instagramUrl: SITE_CONFIG.social.instagram,
  tiktokUrl: SITE_CONFIG.social.tiktok,
  heroBannerUrl: "",
  heroImageUrl: "",
  heroVideoUrl: "",
  heroMediaType: "image",
  reviewScreenshotUrl: "",
  reviewScreenshots: [],
  kidsGalleryOrder: [],
  scheduleFileUrl: "",
  scheduleFileName: "",
  aboutValues: [
    {
      title: "УМЕНИЯ ОТВЪД УРОЦИТЕ",
      titleEn: "SKILLS BEYOND LESSONS",
      text: "Децата развиват умения отвъд уроците, които ще носят цял живот – увереност, отговорност, работа в екип и критично мислене.",
      textEn: "Children develop lifelong skills beyond lessons – confidence, responsibility, teamwork, and critical thinking.",
    },
    {
      title: "СРЕДА, БЛИЗКА ДО ДОМА",
      titleEn: "HOME-LIKE ENVIRONMENT",
      text: "Място, където всяко дете се чувства прието и спокойно да бъде себе си, а уважението, добротата и отношението към другите са част от всеки ден.",
      textEn: "A place where every child feels accepted and at ease to be themselves, with kindness and respect in everyday interactions.",
    },
    {
      title: "ИНДИВИДУАЛЕН ПОДХОД",
      titleEn: "INDIVIDUAL APPROACH",
      text: "В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от неговото ниво и го издигаме нагоре.",
      textEn: "In small groups, each child receives personal attention and support, meeting them at their level and lifting them higher.",
    },
  ],
  aboutFeatures: [
    {
      title: "БЕЗ ЕКРАНИ",
      titleEn: "SCREEN-FREE",
      text: "Екраните остават настрана, за да има място за знание, мечти и истински приятелства.",
      textEn: "Screens are set aside to make room for knowledge, imagination, and real friendships.",
    },
    {
      title: "УЧЕНЕ ЧРЕЗ ПРАКТИКА",
      titleEn: "HANDS-ON LEARNING",
      text: "Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само на хартия.",
      textEn: "Knowledge comes to life through interactive tasks, games, and practice instead of staying on paper.",
    },
    {
      title: "РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА",
      titleEn: "PARENTS AS PARTNERS",
      text: "Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на детето.",
      textEn: "Regular feedback keeps you connected to your child's progress, interests, and needs.",
    },
  ],
  servicesOverrides: {},
};

/**
 * Utility to normalize and automatically derive all phone formats
 */
export function normalizePhoneNumber(input: string): {
  phoneDisplay: string;
  phoneFull: string;
  phoneRaw: string;
} {
  const trimmed = input?.trim() || "";
  if (!trimmed) {
    return { phoneDisplay: "", phoneFull: "", phoneRaw: "" };
  }

  let clean = trimmed.replace(/[\s\-\(\)\.\/]/g, "");

  if (clean.startsWith("00")) {
    clean = "+" + clean.slice(2);
  }

  if (clean.startsWith("+359")) {
    const rest = clean.slice(4);
    const raw = "+359" + rest;

    if (rest.length === 9) {
      const part1 = rest.slice(0, 3);
      const part2 = rest.slice(3, 6);
      const part3 = rest.slice(6, 9);
      return {
        phoneDisplay: `0${part1} ${part2} ${part3}`,
        phoneFull: `+359 ${part1} ${part2} ${part3}`,
        phoneRaw: raw,
      };
    }

    if (rest.length === 8) {
      if (rest.startsWith("2")) {
        return {
          phoneDisplay: `02 ${rest.slice(1, 4)} ${rest.slice(4)}`,
          phoneFull: `+359 2 ${rest.slice(1, 4)} ${rest.slice(4)}`,
          phoneRaw: raw,
        };
      } else {
        return {
          phoneDisplay: `0${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`,
          phoneFull: `+359 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`,
          phoneRaw: raw,
        };
      }
    }

    return {
      phoneDisplay: "0" + rest,
      phoneFull: `+359 ${rest}`,
      phoneRaw: raw,
    };
  }

  if (clean.startsWith("0")) {
    const rest = clean.slice(1);
    const raw = "+359" + rest;

    if (rest.length === 9) {
      const part1 = rest.slice(0, 3);
      const part2 = rest.slice(3, 6);
      const part3 = rest.slice(6, 9);
      return {
        phoneDisplay: `0${part1} ${part2} ${part3}`,
        phoneFull: `+359 ${part1} ${part2} ${part3}`,
        phoneRaw: raw,
      };
    }

    if (rest.length === 8) {
      if (rest.startsWith("2")) {
        return {
          phoneDisplay: `02 ${rest.slice(1, 4)} ${rest.slice(4)}`,
          phoneFull: `+359 2 ${rest.slice(1, 4)} ${rest.slice(4)}`,
          phoneRaw: raw,
        };
      } else {
        return {
          phoneDisplay: `0${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`,
          phoneFull: `+359 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`,
          phoneRaw: raw,
        };
      }
    }

    return {
      phoneDisplay: clean,
      phoneFull: `+359 ${rest}`,
      phoneRaw: raw,
    };
  }

  if (clean.startsWith("+")) {
    const digitsOnly = "+" + clean.slice(1).replace(/\D/g, "");
    return {
      phoneDisplay: trimmed,
      phoneFull: trimmed,
      phoneRaw: digitsOnly,
    };
  }

  if (clean.length === 9 && (clean.startsWith("8") || clean.startsWith("9"))) {
    const part1 = clean.slice(0, 3);
    const part2 = clean.slice(3, 6);
    const part3 = clean.slice(6, 9);
    return {
      phoneDisplay: `0${part1} ${part2} ${part3}`,
      phoneFull: `+359 ${part1} ${part2} ${part3}`,
      phoneRaw: `+359${clean}`,
    };
  }

  const digits = clean.replace(/\D/g, "");
  return {
    phoneDisplay: trimmed,
    phoneFull: trimmed,
    phoneRaw: digits ? (digits.startsWith("359") ? "+" + digits : "+359" + digits) : trimmed,
  };
}
