import { serialize } from 'cookie';
const TOP_LEVEL_OAUTH_COOKIE_NAME = 'shopifyTopLevelOAuth';
const TEST_COOKIE_NAME = 'shopifyTestCookie';
const GRANTED_STORAGE_ACCESS_COOKIE_NAME = 'shopify.granted_storage_access';

function getCookieOptions(req) {
  const { headers } = req;
  const userAgent = headers['user-agent'];
  const isChrome = userAgent && userAgent.match(/chrome|crios/i);
  let cookieOptions = {};
  if (isChrome) {
    cookieOptions = {
      sameSite: 'None',
      secure: true
    };
  }
  return cookieOptions;
}

function createSetCookies(name, value) {
  return (req, res) => {
    const options = getCookieOptions(req);
    const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);
    res.setHeader('Set-Cookie', serialize(name, String(stringValue)), options);
  };
}

export function hasCookieAccess(req) {
  return Boolean(req.cookies[TEST_COOKIE_NAME]);
}

export function grantedStorageAccess(req) {
  return Boolean(req.cookies[GRANTED_STORAGE_ACCESS_COOKIE_NAME]);
}

export function shouldPerformInlineOAuth(req) {
  return Boolean(req.cookies[TOP_LEVEL_OAUTH_COOKIE_NAME]);
}

export const createTopLevelOAuthCookie = createSetCookies(TOP_LEVEL_OAUTH_COOKIE_NAME, '1');

export const destroyTopLevelOAuthCookie = createSetCookies(TOP_LEVEL_OAUTH_COOKIE_NAME, '');

export const createTestCookie = createSetCookies(TEST_COOKIE_NAME, '1');

export const destroyTestCookie = createSetCookies(TEST_COOKIE_NAME, '');

export const createGrantedStorageAccessCookie = createSetCookies(
  GRANTED_STORAGE_ACCESS_COOKIE_NAME,
  '1'
);

export const destroyGrantedStorageAccessCookie = createSetCookies(
  GRANTED_STORAGE_ACCESS_COOKIE_NAME,
  ''
);

export const removeProperties = (target, keys) => {
  const result = Object.keys(target).reduce((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = target[key];
    }
    return acc;
  }, {});
  return result;
};

export const redirectToAuth = (req, res) => {
  const querystring = req.url.split('?')[1] ? `?${req.url.split('?')[1]}` : '';
  res
    .writeHead('307', {
      Location: `/api/auth${querystring}`
    })
    .end();
};
