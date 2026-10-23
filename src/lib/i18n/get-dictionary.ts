import { Locale, DEFAULT_LOCALE } from "./types";
import { DICTIONARY, Dictionary } from "./dictionaries";

export function getDictionary(locale: Locale): Dictionary {
  return (DICTIONARY[locale] || DICTIONARY[DEFAULT_LOCALE]) as Dictionary;
}
