# next-connect-shopify
Provide a function which could do Shopify app OAuth within Next.js API Routes

in pages/api/[...fns].js

```javascript
import nc from 'next-connect';
import createNextShopifyFunctions from 'next-connect-shopify';
import connectMongo from 'connect-mongo';
import { expressSession } from 'next-session';
import mongoose from 'mongoose';

const connection = {};

async function connectMongoose() {
  if (connection.isConnected && connection.mongooseConnection) {
    return connection;
  }

  const db = await mongoose.connect(process.env.SHOPIFY_APP_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  
  connection.isConnected = db.connections[0].readyState;
  connection.mongooseConnection = mongoose.connection;
  return connection;
}

const prepareSessionOptions = async () => {
  const { mongooseConnection } = await connectMongoose();
  const MongoStore = connectMongo(expressSession);
  return {
    cookie: {
      maxAge: parseInt(process.env.SHOPIFY_APP_SESSION_COOKIE_MAXAGE, 10),
      secure: true,
      sameSite: 'None'
    },
    store: new MongoStore({ mongooseConnection })
  };
};

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
```
