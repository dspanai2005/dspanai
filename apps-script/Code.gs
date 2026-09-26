/*******************************************************************
 * D's PANAI — Order booking, invoicing and status backend
 * Google Apps Script (bound to a Google Sheet)
 *
 * WHAT THIS DOES
 *  - Receives orders from the website
 *  - Creates a unique Order ID (DSP-YYMMDD-XXXX)
 *  - Writes a colour-coded row into the "Orders" sheet
 *  - Builds a branded PDF invoice (website theme + logo)
 *  - Emails the invoice + thank-you to the customer
 *  - Emails a copy to the owner (divyaselvaraj339@gmail.com)
 *  - Lets the website read all orders and update the status
 *    (Pending / Confirmed / Shipped / In Transit / Delivered)
 *  - Emails the customer automatically whenever the status changes
 *
 * SETUP (once)
 *  1. Create a new Google Sheet.
 *  2. Extensions > Apps Script. Delete everything, paste this file.
 *  3. Run the function  setup()  once and allow the permissions.
 *  4. Deploy > New deployment > Web app
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the /exec URL and give it to the website (APPS_SCRIPT_URL).
 *  5. Set the Script Property APPS_SCRIPT_TOKEN to match the website secret.
 *******************************************************************/

/** Set this Script Property to the same value as the website APPS_SCRIPT_TOKEN. */
var TOKEN_PROPERTY = 'APPS_SCRIPT_TOKEN';

var OWNER_EMAIL = 'divyaselvaraj339@gmail.com';
var BRAND_NAME = "D's PANAI";
var BRAND_TAGLINE = 'Pure Palm Candy (Panangarkandu)';
var BRAND_WHATSAPP = '+91 96778 92457';
var BRAND_SITE = 'https://www.dspanaitraditions.in';
var LOGO_URL = BRAND_SITE + '/favicon.png';

/* Website theme colours */
var INK = '#1A1714';
var CARAMEL = '#B4601F';
var HONEY = '#E0B872';
var PAPER = '#FFFDF8';
var CREAM = '#F7F0E4';

var SHEET_NAME = 'Orders';
var STATUSES = ['Pending', 'Confirmed', 'Shipped', 'In Transit', 'Delivered'];
var HEADERS = [
  'Order ID', 'Date', 'Status', 'Customer', 'Mobile', 'WhatsApp', 'Email',
  'Address', 'City', 'State', 'Pincode', 'Landmark', 'Instructions',
  'Items', 'Total Weight (g)', 'Product Total', 'Shipping', 'Grand Total',
  'Invoice PDF', 'Payment Status', 'Payment Proof', 'Customer Emailed', 'Last Status Update'
];

/* ================================================================ */
/* SETUP                                                             */
/* ================================================================ */

function setup() {
  var sheet = getSheet_();
  styleSheet_(sheet);
  SpreadsheetApp.getActive().toast('D\'s PANAI order sheet is ready.');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else if (sheet.getRange(1, 20).getValue() !== 'Payment Status') {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  return sheet;
}

function styleSheet_(sheet) {
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  header
    .setBackground(INK)
    .setFontColor(PAPER)
    .setFontWeight('bold')
    .setFontSize(11)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  var widths = [140, 150, 120, 170, 130, 130, 210, 260, 120, 120, 90, 150, 220, 260, 120, 120, 100, 120, 240, 130, 150, 140, 240];
  for (var i = 0; i < widths.length; i++) sheet.setColumnWidth(i + 1, widths[i]);

  var maxRows = Math.max(sheet.getMaxRows(), 500);
  var body = sheet.getRange(2, 1, maxRows - 1, HEADERS.length);
  body.setVerticalAlignment('top').setFontSize(10);
  sheet.getRange(2, 1, maxRows - 1, 1).setFontWeight('bold').setFontColor(CARAMEL);

  /* Status dropdown */
  var statusRange = sheet.getRange(2, 3, maxRows - 1, 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  );
  statusRange.setHorizontalAlignment('center').setFontWeight('bold');

  /* Colour-coded statuses + zebra striping */
  sheet.clearConditionalFormatRules();
  var rules = [
    statusRule_(statusRange, 'Pending', '#FDF1DC', '#8C5A28'),
    statusRule_(statusRange, 'Confirmed', '#E7F3E4', '#25601F'),
    statusRule_(statusRange, 'Shipped', '#E3EDFB', '#17457F'),
    statusRule_(statusRange, 'In Transit', '#F6E8FB', '#6B2287'),
    statusRule_(statusRange, 'Delivered', '#1A1714', '#E0B872')
  ];
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ISEVEN(ROW())')
      .setBackground(CREAM)
      .setRanges([sheet.getRange(2, 4, maxRows - 1, HEADERS.length - 3)])
      .build()
  );
  sheet.setConditionalFormatRules(rules);
  sheet.getRange(2, 16, maxRows - 1, 3).setNumberFormat('₹#,##0');
}

