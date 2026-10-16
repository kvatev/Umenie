/**
 * Automated end-to-end test script for the Blog functionality
 * Run with: node --env-file=.env.local scripts/test-blog.cjs
 */
const {
  getBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  deleteBlogPost,
  getBlogComments,
  addBlogComment,
  moderateBlogComment,
  deleteBlogComment,
} = require("../src/lib/blog-service.ts");
const { NAV_LINKS, FOOTER_LEGAL_LINKS } = require("../src/lib/constants.ts");
const { slugifyCyrillic } = require("../src/lib/blog-data.ts");

// We will run this via ts-node or a compiled runner
