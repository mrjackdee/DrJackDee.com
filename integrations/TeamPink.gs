const SHEET_ID = '18WPlTLIkFRNlr3Z8z7S9VHhYEnwQXpRx4-DQiBFIknE';
const NOTIFY_EMAIL = 'jackdee@att.net';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function setup() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Orders');
  sheet.getRange('I1').setValue('Submitter Confirmation');
  MailApp.getRemainingDailyQuota();
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'retryNotifications')) {
    ScriptApp.newTrigger('retryNotifications').timeBased().everyMinutes(10).create();
  }
}

function reply(data, success, error) {
  const origin = data.origin === 'https://www.drjackdee.com' ? data.origin : 'https://drjackdee.com';
  const message = JSON.stringify({type:'teampink-order',orderId:UUID.test(data.orderId || '') ? data.orderId : '',success,error:error || ''});
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.top.postMessage(' + message + ',' + JSON.stringify(origin) + ');<\/script></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const data = e && e.parameter || {};
  if (data.origin !== 'https://drjackdee.com' && data.origin !== 'https://www.drjackdee.com') return reply(data,false,'Invalid submission.');
  if (data.website || !UUID.test(data.orderId || '')) return reply(data,false,'Invalid submission.');
  const limits = {name:120,address:500,phone:40,email:254};
  for (const key in limits) {
    if (typeof data[key] !== 'string' || !data[key].trim() || data[key].length > limits[key]) return reply(data,false,'Please complete all contact fields.');
    data[key] = data[key].trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.phone.replace(/\D/g,'').length < 7 || !['true','false'].includes(data.mail)) return reply(data,false,'Please check your contact details.');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reply(data,false,'Please try again in a moment.');
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Orders');
    const count = sheet.getLastRow();
    if (count > 1 && sheet.getRange(2,2,count-1,1).createTextFinder(data.orderId).matchEntireCell(true).findNext()) return reply(data,true);
    const cache = CacheService.getScriptCache();
    const bucket = 'orders:' + Math.floor(Date.now()/60000);
    const current = Number(cache.get(bucket) || 0);
    if (current >= 10) return reply(data,false,'Please try again in a minute.');
    cache.put(bucket,String(current+1),120);
    const clean = value => /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
    const row = count+1;
    sheet.getRange(row,2,1,6).setNumberFormat('@');
    sheet.getRange(row,1,1,9).setValues([[new Date(),data.orderId,clean(data.name),clean(data.address),clean(data.phone),clean(data.email),data.mail === 'true' ? 'Yes' : 'No','Pending','Pending']]);
    SpreadsheetApp.flush();
    try { notify(sheet,row); } catch (_) { /* A scheduled retry delivers Pending notifications. */ }
    return reply(data,true);
  } catch (_) { return reply(data,false,'We could not confirm your order. Please try again.'); }
  finally { lock.releaseLock(); }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function notify(sheet,row) {
  const v = sheet.getRange(row,1,1,9).getValues()[0];
  if (v[7] === 'Pending' && MailApp.getRemainingDailyQuota() > 0) {
    const body = 'A new TeamPink tumbler order was submitted.\n\nName: ' + v[2] + '\nAddress: ' + v[3] +
      '\nPhone: ' + v[4] + '\nEmail: ' + v[5] + '\nMail tumbler: ' + v[6] + '\nOrder reference: ' + v[1] +
      '\n\nThe order will be submitted Monday, October 19, 2026.\n\nOrders: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit';
    try {
      MailApp.sendEmail({to:NOTIFY_EMAIL,subject:'New TeamPink tumbler order submission',body});
      sheet.getRange(row,8).setValue('Sent');
    } catch (_) { /* Retry the organizer notification independently. */ }
  }
  if (v[8] === 'Pending' && MailApp.getRemainingDailyQuota() > 0) {
    const delivery = v[6] === 'Yes' ? 'You requested that your tumbler be mailed to the address you provided.' : 'You requested that your tumbler not be mailed.';
    const body = 'Hello ' + v[2] + ',\n\nYour TeamPink tumbler request has been received.\n\n' +
      'I will submit the order on Monday, October 19, 2026.\n\n' + delivery +
      '\n\nOrder reference: ' + v[1] + '\n\nQuestions? Reply to this email to reach Jack Dee.\n\nThank you!\nJack Dee';
    const htmlBody = '<!doctype html><html><body style="margin:0;background:#fff9f5;color:#193f2e;font-family:Arial,Helvetica,sans-serif;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 16px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ead8d0;">' +
      '<tr><td style="background:#193f2e;padding:24px 28px;color:#fae1da;font-size:26px;font-family:Georgia,serif;">TeamPink</td></tr>' +
      '<tr><td style="padding:28px;border-top:5px solid #ee9186;">' +
      '<h1 style="margin:0 0 20px;font-size:28px;font-family:Georgia,serif;color:#193f2e;">Your request is received!</h1>' +
      '<p style="line-height:1.7;">Hello ' + escapeHtml(v[2]) + ',</p>' +
      '<p style="line-height:1.7;">Thank you for submitting your TeamPink tumbler request.</p>' +
      '<p style="padding:16px;background:#fae1da;line-height:1.7;">I will submit the order on <strong>Monday, October 19, 2026.</strong></p>' +
      '<p style="line-height:1.7;">' + delivery + '</p>' +
      '<p style="line-height:1.7;font-size:13px;"><strong>Order reference:</strong> ' + escapeHtml(v[1]) + '</p>' +
      '<p style="line-height:1.7;">Questions? Reply to this email to reach Jack Dee.</p>' +
      '<p style="line-height:1.7;">Thank you!<br>Jack Dee</p></td></tr></table></td></tr></table></body></html>';
    try {
      MailApp.sendEmail({to:String(v[5]),subject:'Your TeamPink tumbler request is received',body,htmlBody,name:'TeamPink | Jack Dee',replyTo:NOTIFY_EMAIL});
      sheet.getRange(row,9).setValue('Sent');
    } catch (_) { /* Retry the submitter confirmation independently. */ }
  }
}

function retryNotifications() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Orders');
    const count = sheet.getLastRow();
    if (count < 2) return;
    const states = sheet.getRange(2,8,count-1,2).getValues();
    let sent = 0;
    for (let i=0;i<states.length && sent<20;i++) {
      if (states[i][0] !== 'Pending' && states[i][1] !== 'Pending') continue;
      if (MailApp.getRemainingDailyQuota()<1) break;
      try { notify(sheet,i+2); sent++; } catch (_) { break; }
    }
  } finally { lock.releaseLock(); }
}
