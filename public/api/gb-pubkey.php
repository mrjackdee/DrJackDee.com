<?php
/** Public verification key for guestbook alert requests (safe to publish). */
declare(strict_types=1);
require __DIR__ . '/gb-lib.php';
header('Content-Type: application/json');
header('Cache-Control: public, max-age=300');
try { echo json_encode(['jwk' => gb_public_jwk()]); }
catch (Throwable $e) { error_log('[guestbook] ' . $e->getMessage()); http_response_code(503); echo '{}'; }