function statusRule_(range, text, bg, fg) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text)
    .setBackground(bg)
    .setFontColor(fg)
    .setBold(true)
    .setRanges([range])
    .build();
}

/* ================================================================ */
/* WEB APP ENTRY POINTS                                              */
/* ================================================================ */

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sharedToken = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
    if (!sharedToken || body.token !== sharedToken) {
      return json_({ ok: false, error: 'Unauthorized' });
    }

    if (body.action === 'create') return json_(createOrder_(body.order));
    if (body.action === 'track') return json_(trackOrder_(body.orderId));
    if (body.action === 'list') return json_({ ok: true, orders: listOrders_() });
    if (body.action === 'updateStatus') return json_(updateStatus_(body.orderId, body.status));
    if (body.action === 'ping') return json_({ ok: true, pong: true });
    if (body.action === 'uploadPaymentProof') return json_(uploadPaymentProof_(body));
    return json_({ ok: false, error: 'Unknown action: ' + body.action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "D's PANAI orders" });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ================================================================ */
/* CREATE ORDER                                                      */
/* ================================================================ */

function createOrder_(order) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = getSheet_();
    var orderId = nextOrderId_(sheet);
    var now = new Date();

    var items = order.items || [];
    var totalWeight = 0;
    var summary = [];
    for (var i = 0; i < items.length; i++) {
      totalWeight += Number(items[i].weightGrams) * Number(items[i].quantity);
      summary.push(
        formatWeight_(items[i].weightGrams) + ' x ' + items[i].quantity +
        ' = ' + money_(items[i].lineTotal)
      );
    }

    var invoice = buildInvoicePdf_(orderId, now, order, items);
    var file = DriveApp.createFile(invoice);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    sheet.appendRow([
      orderId,
      Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd MMM yyyy HH:mm'),
      'Pending',
      order.fullName, order.mobile, order.whatsapp || order.mobile, order.email,
      order.address, order.city, order.state, order.pincode,
      order.landmark, order.instructions,
      summary.join('\n'),
      totalWeight,
      Number(order.productTotal), Number(order.shipping), Number(order.total),
      file.getUrl(),
      'Not paid',
      '',
      'No',
      Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd MMM yyyy HH:mm')
    ]);
    var orderRow = sheet.getLastRow();
    styleSheet_(sheet);

    var emailedCustomer = order.email
      ? sendCustomerEmail_(orderId, order, items, invoice)
      : false;
    sheet.getRange(orderRow, 22).setValue(emailedCustomer ? 'Yes' : 'No');

    try {
      sendOwnerEmail_(orderId, order, items, invoice, summary.join('\n'));
    } catch (err) {
      console.error(err);
    }

    return { ok: true, orderId: orderId, emailedCustomer: emailedCustomer };
  } finally {
    lock.releaseLock();
  }
}

