# Updated packaging, pricing, and optional payment

## What will change

- Replace old cloth-pouch wording and product photos with the supplied branded 500 g pouch, plus a small cohesive set of matching product scenes.
- Set pricing to 250 g ₹299, 500 g ₹499, 750 g ₹699, 1 kg ₹899, then ₹899 per additional kilogram, while keeping custom 50 g quantities priced consistently between tiers.
- Update Instagram to `@dspanai.traditions` and its supplied profile link.
- After an order is placed, show the supplied payment QR as an optional choice. Customers may skip payment and wait for WhatsApp contact.
- Let paying customers upload a payment screenshot tied to their order ID.
- Show payment proof and its Drive link on the private orders dashboard and in the Google Sheet.
- Update invoice and email wording to match the new packaging and optional-payment process.

## Customer experience

1. Customer chooses a weight and places an order.
2. The website creates the unique order ID and sends the invoice email as it does now.
3. The confirmation screen offers two clear choices: pay now by QR, or wait for WhatsApp contact.
4. After paying, the customer uploads a screenshot and sees confirmation that it was attached to the order.

## Technical details

- Store the uploaded proof in the Apps Script owner's Google Drive and write its shareable URL into a new `Payment Proof` sheet column.
- Add a token-protected Apps Script upload action with file type and size validation.
- Extend order records and dashboard rows with payment state and proof links.
- Keep payment optional and do not mark an order paid merely because a screenshot was uploaded; the owner verifies it manually.
- Update the Apps Script setup guide so the deployed script version and sheet columns stay in sync.

## Verification

- Check pricing totals at every tier and one custom in-between weight.
- Test the order confirmation payment choices and screenshot upload interaction.
- Verify desktop and mobile product imagery, checkout, and dashboard layouts.
- Validate the Apps Script request shape locally; a full live Sheets/Drive/email test requires redeploying the updated Apps Script first.
