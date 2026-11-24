<?php
/**
 * One-time import of guestbook notes Jack collected before launch.
 * Locked by a key held off-repo (only its SHA-256 is here) and it refuses to run
 * a second time. After use it stays in place, inert.
 */
declare(strict_types=1);
require __DIR__ . '/gb-lib.php';

const GB_IMPORT_KEY_SHA256 = 'e05373d063d9f0480855bacdcd41fccafbae3aebe1a3a968a1bcdf065feba084';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(404); echo '{}'; exit; }

$in = json_decode((string) file_get_contents('php://input'), true);
$key = is_array($in) ? (string) ($in['key'] ?? '') : '';
if (!hash_equals(GB_IMPORT_KEY_SHA256, hash('sha256', $key))) { http_response_code(404); echo '{}'; exit; }

$db = gb_db();
if (gb_setting($db, 'import_v1_done') !== '') gb_fail(409, 'Import already done.');

$notes = is_array($in['notes'] ?? null) ? $in['notes'] : [];
if (!$notes || count($notes) > 50) gb_fail(422, 'No notes.');

$db->beginTransaction();
$ins = $db->prepare("INSERT INTO notes (name, relation, message, status, ip_hash, created_at, approved_at, notified)
                     VALUES (?, ?, ?, 'approved', 'import', ?, ?, 1)");
$base = time();
foreach (array_values($notes) as $i => $n) {
    $name = gb_clean((string) ($n['name'] ?? ''), 60);
    $msg  = gb_clean((string) ($n['message'] ?? ''), 600, true);
    if ($name === '' || $msg === '') { $db->rollBack(); gb_fail(422, 'Note ' . ($i + 1) . ' is missing a name or message.'); }
    // First note in the list shows first: give it the latest approval time.
    $t = gmdate('c', $base - $i);
    $ins->execute([$name, gb_clean((string) ($n['relation'] ?? ''), 60), $msg, $t, $t]);
}
gb_set_setting($db, 'import_v1_done', gmdate('c'));
$db->commit();

echo json_encode(['ok' => true, 'imported' => count($notes), 'admin' => gb_admin_url()]);