function uploadPaymentProof_(body) {
  var orderId = String(body.orderId || '').trim().toUpperCase();
  var mimeType = String(body.mimeType || '').toLowerCase();
  var dataUrl = String(body.dataUrl || '');
  var fileName = String(body.fileName || 'payment-screenshot').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
  if (!orderId || !dataUrl) return { ok: false, error: 'Order ID and screenshot are required.' };
  if (!/^image\/(png|jpeg|webp)$/.test(mimeType)) return { ok: false, error: 'Only PNG, JPG and WebP images are accepted.' };
  var comma = dataUrl.indexOf(',');
  if (comma === -1) return { ok: false, error: 'Invalid image data.' };
  var bytes = Utilities.base64Decode(dataUrl.slice(comma + 1));
  if (bytes.length > 5 * 1024 * 1024) return { ok: false, error: 'The screenshot must be smaller than 5 MB.' };

  var sheet = getSheet_();
  var ids = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues() : [];
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim().toUpperCase() !== orderId) continue;
    var file = DriveApp.createFile(Utilities.newBlob(bytes, mimeType, fileName));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var row = i + 2;
    sheet.getRange(row, 20).setValue('Proof uploaded');
    sheet.getRange(row, 21).setValue(file.getUrl());
    return { ok: true, paymentStatus: 'Proof uploaded', paymentProofUrl: file.getUrl() };
  }
  return { ok: false, error: 'Order not found: ' + orderId };
}

function nextOrderId_(sheet) {
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMdd');
  var props = PropertiesService.getScriptProperties();
  var key = 'seq_' + stamp;
  var seq = Number(props.getProperty(key) || '0') + 1;
  props.setProperty(key, String(seq));
  var candidate = 'DSP-' + stamp + '-' + ('000' + seq).slice(-4);
  /* Guarantee uniqueness even if properties were reset */
  var existing = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().join('|')
    : '';
  while (existing.indexOf(candidate) !== -1) {
    seq += 1;
    props.setProperty(key, String(seq));
    candidate = 'DSP-' + stamp + '-' + ('000' + seq).slice(-4);
  }
  return candidate;
}

/* ================================================================ */
/* LIST + STATUS                                                     */
/* ================================================================ */

function listOrders_() {
  var sheet = getSheet_();
  if (sheet.getLastRow() < 2) return [];
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  var out = [];
  for (var i = values.length - 1; i >= 0; i--) {
    var r = values[i];
    if (!r[0]) continue;
    out.push({
      orderId: String(r[0]),
      createdAt: String(r[1]),
      status: String(r[2] || 'Pending'),
      fullName: String(r[3]),
      mobile: String(r[4]),
      whatsapp: String(r[5]),
      email: String(r[6]),
      address: String(r[7]),
      city: String(r[8]),
      state: String(r[9]),
      pincode: String(r[10]),
      landmark: String(r[11]),
      instructions: String(r[12]),
      itemsSummary: String(r[13]),
      totalWeightGrams: Number(r[14]) || 0,
      productTotal: Number(r[15]) || 0,
      shipping: Number(r[16]) || 0,
      total: Number(r[17]) || 0,
      invoiceUrl: String(r[18]),
      paymentStatus: String(r[19] || 'Not paid'),
      paymentProofUrl: String(r[20] || ''),
      emailedCustomer: String(r[21] || '')
    });
  }
  return out;
}

/* Public lookup: return only tracking-safe fields for a known order ID. */
function trackOrder_(orderId) {
  var requestedId = String(orderId || '').trim().toUpperCase();
  if (!requestedId) {
    return { ok: false, error: 'Enter your order ID.' };
  }
  var sheet = getSheet_();
  if (sheet.getLastRow() < 2) return { ok: false, error: 'Order not found.' };
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (String(row[0]).trim().toUpperCase() === requestedId) {
      return {
        ok: true,
        order: {
          orderId: String(row[0]),
          createdAt: String(row[1]),
          status: String(row[2] || 'Pending'),
          firstName: String(row[3]).trim().split(/\s+/)[0],
          total: Number(row[17]) || 0,
          invoiceUrl: ''
        }
      };
    }
  }
  return { ok: false, error: 'We could not find an order with those details.' };
}

