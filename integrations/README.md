# Activate TeamPink orders

The page is implemented in the private **mrjackdee/DrJackDee.com** repository and deployed by GitHub → Hostinger. The homepage is unchanged. Hostinger serves the standalone page in `public/teampink/`, copied by Vite to `dist/teampink/`.

The form sends contact details directly to a Google Apps Script web app using an invisible form frame. Google validates and saves the order, sends an organizer notification to **jackdee@att.net** and an HTML confirmation to the submitter's email address, then confirms the sheet write back to the page. No Hostinger server settings or secret credentials are needed.

## One-time Google authorization

1. Sign into Google as **jackdee.sync@gmail.com** and open https://script.google.com/home/start.
2. Create a project named **TeamPink Orders**. Replace its default code with **TeamPink-Setup.gs** (the same code is in this repository's `integrations/TeamPink.gs`).
3. Select **setup** from the function dropdown and click **Run**. Approve Google's requested spreadsheet, email-sending, and trigger permissions. This installs the spreadsheet edit trigger and notification retry trigger; it does not send a test email.
4. Click **Deploy → New deployment → Web app**. Choose **Execute as: Me** and **Who has access: Anyone**, then deploy.
5. Send the **Web app URL** ending in `/exec` to Codex. Codex will set it in `public/teampink/config.js`, commit to GitHub, and verify Hostinger's deployment and a test order.

The Orders sheet remains private. The public write endpoint validates contact fields, restricts mailing to yes/no, uses a honeypot and a 10-orders-per-minute limit, prevents duplicate retry references, and writes contact fields as text to prevent spreadsheet formulas. Pending email notifications retry every ten minutes; Google email quotas still apply. Notification delivery can repeat in the rare case a send succeeds but updating its sheet status fails.

The page displays a setup notice and disables Submit until the Web app URL is configured. It only shows a successful order confirmation after Google confirms saving the order.

## Updating an existing Google deployment

Replace the Apps Script code with the latest `integrations/TeamPink.gs`, run **setup** to configure columns I–L and install the spreadsheet status edit trigger, and choose **Deploy → Manage deployments → Edit → New version → Deploy**. The existing Web app URL stays the same. New orders track organizer and submitter emails separately, so retrying one does not resend the other. Existing orders are not automatically sent a new customer confirmation. The HTML confirmation uses salmon pink and ivy green, includes the October 19 date, mailing preference, and order reference, and lets the recipient reply to jackdee@att.net. Each new order uses two email recipients against Google's daily quota.

## Send order-placed status emails

After Google setup and deployment, select **Order** in **Order Status (column J)** for each request whose order you have placed. This sends that submitter an ivy green and salmon pink HTML email saying their TeamPink tumbler order has been placed. New requests start as **Received**, which does not send a status email. You may select Order for several rows with a paste; each valid order receives its own email.

**Order Status Email (column K)** shows Pending, Sent, or Check email. **Status Email Sent At (column L)** records successful delivery submission. Leave these automatic tracking columns alone; clearing Sent can resend a message. Successful order status emails are not repeated when you reselect Order. Failed sends or exhausted Google quotas stay Pending and are retried every ten minutes. Existing requests with no status remain unchanged until you select Order.
