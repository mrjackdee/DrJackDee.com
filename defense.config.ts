/**
 * ============================================================
 *  DEFENSE PAGE SETTINGS: the only place to edit date and status
 * ============================================================
 *
 *  status
 *    "pending"    Shows "Defense Date and Time: Coming Soon"
 *                 No timer. The start time below is NOT published.
 *    "date-set"   Shows the date only (no time line). No timer.
 *                 start is a date only, e.g. "2026-11-24". After that day
 *                 ends in ET the page shows "Defense update coming soon."
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
  status: "passed" as "pending" | "date-set" | "confirmed" | "passed",

  // Defense passed 11/23/2026, confirmed by Jack.
  // When the time is set: status "confirmed" and a full timestamp with offset,
  // e.g. "2026-11-24T15:00:00-05:00".
  start: "2026-11-23",

  // true shows the portrait beside the quote; false removes it from the page.
  showPortrait: true,

  // true shows the "Leave a Note" guestbook. Notes appear only after Jack approves them.
  guestbook: true,

  // Oral defense video (passed state only): "Watch My Defense" button in the hero
  // plus an in-page player with a poster frame. src "" hides both.
  // The file is served from Hostinger on video.drjackdee.com (DNS only, not proxied by Cloudflare).
  defenseVideo: {
    src: "https://video.drjackdee.com/BeVISIBLE_Defense_2026-11-23.mp4",
    poster: "/defense-slide-1600.jpg",
    length: "25:53",
  },
};