function updateStatus_(orderId, status) {
  if (STATUSES.indexOf(status) === -1) return { ok: false, error: 'Invalid status' };
  var sheet = getSheet_();
  var ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(orderId)) {
      var row = i + 2;
      sheet.getRange(row, 3).setValue(status);
      sheet.getRange(row, 23).setValue(
        Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMM yyyy HH:mm')
      );
      var email = String(sheet.getRange(row, 7).getValue());
      var name = String(sheet.getRange(row, 4).getValue());
      if (email) sendStatusEmail_(orderId, name, email, status);
      return { ok: true };
    }
  }
  return { ok: false, error: 'Order not found: ' + orderId };
}

/* Sheet edit trigger: change the status by hand and the customer is emailed. */
function onEdit(e) {
  try {
    var sheet = e.range.getSheet();
    if (sheet.getName() !== SHEET_NAME) return;
    if (e.range.getColumn() !== 3 || e.range.getRow() < 2) return;
    var row = e.range.getRow();
    var status = String(e.range.getValue());
    if (STATUSES.indexOf(status) === -1) return;
    var orderId = String(sheet.getRange(row, 1).getValue());
    var email = String(sheet.getRange(row, 7).getValue());
    var name = String(sheet.getRange(row, 4).getValue());
    sheet.getRange(row, 23).setValue(
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd MMM yyyy HH:mm')
    );
    if (email) sendStatusEmail_(orderId, name, email, status);
  } catch (err) {
    console.error(err);
  }
}

/* ================================================================ */
/* INVOICE PDF                                                       */
/* ================================================================ */

