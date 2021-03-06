import itpHelper from './client/itpHelper';
import css from './client/polarisCss';
import requestStorageAccess from './client/requestStorageAccess';
import storageAccessHelper from './client/storageAccessHelper';
import errorMessage from './errorMessage';

const HEADING = 'This app needs access to your browser data';
const BODY =
  'Your browser is blocking this app from accessing your data. To continue using this app, click Continue, then click Allow if the browser prompts you.';
const ACTION = 'Continue';

export default function createRequestStorageAccess(apiKey) {
  return function requestStorage(req, res) {
    const { query } = req;
    const { shop } = query;

    if (shop == null) {
      res.writeHead(400).end(errorMessage.ShopParamMissing);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' }).end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    ${css}
  </style>
  <base target="_top">
  <title>Redirecting…</title>

  <script>
    window.apiKey = "${apiKey}";
    window.shopOrigin = "https://${encodeURIComponent(shop)}";
    ${itpHelper}
    ${storageAccessHelper}
    ${requestStorageAccess(shop)}
  </script>
</head>
<body>
  <main id="RequestStorageAccess">
    <div class="Polaris-Page">
      <div class="Polaris-Page__Content">
        <div class="Polaris-Layout">
          <div class="Polaris-Layout__Section">
            <div class="Polaris-Stack Polaris-Stack--vertical">
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Card">
                  <div class="Polaris-Card__Header">
                    <h1 class="Polaris-Heading">${HEADING}</h1>
                  </div>
                  <div class="Polaris-Card__Section">
                    <p>${BODY}</p>
                  </div>
                </div>
              </div>
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">
                  <div class="Polaris-Stack__Item">
                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="TriggerAllowCookiesPrompt">
                      <span class="Polaris-Button__Content"><span>${ACTION}</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`);
  };
}
