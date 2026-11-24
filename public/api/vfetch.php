<?php
// One-time copy of the oral defense video from Google Drive to video.drjackdee.com.
// Locked by a token hash, runs once, then refuses. Removed from the repo after use.
declare(strict_types=1);
header('Content-Type: application/json');
header('Cache-Control: no-store');
const TOKEN_SHA256 = '3b7e79762e0855165a697862b638870d4cb2cb3df178c97f1c4e766d435cc80f';
const DRIVE_ID = '12HtvwFxckFYS-7ZEko4J-QJtsDHN4U3d';
const NAME = 'BeVISIBLE_Defense_2026-11-23.mp4';
const EXPECT_BYTES = 82451117;

function out(int $code, array $body): void { http_response_code($code); echo json_encode($body); exit; }

$t = (string)($_GET['t'] ?? '');
if ($t === '' || !hash_equals(TOKEN_SHA256, hash('sha256', $t))) out(404, ['ok' => false]);

$dir = dirname(__DIR__, 3) . '/video.drjackdee.com/public_html';
if (!is_dir($dir)) out(500, ['ok' => false, 'error' => 'target folder missing', 'dir' => $dir]);
$dest = $dir . '/' . NAME;
$lock = $dir . '/.vfetch-done';
if (is_file($lock)) out(409, ['ok' => false, 'error' => 'already copied', 'bytes' => @filesize($dest)]);

@set_time_limit(900);
$tmp = $dest . '.part';
$fh = fopen($tmp, 'wb');
$ch = curl_init('https://drive.usercontent.google.com/download?id=' . DRIVE_ID . '&export=download&confirm=t');
curl_setopt_array($ch, [CURLOPT_FILE => $fh, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 5,
  CURLOPT_CONNECTTIMEOUT => 20, CURLOPT_TIMEOUT => 840, CURLOPT_FAILONERROR => true,
  CURLOPT_USERAGENT => 'drjackdee-video-copy/1.0']);
$ok = curl_exec($ch);
$err = curl_error($ch);
$type = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);
fclose($fh);
$bytes = @filesize($tmp) ?: 0;
if (!$ok || $bytes !== EXPECT_BYTES) {
  $head = substr((string)@file_get_contents($tmp, false, null, 0, 300), 0, 300);
  @unlink($tmp);
  out(502, ['ok' => false, 'error' => $err ?: 'size mismatch', 'bytes' => $bytes, 'type' => $type, 'head' => preg_replace('/[^\x20-\x7E]/', '.', $head)]);
}
// Top-level MP4 atoms, to confirm a real MP4 and whether it streams before fully loaded.
$atoms = []; $f = fopen($tmp, 'rb'); $pos = 0;
while ($pos < $bytes && count($atoms) < 12) {
  fseek($f, $pos); $h = fread($f, 16); if (strlen($h) < 8) break;
  $size = unpack('N', substr($h, 0, 4))[1]; $name = substr($h, 4, 4);
  if ($size === 1) { $size = (int)unpack('J', substr($h, 8, 8))[1]; }
  $atoms[] = $name; if ($size < 8) break; $pos += $size;
}
fclose($f);
rename($tmp, $dest);
@chmod($dest, 0644);
file_put_contents($lock, gmdate('c'));
if (!is_file($dir . '/.htaccess')) {
  file_put_contents($dir . '/.htaccess', "Options -Indexes\nAddType video/mp4 .mp4\n<FilesMatch \"\\.mp4$\">\n  Header set Cache-Control \"public, max-age=2592000\"\n  Header set X-Content-Type-Options \"nosniff\"\n</FilesMatch>\n<FilesMatch \"^\\.\">\n  Require all denied\n</FilesMatch>\n");
}
out(200, ['ok' => true, 'bytes' => $bytes, 'sha256' => hash_file('sha256', $dest), 'atoms' => $atoms, 'type' => $type]);
