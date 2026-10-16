import {
  getBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  deleteBlogPost,
  getBlogComments,
  addBlogComment,
  moderateBlogComment,
  deleteBlogComment,
} from "../src/lib/blog-service.ts";
import { NAV_LINKS, FOOTER_LEGAL_LINKS } from "../src/lib/constants.ts";
import { slugifyCyrillic } from "../src/lib/blog-data.ts";
import { readFileSync } from "fs";

async function runTestSuite() {
  console.log("=================================================");
  console.log("🚀 STARTING COMPREHENSIVE BLOG TEST SUITE (PHASE 1)");
  console.log("=================================================\n");

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failedTests++;
    }
  }

  // --- 1. INITIAL DATA VERIFICATION ---
  console.log("1. Checking Initial Seed Posts...");
  const initialPosts = await getBlogPosts({ includeDrafts: true });
  assert(initialPosts.length >= 4, `Expected at least 4 blog posts, got ${initialPosts.length}`);
  const firstPost = initialPosts[0];
  assert(!!firstPost.slug, `Post has valid slug: ${firstPost.slug}`);
  assert(!!firstPost.title, `Post has title: ${firstPost.title}`);
  assert(!!firstPost.content, `Post has rich content: length ${firstPost.content.length}`);
  assert(!!firstPost.category, `Post has category: ${firstPost.category}`);

  // --- 2. ADMIN CREATE ARTICLE LIFECYCLE ---
  console.log("\n2. Testing Admin Create Article...");
  const testArticleData = {
    title: "Тестова статия за проверка на блог системата",
    excerpt: "Кратко резюме на тестовата статия за автоматизирана проверка.",
    content: "### Подзаглавие 1\n\nТова е тестов параграф за проверка.\n\n- Точка 1\n- Точка 2\n\n> Цитат от проверката",
    category: "Съвети за родители",
    author: "Автоматизиран тест",
    readTime: "2 мин четене",
    published: true,
  };

  const createdPost = await saveBlogPost(testArticleData);
  assert(!!createdPost.id, `Created post assigned ID: ${createdPost.id}`);
  assert(
    createdPost.slug === "testova-statiya-za-proverka-na-blog-sistemata",
    `Auto-generated slug matches: ${createdPost.slug}`
  );

  // --- 3. FETCH BY SLUG ---
  console.log("\n3. Testing Fetch Post by Slug...");
  const fetchedPost = await getBlogPostBySlug(createdPost.slug);
  assert(!!fetchedPost, `Found post by slug: ${createdPost.slug}`);
  assert(fetchedPost.title === testArticleData.title, `Title matches original title`);
  assert(fetchedPost.author === "Автоматизиран тест", `Author matches`);

  // --- 4. ADMIN UPDATE & DRAFT TOGGLE ---
  console.log("\n4. Testing Admin Update & Draft Toggle...");
  const updatedPost = await saveBlogPost({
    id: createdPost.id,
    title: "Обновена тестова статия за проверка",
    published: false, // change to draft
  });
  assert(updatedPost.title === "Обновена тестова статия за проверка", `Title updated successfully`);
  assert(updatedPost.published === false, `Status toggled to draft`);

  const publicPosts = await getBlogPosts({ includeDrafts: false });
  assert(
    !publicPosts.some((p) => p.id === createdPost.id),
    `Draft post is correctly excluded from public blog list`
  );

  const adminPosts = await getBlogPosts({ includeDrafts: true });
  assert(
    adminPosts.some((p) => p.id === createdPost.id),
    `Draft post is visible in admin list`
  );

  // Re-publish
  await saveBlogPost({ id: createdPost.id, published: true, title: updatedPost.title });

  // --- 5. COMMENT SYSTEM FLOW ---
  console.log("\n5. Testing Public Comment Submission & Moderation...");
  const testComment = await addBlogComment({
    postSlug: createdPost.slug,
    authorName: "Мария Тестова",
    authorEmail: "maria.test@example.com",
    content: "Това е тестов коментар към статията. Всичко изглежда супер!",
  });
  assert(!!testComment.id, `Comment created with ID: ${testComment.id}`);
  assert(testComment.status === "approved", `Comment status is approved by default`);

  let postComments = await getBlogComments({ postSlug: createdPost.slug });
  assert(
    postComments.some((c) => c.id === testComment.id),
    `Comment is returned in post's comment list`
  );

  // Test moderation: reject
  await moderateBlogComment(testComment.id, "rejected");
  let publicCommentsAfterReject = await getBlogComments({ postSlug: createdPost.slug, includeAll: false });
  assert(
    !publicCommentsAfterReject.some((c) => c.id === testComment.id),
    `Rejected comment is hidden from public view`
  );

  // Test moderation: approve back
  await moderateBlogComment(testComment.id, "approved");
  let publicCommentsAfterApprove = await getBlogComments({ postSlug: createdPost.slug, includeAll: false });
  assert(
    publicCommentsAfterApprove.some((c) => c.id === testComment.id),
    `Approved comment is visible to public`
  );

  // Clean up comment
  await deleteBlogComment(testComment.id);
  let commentsAfterDelete = await getBlogComments({ postSlug: createdPost.slug, includeAll: true });
  assert(
    !commentsAfterDelete.some((c) => c.id === testComment.id),
    `Comment deleted successfully`
  );

  // --- 6. ADMIN DELETE POST ---
  console.log("\n6. Testing Admin Delete Post...");
  const deleteResult = await deleteBlogPost(createdPost.id);
  assert(deleteResult === true, `deleteBlogPost returned true`);
  const checkDeleted = await getBlogPostBySlug(createdPost.slug);
  assert(checkDeleted === null, `Deleted post can no longer be fetched by slug`);

  // --- 7. NAVIGATION & MENU PLACEMENT VERIFICATION ---
  console.log("\n7. Verifying Menu Navigation Placement...");
  const aboutIdx = NAV_LINKS.findIndex((l) => l.label.includes("ЗА НАС"));
  const blogIdx = NAV_LINKS.findIndex((l) => l.label === "БЛОГ");
  const scheduleIdx = NAV_LINKS.findIndex((l) => l.label.includes("ГРАФИК"));

  assert(aboutIdx >= 0, `Found 'ЗА НАС' at index ${aboutIdx}`);
  assert(blogIdx >= 0, `Found 'БЛОГ' at index ${blogIdx}`);
  assert(scheduleIdx >= 0, `Found 'КАЛЕНДАР / ГРАФИК' at index ${scheduleIdx}`);
  assert(
    aboutIdx < blogIdx && blogIdx < scheduleIdx,
    `'БЛОГ' is located strictly between 'ЗА НАС' and 'КАЛЕНДАР / ГРАФИК'! (about=${aboutIdx}, blog=${blogIdx}, schedule=${scheduleIdx})`
  );

  const footerBlogLink = FOOTER_LEGAL_LINKS.find((l) => l.href === "/blog");
  assert(!!footerBlogLink, `Footer includes link to /blog`);

  // --- 8. FILE STRUCTURE & INTEGRATION VERIFICATION ---
  console.log("\n8. Checking Components & Page Integrations...");
  const homePageCode = readFileSync("src/app/page.tsx", "utf-8");
  assert(homePageCode.includes("<HomeBlogSection"), `HomePage renders <HomeBlogSection />`);
  assert(homePageCode.includes("getBlogPosts"), `HomePage fetches getBlogPosts`);

  const adminSidebarCode = readFileSync("src/components/admin/AdminSidebar.tsx", "utf-8");
  assert(adminSidebarCode.includes("/admin/pages/blog"), `AdminSidebar links to /admin/pages/blog`);
  assert(adminSidebarCode.includes("Блог и Статии"), `AdminSidebar has label 'Блог и Статии'`);

  console.log("\n=================================================");
  console.log(`PHASE 1 RESULTS: ${passedTests} passed, ${failedTests} failed.`);
  console.log("=================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }

  // --- 9. "ТЕСТ НА ТЕСТА" (PHASE 2 - DOUBLE VALIDATION & EDGE CASES) ---
  console.log("=================================================");
  console.log("🔍 STARTING PHASE 2: DOUBLE VALIDATION (ТЕСТ НА ТЕСТА)");
  console.log("=================================================\n");

  let phase2Passed = 0;
  let phase2Failed = 0;

  function assert2(condition, message) {
    if (condition) {
      console.log(`  🔎 PASS (VERIFIED): ${message}`);
      phase2Passed++;
    } else {
      console.error(`  ❌ FAIL (EDGE CASE): ${message}`);
      phase2Failed++;
    }
  }

  // Edge case 1: Cyrillic slug transliteration with complex punctuation
  console.log("A. Validating Cyrillic Transliteration & Slugifier...");
  const complexTitle = "Как да отгледаме щастливо & уверено дете (съвети от 1-ви клас)?!";
  const generatedSlug = slugifyCyrillic(complexTitle);
  assert2(
    generatedSlug === "kak-da-otgledame-shtastlivo-uvereno-dete-saveti-ot-1-vi-klas",
    `Slug generated cleanly: ${generatedSlug}`
  );

  // Edge case 2: Duplicate title collision handling
  console.log("\nB. Validating Slug Collision Avoidance...");
  const dup1 = await saveBlogPost({ title: "Статия Дубликат", published: false });
  const dup2 = await saveBlogPost({ title: "Статия Дубликат", published: false });
  assert2(dup1.slug !== dup2.slug, `Duplicate slugs resolved uniquely: '${dup1.slug}' vs '${dup2.slug}'`);
  assert2(dup2.slug.includes("-1"), `Second slug received numeric suffix: ${dup2.slug}`);
  await deleteBlogPost(dup1.id);
  await deleteBlogPost(dup2.id);

  // Edge case 3: Search filter precision
  console.log("\nC. Validating Search & Filtering Engine...");
  const chessPosts = await getBlogPosts({ search: "шах" });
  assert2(chessPosts.length > 0, `Search for 'шах' found ${chessPosts.length} post(s)`);
  assert2(
    chessPosts.every((p) => p.title.toLowerCase().includes("шах") || p.content.toLowerCase().includes("шах")),
    `All returned posts contain the search term`
  );

  const creativePosts = await getBlogPosts({ category: "Творчество" });
  assert2(creativePosts.length > 0, `Category filter 'Творчество' found ${creativePosts.length} post(s)`);
  assert2(
    creativePosts.every((p) => p.category === "Творчество"),
    `All returned posts strictly belong to 'Творчество'`
  );

  // Edge case 4: Post comments counter accuracy
  console.log("\nD. Validating Comments Counter Synchronization...");
  const post1 = await getBlogPostBySlug("kak-da-pomognem-na-deteto-da-uchi-s-zhelanie");
  const post1Comments = await getBlogComments({ postSlug: "kak-da-pomognem-na-deteto-da-uchi-s-zhelanie" });
  assert2(
    post1.commentsCount === post1Comments.length,
    `Post commentsCount (${post1.commentsCount}) exactly matches comments array length (${post1Comments.length})`
  );

  console.log("\n=================================================");
  console.log(`PHASE 2 RESULTS: ${phase2Passed} verified, ${phase2Failed} failed.`);
  console.log("=================================================\n");

  if (phase2Failed > 0) {
    process.exit(1);
  }

  console.log("🎉 ALL TESTS & DOUBLE-TESTS PASSED 100% WITH FLYING COLORS!\n");
}

runTestSuite().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