function buildInvoicePdf_(orderId, date, order, items) {
  var rows = '';
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    rows +=
      '<tr>' +
      '<td style="padding:12px 10px;border-bottom:1px solid ' + CREAM + ';">Pure Panangarkandu (Palm Candy)<div style="color:#8A7B6B;font-size:11px;">D\'s PANAI branded pack</div></td>' +
      '<td style="padding:12px 10px;border-bottom:1px solid ' + CREAM + ';text-align:center;">' + formatWeight_(it.weightGrams) + '</td>' +
      '<td style="padding:12px 10px;border-bottom:1px solid ' + CREAM + ';text-align:center;">' + it.quantity + '</td>' +
      '<td style="padding:12px 10px;border-bottom:1px solid ' + CREAM + ';text-align:right;">' + money_(it.unitPrice) + '</td>' +
      '<td style="padding:12px 10px;border-bottom:1px solid ' + CREAM + ';text-align:right;font-weight:bold;">' + money_(it.lineTotal) + '</td>' +
      '</tr>';
  }

  var html =
  '<html><body style="margin:0;padding:28px;font-family:Georgia,serif;background:#EFE7D9;color:' + INK + ';">' +
    '<div style="max-width:760px;margin:0 auto;padding:34px;background:' + PAPER + ';border:1px solid #D8C8B0;box-shadow:0 8px 28px rgba(26,23,20,.12);">' +
    '<table width="100%" style="border-collapse:collapse;"><tr>' +
      '<td style="vertical-align:middle;">' +
        '<img src="' + LOGO_URL + '" width="64" height="64" style="vertical-align:middle;border:0;">' +
        '<span style="font-size:26px;letter-spacing:.04em;margin-left:12px;">' + BRAND_NAME + '</span>' +
        '<div style="color:' + CARAMEL + ';font-size:12px;letter-spacing:.22em;text-transform:uppercase;margin-top:6px;">' + BRAND_TAGLINE + '</div>' +
      '</td>' +
      '<td style="text-align:right;vertical-align:top;">' +
        '<div style="font-size:22px;letter-spacing:.18em;text-transform:uppercase;">Invoice</div>' +
        '<div style="font-size:13px;margin-top:6px;"><b>' + orderId + '</b></div>' +
        '<div style="font-size:12px;color:#8A7B6B;">' + Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd MMM yyyy, HH:mm') + '</div>' +
      '</td>' +
    '</tr></table>' +
    '<div style="height:3px;background:linear-gradient(90deg,' + INK + ',' + CARAMEL + ',' + HONEY + ');margin:22px 0 26px;"></div>' +

    '<table width="100%" style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:12.5px;"><tr>' +
      '<td style="vertical-align:top;width:50%;">' +
        '<div style="font-size:10.5px;letter-spacing:.18em;color:' + CARAMEL + ';text-transform:uppercase;">Billed to</div>' +
        '<div style="margin-top:8px;font-size:15px;font-weight:bold;">' + esc_(order.fullName) + '</div>' +
        '<div style="margin-top:4px;line-height:1.6;color:#4A423A;">' +
          esc_(order.address) + '<br>' +
          (order.landmark ? esc_(order.landmark) + '<br>' : '') +
          esc_(order.city) + ', ' + esc_(order.state) + ' - ' + esc_(order.pincode) + '<br>' +
          'Phone: ' + esc_(order.mobile) +
          (order.email ? '<br>Email: ' + esc_(order.email) : '') +
        '</div>' +
      '</td>' +
      '<td style="vertical-align:top;width:50%;text-align:right;">' +
        '<div style="font-size:10.5px;letter-spacing:.18em;color:' + CARAMEL + ';text-transform:uppercase;">Sold by</div>' +
        '<div style="margin-top:8px;font-size:15px;font-weight:bold;">' + BRAND_NAME + '</div>' +
        '<div style="margin-top:4px;line-height:1.6;color:#4A423A;">WhatsApp ' + BRAND_WHATSAPP + '<br>' + OWNER_EMAIL + '<br>' + BRAND_SITE + '</div>' +
      '</td>' +
    '</tr></table>' +

    '<table width="100%" style="border-collapse:collapse;margin-top:26px;font-family:Helvetica,Arial,sans-serif;font-size:12.5px;">' +
      '<tr style="background:' + INK + ';color:' + PAPER + ';">' +
        '<th style="text-align:left;padding:11px 10px;">Item</th>' +
        '<th style="padding:11px 10px;">Weight</th>' +
        '<th style="padding:11px 10px;">Qty</th>' +
        '<th style="text-align:right;padding:11px 10px;">Rate</th>' +
        '<th style="text-align:right;padding:11px 10px;">Amount</th>' +
      '</tr>' + rows +
    '</table>' +

    '<table width="100%" style="border-collapse:collapse;margin-top:18px;font-family:Helvetica,Arial,sans-serif;font-size:13px;"><tr>' +
      '<td style="width:55%;vertical-align:top;color:#6F6459;font-size:11.5px;line-height:1.7;">' +
        (order.instructions ? '<b>Delivery notes:</b> ' + esc_(order.instructions) + '<br>' : '') +
        'Payment is optional. You may pay by QR or confirm payment with us on WhatsApp before dispatch.<br>Thank you for keeping a traditional taste alive.' +
      '</td>' +
      '<td style="width:45%;">' +
        '<table width="100%" style="border-collapse:collapse;">' +
          '<tr><td style="padding:6px 0;color:#6F6459;">Product total</td><td style="text-align:right;padding:6px 0;">' + money_(order.productTotal) + '</td></tr>' +
          '<tr><td style="padding:6px 0;color:#6F6459;">Shipping</td><td style="text-align:right;padding:6px 0;">' + money_(order.shipping) + '</td></tr>' +
          '<tr><td style="padding:12px 0;border-top:2px solid ' + INK + ';font-weight:bold;letter-spacing:.12em;text-transform:uppercase;">Grand total</td>' +
          '<td style="padding:12px 0;border-top:2px solid ' + INK + ';text-align:right;font-size:19px;font-weight:bold;color:' + CARAMEL + ';">' + money_(order.total) + '</td></tr>' +
        '</table>' +
      '</td>' +
    '</tr></table>' +

    '<div style="margin-top:34px;padding:14px 16px;background:' + CREAM + ';border-left:4px solid ' + CARAMEL + ';font-family:Helvetica,Arial,sans-serif;font-size:11.5px;color:#4A423A;">' +
      'Order status updates (Confirmed, Shipped, In Transit, Delivered) are emailed to you automatically. Quote <b>' + orderId + '</b> in any message.' +
    '</div>' +
    '</div></body></html>';

  return Utilities.newBlob(html, 'text/html', 'invoice.html')
    .getAs('application/pdf')
    .setName('Invoice-' + orderId + '.pdf');
}

