import { applySession } from 'next-session';
import querystring from 'querystring';
import Shopify from 'shopify-api-node';

import createEnableCookies from './createEnableCookies';
import createOAuthCallback from './createOAuthCallback';
import createOAuthStart from './createOAuthStart';
import createRequestStorageAccess from './createRequestStorageAccess';
import createTopLevelOAuthRedirect from './createTopLevelOAuthRedirect';
import { redirectToAuth } from './helpers';
import {
  createTestCookie,
  destroyTopLevelOAuthCookie,
  grantedStorageAccess,
  hasCookieAccess,
  shouldPerformInlineOAuth
} from './helpers';
import shopifyResourceTypes from './shopifyResourceTypes';
// to be used in pages and apis
export const createSetSessionMiddleware = ({ prepareSessionOptions }) => async (req, res, next) => {
  const options = await prepareSessionOptions();
  await applySession(req, res, options);
  await next();
};

export const createEnableCookiesMiddleware = ({ apiKey, paramsName }) => async (req, res, next) => {
  const params = req.query[paramsName];
  if (params.length === 2 && params[0] === 'auth' && params[1] === 'enable_cookies') {
    const enableCookies = createEnableCookies(apiKey);
    await enableCookies(req, res);
    return;
  }
  await next();
};

export const createGetAuthUrlMiddleware = ({
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout,
  accessMode,
  paramsName
}) => async (req, res, next) => {
  const params = req.query[paramsName];
  if (params.length === 1 && params[0] === 'auth') {
    if (!hasCookieAccess(req) && !grantedStorageAccess(req)) {
      const requestStorageAccess = createRequestStorageAccess(apiKey);
      await requestStorageAccess(req, res);
      return;
    }

    if (shouldPerformInlineOAuth(req, res)) {
      const oAuthStart = createOAuthStart({
        paramsName,
        sharedSecret,
        apiKey,
        scopes,
        accessTokenTimeout,
        accessMode
      });
      await oAuthStart(req, res);
      return;
    } else {
      const topLevelOAuthRedirect = createTopLevelOAuthRedirect(apiKey, '/api/auth/inline');
      await topLevelOAuthRedirect(req, res);
      return;
    }
  }
  await next();
};

export const createHandleInlineAuthMiddleware = ({
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout,
  accessMode,
  paramsName
}) => async (req, res, next) => {
  const params = req.query[paramsName];
  if (params.length === 2 && params[0] === 'auth' && params[1] === 'inline') {
    const oAuthStart = createOAuthStart({
      paramsName,
      sharedSecret,
      apiKey,
      scopes,
      accessTokenTimeout,
      accessMode
    });
    await oAuthStart(req, res);
    return;
  }
  await next();
};

export const createGetAccessTokenMiddleware = ({
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout,
  accessMode,
  paramsName,
  apiVersion,
  autoLimit,
  presentmentPrices,
  shopifyAPITimeout,
  whatToDoAfterAuth
}) => async (req, res, next) => {
  const params = req.query[paramsName];
  if (params.length === 2 && params[0] === 'auth' && params[1] === 'callback') {
    const oAuthCallback = createOAuthCallback({
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
    });
    await oAuthCallback(req, res);
    return;
  }
  await next();
};

export const createHandleShopifyAPIMiddleware = ({
  paramsName,
  apiVersion,
  autoLimit,
  presentmentPrices,
  shopifyAPITimeout
}) => async (req, res, next) => {
  const params = req.query[paramsName];
  const [resourceName, methodName] = params;
  if (
    params.length === 2 &&
    shopifyResourceTypes[resourceName] !== undefined &&
    shopifyResourceTypes[resourceName][methodName] !== undefined
  ) {
    const { session } = req;
    if (session && session.accessToken) {
      destroyTopLevelOAuthCookie(req, res);
      const { shopName, accessToken } = session;

      const shopify = new Shopify({
        shopName,
        accessToken,
        apiVersion,
        autoLimit,
        presentmentPrices,
        timeout: shopifyAPITimeout
      });
      const queryData = req.query;
      const bodyData = req.body ?? {};
      const allData = { ...queryData, ...bodyData };
      const parameters = shopifyResourceTypes[resourceName][methodName].map(
        (parameterName) => allData[parameterName]
      );
      try {
        const result = await shopify[resourceName][methodName](...parameters);
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(result));
        return;
      } catch (err) {
        redirectToAuth(req, res);
        return;
      }
    }
    createTestCookie(req, res);
    redirectToAuth(req, res);
    return;
  }
  await next();
};
// to be used in pages and apis
export const createLoginAgainIfDifferentShopMiddleware = () => async (req, res, next) => {
  const { query: tmpQuery, session, url } = req;
  const query = tmpQuery ?? querystring.parse(url.split('?')[1] ?? '');
  if (session && query && query.shop && session.shop && session.shop != query.shop) {
    console.log('loginAgainIfDifferentShopMiddleware', req.url);
    req.session.destroy();
    redirectToAuth(req, res);
  }
  await next();
};
// to be used in pages and apis
export const createVerifyTokenMiddleware = ({ paramsName }) => async (req, res, next) => {
  const params = req.query && req.query[paramsName];
  const [resourceName, methodName] = params ?? [];
  if (
    !params ||
    params.length !== 2 ||
    (resourceName && shopifyResourceTypes[resourceName] === undefined) ||
    (resourceName &&
      methodName &&
      shopifyResourceTypes[resourceName] &&
      shopifyResourceTypes[resourceName][methodName] === undefined)
  ) {
    const { session } = req;
    if (session && session.accessToken) {
      destroyTopLevelOAuthCookie(req, res);
      const { shopName, accessToken } = session;
      const shopify = new Shopify({
        shopName,
        accessToken
      });
      try {
        await shopify.metafield.list();
      } catch (err) {
        redirectToAuth(req, res);
        return;
      }

      await next();
      return;
    }
    createTestCookie(req, res);
    redirectToAuth(req, res);
    return;
  }
  await next();
};

export const createVerifyAPIRoutesMiddleware = ({ paramsName }) => async (req, res, next) => {
  const params = req.query[paramsName];
  const [resourceName, methodName] = params;
  if (
    (params.length === 1 && params[0] === 'auth') ||
    (params.length === 2 && params[0] === 'auth' && params[1] === 'callback') ||
    (params.length === 2 &&
      shopifyResourceTypes[resourceName] !== undefined &&
      shopifyResourceTypes[resourceName][methodName] !== undefined)
  ) {
    if (req.redirectPath) {
      await next();
      return;
    }
  } else {
    res.writeHead(400).end('Route API not found');
    return;
  }
};
