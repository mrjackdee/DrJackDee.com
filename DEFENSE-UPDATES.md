# Defense page: how status changes are triggered

All date and status settings live in `defense.config.ts`. Nothing else needs editing.

## Jack's trigger messages

| Jack sends | What changes |
|---|---|
| `Defense date: <date>, time TBA` | `status: "date-set"`, `start` set to the date only (e.g. `2026-11-24`). Page shows the date only; no time line, no countdown. |
| `Defense confirmed: <date> at <time> ET`<br>e.g. `Defense confirmed: Tue Nov 24 at 3:00 PM ET` | `status: "confirmed"` and `start` set to that moment with the correct Eastern offset (`-05:00` EST, `-04:00` EDT). Page shows the date and the live countdown. |
| `Defense moved: <date> at <time> ET` | `start` updated; status stays `"confirmed"`. |
| `Defense date back to Coming Soon` | `status: "pending"`. Page shows "Coming Soon"; no date is published. |
| `Defense passed` | `status: "passed"`. Only on Jack's word, never automatic. |
| `Portrait off` / `Portrait on` | `showPortrait: false` / `true`. |

After the start time passes, the page stops at zero and shows "Defense update coming soon." on its own. No message is needed for that.

## Steps for whoever runs the trigger

1. Edit only `defense.config.ts`. Convert the time Jack gives to an ISO timestamp with offset; the build rejects a timestamp without one.
2. `npm run build` must pass.
3. Commit and push to `main`. Hostinger deploys from the repo; never treat a successful push as done, only the live check in step 4.
4. Verify live at https://drjackdee.com and https://www.drjackdee.com: the served page shows the new date/status (fetch the HTML and check the `<time>` text), and the countdown is ticking.
5. Report to Jack with a screenshot of the live page and the time verified, in ET. If any step fails, report it at once with the fix; do not leave the page half-updated.

Rules: no Zoom link, passcode, or "Join" button unless Jack approves public attendance. No "Dr." in page copy before degree conferral. Do not change domain, DNS, or email routing.
