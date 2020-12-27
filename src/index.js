import installAppIfNotCreator from './installAppIfNotCreator';
import {
  createSetSessionMiddleware,
  createGetAuthUrlMiddleware,
  createGetAccessTokenMiddleware,
  createHandleShopifyAPIMiddleware,
  createVerifyAPIRoutesMiddleware,
  createRedirectMiddleware,
} from './middlewareCreators';

const functions = {};
const createNextShopifyFunctions = ({
  prepareSessionOptions,
  sharedSecret,
  apiKey,
  appSlug,
  scopes,
  accessTokenTimeout = 60000,
  accessMode = '',
  paramsName = 'params',
  paramsIValue = 'i',
  paramsRValue = 'r',
  apiVersion = '2020-10',
  autoLimit = false,
  presentmentPrices = false,
  shopifyAPITimeout = 60000,
}) => {
  if (Object.keys(functions).length > 0) {
    return functions;
  }
  functions.installAppIfNot = installAppIfNotCreator({
    prepareSessionOptions,
    paramsIValue,
    apiVersion,
    autoLimit,
    presentmentPrices,
    shopifyAPITimeout,
  });
  functions.setSessionMiddleware = createSetSessionMiddleware({
    prepareSessionOptions,
  });
  functions.getAuthUrlMiddleware = createGetAuthUrlMiddleware({
    sharedSecret,
    apiKey,
    scopes,
    accessTokenTimeout,
    accessMode,
    paramsName,
    paramsRValue,
    paramsIValue,
  });
  functions.getAccessTokenMiddleware = createGetAccessTokenMiddleware({
    sharedSecret,
    apiKey,
    scopes,
    accessTokenTimeout,
    accessMode,
    paramsName,
    paramsRValue,
    appSlug,
  });
  functions.handleShopifyAPIMiddleware = createHandleShopifyAPIMiddleware({
    paramsName,
    paramsIValue,
    apiVersion,
    autoLimit,
    presentmentPrices,
    shopifyAPITimeout,
  });
  functions.verifyAPIRoutesMiddleware = createVerifyAPIRoutesMiddleware({
    paramsName,
    paramsIValue,
    paramsRValue,
  });
  functions.redirectMiddleware = createRedirectMiddleware();
  return functions;
};

export default createNextShopifyFunctions;
