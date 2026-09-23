import { SITE_CONFIG } from "@/lib/constants";

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
};
