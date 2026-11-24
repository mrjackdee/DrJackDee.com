/**
 * Build step for the defense announcement page.
 * Reads defense.config.ts and writes the date/status into index.html as
 * plain HTML, so the confirmed date is visible even with JavaScript off.
 * Edit defense.config.ts, not this file.
 */
import type { Plugin } from 'vite';
import { defense } from './defense.config';

// Oral defense video (passed state). Settings come from defense.config.ts.
type DefenseVideo = { src?: string; poster?: string; length?: string };
function video(): Required<DefenseVideo> | null {
  const v = (defense as { defenseVideo?: DefenseVideo }).defenseVideo ?? {};
  const src = String(process.env.DEFENSE_VIDEO_SRC ?? v.src ?? '').trim();
  if (!src) return null;
  if (!/^(https:\/\/[\w.-]+)?\/[\w./-]+\.mp4$/.test(src)) fail('defenseVideo.src must be an https .mp4 address');
  return { src, poster: v.poster || '/defense-slide-1600.jpg', length: v.length || '' };
}
function PLAYER(): string {
  const v = video();
  if (!v) return '';
  const webp = v.poster.replace(/\.jpg$/, '.webp');
  return `<section class="player-sec" id="defense-video" aria-label="Oral defense video">
          <div class="player" data-player>
            <video preload="none" playsinline poster="${v.poster}" width="1600" height="1000" aria-label="Oral defense of Jack Dee, November 23, 2026">
              <source src="${v.src}" type="video/mp4" />
              <a href="${v.src}">Download the oral defense video</a>
            </video>
            <button class="player-play" type="button" data-play-video aria-label="Play the oral defense video${v.length ? `, ${v.length}` : ''}">
              <picture class="player-poster" aria-hidden="true"><source srcset="${webp}" type="image/webp" /><img src="${v.poster}" alt="" width="1600" height="1000" decoding="async" /></picture>
              <span class="player-btn" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M8.5 5.8v12.4L18.5 12z" fill="currentColor"/></svg>Play${v.length ? `<span class="player-len">${v.length}</span>` : ''}</span>
            </button>
          </div>
          <p class="player-meta">Oral Defense Overview<span class="sep"> · </span>25min<span class="sep"> · </span><a href="${v.src}" target="_blank" rel="noopener noreferrer">Open in a new tab<span class="sr-only"> (opens in a new tab)</span></a></p>
          <p class="player-note">A condensed recording that captures the key moments of my oral defense.</p>
        </section>
        `;
}

const STATUSES = ['pending', 'date-set', 'confirmed', 'passed'] as const;
type Status = (typeof STATUSES)[number];
const OFFSET_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(msg: string): never {
  throw new Error(`[defense.config.ts] ${msg}`);
}

function validate(): { status: Status; start?: Date; iso?: string; dateOnly?: boolean } {
  const status = defense.status as Status;
  if (!STATUSES.includes(status)) {
    fail(`status must be one of ${STATUSES.join(', ')}; got "${defense.status}"`);
  }
  if (status === 'pending') return { status }; // start is never published while pending
  const iso = String(defense.start || '').trim();
  // A bare date (no time) is allowed for "date-set", and for "passed" after a date-only schedule.
  if (DATE_RE.test(iso) && (status === 'date-set' || status === 'passed')) {
    const noonUTC = new Date(`${iso}T12:00:00Z`);
    if (Number.isNaN(noonUTC.getTime()) || noonUTC.toISOString().slice(0, 10) !== iso) fail(`start is not a real date: "${iso}"`);
    return { status, start: noonUTC, iso, dateOnly: true };
  }
  if (status === 'date-set') fail(`for "date-set", start must be a date only, e.g. 2026-11-24; got "${iso}"`);
  if (!OFFSET_RE.test(iso)) {
    fail(`start must include a time-zone offset, e.g. 2026-11-24T15:00:00-05:00; got "${iso}"`);
  }
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) fail(`start is not a real date: "${iso}"`);
  return { status, start, iso };
}

function partsET(d: Date, opts: Intl.DateTimeFormatOptions) {
  const out: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...opts }).formatToParts(d)) {
    out[p.type] = p.value;
  }
  return out;
}

