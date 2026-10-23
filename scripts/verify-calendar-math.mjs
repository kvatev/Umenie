import { isEventOnDate, getDaysDifference } from "../src/lib/schedule-data.ts";

console.log("====================================================================");
console.log("TEST 2: Calendar Date & Bi-Weekly Recurrence Math Verification");
console.log("====================================================================");

// Define test event created on 2026-10-27 (Tuesday) with recurrenceType = 'biweekly'
const testEvent = {
  id: "test-biweekly-event-uuid",
  title: "Арт работилница (През седмица)",
  startDate: "2026-10-27",
  date: "2026-10-27",
  dayOfWeek: 2, // Tuesday
  startTime: "16:00",
  endTime: "17:30",
  recurrence: {
    type: "biweekly",
  },
  isActive: true,
};

const testCases = [
  {
    dateStr: "2026-10-20",
    description: "1 week before start date",
    expected: false,
    expectedReason: "diffDays < 0 (hidden!)"
  },
  {
    dateStr: "2026-10-27",
    description: "Start date (Day 0)",
    expected: true,
    expectedReason: "diffDays === 0 (visible!)"
  },
  {
    dateStr: "2026-11-03",
    description: "Week 2 (Day +7)",
    expected: false,
    expectedReason: "diffDays % 14 !== 0 (hidden — skipped week!)"
  },
  {
    dateStr: "2026-11-10",
    description: "Week 3 (Day +14)",
    expected: true,
    expectedReason: "diffDays % 14 === 0 (visible!)"
  },
  {
    dateStr: "2026-11-17",
    description: "Week 4 (Day +21)",
    expected: false,
    expectedReason: "diffDays % 14 !== 0 (hidden — skipped week!)"
  },
  {
    dateStr: "2026-11-24",
    description: "Week 5 (Day +28)",
    expected: true,
    expectedReason: "diffDays % 14 === 0 (visible!)"
  },
];

let allPassed = true;

for (const tc of testCases) {
  const diffDays = getDaysDifference(testEvent.startDate, tc.dateStr);
  const result = isEventOnDate(testEvent, tc.dateStr);
  const passed = result === tc.expected;

  const statusTag = passed ? "[PASS]" : "[FAIL]";
  console.log(`${statusTag} Date: ${tc.dateStr} | ${tc.description} | diffDays: ${diffDays} | Result: ${result} (Expected: ${tc.expected}) | ${tc.expectedReason}`);

  if (!passed) {
    allPassed = false;
  }
}

// Additional Check: Event with recurrenceType = 'none' (Single occurrence)
console.log("\n--- Additional Check: Single Occurrence (recurrenceType = 'none') ---");
const singleEvent = {
  id: "single-event",
  title: "Еднократно занятие",
  startDate: "2026-10-27",
  date: "2026-10-27",
  dayOfWeek: 2,
  recurrence: { type: "none" },
  isActive: true,
};
const singleTestBefore = isEventOnDate(singleEvent, "2026-10-20");
const singleTestOn = isEventOnDate(singleEvent, "2026-10-27");
const singleTestAfter = isEventOnDate(singleEvent, "2026-11-03");

console.log(`Single Event 2026-10-20 (Before): ${singleTestBefore} (Expected: false) -> ${singleTestBefore === false ? "[PASS]" : "[FAIL]"}`);
console.log(`Single Event 2026-10-27 (On Date): ${singleTestOn} (Expected: true) -> ${singleTestOn === true ? "[PASS]" : "[FAIL]"}`);
console.log(`Single Event 2026-11-03 (After): ${singleTestAfter} (Expected: false) -> ${singleTestAfter === false ? "[PASS]" : "[FAIL]"}`);

if (singleTestBefore !== false || singleTestOn !== true || singleTestAfter !== false) {
  allPassed = false;
}

console.log("\n====================================================================");
if (allPassed) {
  console.log(">>> ALL TEST 2 CALENDAR RECURRENCE CHECKS PASSED PERFECTLY! <<<");
  process.exit(0);
} else {
  console.error(">>> SOME TEST 2 CHECKS FAILED! <<<");
  process.exit(1);
}
