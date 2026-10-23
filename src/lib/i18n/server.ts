import { cookies } from "next/headers";
import { Locale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from "./types";
import { getDictionary } from "./get-dictionary";
import type { Dictionary } from "./dictionaries";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(LOCALE_COOKIE_NAME);
    const val = cookie?.value as Locale | undefined;
    if (val && SUPPORTED_LOCALES.includes(val)) {
      return val;
    }
  } catch {
    // cookies() might fail in some static evaluation phases
  }
  return DEFAULT_LOCALE;
}

export async function getServerDictionary(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  return { locale, dict };
}
