import { applySession } from 'next-session';
import Shopify from 'shopify-api-node';
const installAppIfNotCreator = ({
  prepareSessionOptions,
  paramsIValue,
  apiVersion,
  autoLimit,
  presentmentPrices,
  shopifyAPITimeout,
}) => async (ctx) => {
  const { req, res, resolvedUrl } = ctx;
  const installUrl = `/api/shopify/${paramsIValue}${resolvedUrl.replace(
    '/',
    ''
  )}`;
  const options = await prepareSessionOptions();
  await applySession(req, res, options);
  const { shopName, accessToken } = req.session;
  if (!shopName || !accessToken) {
    res
      .writeHead(302, {
        Location: installUrl,
      })
      .end();
    return false;
  }
  const shopify = new Shopify({
    shopName,
    accessToken,
    apiVersion,
    autoLimit,
    presentmentPrices,
    timeout: shopifyAPITimeout,
  });

  let accessScope;
  try {
    accessScope =
      shopify &&
      shopify.accessScope &&
      typeof shopify.accessScope.list === 'function' &&
      (await shopify.accessScope.list());
  } catch (err) {
    res
      .writeHead(302, {
        Location: installUrl,
      })
      .end();
    return false;
  }

  if (!accessScope) {
    res
      .writeHead(302, {
        Location: installUrl,
      })
      .end();
    return false;
  }
  shopify.accessScopeList = accessScope;
  return shopify;
};

export default installAppIfNotCreator;
