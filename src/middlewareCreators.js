import axios from 'axios';
import { applySession } from 'next-session';
import ShopifyToken from 'shopify-token';
import Shopify from 'shopify-api-node';
import { removeProperties } from './helpers';
import shopifyResourceTypes from './shopifyResourceTypes';

export const createSetSessionMiddleware = ({ prepareSessionOptions }) => async (
  req,
  res,
  next
) => {
  console.log('setSessionMiddleware');
  const options = await prepareSessionOptions();
  await applySession(req, res, options);
  return next();
};

export const createGetAuthUrlMiddleware = ({
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout,
  accessMode,
  paramsName,
  paramsRValue,
  paramsIValue,
}) => async (req, res, next) => {
  console.log('getAuthUrlMiddleware');
  const params = req.query[paramsName];
  if (params.length === 1 && params[0] === paramsIValue) {
    const { shop } = req.query;
    if (!shop || !shop.includes('.myshopify.com')) {
      res.writeHead(400).end('Login your shopify account first, please!');
      return;
    }
    const shopName = shop.replace('.myshopify.com', '');
    const shopifyToken = new ShopifyToken({
      sharedSecret,
      apiKey,
      redirectUri: `https://${req.headers.host}/api/shopify/${paramsRValue}`,
      scopes,
      timeout: accessTokenTimeout,
      accessMode,
    });
    const query = removeProperties(req.query, [paramsName]);
    if (!shopifyToken.verifyHmac(query)) {
      res.writeHead(400).end('getAuthUrl: HMAC validation failed!');
      return;
    }
    const nonce = shopifyToken.generateNonce();
    req.session.nonce = nonce;
    const authUrl = shopifyToken.generateAuthUrl(shopName, scopes, nonce);
    req.redirectUrl = authUrl;
  }
  next();
};

export const createGetAccessTokenMiddleware = ({
  sharedSecret,
  apiKey,
  scopes,
  appSlug,
  accessTokenTimeout,
  accessMode,
  paramsName,
  paramsRValue,
}) => async (req, res, next) => {
  console.log('getAccessTokenMiddleware');
  let hasError = false;
  const params = req.query[paramsName];
  if (params.length === 1 && params[0] === paramsRValue) {
    const { code, hmac, shop, state } = req.query;
    const nonce = req.session.nonce;
    if (state !== nonce) {
      res.writeHead(400).end('NONCE validation failed!');
      return;
    }
    if (shop.match(/[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com[\/]?/) === null) {
      res.writeHead(400).end('HOSTNAME validation failed!');
      return;
    }
    const shopifyToken = new ShopifyToken({
      sharedSecret,
      apiKey,
      redirectUri: `https://${req.headers.host}/api/shopify/${paramsRValue}`,
      scopes,
      timeout: accessTokenTimeout,
      accessMode,
    });
    const query = removeProperties(req.query, [paramsName]);
    if (!shopifyToken.verifyHmac(query)) {
      res.writeHead(400).end('HMAC validation failed!');
      return;
    }
    const shopName = shop.replace('.myshopify.com', '');
    req.session.shopName = shopName;
    const accessTokenRelatedInfo = await shopifyToken.getAccessToken(
      shop,
      code
    );
    if (!accessTokenRelatedInfo || !accessTokenRelatedInfo.access_token) {
      res.writeHead(400).end('CODE validation failed!');
      return;
    }
    req.session.accessToken = accessTokenRelatedInfo.access_token;
    req.redirectUrl = `https://${shop}/admin/apps/${appSlug}`;
  }
  next();
};

export const createHandleShopifyAPIMiddleware = ({
  paramsName,
  paramsIValue,
  apiVersion,
  autoLimit,
  presentmentPrices,
  shopifyAPITimeout,
}) => async (req, res, next) => {
  const params = req.query[paramsName];
  const [resourceName, methodName] = params;
  if (
    params.length === 2 &&
    shopifyResourceTypes[resourceName] !== undefined &&
    shopifyResourceTypes[resourceName][methodName] !== undefined
  ) {
    const { shopName, accessToken } = req.session;
    const shopify = new Shopify({
      shopName,
      accessToken,
      apiVersion,
      autoLimit,
      presentmentPrices,
      timeout: shopifyAPITimeout,
    });
    const queryData = req.query;
    const bodyData = req.body ?? {};
    const allData = { ...queryData, ...bodyData };
    const parameters = shopifyResourceTypes[resourceName][methodName].map(
      (parameterName) => allData[parameterName]
    );
    const result = await shopify[resourceName][methodName](...parameters);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    return;
  }
  next();
};

export const createVerifyAPIRoutesMiddleware = ({
  paramsName,
  paramsIValue,
  paramsRValue,
}) => async (req, res, next) => {
  console.log('verifyAPIRoutesMiddleware');
  const params = req.query[paramsName];
  const [resourceName, methodName] = params;
  console.log(params);
  if (
    (params.length === 1 &&
      (params[0] === paramsIValue || params[0] === paramsRValue)) ||
    (params.length === 2 &&
      shopifyResourceTypes[resourceName] !== undefined &&
      shopifyResourceTypes[resourceName][methodName] !== undefined)
  ) {
    if (req.redirectUrl) {
      return next();
    }
  } else {
    res.writeHead(400).end('Route API not found');
    return;
  }
};

export const createRedirectMiddleware = () => async (req, res) => {
  console.log('redirectMiddleware');
  res.writeHead(302, { Location: req.redirectUrl }).end();
};
