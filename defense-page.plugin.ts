/**
 * Build step for the defense announcement page.
 * Reads defense.config.ts and writes the date/status into index.html as
 * plain HTML, so the confirmed date is visible even with JavaScript off.
 * Edit defense.config.ts, not this file.
 */
import type { Plugin } from 'vite';
import { defense } from './defense.config';

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
    return `<p class="status-kicker">Defense Passed</p>
        <p class="status-line"><time datetime="${v.iso}">${dateET(v.start!, v.dateOnly)}</time></p>`;
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

export function defensePage(): Plugin {
  return {
    name: 'defense-page',
    transformIndexHtml(html) {
      if (!html.includes('<!--DEFENSE_STATUS-->')) return html;
      const v = validate();
      if (typeof defense.showPortrait !== 'boolean') fail('showPortrait must be true or false');
      const portrait = defense.showPortrait
        ? `<figure class="portrait">
            <picture>
              <source type="image/webp" srcset="/portrait-jdg-480.webp 480w, /portrait-jdg-960.webp 960w" sizes="(max-width: 640px) 200px, 260px" />
              <img src="/portrait-jdg-480.jpg" srcset="/portrait-jdg-480.jpg 480w, /portrait-jdg-960.jpg 960w" sizes="(max-width: 640px) 200px, 260px"
                   width="480" height="600" loading="lazy" decoding="async"
                   alt="Jack Darnell Givens in academic regalia, smiling, with the Dallas skyline at dusk behind him." />
            </picture>
            <figcaption><span class="name">Jack Darnell Givens</span><span class="candidacy">Doctor of Business Administration Candidate</span><span class="school"><span class="school-name">William Howard Taft</span><span class="school-sub">University</span><span class="school-college">Deming School of Business</span></span></figcaption>
          </figure>`
        : '';
      return html
        .replace('<!--DEFENSE_PORTRAIT-->', portrait)
        // Name sits under the portrait; without a portrait it returns to the hero.
        .replace('<!--HERO_NAME-->', defense.showPortrait ? '' : '<p class="name">Jack Darnell Givens</p><p class="candidacy">Doctor of Business Administration Candidate</p><p class="school"><span class="school-name">William Howard Taft</span><span class="school-sub">University</span><span class="school-college">Deming School of Business</span></p>')
        .replace('%DEFENSE_LAYOUT%', defense.showPortrait ? 'with-portrait' : 'no-portrait')
        .replace('<!--DEFENSE_STATUS-->', statusBlock(v))
        .replace('%DEFENSE_STATE%', v.status)
        .replace('%DEFENSE_START%', v.status === 'confirmed' ? v.iso! : v.status === 'date-set' ? endOfDayET(v.iso!) : '');
    },
  };
}
