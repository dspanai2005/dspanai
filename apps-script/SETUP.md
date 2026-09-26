# D's PANAI — order system setup (Google Sheets)

1. Go to https://sheets.new and create a new sheet. Name it "D's PANAI Orders".
2. Menu: **Extensions → Apps Script**. Delete the sample code.
3. Open `apps-script/Code.gs` from this project, copy everything, paste it in, and save.
4. In the toolbar, choose the function **setup** and press **Run**. Allow the
   permissions Google asks for (it needs to send email and create the invoice PDF).
5. In **Project Settings → Script Properties**, add `APPS_SCRIPT_TOKEN` with a
   newly generated secret value. Set the same value as the website's
   `APPS_SCRIPT_TOKEN` environment secret. Do not put the token in source code.
6. Press **Deploy → New deployment → Web app**:
   - Description: `D's PANAI orders`
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Press **Deploy**, then set the web app URL ending in `/exec` as the website's
   `APPS_SCRIPT_URL` environment secret. Redeploy the website after changing secrets.

## Updating an existing deployment

After changing `Code.gs`, saving the file does not update the live `/exec` URL.
Create a new version of the existing web-app deployment:

1. Save `Code.gs`.
2. Open **Deploy -> Manage deployments**.
3. Edit the existing web-app deployment.
4. Set **Version** to **New version**, then click **Deploy**.
5. Keep the same `/exec` URL and test it again.

The tracking page sends `action: "track"` with the order ID. The deployed version
must include the `track` branch in `doPost` and the `trackOrder_` function.

The script reads `APPS_SCRIPT_TOKEN` from Script Properties. The website sends
the matching secret from its server environment. The previously hardcoded token
was exposed and must not be reused.

Public order tracking intentionally does not return the invoice URL. The invoice
is attached to the customer email; invoice and payment-proof links remain in the
password-protected owner dashboard. Drive sharing remains "Anyone with the link"
for compatibility with the dashboard's direct links, so those URLs are bearer
links. Making the files fully private requires a server-side download proxy in
the website as well as a corresponding Apps Script change.

## What happens on each order

- A unique order ID is created: `DSP-YYMMDD-0001`
- A colour-coded row is added to the Orders sheet
- A branded invoice PDF (logo + website colours) is generated
- The customer gets a thank-you email with the invoice attached
- divyaselvaraj339@gmail.com gets a copy with all order details
- Changing the status (in the sheet dropdown or on `/order-divya2004`)
  emails the customer automatically
