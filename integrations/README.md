# TeamPink orders

This implementation belongs to the private **mrjackdee/DrJackDee.com** repository, formerly Coming-Soon-DrJackDee.com. The existing React homepage is unchanged.

The standalone order page is in `public/teampink/`. Vite copies it into `dist/teampink/` at build time. The Express server serves it at `/teampink` and `/teampink/`, and handles orders at `/api/teampink-order`. A Vercel rewrite and serverless handler support deployments on Vercel too.

## Google setup

1. Sign into Google as **jackdee.sync@gmail.com**, then open https://script.google.com/home/start.
2. Create a project named **TeamPink Orders** and replace the default code with the prepared private **TeamPink-Setup.gs** file. Keep that file out of GitHub: it contains a private server secret.
3. Select **setup** and click **Run**, then authorize the spreadsheet, email sending, and retry trigger.
4. Choose **Deploy → New deployment → Web app**, with **Execute as: Me** and **Who has access: Anyone**. Deploy and copy the Web app URL ending in `/exec`.
5. Configure `TEAMPINK_SCRIPT_URL` and `TEAMPINK_SECRET` as server-side environment variables on the site's actual host, then redeploy. Use the matching secret from the private setup file. Never put either value in a VITE_ variable or frontend source.

Orders save to the private Orders tab in the TeamPink sheet for jackdee.sync@gmail.com. Notifications go to **jackdee@att.net**. The service prevents duplicate retries, writes contact values as text to prevent spreadsheet formulas, and retries pending email notifications every ten minutes. Google email quotas still apply.

Until the service is configured, the form reports that ordering is being set up. No success confirmation appears without a confirmed sheet write.
