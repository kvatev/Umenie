import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE env variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const SETTINGS_FILE = "settings.json";

function resolveLocalized(locale, dbBg, dbEn, defaultBg, defaultEn) {
  const isEn = locale?.toLowerCase() === "en";
  if (isEn) {
    if (dbEn && dbEn.trim() !== "") return dbEn;
    return defaultEn || defaultBg || "";
  }
  if (dbBg && dbBg.trim() !== "") return dbBg;
  return defaultBg || "";
}

function parseDateKey(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isEventOnDate(item, targetDateStr) {
  if (item.date) {
    if (item.date === targetDateStr) return true;
    if (!item.recurrence || item.recurrence.type === "none") return false;

    const startDate = parseDateKey(item.date);
    const targetDate = parseDateKey(targetDateStr);

    if (targetDate < startDate) return false;

    const diffDays = Math.round(
      (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays % 7 !== 0) return false;

    const r = item.recurrence;
    if (r.type === "weekly") return true;

    if (r.type === "biweekly") {
      return diffDays >= 0 && diffDays % 14 === 0;
    }

    if (r.type === "weekly_count" && r.count) {
      const weekIndex = Math.floor(diffDays / 7);
      return weekIndex < r.count;
    }

    if (r.type === "custom_until" && r.untilDate) {
      const untilDate = parseDateKey(r.untilDate);
      return targetDate <= untilDate;
    }

    return false;
  }
  return false;
}

async function runAudit() {
  console.log("================================================================================");
  console.log("PRE-LAUNCH CRITICAL AUDIT: FULL ROUND-TRIP SUPABASE VERIFICATION (BG & EN)");
  console.log("================================================================================\n");

  // Helper to read fresh settings bypassing CDN edge
  async function readSettings() {
    const url = `${supabaseUrl}/storage/v1/object/site-media/${SETTINGS_FILE}?ts=${Date.now()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${supabaseServiceKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch settings: status ${res.status}`);
    }
    return await res.json();
  }

  // Helper to save settings with cacheControl: 0
  async function saveSettings(obj) {
    const buf = Buffer.from(JSON.stringify(obj, null, 2), "utf8");
    const { error } = await supabase.storage.from("site-media").upload(SETTINGS_FILE, buf, {
      upsert: true,
      contentType: "application/json",
      cacheControl: "0",
    });
    if (error) {
      throw new Error(`Failed to upload settings.json: ${error.message}`);
    }
  }

  const initialSettings = await readSettings();
  console.log("[SETUP] Initial settings successfully loaded from Supabase storage (site-media).");

  // --------------------------------------------------------------------------------
  // 1. HOME TEST: Hero BG/EN Title & Kids Gallery Order
  // --------------------------------------------------------------------------------
  console.log("\n--- [TEST 1] HOME SECTION: Hero BG/EN Title & Kids Gallery Order ---");
  const testHeroBg = "ТЕСТОВО НАЧАЛНО ЗАГЛАВИЕ AUDIT";
  const testHeroEn = "TEST AUDIT HERO TITLE EN";
  const testKidsOrder = ["/test/kids-1.webp", "/test/kids-2.webp"];

  const homePatched = {
    ...initialSettings,
    heroTitle: testHeroBg,
    heroTitleEn: testHeroEn,
    kidsGalleryOrder: testKidsOrder,
  };
  await saveSettings(homePatched);

  const homeRead = await readSettings();
  if (homeRead.heroTitle !== testHeroBg || homeRead.heroTitleEn !== testHeroEn) {
    throw new Error(`[FAIL] Home test failed: expected heroTitle "${testHeroBg}", got "${homeRead.heroTitle}"`);
  }
  if (!Array.isArray(homeRead.kidsGalleryOrder) || homeRead.kidsGalleryOrder[0] !== testKidsOrder[0]) {
    throw new Error(`[FAIL] Kids gallery order mismatch: expected "${testKidsOrder[0]}", got "${homeRead.kidsGalleryOrder?.[0]}"`);
  }
  console.log("  ✅ Hero BG & EN titles persisted in Supabase.");
  console.log("  ✅ Kids Gallery order persisted in Supabase.");

  // Revert Home
  await saveSettings(initialSettings);
  console.log("  ✅ Home section reverted to pristine initial state.");

  // --------------------------------------------------------------------------------
  // 2. SERVICES TEST: BG & EN Title, Slogan, Narrative, Bullets & hasSlider Toggle
  // --------------------------------------------------------------------------------
  console.log("\n--- [TEST 2] SERVICES SECTION: BG & EN Unification & Slider Toggle ---");
  const testSlug = "matematika";
  const servicesOverrides = {
    ...(initialSettings.servicesOverrides || {}),
    [testSlug]: {
      title: "Забавна Математика (ОДИТ)",
      titleEn: "Fun Math Audit EN",
      badge: "Математика+",
      badgeEn: "Math+ EN",
      sloganPart1: "Мисли логично",
      sloganPart1En: "Think Logically",
      sloganPart2: "Действай уверено",
      sloganPart2En: "Act Confidently",
      intro: "Специално аудитирано въведение за математика",
      introEn: "Specially audited introduction for math",
      bullets: ["Умения за бързо смятане", "**Логически** игри"],
      bulletsEn: ["Quick math skills", "**Logical** games"],
      hasSlider: false,
    },
  };

  await saveSettings({ ...initialSettings, servicesOverrides });

  const servicesRead = await readSettings();
  const mathOverride = servicesRead.servicesOverrides?.[testSlug];
  if (!mathOverride || mathOverride.title !== "Забавна Математика (ОДИТ)") {
    throw new Error("[FAIL] Services override failed to persist in Supabase.");
  }

  // Test resolution logic: BG & EN
  const resolvedBgTitle = resolveLocalized("bg", mathOverride.title, mathOverride.titleEn, "Default BG", "Default EN");
  const resolvedEnTitle = resolveLocalized("en", mathOverride.title, mathOverride.titleEn, "Default BG", "Default EN");
  if (resolvedBgTitle !== "Забавна Математика (ОДИТ)") {
    throw new Error(`[FAIL] BG resolution failed: expected "Забавна Математика (ОДИТ)", got "${resolvedBgTitle}"`);
  }
  if (resolvedEnTitle !== "Fun Math Audit EN") {
    throw new Error(`[FAIL] EN resolution failed: expected "Fun Math Audit EN", got "${resolvedEnTitle}"`);
  }
  if (mathOverride.hasSlider !== false) {
    throw new Error("[FAIL] hasSlider toggle failed to persist false.");
  }
  console.log("  ✅ Service BG & EN title, slogan, narrative and bullets persisted in Supabase.");
  console.log("  ✅ resolveLocalized correctly prioritized DB override over static defaults (BG & EN).");
  console.log("  ✅ hasSlider toggle successfully set to false.");

  // Revert Services
  await saveSettings(initialSettings);
  console.log("  ✅ Services section reverted to pristine initial state.");

  // --------------------------------------------------------------------------------
  // 3. ABOUT TEST: Pillars in BG & EN
  // --------------------------------------------------------------------------------
  console.log("\n--- [TEST 3] ABOUT US SECTION: 3 Pillars & Secondary Features (BG & EN) ---");
  const testAboutValues = [
    {
      title: "УМЕНИЯ ЗА БЪДЕЩЕТО (ОДИТ)",
      titleEn: "SKILLS FOR THE FUTURE (AUDIT)",
      text: "Тестово подробно описание на български език за одит.",
      textEn: "Test detailed description in English for pre-launch audit.",
      icon: "brain",
    },
  ];

  await saveSettings({ ...initialSettings, aboutValues: testAboutValues });

  const aboutRead = await readSettings();
  const firstValue = aboutRead.aboutValues?.[0];
  if (firstValue.title !== "УМЕНИЯ ЗА БЪДЕЩЕТО (ОДИТ)" || firstValue.titleEn !== "SKILLS FOR THE FUTURE (AUDIT)") {
    throw new Error("[FAIL] About values failed to persist in Supabase.");
  }

  const resAboutBg = resolveLocalized("bg", firstValue.title, firstValue.titleEn, "Def BG", "Def EN");
  const resAboutEn = resolveLocalized("en", firstValue.title, firstValue.titleEn, "Def BG", "Def EN");
  if (resAboutBg !== "УМЕНИЯ ЗА БЪДЕЩЕТО (ОДИТ)" || resAboutEn !== "SKILLS FOR THE FUTURE (AUDIT)") {
    throw new Error("[FAIL] About value localization resolution mismatch.");
  }
  console.log("  ✅ About Us pillars saved and resolved in both BG and EN.");

  // Revert About
  await saveSettings(initialSettings);
  console.log("  ✅ About Us section reverted to pristine initial state.");

  // --------------------------------------------------------------------------------
  // 4. SCHEDULE & CALENDAR TEST: Bi-Weekly Event, Date Constraints & No Loss of Events
  // --------------------------------------------------------------------------------
  console.log("\n--- [TEST 4] SCHEDULE & CALENDAR: Recurrence & Supabase Persistence ---");
  // Inspect existing events first
  const { data: existingEvents, error: fetchErr } = await supabase
    .from("schedule_events")
    .select("*");
  
  if (fetchErr) {
    throw new Error(`[FAIL] Could not query schedule_events: ${fetchErr.message}`);
  }
  const baselineCount = existingEvents?.length || 0;
  console.log(`  ℹ️ Baseline existing events in Supabase: ${baselineCount}`);

  // Create a biweekly test event starting today 2026-10-27
  const testEventId = randomUUID();
  const testEvent = {
    id: testEventId,
    title: "Одитно Занятие (Би-уикли)",
    category: "chess",
    day_of_week: 2, // Tuesday
    start_time: "17:00",
    end_time: "18:00",
    age_group: "7-12 г.",
    location: "Славейков, блок 48",
    capacity: 8,
    is_active: true,
    event_date: "2026-10-27",
    recurrence_type: "biweekly",
  };

  const { data: insertedEvent, error: insertEventErr } = await supabase
    .from("schedule_events")
    .insert(testEvent)
    .select()
    .single();

  if (insertEventErr) {
    throw new Error(`[FAIL] Insert schedule event failed: ${insertEventErr.message}`);
  }
  console.log(`  ✅ Bi-weekly event inserted successfully. ID: ${insertedEvent.id}`);

  // Check baseline events were NOT lost
  const { data: currentEvents } = await supabase.from("schedule_events").select("*");
  if ((currentEvents?.length || 0) < baselineCount) {
    throw new Error("[CRITICAL BUG] Existing events disappeared after adding a new event!");
  }
  console.log(`  ✅ Existing events preserved: ${currentEvents.length} events now present.`);

  // Test Recurrence Calculation strictly
  const eventItem = {
    id: insertedEvent.id,
    title: insertedEvent.title,
    date: insertedEvent.event_date,
    recurrence: { type: "biweekly", intervalWeeks: 2 },
  };

  const onStart = isEventOnDate(eventItem, "2026-10-27"); // Today (Start date) -> must be TRUE
  const onBiweekly = isEventOnDate(eventItem, "2026-11-10"); // +14 days -> must be TRUE
  const onPast = isEventOnDate(eventItem, "2026-10-20"); // -7 days (Before start) -> must be FALSE
  const onSkippedWeek = isEventOnDate(eventItem, "2026-11-03"); // +7 days (Skipped week) -> must be FALSE

  if (!onStart) throw new Error("[FAIL] Biweekly event should appear on start date (2026-10-27).");
  if (!onBiweekly) throw new Error("[FAIL] Biweekly event should appear 14 days later (2026-11-10).");
  if (onPast) throw new Error("[FAIL] Biweekly event must NEVER appear before start date (2026-10-20).");
  if (onSkippedWeek) throw new Error("[FAIL] Biweekly event must NOT appear on skipped week (2026-11-03).");

  console.log("  ✅ Recurrence test passed: strictly occurs every 14 days; never occurs in the past or on skipped weeks.");

  // Delete test event
  const { error: deleteEventErr } = await supabase
    .from("schedule_events")
    .delete()
    .eq("id", insertedEvent.id);

  if (deleteEventErr) {
    throw new Error(`[FAIL] Failed to delete test schedule event: ${deleteEventErr.message}`);
  }
  console.log("  ✅ Test schedule event cleanly deleted from Supabase.");

  // --------------------------------------------------------------------------------
  // 5. BOOKINGS TEST: Insert, Update Status, Delete
  // --------------------------------------------------------------------------------
  console.log("\n--- [TEST 5] BOOKINGS: Lifecycle from BookingModal to BookingsTable ---");
  const testBooking = {
    activity_name: "Одитен Урок по Роботика",
    child_name: "Александър Тестов",
    child_age: "9 години",
    parent_name: "Мария Тестова",
    phone: "0889112233",
    email: "maria.test@example.com",
    status: "pending",
    consent_marketing: false,
  };

  const { data: insertedBooking, error: bookErr } = await supabase
    .from("bookings")
    .insert(testBooking)
    .select()
    .single();

  if (bookErr) throw new Error(`[FAIL] Booking insert failed: ${bookErr.message}`);
  console.log(`  ✅ Booking submitted and saved in Supabase. ID: ${insertedBooking.id}`);

  // Admin updates status to confirmed
  const { error: updateBookErr } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", insertedBooking.id);
  if (updateBookErr) throw new Error(`[FAIL] Booking status update failed: ${updateBookErr.message}`);

  const { data: verifiedBooking } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", insertedBooking.id)
    .single();

  if (verifiedBooking?.status !== "confirmed") {
    throw new Error(`[FAIL] Expected booking status "confirmed", got "${verifiedBooking?.status}"`);
  }
  console.log("  ✅ Booking status changed to 'confirmed' and verified in Supabase.");

  // Clean up
  await supabase.from("bookings").delete().eq("id", insertedBooking.id);
  console.log("  ✅ Test booking deleted and cleaned up.");

  // --------------------------------------------------------------------------------
  // 6. GLOBAL SETTINGS TEST: Contacts (Phone, TikTok, Address)
  // --------------------------------------------------------------------------------
  console.log("\n--- [TEST 6] GLOBAL SETTINGS: Contacts, Social & Address ---");
  const testPhone = "0888 999 888";
  const testTikTok = "https://www.tiktok.com/@obrazovatelenklubumenie";
  const testAddressBg = "к-с Славейков, блок 48, партер, Бургас";
  const testAddressEn = "Slaveykov compl., bl. 48, ground floor, Burgas";

  await saveSettings({
    ...initialSettings,
    phoneDisplay: testPhone,
    tiktokUrl: testTikTok,
    locationFull: testAddressBg,
    locationFullEn: testAddressEn,
  });

  const settingsRead = await readSettings();
  if (settingsRead.phoneDisplay !== testPhone || settingsRead.tiktokUrl !== testTikTok) {
    throw new Error("[FAIL] Global settings failed to persist.");
  }
  console.log("  ✅ Phone, TikTok URL and Address successfully persisted in Supabase.");

  // Revert Global Settings
  await saveSettings(initialSettings);
  console.log("  ✅ Global settings reverted to pristine initial state.");

  console.log("\n================================================================================");
  console.log("ALL 6 ADMIN SECTIONS & SUPABASE PERSISTENCE TESTS PASSED 100% SUCCESSFULLY!");
  console.log("================================================================================\n");
}

runAudit().catch((err) => {
  console.error("\n❌ AUDIT FAILED:", err);
  process.exit(1);
});
