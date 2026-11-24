<?php
/**
 * drjackdee.com guestbook endpoint.
 *
 *   GET  /api/guestbook.php            approved notes, newest first (JSON)
 *   POST /api/guestbook.php            submit a note; it is stored as "pending"
 *
 * Nothing shows publicly until Jack approves it from the link in the
 * notification email (or the moderation page). Notes are never deleted:
 * "hide" only changes their status, so every note can be restored.
 *
 * Data lives OUTSIDE public_html (domains/drjackdee.com/guestbook-data/), so
 * deploys never touch it and it can never be downloaded from the web.
 */
declare(strict_types=1);
require __DIR__ . '/gb-lib.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

try {
    $db = gb_db();
} catch (Throwable $e) {
    gb_fail(503, 'The guestbook is unavailable right now. Please try again later.', $e);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    header('Cache-Control: no-cache');
    // With names switched off, names never leave the server: the page gets the comments only.
    $showNames = gb_setting($db, 'show_names') === '1';
    $cols = $showNames ? 'name, relation, message' : 'message';
    $rows = $db->query("SELECT $cols FROM notes
                        WHERE status = 'approved' ORDER BY approved_at DESC, id DESC LIMIT 120")
               ->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['show_names' => $showNames, 'notes' => $rows], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method !== 'POST') gb_fail(405, 'Method not allowed.');
header('Cache-Control: no-store');

$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) gb_fail(400, 'Please fill in your name and message.');

// Bot traps: a hidden field people never see, and a minimum time on the form.
if (trim((string) ($in['website'] ?? '')) !== '') gb_ok_silently();
$elapsed = (int) ($in['elapsed'] ?? 0);
if ($elapsed > 0 && $elapsed < 2500) gb_ok_silently();

$name     = gb_clean((string) ($in['name'] ?? ''), 60);
$relation = gb_clean((string) ($in['relation'] ?? ''), 60);
$message  = gb_clean((string) ($in['message'] ?? ''), 600, true);

if ($name === '' || $message === '') gb_fail(422, 'Please add your name and a message.');
if (preg_match_all('~https?://|www\.~i', $message) > 1) gb_fail(422, 'Please leave out links.');

// Rate limit: 3 notes per visitor per hour. The address is stored only as a salted hash.
$ipHash = hash_hmac('sha256', gb_client_ip(), gb_secret());
$recent = $db->prepare("SELECT COUNT(*) FROM notes WHERE ip_hash = ? AND created_at > ?");
$recent->execute([$ipHash, gmdate('c', time() - 3600)]);
if ((int) $recent->fetchColumn() >= 3) gb_fail(429, 'Thank you! You have shared a few notes already. Please try again later.');

$ins = $db->prepare("INSERT INTO notes (name, relation, message, status, ip_hash, created_at)
                     VALUES (?, ?, ?, 'pending', ?, ?)");
$ins->execute([$name, $relation, $message, $ipHash, gmdate('c')]);
$id = (int) $db->lastInsertId();

gb_notify($id, $name, $relation, $message);

http_response_code(201);
echo json_encode(['ok' => true, 'message' => 'Thank you! Your note will appear once it has been reviewed.']);
