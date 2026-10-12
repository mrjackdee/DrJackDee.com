const SHEET_ID = '18WPlTLIkFRNlr3Z8z7S9VHhYEnwQXpRx4-DQiBFIknE';
const NOTIFY_EMAIL = 'jackdee@att.net';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function setup() {
  SpreadsheetApp.openById(SHEET_ID).getSheetByName('Orders').getRange('A1:H1').getValues();
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
    sheet.getRange(row,1,1,8).setValues([[new Date(),data.orderId,clean(data.name),clean(data.address),clean(data.phone),clean(data.email),data.mail === 'true' ? 'Yes' : 'No','Pending']]);
    SpreadsheetApp.flush();
    try { notify(sheet,row); } catch (_) { /* A scheduled retry delivers Pending notifications. */ }
    return reply(data,true);
  } catch (_) { return reply(data,false,'We could not confirm your order. Please try again.'); }
  finally { lock.releaseLock(); }
}

function notify(sheet,row) {
  const v = sheet.getRange(row,1,1,8).getValues()[0];
  if (v[7] === 'Sent') return;
  const body = 'A new TeamPink tumbler order was submitted.\n\nName: ' + v[2] + '\nAddress: ' + v[3] +
    '\nPhone: ' + v[4] + '\nEmail: ' + v[5] + '\nMail tumbler: ' + v[6] + '\nOrder reference: ' + v[1] +
    '\n\nThe order will be submitted Monday, October 19, 2026.\n\nOrders: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit';
  MailApp.sendEmail({to:NOTIFY_EMAIL,subject:'New TeamPink tumbler order submission',body});
  sheet.getRange(row,8).setValue('Sent');
}

function retryNotifications() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Orders');
    const count = sheet.getLastRow();
    if (count < 2) return;
    const states = sheet.getRange(2,8,count-1,1).getValues();
    let sent = 0;
    for (let i=0;i<states.length && sent<20;i++) {
      if (states[i][0] !== 'Pending') continue;
      if (MailApp.getRemainingDailyQuota()<1) break;
      try { notify(sheet,i+2); sent++; } catch (_) { break; }
    }
  } finally { lock.releaseLock(); }
}
