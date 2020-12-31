import querystring from 'querystring';

import redirectionScript from './redirectionPage';

export default function createTopLevelRedirect(apiKey, path) {
  return (req, res) => {
    const {
      headers: { host },
      query
    } = req;
    const shop = query.shop;
    const queryString = querystring.stringify(query);
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      redirectionScript({
        origin: shop,
        redirectTo: `https://${host}${path}?${queryString}`,
        apiKey
      })
    );
    return;
  };
}
