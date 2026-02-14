# Hardware Numb3rs — Landing Page

Landing page for [Hardware Numb3rs](https://www.youtube.com/c/HardwareNumb3rs) hosted on **Azure Static Web Apps** at [hardwarenumbers.com](https://hardwarenumbers.com).

## Structure

```text
src/
├── index.html                  # Main landing page
├── css/styles.css              # Styles (dark theme, responsive)
├── js/main.js                  # Mobile nav + YouTube RSS feed loader
├── assets/favicon.svg          # Favicon
└── staticwebapp.config.json    # Azure SWA routing & security headers
```

## Deployment

This site auto-deploys via GitHub Actions on every push to `main`.

### Setup

1. **Create an Azure Static Web App** in the Azure Portal (or via CLI).
2. Copy the deployment token and add it as a GitHub secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`.
3. Push to `main` — the GitHub Action will deploy automatically.

### Custom Domain (`hardwarenumbers.com`)

1. In the Azure Portal, go to your Static Web App → **Custom domains**.
2. Add `hardwarenumbers.com` and follow the DNS validation steps.
3. Add a `www.hardwarenumbers.com` CNAME pointing to your SWA default hostname.
4. Azure provides a free TLS certificate automatically.

## Local Development

Open `src/index.html` in a browser, or serve locally:

```bash
npx serve src
```

## YouTube Channel ID

The JavaScript fetches the latest videos from the YouTube RSS feed. Update the `CHANNEL_ID` constant in `src/js/main.js` with the correct channel ID if needed. You can find it by visiting your YouTube channel page and looking at the URL or using [this tool](https://commentpicker.com/youtube-channel-id.php).