/* ================================================================ */
/* EMAILS                                                            */
/* ================================================================ */

function emailShell_(heading, introHtml, bodyHtml) {
  return '' +
  '<div style="margin:0;padding:26px;background:' + CREAM + ';font-family:Helvetica,Arial,sans-serif;color:' + INK + ';">' +
    '<div style="max-width:600px;margin:0 auto;background:' + PAPER + ';border-radius:16px;overflow:hidden;border:1px solid #E8DFCF;">' +
      '<div style="padding:22px 26px;background:' + INK + ';color:' + PAPER + ';">' +
        '<img src="' + LOGO_URL + '" width="40" height="40" style="vertical-align:middle;border:0;">' +
        '<span style="font-family:Georgia,serif;font-size:20px;letter-spacing:.05em;margin-left:10px;">' + BRAND_NAME + '</span>' +
        '<div style="color:' + HONEY + ';font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;margin-top:6px;">' + BRAND_TAGLINE + '</div>' +
      '</div>' +
      '<div style="height:3px;background:linear-gradient(90deg,' + CARAMEL + ',' + HONEY + ');"></div>' +
      '<div style="padding:26px;">' +
        '<h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 10px;">' + heading + '</h1>' +
        '<div style="font-size:14px;line-height:1.7;color:#4A423A;">' + introHtml + '</div>' +
        bodyHtml +
        '<p style="font-size:13px;line-height:1.7;color:#4A423A;margin-top:22px;">Need anything? Just reply, or message us on WhatsApp at <b>' + BRAND_WHATSAPP + '</b>.</p>' +
      '</div>' +
      '<div style="padding:16px 26px;background:' + CREAM + ';font-size:11px;color:#6F6459;">' + BRAND_NAME + ' · ' + BRAND_SITE + '</div>' +
    '</div>' +
  '</div>';
}

function detailTable_(orderId, order, items) {
  var rows = '';
  for (var i = 0; i < items.length; i++) {
    rows += '<tr><td style="padding:7px 0;border-bottom:1px solid ' + CREAM + ';">Palm Candy — ' +
      formatWeight_(items[i].weightGrams) + ' x ' + items[i].quantity + '</td>' +
      '<td style="padding:7px 0;border-bottom:1px solid ' + CREAM + ';text-align:right;font-weight:bold;">' +
      money_(items[i].lineTotal) + '</td></tr>';
  }
  return '' +
  '<div style="margin-top:20px;padding:16px 18px;background:' + CREAM + ';border-radius:12px;">' +
    '<div style="font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:' + CARAMEL + ';">Order ID</div>' +
    '<div style="font-family:Georgia,serif;font-size:20px;margin-top:4px;">' + orderId + '</div>' +
  '</div>' +
  '<div style="margin-top:16px;padding:16px 18px;border:1px solid #E8DFCF;border-radius:12px;background:#FFFDF8;">' +
  '<table width="100%" style="border-collapse:collapse;font-size:13.5px;">' + rows +
    '<tr><td style="padding:9px 0;color:#6F6459;">Shipping</td><td style="padding:9px 0;text-align:right;">' + money_(order.shipping) + '</td></tr>' +
    '<tr><td style="padding:11px 0;border-top:2px solid ' + INK + ';font-weight:bold;">Grand total</td>' +
    '<td style="padding:11px 0;border-top:2px solid ' + INK + ';text-align:right;font-weight:bold;color:' + CARAMEL + ';font-size:17px;">' + money_(order.total) + '</td></tr>' +
  '</table></div>' +
  '<div style="margin-top:18px;font-size:13px;line-height:1.7;color:#4A423A;">' +
    '<b>Delivering to</b><br>' + esc_(order.fullName) + '<br>' + esc_(order.address) + '<br>' +
    esc_(order.city) + ', ' + esc_(order.state) + ' - ' + esc_(order.pincode) + '<br>Phone: ' + esc_(order.mobile) +
  '</div>';
}

