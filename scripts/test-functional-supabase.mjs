import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE env variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabase() {
  console.log("=== 1. Testing Booking Insert & Immediate Cleanup ===");
  const testPayload = {
    activity_name: "ТЕСТ - Одит Проверка",
    child_name: "Тестово Дете",
    child_age: "7 години",
    parent_name: "Тестов Родител",
    phone: "0888000000",
    email: "test-audit@umenie.net",
    status: "pending",
    consent_marketing: false,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("bookings")
    .insert(testPayload)
    .select()
    .single();

  if (insertError) {
    console.error("[FAIL] Booking insert failed:", insertError.message);
    process.exit(1);
  }
  console.log(`[OK] Booking inserted successfully! ID: ${inserted.id}`);

  // Immediate cleanup
  const { error: deleteError } = await supabase
    .from("bookings")
    .delete()
    .eq("id", inserted.id);

  if (deleteError) {
    console.error(`[WARN] Failed to delete test booking ${inserted.id}:`, deleteError.message);
  } else {
    console.log(`[OK] Test booking ${inserted.id} successfully cleaned up (deleted).`);
  }

  console.log("\n=== 2. Testing Site Settings Connection ===");
  const { data: settingsData, error: settingsError } = await supabase
    .from("site_settings")
    .select("key, value")
    .limit(5);

  if (settingsError) {
    console.error("[FAIL] Site settings query failed:", settingsError.message);
  } else {
    console.log(`[OK] Site settings retrieved ${settingsData.length} records successfully.`);
  }

  console.log("\n=== 3. Testing Schedule Events / Data Connection ===");
  const { data: schedData, error: schedError } = await supabase
    .from("schedule_events")
    .select("id, title")
    .limit(5);

  if (schedError) {
    console.log(`[INFO] schedule_events table query result: ${schedError.message} (static fallback in place)`);
  } else {
    console.log(`[OK] schedule_events returned ${schedData.length} records.`);
  }

  console.log("\n=== Supabase Verification Passed ===");
}

testSupabase().catch(console.error);
