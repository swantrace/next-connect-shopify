import {
  createEnableCookiesMiddleware,
  createGetAccessTokenMiddleware,
  createGetAuthUrlMiddleware,
  createHandleInlineAuthMiddleware,
  createHandleShopifyAPIMiddleware,
  createLoginAgainIfDifferentShopMiddleware,
  createSetSessionMiddleware,
  createVerifyAPIRoutesMiddleware,
  createVerifyTokenMiddleware
} from './middlewareCreators';

const functions = {};
const createNextShopifyFunctions = ({
  prepareSessionOptions,
  sharedSecret,
  apiKey,
  scopes,
  accessTokenTimeout = 60000,
  accessMode = '',
  paramsName = 'fns',
  apiVersion = '2020-10',
  autoLimit = false,
  presentmentPrices = false,
  shopifyAPITimeout = 60000,
  // eslint-disable-next-line no-unused-vars
  whatToDoAfterAuth = (req, res, shopify) => {
    res.redirect('/');
  }
}) => {
  if (Object.keys(functions).length > 0) {
    return functions;
  }
  functions.setSessionMiddleware = createSetSessionMiddleware({
    prepareSessionOptions
  });
  functions.enableCookiesMiddleware = createEnableCookiesMiddleware({
    apiKey,
    paramsName
  });
  functions.getAuthUrlMiddleware = createGetAuthUrlMiddleware({
    sharedSecret,
    apiKey,
    scopes,
    accessTokenTimeout,
    accessMode,
    paramsName
  });
  functions.handleInlineAuthMiddleware = createHandleInlineAuthMiddleware({
    sharedSecret,
    apiKey,
    scopes,
    accessTokenTimeout,
    accessMode,
    paramsName
  });
  functions.getAccessTokenMiddleware = createGetAccessTokenMiddleware({
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
  });
  functions.loginAgainIfDirrentShopMiddleware = createLoginAgainIfDifferentShopMiddleware();
  functions.verifyTokenMiddleware = createVerifyTokenMiddleware({ paramsName });
  functions.handleShopifyAPIMiddleware = createHandleShopifyAPIMiddleware({
    paramsName,
    apiVersion,
    autoLimit,
    presentmentPrices,
    shopifyAPITimeout
  });
  functions.verifyAPIRoutesMiddleware = createVerifyAPIRoutesMiddleware({
    paramsName
  });
  return functions;
};

export default createNextShopifyFunctions;
