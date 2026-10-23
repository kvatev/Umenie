import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  for (const line of envFile.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

import { getSiteSettings } from "../src/lib/site-settings.ts";
import { saveServiceContentAction, saveAboutPageContentAction } from "../src/actions/admin-services.ts";
import { updateSiteSettingsAction } from "../src/actions/admin-settings.ts";
import { createScheduleAction, deleteScheduleAction, getSchedulesAction } from "../src/actions/admin-schedules.ts";

console.log("====================================================================");
console.log("VERIFY: ENGLISH TRANSLATION OVERRIDES PERSISTENCE (ALL 4 SECTIONS)");
console.log("====================================================================");

async function run() {
  const initial = await getSiteSettings();

  // --- 1. SERVICES EDITOR ---
  console.log("\n[1] Testing Services Editor English overrides...");
  const sRes = await saveServiceContentAction("urotsi-i-kursove", {
    titleEn: "TEST_EN_TITLE_LESSONS",
    badgeEn: "TEST_EN_BADGE",
    sloganPart1En: "TEST_EN_SLOGAN_1",
    sloganPart2En: "TEST_EN_SLOGAN_2",
    introNarrativeEn: "TEST_EN_INTRO_NARRATIVE",
    bulletsEn: ["TEST_BULLET_1_EN", "TEST_BULLET_2_EN"],
  });
  if (!sRes.success) throw new Error("saveServiceContentAction failed: " + sRes.message);

  const freshSettings1 = await getSiteSettings();
  const servOverride = freshSettings1.servicesOverrides?.["urotsi-i-kursove"];
  const sPass =
    servOverride?.titleEn === "TEST_EN_TITLE_LESSONS" &&
    servOverride?.badgeEn === "TEST_EN_BADGE" &&
    servOverride?.introNarrativeEn === "TEST_EN_INTRO_NARRATIVE" &&
    servOverride?.bulletsEn?.[0] === "TEST_BULLET_1_EN";

  console.log("Services English override persist:", sPass ? "[PASS]" : "[FAIL]", servOverride?.titleEn);

  // --- 2. ABOUT US EDITOR ---
  console.log("\n[2] Testing About Us Editor English overrides...");
  const testValues = [
    { title: "Ценност 1", text: "Текст 1", titleEn: "TEST_VALUE_EN_1", textEn: "TEST_TEXT_EN_1" },
    { title: "Ценност 2", text: "Текст 2", titleEn: "TEST_VALUE_EN_2", textEn: "TEST_TEXT_EN_2" },
    { title: "Ценност 3", text: "Текст 3", titleEn: "TEST_VALUE_EN_3", textEn: "TEST_TEXT_EN_3" },
  ];
  const testFeatures = [
    { title: "Принцип 1", text: "Текст П1", titleEn: "TEST_FEAT_EN_1", textEn: "TEST_FEAT_TEXT_EN_1" },
    { title: "Принцип 2", text: "Текст П2", titleEn: "TEST_FEAT_EN_2", textEn: "TEST_FEAT_TEXT_EN_2" },
    { title: "Принцип 3", text: "Текст П3", titleEn: "TEST_FEAT_EN_3", textEn: "TEST_FEAT_TEXT_EN_3" },
  ];
  const aRes = await saveAboutPageContentAction(testValues, testFeatures);
  if (!aRes.success) throw new Error("saveAboutPageContentAction failed: " + aRes.message);

  const freshSettings2 = await getSiteSettings();
  const aPass =
    freshSettings2.aboutValues?.[0]?.titleEn === "TEST_VALUE_EN_1" &&
    freshSettings2.aboutFeatures?.[0]?.titleEn === "TEST_FEAT_EN_1";
  console.log("About Us English override persist:", aPass ? "[PASS]" : "[FAIL]", freshSettings2.aboutValues?.[0]?.titleEn);

  // --- 3. HOME PAGE EDITOR ---
  console.log("\n[3] Testing Home Page Editor heroTitleEn override...");
  const hRes = await updateSiteSettingsAction({
    heroTitleEn: "TEST_HERO_TITLE_EN_OVERRIDE",
  });
  if (!hRes.success) throw new Error("updateSiteSettingsAction failed: " + hRes.message);

  const freshSettings3 = await getSiteSettings();
  const hPass = freshSettings3.heroTitleEn === "TEST_HERO_TITLE_EN_OVERRIDE";
  console.log("Home Page heroTitleEn persist:", hPass ? "[PASS]" : "[FAIL]", freshSettings3.heroTitleEn);

  // --- 4. SCHEDULE MODAL / EDITOR ---
  console.log("\n[4] Testing Schedule Modal English title persist...");
  const schedRes = await createScheduleAction({
    title: "Тестово Занятие БГ",
    titleEn: "TEST_SCHEDULE_ITEM_EN",
    title_en: "TEST_SCHEDULE_ITEM_EN",
    category: "art",
    day_of_week: 3,
    start_time: "15:00",
    end_time: "16:00",
    age_group: "1 - 4 клас",
    location: "Славейков",
    capacity: 10,
    is_active: true,
  });
  if (!schedRes.success) throw new Error("createScheduleAction failed: " + schedRes.message);

  const schedules = await getSchedulesAction();
  const created = schedules.find((s) => s.title === "Тестово Занятие БГ");
  const schedPass = created?.titleEn === "TEST_SCHEDULE_ITEM_EN" || created?.title_en === "TEST_SCHEDULE_ITEM_EN";
  console.log("Schedule item English title persist:", schedPass ? "[PASS]" : "[FAIL]", created?.titleEn);

  if (created?.id) {
    await deleteScheduleAction(created.id);
    console.log("Cleaned up test schedule item.");
  }

  // --- REVERT SETTINGS CLEANLY ---
  console.log("\n[5] Reverting test site settings cleanly...");
  await updateSiteSettingsAction({
    heroTitleEn: initial.heroTitleEn || "",
    servicesOverrides: initial.servicesOverrides || {},
    aboutValues: initial.aboutValues || [],
    aboutFeatures: initial.aboutFeatures || [],
  });
  console.log("Settings successfully reverted to initial state!");

  const allPassed = sPass && aPass && hPass && schedPass;
  console.log("====================================================================");
  if (allPassed) {
    console.log(">>> ALL 4 SECTIONS ENGLISH OVERRIDES PERSISTENCE PASSED PERFECTLY! <<<");
    process.exit(0);
  } else {
    console.error(">>> TESTS FAILED! <<<");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test failed with exception:", err);
  process.exit(1);
});
