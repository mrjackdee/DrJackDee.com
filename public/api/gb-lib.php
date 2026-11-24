<?php
/** Shared helpers for the guestbook. Not an endpoint. */
declare(strict_types=1);
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'gb-lib.php') { http_response_code(404); exit; }

const GB_NOTIFY_TO   = 'jackdee.sync@gmail.com';
const GB_SITE        = 'https://drjackdee.com';

/** domains/drjackdee.com/guestbook-data, beside public_html (never deployed over, never web-served). */
function gb_data_dir(): string {
    $dir = getenv('GB_DATA_DIR') ?: dirname(__DIR__, 2) . '/guestbook-data';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('cannot create data dir');
    }
    return $dir;
}

function gb_db(): PDO {
    $db = new PDO('sqlite:' . gb_data_dir() . '/guestbook.sqlite', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $db->exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 3000;');
    $db->exec("CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        relation TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','hidden')),
        ip_hash TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        approved_at TEXT,
        notified INTEGER NOT NULL DEFAULT 0
    )");
    $db->exec('CREATE INDEX IF NOT EXISTS notes_status ON notes (status, approved_at)');
    $db->exec("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    // Every correction is logged with the original wording, so nothing is ever lost.
    $db->exec("CREATE TABLE IF NOT EXISTS edits (
        id INTEGER PRIMARY KEY AUTOINCREMENT, note_id INTEGER NOT NULL, field TEXT NOT NULL,
        old_value TEXT NOT NULL, new_value TEXT NOT NULL, edited_at TEXT NOT NULL)");
    return $db;
}

/** Display switches Jack controls from the moderation page. Names are off by default. */
const GB_DEFAULTS = ['show_names' => '0'];

function gb_setting(PDO $db, string $key): string {
    $q = $db->prepare('SELECT value FROM settings WHERE key = ?');
    $q->execute([$key]);
    $v = $q->fetchColumn();
    return $v === false ? (GB_DEFAULTS[$key] ?? '') : (string) $v;
}

function gb_set_setting(PDO $db, string $key, string $value): void {
    $db->prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
       ->execute([$key, $value]);
}

/** Random secret created once on the server; signs moderation links. Never in the repo. */
function gb_secret(): string {
    static $s = null;
    if ($s !== null) return $s;
    $f = gb_data_dir() . '/secret.key';
    if (!is_file($f)) {
        $fh = fopen($f, 'x');
        if ($fh) { fwrite($fh, bin2hex(random_bytes(32))); fclose($fh); chmod($f, 0600); }
    }
    $s = trim((string) file_get_contents($f));
    if (strlen($s) < 64) throw new RuntimeException('bad secret');
    return $s;
}

function gb_token(string $scope): string {
    return substr(hash_hmac('sha256', $scope, gb_secret()), 0, 40);
}

function gb_check(string $scope, string $token): bool {
    return $token !== '' && hash_equals(gb_token($scope), $token);
}

function gb_admin_url(): string { return GB_SITE . '/api/gb-admin.php?t=' . gb_token('admin'); }

function gb_clean(string $s, int $max, bool $multiline = false): string {
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    // Remove control characters and invisible bidi overrides, but keep the zero-width
    // joiner (U+200D) and variation selectors so emoji like 👩🏽‍🎓 stay in one piece.
    $s = preg_replace($multiline ? '/[^\P{Cc}\n]+/u' : '/\p{Cc}+/u', '', $s) ?? '';
    $s = preg_replace('/[\x{200B}\x{200C}\x{200E}\x{200F}\x{202A}-\x{202E}\x{2066}-\x{2069}\x{FEFF}]+/u', '', $s) ?? '';
    $s = trim(preg_replace('/\n{3,}/', "\n\n", $s) ?? '');
    return mb_substr($s, 0, $max);
}

function gb_client_ip(): string {
    return $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function gb_fail(int $code, string $msg, ?Throwable $e = null): never {
    if ($e) error_log('[guestbook] ' . $e->getMessage());
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

/** Bots get a normal-looking success so they do not retry; nothing is stored. */
function gb_ok_silently(): never {
    http_response_code(201);
    echo json_encode(['ok' => true, 'message' => 'Thank you! Your note will appear once it has been reviewed.']);
    exit;
}

function gb_h(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** Email Jack that a note is waiting. Failure is logged, never shown to the visitor. */
function gb_notify(int $id, string $name, string $relation, string $message): void {
    $review = GB_SITE . '/api/gb-admin.php?t=' . gb_token('admin') . '#note-' . $id;
    $rel = $relation !== '' ? ' (' . gb_h($relation) . ')' : '';
    $html = '<!doctype html><html><body style="margin:0;background:#F5F1E8;font-family:Arial,Helvetica,sans-serif">'
      . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1E8;padding:24px 12px"><tr><td align="center">'
      . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden">'
      . '<tr><td style="background:#0A192F;padding:20px 24px;color:#B99550;font-size:13px;letter-spacing:2px;text-transform:uppercase">drjackdee.com guestbook</td></tr>'
      . '<tr><td style="padding:24px;color:#0A192F;font-size:16px;line-height:1.55">'
      . '<p style="margin:0 0 12px"><strong>' . gb_h($name) . '</strong>' . $rel . ' left a note:</p>'
      . '<p style="margin:0 0 20px;padding:14px 16px;background:#F5F1E8;border-left:3px solid #B99550;white-space:pre-wrap">' . gb_h($message) . '</p>'
      . '<p style="margin:0 0 8px"><a href="' . gb_h($review) . '" style="display:inline-block;background:#0A192F;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:4px;font-weight:bold">Review and approve</a></p>'
      . '<p style="margin:16px 0 0;font-size:13px;color:#555">It stays hidden until you approve it. Keep this email private: the button opens your moderation page.</p>'
      . '</td></tr></table></td></tr></table></body></html>';
    $headers = implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: drjackdee.com Guestbook <guestbook@drjackdee.com>',
        'Reply-To: ' . GB_NOTIFY_TO,
    ]);
    $subject = '=?UTF-8?B?' . base64_encode('New guestbook note from ' . $name) . '?=';
    try {
        // Envelope sender on drjackdee.com, so receivers check it against the domain's SPF record
        // (which authorizes Hostinger's mail servers alongside Cloudflare forwarding).
        $sent = mail(GB_NOTIFY_TO, $subject, $html, $headers, '-fguestbook@drjackdee.com');
        if ($sent) gb_db()->prepare('UPDATE notes SET notified = 1 WHERE id = ?')->execute([$id]);
        else error_log('[guestbook] notify mail() returned false for note ' . $id);
    } catch (Throwable $e) {
        error_log('[guestbook] notify failed: ' . $e->getMessage());
    }
}
