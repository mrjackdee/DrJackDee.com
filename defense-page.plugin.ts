/**
 * Build step for the defense announcement page.
 * Reads defense.config.ts and writes the date/status into index.html as
 * plain HTML, so the confirmed date is visible even with JavaScript off.
 * Edit defense.config.ts, not this file.
 */
import type { Plugin } from 'vite';
import { defense } from './defense.config';

const STATUSES = ['pending', 'confirmed', 'passed'] as const;
type Status = (typeof STATUSES)[number];
const OFFSET_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/;

function fail(msg: string): never {
  throw new Error(`[defense.config.ts] ${msg}`);
}

function validate(): { status: Status; start?: Date; iso?: string } {
  const status = defense.status as Status;
  if (!STATUSES.includes(status)) {
    fail(`status must be one of ${STATUSES.join(', ')}; got "${defense.status}"`);
  }
  if (status === 'pending') return { status }; // start is never published while pending
  const iso = String(defense.start || '').trim();
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
function dateET(d: Date) {
  const p = partsET(d, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return `${p.weekday}, ${p.month} ${p.day}, ${p.year}`;
}

/** "3:00 p.m. ET" */
function timeET(d: Date) {
  const p = partsET(d, { hour: 'numeric', minute: '2-digit', hour12: true });
  const period = (p.dayPeriod || '').toUpperCase() === 'AM' ? 'a.m.' : 'p.m.';
  return `${p.hour}:${p.minute}\u00a0${period}\u00a0ET`;
}

function statusBlock(v: ReturnType<typeof validate>): string {
  if (v.status === 'pending') {
    return `<p class="status-kicker">Defense Date and Time</p>
        <p class="status-line">To Be Announced</p>`;
  }
  const when = `${dateET(v.start!)} at\u00a0${timeET(v.start!)}`;
  if (v.status === 'passed') {
    return `<p class="status-kicker">Defense Passed</p>
        <p class="status-line"><time datetime="${v.iso}">${dateET(v.start!)}</time></p>`;
  }
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
            <figcaption><span class="name">Jack Darnell Givens</span><span class="candidacy">Doctor of Business Administration Candidate</span><span class="creds">M.EdTech<span class="sep"> · </span>MBA-PM<span class="sep"> · </span>PMP<span class="sep"> · </span>LSSBB</span></figcaption>
          </figure>`
        : '';
      return html
        .replace('<!--DEFENSE_PORTRAIT-->', portrait)
        // Name sits under the portrait; without a portrait it returns to the hero.
        .replace('<!--HERO_NAME-->', defense.showPortrait ? '' : '<p class="name">Jack Darnell Givens</p><p class="candidacy">Doctor of Business Administration Candidate</p><p class="creds">M.EdTech<span class="sep"> · </span>MBA-PM<span class="sep"> · </span>PMP<span class="sep"> · </span>LSSBB</p>')
        .replace('%DEFENSE_LAYOUT%', defense.showPortrait ? 'with-portrait' : 'no-portrait')
        .replace('<!--DEFENSE_STATUS-->', statusBlock(v))
        .replace('%DEFENSE_STATE%', v.status)
        .replace('%DEFENSE_START%', v.status === 'confirmed' ? v.iso! : '');
    },
  };
}
