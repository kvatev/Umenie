/**
 * Helper to dynamically map schedule events and activities to their official circular badge icon.
 */
export function getActivityIcon(title: string, category?: string): string {
  const normalized = (title + " " + (category || "")).toLowerCase();

  if (normalized.includes("шах") || normalized.includes("chess")) {
    return "/images/icons/icon-shah.png";
  }
  if (normalized.includes("плетиво") || normalized.includes("knitting")) {
    return "/images/icons/icon-pletivo.png";
  }
  if (normalized.includes("арт") || normalized.includes("рисува") || normalized.includes("art")) {
    return "/images/icons/icon-art.png";
  }
  if (normalized.includes("учебна занималня") || normalized.includes("занималн")) {
    return "/images/icons/icon-zanimalnya.png";
  }
  if (normalized.includes("читател") || normalized.includes("лигериа") || normalized.includes("книг")) {
    return "/images/icons/icon-chitatelski-klub.png";
  }
  // ALL Bulgarian, Math, and English language lessons & courses:
  if (
    normalized.includes("урок") ||
    normalized.includes("курс") ||
    normalized.includes("бел") ||
    normalized.includes("български") ||
    normalized.includes("математик") ||
    normalized.includes("английски")
  ) {
    return "/images/icons/icon-urotsi.png";
  }

  return "/images/icons/icon-urotsi.png"; // default fallback
}
