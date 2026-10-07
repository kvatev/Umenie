import { SITE_CONFIG } from "@/lib/constants";

export interface AboutTextItem {
  title: string;
  text: string;
}

export interface ServiceOverride {
  title?: string;
  shortTitle?: string;
  sloganPart1?: string;
  sloganPart2?: string;
  intro?: string;
  bulletPoints?: string[];
  pageImages?: string[];
  sliderImages?: string[];
  galleryTitle?: string;
  hasSlider?: boolean;
}

export interface SiteSettings {
  phoneDisplay: string;
  phoneFull: string;
  phoneRaw: string;
  locationShort: string;
  locationFull: string;
  googleMapsUrl: string;
  email: string;
  tagline: string;
  facebookUrl: string;
  instagramUrl: string;
  // Hero Banner settings
  heroBannerUrl?: string;
  heroVideoUrl?: string;
  heroMediaType?: "image" | "video";
  // Review Screenshot setting
  reviewScreenshotUrl?: string;
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
  locationFull: SITE_CONFIG.locationFull,
  googleMapsUrl: SITE_CONFIG.googleMapsUrl,
  email: SITE_CONFIG.email,
  tagline: SITE_CONFIG.tagline,
  facebookUrl: SITE_CONFIG.social.facebook,
  instagramUrl: SITE_CONFIG.social.instagram,
  heroBannerUrl: "",
  heroVideoUrl: "",
  heroMediaType: "image",
  reviewScreenshotUrl: "",
  kidsGalleryOrder: [],
  scheduleFileUrl: "",
  scheduleFileName: "",
  aboutValues: [
    {
      title: "УМЕНИЯ ОТВЪД УРОЦИТЕ",
      text: "Децата развиват умения отвъд уроците, които ще носят цял живот – увереност, отговорност, работа в екип и критично мислене.",
    },
    {
      title: "СРЕДА, БЛИЗКА ДО ДОМА",
      text: "Място, където всяко дете се чувства прието и спокойно да бъде себе си, а уважението, добротата и отношението към другите са част от всеки ден.",
    },
    {
      title: "ИНДИВИДУАЛЕН ПОДХОД",
      text: "В малки групи всяко дете получава лично внимание и подкрепа, защото започваме от неговото ниво и го издигаме нагоре.",
    },
  ],
  aboutFeatures: [
    {
      title: "БЕЗ ЕКРАНИ",
      text: "Екраните остават настрана, за да има място за знание, мечти и истински приятелства.",
    },
    {
      title: "УЧЕНЕ ЧРЕЗ ПРАКТИКА",
      text: "Знанията влизат в действие чрез задачи, игри и практика, вместо да остават само на хартия.",
    },
    {
      title: "РОДИТЕЛЯТ Е ЧАСТ ОТ ПРОЦЕСА",
      text: "Регулярната обратна връзка ви държи близо до напредъка, интересите и нуждите на детето.",
    },
  ],
  servicesOverrides: {},
};

/**
 * Utility to normalize and automatically derive all phone formats
 * (display format, international/footer format, and dialable tel: format)
 * from a single user input string.
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

  // Strip spaces, dashes, brackets, dots, slashes
  let clean = trimmed.replace(/[\s\-\(\)\.\/]/g, "");

  // Convert leading 00 to +
  if (clean.startsWith("00")) {
    clean = "+" + clean.slice(2);
  }

  // Case 1: Bulgarian international (+359...)
  if (clean.startsWith("+359")) {
    const rest = clean.slice(4); // digits after +359
    const raw = "+359" + rest;

    // Standard Bulgarian mobile (9 digits without leading 0, e.g. 877488481)
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

    // Bulgarian landline 8 digits
    if (rest.length === 8) {
      if (rest.startsWith("2")) {
        // Sofia (02)
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

  // Case 2: Bulgarian national format (starts with 0)
  if (clean.startsWith("0")) {
    const rest = clean.slice(1);
    const raw = "+359" + rest;

    // Mobile: 10 digits total (rest is 9 digits, e.g. 877488481)
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

    // Landline: 9 digits total (rest is 8 digits)
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

  // Case 3: Other international number (+...)
  if (clean.startsWith("+")) {
    const digitsOnly = "+" + clean.slice(1).replace(/\D/g, "");
    return {
      phoneDisplay: trimmed,
      phoneFull: trimmed,
      phoneRaw: digitsOnly,
    };
  }

  // Case 4: Digits without prefix (e.g. 877488481)
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

  // Fallback
  const digits = clean.replace(/\D/g, "");
  return {
    phoneDisplay: trimmed,
    phoneFull: trimmed,
    phoneRaw: digits ? (digits.startsWith("359") ? "+" + digits : "+359" + digits) : trimmed,
  };
}
