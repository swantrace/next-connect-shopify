import Shopify from 'shopify-api-node';
import ShopifyToken from 'shopify-token';

import errorMessage from './errorMessage';
import { removeProperties } from './helpers';

export default function createOAuthCallback({
  paramsName,
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout,
  accessMode,
  apiVersion,
  autoLimit,
  presentmentPrices,
  shopifyAPITimeout,
  whatToDoAfterAuth
}) {
  return async (req, res) => {
    const { code, shop, state } = req.query;
    const nonce = req.session.nonce;
    if (state !== nonce) {
      res.writeHead(403).end(errorMessage.NonceMatchFailed);
      return;
    }

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

    const accessTokenRelatedInfo = await shopifyToken.getAccessToken(shop, code);
    if (!accessTokenRelatedInfo || !accessTokenRelatedInfo.access_token) {
      res.writeHead(401).end(errorMessage.AccessTokenFetchFailure);
      return;
    }

    const shopName = shop.replace('.myshopify.com', '');
    const { access_token, scope } = accessTokenRelatedInfo;

    const shopify = new Shopify({
      shopName,
      accessToken: access_token,
      apiVersion,
      autoLimit,
      presentmentPrices,
      timeout: shopifyAPITimeout
    });

    try {
      await shopify.metafield.list();
    } catch (err) {
      res.writeHead(401).end(errorMessage.AccessTokenFetchFailure);
      return;
    }

    req.session.shop = shop;
    req.session.shopName = shopName;
    req.session.accessToken = access_token;
    req.session.scope = scope;

    if (accessMode === 'per-user') {
      const { expires_in, associated_user_scope, associated_user } = accessTokenRelatedInfo;
      req.session.expiresIn = expires_in;
      req.session.associatedUser = associated_user;
      req.session.associatedUserScope = associated_user_scope;
    }
    whatToDoAfterAuth(req, res, shopify);
  };
}
