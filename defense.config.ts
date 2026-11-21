/**
 * ============================================================
 *  DEFENSE PAGE SETTINGS: the only place to edit date and status
 * ============================================================
 *
 *  status
 *    "pending"    Shows "Defense Date and Time: Coming Soon"
 *                 No timer. The start time below is NOT published.
 *    "confirmed"  Shows the date and time in Eastern Time plus a live
 *                 Days / Hours / Minutes countdown. When the start time
 *                 passes, the timer stops at zero and the page shows
 *                 "Defense update coming soon." automatically.
 *    "passed"     Shows "Defense Passed". Set this by hand, and only
 *                 after the result is confirmed.
 *
 *  start
 *    The scheduled start, written WITH its time-zone offset so every
 *    visitor counts down to the same moment.
 *    Eastern Standard Time (early Nov to mid Mar):  -05:00
 *    Eastern Daylight Time (mid Mar to early Nov):  -04:00
 *    Example: 3:00 p.m. ET on Nov 24, 2026 is "2026-11-24T15:00:00-05:00"
 *
 *  After editing, commit and push. The site rebuilds on deploy.
 *  A typo here fails the build on purpose, so a bad date never goes live.
 */
export const defense = {
  status: "pending" as "pending" | "confirmed" | "passed",

  // Proposed, not confirmed. Stays hidden while status is "pending".
  start: "2026-11-24T15:00:00-05:00",

  // true shows the portrait beside the quote; false removes it from the page.
  showPortrait: true,
};
