# next-connect-shopify
Provide a function which could do Shopify app OAuth within Next.js API Routes

import nc from 'next-connect';
import createNextShopifyFunctions from 'next-connect-shopify';

import prepareSessionOptions from '../../utils/prepareSessionOptions';

const {
  SHOPIFY_APP_CLIENT_SECRET: sharedSecret,
  SHOPIFY_APP_CLIENT_ID: apiKey,
  SHOPIFY_APP_SCOPES: scopes
} = process.env;

const {
  setSessionMiddleware,
  loginAgainIfDirrentShopMiddleware,
  enableCookiesMiddleware,
  getAuthUrlMiddleware,
  handleInlineAuthMiddleware,
  getAccessTokenMiddleware,
  verifyTokenMiddleware,
  handleShopifyAPIMiddleware,
  verifyAPIRoutesMiddleware
} = createNextShopifyFunctions({
  prepareSessionOptions,
  sharedSecret,
  apiKey,
  scopes
});
const handler = nc();

handler
  .use(setSessionMiddleware)
  .use(loginAgainIfDirrentShopMiddleware)
  .use(enableCookiesMiddleware)
  .use(getAuthUrlMiddleware)
  .use(handleInlineAuthMiddleware)
  .use(getAccessTokenMiddleware)
  .use(handleShopifyAPIMiddleware)
  .use(verifyTokenMiddleware)
  .use(verifyAPIRoutesMiddleware);

export default handler;
