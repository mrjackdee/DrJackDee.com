<?php
/**
 * Guestbook moderation page. Opened from the link in each notification email.
 * The link carries a token signed with the server-only secret; without it the page is a 404.
 * Actions are POST only, so email link scanners can never approve or hide anything.
 */
declare(strict_types=1);
require __DIR__ . '/gb-lib.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

// Two ways in: the signed link from a notification email, or Jack's private bookmark key
// (only its SHA-256 is stored here). Either one unlocks the same page.
const GB_ADMIN_KEY_SHA256 = '858ef1ae1d7cd664f4d9bde8d3df3e0dc74f864737ff84d348cc77db79ae633d';
$t = (string) ($_GET['t'] ?? $_POST['t'] ?? '');
$k = (string) ($_GET['k'] ?? '');
try {
    $ok = gb_check('admin', $t);
    if (!$ok && $k !== '' && hash_equals(GB_ADMIN_KEY_SHA256, hash('sha256', $k))) { $ok = true; $t = gb_token('admin'); }
} catch (Throwable $e) { $ok = false; error_log('[guestbook] ' . $e->getMessage()); }
if (!$ok) { http_response_code(404); echo 'Not found'; exit; }

$db = gb_db();
$flash = '';
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    if (($_POST['action'] ?? '') === 'names') {
        $on = ($_POST['value'] ?? '') === '1';
        gb_set_setting($db, 'show_names', $on ? '1' : '0');
        $flash = $on ? 'Names are now shown on the page.' : 'Names are now hidden. Only the comments show.';
        header('Location: gb-admin.php?t=' . rawurlencode($t) . '&f=' . rawurlencode($flash), true, 303);
        exit;
    }
    $id = (int) ($_POST['id'] ?? 0);
    if (($_POST['action'] ?? '') === 'delete' && $id > 0 && ($_POST['confirm'] ?? '') === 'yes') {
        // Permanent, by Jack's choice: removes the note and its edit history. Two taps required.
        $db->beginTransaction();
        $db->prepare('DELETE FROM edits WHERE note_id = ?')->execute([$id]);
        $db->prepare('DELETE FROM notes WHERE id = ?')->execute([$id]);
        $db->commit();
        header('Location: gb-admin.php?t=' . rawurlencode($t) . '&f=' . rawurlencode('Deleted permanently.'), true, 303);
        exit;
    }
    if (($_POST['action'] ?? '') === 'edit' && $id > 0) {
        $cur = $db->prepare('SELECT name, relation, message FROM notes WHERE id = ?');
        $cur->execute([$id]);
        if ($old = $cur->fetch(PDO::FETCH_ASSOC)) {
            $new = [
                'name'     => gb_clean((string) ($_POST['name'] ?? ''), 60),
                'relation' => gb_clean((string) ($_POST['relation'] ?? ''), 60),
                'message'  => gb_clean((string) ($_POST['message'] ?? ''), 600, true),
            ];
            if ($new['name'] === '' || $new['message'] === '') {
                $flash = 'Not saved: a note needs a name and a message.';
            } else {
                $log = $db->prepare('INSERT INTO edits (note_id, field, old_value, new_value, edited_at) VALUES (?, ?, ?, ?, ?)');
                $changed = 0;
                foreach ($new as $f => $v) {
                    if ($v !== $old[$f]) { $log->execute([$id, $f, $old[$f], $v, gmdate('c')]); $changed++; }
                }
                if ($changed) {
                    $db->prepare('UPDATE notes SET name = ?, relation = ?, message = ? WHERE id = ?')
                       ->execute([$new['name'], $new['relation'], $new['message'], $id]);
                }
                $flash = $changed ? 'Saved. The original wording is kept on record.' : 'No changes to save.';
            }
        }
        header('Location: gb-admin.php?t=' . rawurlencode($t) . '&f=' . rawurlencode($flash) . '#note-' . $id, true, 303);
        exit;
    }
    $to = ['approve' => 'approved', 'hide' => 'hidden', 'pending' => 'pending'][$_POST['action'] ?? ''] ?? null;
    if ($id > 0 && $to) {
        $q = $db->prepare("UPDATE notes SET status = ?, approved_at = CASE WHEN ? = 'approved' THEN COALESCE(approved_at, ?) ELSE approved_at END WHERE id = ?");
        $q->execute([$to, $to, gmdate('c'), $id]);
        $flash = $to === 'approved' ? 'Approved. It is now on the page.' : ($to === 'hidden' ? 'Hidden. It is not shown and can be restored.' : 'Moved back to pending.');
    }
    header('Location: gb-admin.php?t=' . rawurlencode($t) . '&f=' . rawurlencode($flash) . '#note-' . $id, true, 303);
    exit;
}
$flash = (string) ($_GET['f'] ?? '');

