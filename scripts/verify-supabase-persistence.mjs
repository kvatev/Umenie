import fs from "fs";
import path from "path";

// Load .env.local before anything else
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
import { updateSiteSettingsAction } from "../src/actions/admin-settings.ts";

console.log("====================================================================");
console.log("TEST 1: Cloud Persistence Verification (Zero Local Files)");
console.log("====================================================================");

async function runTest() {
  console.log("Step 1: Reading initial settings from Supabase...");
  const initial = await getSiteSettings();
  console.log("[OK] Initial settings loaded. Current heroTitleEn:", initial.heroTitleEn || "(empty)");

  // 1. Prepare test payload
  const testPayload = {
    heroTitleEn: "TEST_CLOUD_PERSISTENCE_HERO_TITLE_EN",
    servicesOverrides: {
      ...(initial.servicesOverrides || {}),
      "art-zanimaniya": {
        ...(initial.servicesOverrides?.["art-zanimaniya"] || {}),
        title: "Арт Занимания (Тест BG)",
        titleEn: "Art Workshop (Test EN)",
      },
    },
    aboutValues: [
      {
        id: "v-test",
        title: "Тестова Ценност BG",
        titleEn: "Test Value EN",
        text: "Описание на тестова ценност",
        textEn: "Description of test value",
        icon: "heart"
      },
      ...(initial.aboutValues?.slice(1) || []),
    ]
  };

  console.log("\nStep 2: Updating Home, Services, and About via updateSiteSettingsAction...");
  const updateRes = await updateSiteSettingsAction(testPayload);
  if (!updateRes.success) {
    console.error("[FAIL] updateSiteSettingsAction failed:", updateRes.message);
    process.exit(1);
  }
  console.log("[OK] updateSiteSettingsAction succeeded!");

  console.log("\nStep 3: Fetching fresh data via getSiteSettings()...");
  const fresh = await getSiteSettings();

  const heroMatch = fresh.heroTitleEn === testPayload.heroTitleEn;
  const serviceBgMatch = fresh.servicesOverrides?.["art-zanimaniya"]?.title === "Арт Занимания (Тест BG)";
  const serviceEnMatch = fresh.servicesOverrides?.["art-zanimaniya"]?.titleEn === "Art Workshop (Test EN)";
  const aboutBgMatch = fresh.aboutValues?.[0]?.title === "Тестова Ценност BG";
  const aboutEnMatch = fresh.aboutValues?.[0]?.titleEn === "Test Value EN";

  console.log(`- Hero title EN match: ${heroMatch ? "[PASS]" : "[FAIL]"} (${fresh.heroTitleEn})`);
  console.log(`- Service BG title match: ${serviceBgMatch ? "[PASS]" : "[FAIL]"} (${fresh.servicesOverrides?.["art-zanimaniya"]?.title})`);
  console.log(`- Service EN title match: ${serviceEnMatch ? "[PASS]" : "[FAIL]"} (${fresh.servicesOverrides?.["art-zanimaniya"]?.titleEn})`);
  console.log(`- About BG value match: ${aboutBgMatch ? "[PASS]" : "[FAIL]"} (${fresh.aboutValues?.[0]?.title})`);
  console.log(`- About EN value match: ${aboutEnMatch ? "[PASS]" : "[FAIL]"} (${fresh.aboutValues?.[0]?.titleEn})`);

  const allPassed = heroMatch && serviceBgMatch && serviceEnMatch && aboutBgMatch && aboutEnMatch;

  console.log("\nStep 4: Cleanly reverting test data to initial state...");
  const revertPayload = {
    heroTitleEn: initial.heroTitleEn || "",
    servicesOverrides: initial.servicesOverrides || {},
    aboutValues: initial.aboutValues || [],
  };
  const revertRes = await updateSiteSettingsAction(revertPayload);
  if (!revertRes.success) {
    console.error("[FAIL] Revert failed:", revertRes.message);
  } else {
    console.log("[OK] Settings cleanly reverted to original state.");
  }

  // Double check after revert
  const reverted = await getSiteSettings();
  console.log("Post-revert heroTitleEn:", reverted.heroTitleEn || "(empty - original)");

  console.log("\n====================================================================");
  if (allPassed) {
    console.log(">>> ALL TEST 1 CLOUD PERSISTENCE CHECKS PASSED PERFECTLY! <<<");
    process.exit(0);
  } else {
    console.error(">>> TEST 1 FAILED! <<<");
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
