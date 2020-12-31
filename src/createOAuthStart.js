import ShopifyToken from 'shopify-token';

import errorMessage from './errorMessage';
import { destroyTopLevelOAuthCookie } from './helpers';
import { removeProperties } from './helpers';

export default function createOAuthStart({
  paramsName,
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout,
  accessMode
}) {
  return async (req, res) => {
    const { shop } = req.query;
    if (!shop || shop.match(/[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com[/]?/) === null) {
      res.writeHead(400).end(errorMessage.ShopParamMissing);
      return;
    }

    const shopifyToken = new ShopifyToken({
      sharedSecret,
      apiKey,
      redirectUri: `https://${req.headers.host}/api/auth/callback`,
      scopes,
      timeout: accessTokenTimeout,
      accessMode
    });

    const query = removeProperties(req.query, [paramsName]);
    if (!shopifyToken.verifyHmac(query)) {
      res.writeHead(400).end(errorMessage.InvalidHmac);
      return;
    }

    const nonce = shopifyToken.generateNonce();
    req.session.nonce = nonce;

    const shopName = shop.replace('.myshopify.com', '');
    const authUrl = shopifyToken.generateAuthUrl(shopName, scopes, nonce);
    destroyTopLevelOAuthCookie(req, res);
    res.redirect(authUrl);
  };
}