$rows = $db->query("SELECT * FROM notes ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, id DESC")->fetchAll(PDO::FETCH_ASSOC);
$counts = ['pending' => 0, 'approved' => 0, 'hidden' => 0];
foreach ($rows as $r) $counts[$r['status']]++;

function et(string $iso): string {
    $d = new DateTime($iso); $d->setTimezone(new DateTimeZone('America/New_York'));
    return $d->format('M j, Y g:i A') . ' ET';
}
function btn(string $t, int $id, string $action, string $label, string $cls): string {
    return '<form method="post"><input type="hidden" name="t" value="' . gb_h($t) . '"><input type="hidden" name="id" value="' . $id . '">'
         . '<button name="action" value="' . $action . '" class="' . $cls . '">' . $label . '</button></form>';
}
?><!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Guestbook moderation | drjackdee.com</title>
<style>
:root{--navy:#0a192f;--navy2:#112240;--line:#c9d1dc2e;--silver:#c9d1dc;--hi:#eef2f6;--muted:#a9b4c4}
*{box-sizing:border-box;margin:0}body{background:#060f1e;color:var(--hi);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px 16px 60px}
.wrap{max-width:760px;margin:0 auto}h1{font-size:22px;font-weight:600}.sub{color:var(--muted);font-size:14px;margin-top:4px}
.counts{display:flex;gap:10px;margin:18px 0;flex-wrap:wrap}.pill{border:1px solid var(--line);border-radius:999px;padding:6px 14px;font-size:14px;color:var(--silver)}
.flash{background:#14325a;border:1px solid #2c5282;border-radius:6px;padding:10px 14px;margin-bottom:14px}
.note{border:1px solid var(--line);border-radius:8px;background:linear-gradient(#112240d9,#0a192fe6);padding:16px 18px;margin-top:12px}
.note.approved{border-color:#3c7a5a}.note.hidden{opacity:.55}
.meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px;color:var(--muted)}
.who{font-weight:600;color:var(--hi);font-size:15px}.msg{margin-top:8px;white-space:pre-wrap;color:#d9dee6}
.tag{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}.tag.pending{color:#f0c060}.tag.approved{color:#7fd1a4}.tag.hidden{color:var(--muted)}
.actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
button{font:inherit;font-size:14px;font-weight:600;border-radius:4px;padding:9px 16px;cursor:pointer;border:1px solid var(--line)}
.ok{background:linear-gradient(120deg,var(--silver),var(--hi));color:var(--navy);border:0}.ghost{background:transparent;color:var(--silver)}
.empty{color:var(--muted);margin-top:24px}
.badge{display:inline-block;font-size:12px;font-weight:600;border-radius:999px;padding:2px 10px;border:1px solid}.badge-sent{color:#bdf0d2;background:#123d2a;border-color:#2f7a52}.badge-failed{color:#ffd0d0;background:#4a1520;border-color:#a33a4a}
.del{order:9;margin-left:auto}.del summary{cursor:pointer;color:#f2a6a6;font-size:14px;font-weight:600;padding:9px 4px;list-style:none}.del summary::-webkit-details-marker{display:none}
.del form{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px;font-size:13.5px;color:#f2a6a6}
.danger{background:#7a1f2b;color:#fff;border:1px solid #b33a4a}
.actions{align-items:flex-start}
.edited{margin-top:8px;font-size:12.5px;color:var(--muted);font-style:italic}
.edit{margin-top:12px}.edit summary{cursor:pointer;color:var(--silver);font-size:14px;font-weight:600}
.edit form{display:grid;gap:10px;margin-top:10px}.edit label{display:grid;gap:4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600}
.edit input,.edit textarea{font:inherit;font-size:16px;letter-spacing:0;text-transform:none;color:var(--hi);background:#060f1e;border:1px solid var(--line);border-radius:6px;padding:10px 12px;width:100%}
.edit .ok{justify-self:start}
.toggle{display:flex;justify-content:space-between;align-items:center;gap:16px;border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin-top:18px;background:#0a192f}
.sub2{color:var(--muted);font-size:13.5px}
.switch{flex:none;width:56px;height:32px;border-radius:999px;padding:3px;background:#2a3a55;border:1px solid var(--line);position:relative}
.switch span{display:block;width:24px;height:24px;border-radius:50%;background:var(--silver);transition:transform .15s}
.switch.on{background:linear-gradient(120deg,var(--silver),var(--hi))}.switch.on span{transform:translateX(24px);background:var(--navy)}
</style></head><body><div class="wrap">
<h1>Guestbook moderation</h1><p class="sub">drjackdee.com. Only approved notes appear on the page. Nothing is ever deleted; hidden notes can be restored.</p>
<?php $namesOn = gb_setting($db, 'show_names') === '1'; ?>
<form method="post" class="toggle"><input type="hidden" name="t" value="<?= gb_h($t) ?>"><input type="hidden" name="action" value="names"><input type="hidden" name="value" value="<?= $namesOn ? '0' : '1' ?>">
  <span><strong>Show names on the page</strong><br><span class="sub2"><?= $namesOn ? 'On: each note shows the name and how they know you.' : 'Off: the scroll shows the comments only.' ?></span></span>
  <button class="switch <?= $namesOn ? 'on' : '' ?>" role="switch" aria-checked="<?= $namesOn ? 'true' : 'false' ?>" aria-label="Show names on the page"><span></span></button>
</form>
<div class="counts"><span class="pill"><?= $counts['pending'] ?> waiting</span><span class="pill"><?= $counts['approved'] ?> on the page</span><span class="pill"><?= $counts['hidden'] ?> hidden</span></div>
<?php if ($flash !== ''): ?><div class="flash"><?= gb_h($flash) ?></div><?php endif; ?>
<?php if (!$rows): ?><p class="empty">No notes yet.</p><?php endif; ?>
<?php foreach ($rows as $r): $id = (int) $r['id']; ?>
<div class="note <?= gb_h($r['status']) ?>" id="note-<?= $id ?>">
  <div class="meta"><span><span class="who"><?= gb_h($r['name']) ?></span><?= $r['relation'] !== '' ? ' · ' . gb_h($r['relation']) : '' ?></span>
  <span><?php if ($r['ip_hash'] !== 'import'): ?><span class="badge <?= $r['notified'] ? 'badge-sent' : 'badge-failed' ?>"><?= $r['notified'] ? 'Email alert sent' : 'Email alert failed' ?></span> · <?php endif; ?><span class="tag <?= gb_h($r['status']) ?>"><?= gb_h($r['status'] === 'approved' ? 'on page' : $r['status']) ?></span> · <?= gb_h(et($r['created_at'])) ?></span></div>
  <p class="msg"><?= gb_h($r['message']) ?></p>
  <?php $ec = $db->prepare('SELECT COUNT(*) FROM edits WHERE note_id = ?'); $ec->execute([$id]); $edited = (int) $ec->fetchColumn(); ?>
  <?php if ($edited): ?><p class="edited">Edited<?= $edited > 1 ? " ($edited changes)" : '' ?>. Original kept on record.</p><?php endif; ?>
  <details class="edit"><summary>Edit text</summary>
    <form method="post"><input type="hidden" name="t" value="<?= gb_h($t) ?>"><input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="action" value="edit">
      <label>Name<input name="name" maxlength="60" value="<?= gb_h($r['name']) ?>" required></label>
      <label>How they know you<input name="relation" maxlength="60" value="<?= gb_h($r['relation']) ?>"></label>
      <label>Message<textarea name="message" maxlength="600" rows="4" required><?= gb_h($r['message']) ?></textarea></label>
      <button class="ok">Save changes</button>
    </form>
  </details>
  <div class="actions">
    <details class="del"><summary>Delete</summary>
      <form method="post"><input type="hidden" name="t" value="<?= gb_h($t) ?>"><input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="confirm" value="yes">
        <span>This removes the note for good. It cannot be undone.</span><button class="danger">Delete permanently</button>
      </form>
    </details>
    <?php if ($r['status'] !== 'approved') echo btn($t, $id, 'approve', 'Approve', 'ok'); ?>
    <?php if ($r['status'] !== 'hidden') echo btn($t, $id, 'hide', 'Hide', 'ghost'); ?>
    <?php if ($r['status'] === 'hidden') echo btn($t, $id, 'pending', 'Restore to pending', 'ghost'); ?>
  </div>
</div>
<?php endforeach; ?>
</div></body></html>
