# Activate TeamPink orders

The page is implemented in the private **mrjackdee/DrJackDee.com** repository and deployed by GitHub → Hostinger. The homepage is unchanged. Hostinger serves the standalone page in `public/teampink/`, copied by Vite to `dist/teampink/`.

The form sends contact details directly to a Google Apps Script web app using an invisible form frame. Google validates and saves the order, sends an email to **jackdee@att.net**, then confirms the sheet write back to the page. No Hostinger server settings or secret credentials are needed.

## One-time Google authorization

1. Sign into Google as **jackdee.sync@gmail.com** and open https://script.google.com/home/start.
2. Create a project named **TeamPink Orders**. Replace its default code with **TeamPink-Setup.gs** (the same code is in this repository's `integrations/TeamPink.gs`).
3. Select **setup** from the function dropdown and click **Run**. Approve Google's requested spreadsheet, email-sending, and trigger permissions. This creates the notification retry trigger; it does not send a test email.
4. Click **Deploy → New deployment → Web app**. Choose **Execute as: Me** and **Who has access: Anyone**, then deploy.
5. Send the **Web app URL** ending in `/exec` to Codex. Codex will set it in `public/teampink/config.js`, commit to GitHub, and verify Hostinger's deployment and a test order.

The Orders sheet remains private. The public write endpoint validates contact fields, restricts mailing to yes/no, uses a honeypot and a 10-orders-per-minute limit, prevents duplicate retry references, and writes contact fields as text to prevent spreadsheet formulas. Pending email notifications retry every ten minutes; Google email quotas still apply. Notification delivery can repeat in the rare case a send succeeds but updating its sheet status fails.

The page displays a setup notice and disables Submit until the Web app URL is configured. It only shows a successful order confirmation after Google confirms saving the order.