/** "Tuesday, November 24, 2026" */
function dateET(d: Date, dateOnly = false) {
  const p = dateOnly
    ? Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).formatToParts(d).map((x) => [x.type, x.value]))
    : partsET(d, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return `${p.weekday}, ${p.month} ${p.day}, ${p.year}`;
}

/** "11/23/2026" from a date-only "2026-11-23" (or the ET calendar day of a full timestamp) */
function dateNumeric(iso: string, d: Date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (m) return `${m[2]}/${m[3]}/${m[1]}`;
  const p = partsET(d, { month: '2-digit', day: '2-digit', year: 'numeric' });
  return `${p.month}/${p.day}/${p.year}`;
}

/** "3:00 p.m. ET" */
function timeET(d: Date) {
  const p = partsET(d, { hour: 'numeric', minute: '2-digit', hour12: true });
  const period = (p.dayPeriod || '').toUpperCase() === 'AM' ? 'a.m.' : 'p.m.';
  return `${p.hour}:${p.minute}\u00a0${period}\u00a0ET`;
}


/** Midnight ET at the end of a YYYY-MM-DD date, with its real EST/EDT offset. */
function endOfDayET(day: string) {
  const next = new Date(`${day}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDay = next.toISOString().slice(0, 10);
  const off = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' })
    .formatToParts(next).find((x) => x.type === 'timeZoneName')!.value.replace('GMT', '') || '+00:00';
  return `${nextDay}T00:00:00${off}`;
}

function statusBlock(v: ReturnType<typeof validate>): string {
  if (v.status === 'pending') {
    return `<p class="status-kicker">Defense Date and Time</p>
        <p class="status-line">Coming Soon</p>`;
  }
  if (v.status === 'passed') {
    // The PASSED stamp carries the result visually; this line keeps it for screen readers.
    return `<p class="sr-only">Oral defense passed, <time datetime="${v.iso}">${dateNumeric(v.iso!, v.start!)}</time></p>`;
  }
  if (v.status === 'date-set') {
    return `<p class="status-kicker" id="status-kicker">Defense Date</p>
        <p class="status-line"><time datetime="${v.iso}">${dateET(v.start!, true)}</time></p>`;
  }
  const when = `${dateET(v.start!)} at\u00a0${timeET(v.start!)}`;
  // confirmed: date is static HTML; the timer is enhanced by JavaScript
  return `<p class="status-kicker" id="status-kicker">Scheduled</p>
        <p class="status-line"><time datetime="${v.iso}">${when}</time></p>
        <div class="countdown" id="countdown" role="timer" aria-live="off" aria-label="Time remaining until the defense begins" hidden>
          <div class="unit"><span class="num" data-unit="d">00</span><span class="lbl">Days</span></div>
          <div class="unit"><span class="num" data-unit="h">00</span><span class="lbl">Hours</span></div>
          <div class="unit"><span class="num" data-unit="m">00</span><span class="lbl">Minutes</span></div>
        </div>`;
}

const GUESTBOOK = `<section class="gb" id="guestbook" aria-labelledby="gb-title">
      <div class="wrap">
        <h2 class="gb-kicker" id="gb-title">Leave a Note</h2>
        <p class="gb-sub">Share a congratulations or a remark. Notes appear here once approved.</p>
        <form class="gb-form" id="gb-form" novalidate>
          <div class="gb-row">
            <div><label for="gb-name">Name</label><input id="gb-name" name="name" maxlength="60" autocomplete="name" placeholder="Your name" required /></div>
            <div><label for="gb-rel">How you know Jack Dee <span class="gb-opt">(optional)</span></label><input id="gb-rel" name="relation" maxlength="60" placeholder="Colleague, family, classmate" /></div>
          </div>
          <div><label for="gb-msg">Message</label><textarea id="gb-msg" name="message" maxlength="600" placeholder="Write your note" required></textarea></div>
          <div class="gb-hp" aria-hidden="true"><label for="gb-web">Website</label><input id="gb-web" name="website" tabindex="-1" autocomplete="off" /></div>
          <div class="gb-foot"><span class="gb-note" id="gb-status" role="status" aria-live="polite">Reviewed before posting.</span><button class="cta" type="submit" id="gb-submit">Sign the Guestbook</button></div>
        </form>
      </div>
      <div class="gb-wall" id="gb-wall" aria-label="Notes from visitors" hidden></div>
    </section>`;

const NAV = (guestbook: boolean) => `<nav class="topnav" id="topnav" aria-label="Site">
      <div class="topnav-in">
        <a class="brand" href="https://mrjackdee.com" aria-label="DrJackDee.com: visit MrJackDee.com">
          <svg class="nav-seal seal" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="svn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9D1DC"/><stop offset=".5" stop-color="#EEF2F6"/><stop offset="1" stop-color="#8F9BAD"/></linearGradient>
              <path id="arcn" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/>
            </defs>
            <circle cx="50" cy="50" r="47" fill="none" stroke="url(#svn)" stroke-width="2"/>
            <g class="ring"><text font-family="IBM Plex Sans, sans-serif" font-size="7" font-weight="500" letter-spacing="2.4" fill="#A9B4C4"><textPath href="#arcn">RESEARCH · STRATEGY · TRANSFORMATION · </textPath></text></g>
            <circle cx="50" cy="50" r="28" fill="none" stroke="url(#svn)" stroke-width="1.4"/>
            <text x="50" y="57" text-anchor="middle" font-family="Michroma, Oxanium, sans-serif" font-size="19" fill="url(#svn)">JD</text>
          </svg>
          <span class="brand-name">DrJackDee.com</span>
        </a>
        <div class="topnav-links">
          ${guestbook ? '<a class="nav-link nav-note" href="#guestbook"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M14.5 7.5l2 2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>Leave a Note</a>' : ''}
          <a class="nav-link nav-pill nav-bv" href="https://bevisible.work" aria-label="Research: visit BeVISIBLE.work">
            <span class="nav-bv-seal" aria-hidden="true"><img class="bv-ring" src="/bv-ring-208.webp" alt="" width="30" height="30" decoding="async"/><img src="/bv-center-208.webp" alt="" width="30" height="30" decoding="async"/></span>
            Research
          </a>
        </div>
      </div>
    </nav>`;

/** "PASSED" stamp shown above the result. Ink: 'silver' matches the site; 'green' is the classic stamp. */
const STAMP_INK: 'silver' | 'green' = (process.env.STAMP_INK as 'silver' | 'green') || 'silver';
const STAMP = () => {
  const ink = STAMP_INK === 'green' ? ['#2FA35A', '#5FD08A'] : ['#C9D1DC', '#EEF2F6'];
  return `<svg class="stamp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" aria-hidden="true" focusable="false">
  <defs>
    <filter id="grit-s" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.75" result="mask"/>
      <feComposite in="SourceGraphic" in2="mask" operator="in" result="g"/>
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3" result="w"/>
      <feDisplacementMap in="g" in2="w" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <linearGradient id="ink-s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ink[0]}"/><stop offset=".55" stop-color="${ink[1]}"/><stop offset="1" stop-color="${ink[0]}"/></linearGradient>
    <path id="top-s" d="M42,120 a78,78 0 0,1 156,0"/>
    <path id="bot-s" d="M34,120 a86,86 0 0,0 172,0"/>
  </defs>
  <g filter="url(#grit-s)" fill="none" stroke="url(#ink-s)">
    <circle cx="120" cy="120" r="112" stroke-width="6"/>
    <circle cx="120" cy="120" r="101" stroke-width="2"/>
    <circle cx="120" cy="120" r="66" stroke-width="2"/>
    <g fill="url(#ink-s)" stroke="none" font-family="Michroma, Oxanium, sans-serif">
      <text font-size="12.5" letter-spacing="3.2" text-anchor="middle"><textPath href="#top-s" startOffset="50%">ORAL DEFENSE</textPath></text>
      <text font-size="11.5" letter-spacing="3" text-anchor="middle" dy="4"><textPath href="#bot-s" startOffset="50%">11 · 23 · 2026</textPath></text>
      <circle cx="31" cy="120" r="3"/><circle cx="209" cy="120" r="3"/>
    </g>
    <path d="M92 96 l20 20 l40 -44" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="18" y="122" width="204" height="44" rx="4" fill="#0a192f" stroke-width="4"/>
    <text x="120" y="155" text-anchor="middle" font-family="Michroma, Oxanium, sans-serif" font-size="27" letter-spacing="5" fill="url(#ink-s)" stroke="none">PASSED</text>
  </g>
</svg>`;
};

const SCHOOL = '<span class="school"><span class="school-name">William Howard Taft</span><span class="school-sub">University</span><span class="school-college">Deming School of Business</span></span>';

export function defensePage(): Plugin {
  return {
    name: 'defense-page',
    transformIndexHtml(html) {
      if (!html.includes('<!--DEFENSE_STATUS-->')) return html;
      const v = validate();
      // After a pass the caption drops "Candidate"; "Dr." stays off until conferral.
      const role = v.status === 'passed' ? 'Doctor of Business Administration' : 'Doctor of Business Administration Candidate';
      const tagline = v.status === 'passed' ? 'Doctor of Business Administration' : 'Doctoral Candidate';
      if (typeof defense.showPortrait !== 'boolean') fail('showPortrait must be true or false');
      const portrait = defense.showPortrait
        ? `<figure class="portrait">
            <picture>
              <source type="image/webp" srcset="/portrait-jdg-480.webp?v=3bars 480w, /portrait-jdg-960.webp?v=3bars 960w" sizes="(max-width: 640px) 200px, 260px" />
              <img src="/portrait-jdg-480.jpg?v=3bars" srcset="/portrait-jdg-480.jpg?v=3bars 480w, /portrait-jdg-960.jpg?v=3bars 960w" sizes="(max-width: 640px) 200px, 260px"
                   width="480" height="600" loading="lazy" decoding="async"
                   alt="Jack Darnell Givens in academic regalia, smiling, with the Dallas skyline at dusk behind him." />
            </picture>
            <figcaption><span class="name">Jack Darnell Givens</span><span class="candidacy">${role}</span><span class="concentration">Organizational Leadership &amp; Strategy</span>${v.status === 'passed' ? '' : SCHOOL}</figcaption>
          </figure>`
        : '';
      const out = html
        .replace('<!--GUESTBOOK-->', (defense as { guestbook?: boolean }).guestbook ? GUESTBOOK : '')
        .replace('<!--SITE_NAV-->', NAV(Boolean((defense as { guestbook?: boolean }).guestbook)))
        .replaceAll('Doctoral Candidate', tagline)
        .replace('<!--DEFENSE_PORTRAIT-->', portrait)
        // Name sits under the portrait; without a portrait it returns to the hero.
        .replace('<!--HERO_NAME-->', defense.showPortrait ? '' : `<p class="name">Jack Darnell Givens</p><p class="candidacy">${role}</p><p class="concentration">Organizational Leadership &amp; Strategy</p><p class="school"><span class="school-name">William Howard Taft</span><span class="school-sub">University</span><span class="school-college">Deming School of Business</span></p>`)
        .replace('%DEFENSE_LAYOUT%', defense.showPortrait ? 'with-portrait' : 'no-portrait')
        .replace('<!--DEFENSE_STATUS-->', statusBlock(v))
        .replace('%DEFENSE_STATE%', v.status)
        .replace('%DEFENSE_START%', v.status === 'confirmed' ? v.iso! : v.status === 'date-set' ? endOfDayET(v.iso!) : '');
      if (v.status !== 'passed') return out;
      // Passed: the result replaces the hero badge, and the lower status block is removed.
      const section = /\s*<!-- Date and status[^>]*-->\s*<section class="status" id="defense"[\s\S]*?<\/section>/;
      if (!section.test(out) || !out.includes('<p class="eyebrow">FINAL DEFENSE ANNOUNCEMENT</p>') || !out.includes('<h1 class="study">')) fail('passed layout: template markers not found');
      return out
        .replace(section, '')
        // Passed: open with the result, then the dissertation title, labeled.
        .replace('<p class="eyebrow">FINAL DEFENSE ANNOUNCEMENT</p>', '')
        .replace('<div class="quote-col">', '<div class="quote-col">' + PLAYER())
        .replace('<h1 class="study">',
          `<section class="status status--hero" id="defense" data-state="passed" aria-label="Defense result"><div class="hero-seal">${STAMP()}<span class="hero-rule" aria-hidden="true"></span><span class="school school--hero"><span class="school-name">William Howard Taft</span><span class="school-sub">University</span><span class="school-college">Deming School of Business</span></span></div>${statusBlock(v)}</section>
        <h1 class="study study--labeled"><span class="study-label">Title</span>`);
    },
  };
}