function sendCustomerEmail_(orderId, order, items, invoice) {
  try {
    var html = emailShell_(
      'Thank you, ' + esc_(order.fullName) + '!',
      'We have received your palm candy order and your invoice is attached as a PDF. ' +
      'Our team will contact you shortly on WhatsApp to confirm availability, the final amount and dispatch.',
      detailTable_(orderId, order, items)
    );
    MailApp.sendEmail({
      to: order.email,
      subject: BRAND_NAME + ' · Order ' + orderId + ' received — thank you!',
      htmlBody: html,
      body: 'Thank you for your order ' + orderId + '. Your invoice is attached.',
      attachments: [invoice],
      name: BRAND_NAME
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function sendOwnerEmail_(orderId, order, items, invoice, summary) {
  var html = emailShell_(
    'New order ' + orderId,
    'A new order was placed on the website. Contact the customer to confirm.',
    detailTable_(orderId, order, items) +
    '<div style="margin-top:18px;font-size:13px;color:#4A423A;">' +
      'WhatsApp: ' + esc_(order.whatsapp || order.mobile) + '<br>' +
      'Email: ' + esc_(order.email || '—') + '<br>' +
      'Notes: ' + esc_(order.instructions || '—') +
    '</div>'
  );
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: 'NEW ORDER ' + orderId + ' · ' + order.fullName + ' · ' + money_(order.total),
    htmlBody: html,
    body: 'New order ' + orderId + '\n' + summary,
    attachments: [invoice],
    name: BRAND_NAME + ' Orders'
  });
}

function sendStatusEmail_(orderId, name, email, status) {
  var lines = {
    'Pending': 'We have your order and will confirm it shortly.',
    'Confirmed': 'Your order is confirmed and is being packed in our D\'s PANAI branded pack.',
    'Shipped': 'Good news — your order has been shipped.',
    'In Transit': 'Your parcel is on its way to you.',
    'Delivered': 'Your order has been delivered. We hope you enjoy it!'
  };
  var html = emailShell_(
    'Order ' + status,
    'Hello ' + esc_(name) + ', ' + lines[status],
    '<div style="margin-top:20px;padding:16px 18px;background:' + CREAM + ';border-radius:12px;">' +
      '<div style="font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:' + CARAMEL + ';">Order ID</div>' +
      '<div style="font-family:Georgia,serif;font-size:20px;margin-top:4px;">' + orderId + '</div>' +
      '<div style="margin-top:10px;font-size:13px;">Status: <b>' + status + '</b></div>' +
    '</div>'
  );
  try {
    MailApp.sendEmail({
      to: email,
      subject: BRAND_NAME + ' · Order ' + orderId + ' is ' + status,
      htmlBody: html,
      body: 'Order ' + orderId + ' status: ' + status,
      name: BRAND_NAME
    });
  } catch (err) {
    console.error(err);
  }
}

/* ================================================================ */
/* HELPERS                                                           */
/* ================================================================ */

function money_(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

function formatWeight_(g) {
  g = Number(g || 0);
  return g >= 1000 ? (g / 1000) + ' kg' : g + ' g';
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
