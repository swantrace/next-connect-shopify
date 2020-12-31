const shopifyResourceTypes = {
  accessScope: { list: [] },
  apiPermission: { delete: [] },
  applicationCharge: {
    activate: ['id', '_params'],
    create: ['createApplicationCharge'],
    get: ['id', '_params'],
    list: ['_params']
  },
  applicationCredit: {
    create: ['createApplicationCredit'],
    get: ['id', '_params'],
    list: ['_params']
  },
  article: {
    authors: [],
    count: ['blogId', '_params'],
    create: ['blogId', 'createArticle'],
    delete: ['blogId', 'id'],
    get: ['blogId', 'id', '_params'],
    list: ['blogId', '_params'],
    tags: ['blogId', '_params'],
    update: ['blogId', 'id', 'updateArticle']
  },
  asset: {
    create: ['themeId', 'params'],
    delete: ['themeId', 'params'],
    get: ['themeId', '_params'],
    list: ['themeId', '_params'],
    update: ['themeId', 'updateAsset']
  },
  balance: {
    list: [],
    transactions: []
  },
  blog: {
    count: [],
    create: ['createBlog'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  cancellationRequest: {
    create: ['fulfillmentOrderId', '_message'],
    accept: ['fulfillmentOrderId', '_message'],
    reject: ['fulfillmentOrderId', '_message']
  },
  carrierService: {
    create: ['createCarrierService'],
    delete: ['id'],
    get: ['id'],
    list: [],
    update: ['id', 'updateCarrierService']
  },
  checkout: {
    complete: ['token'],
    count: ['_params'],
    create: ['_params'],
    get: ['token'],
    list: ['_params'],
    shippingRates: ['token'],
    update: ['token', 'params']
  },
  collect: {
    count: ['_params'],
    create: ['createCollect'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params']
  },
  collection: {
    get: ['id', '_params'],
    products: ['id', '_params']
  },
  collectionListing: {
    get: ['id', '_params'],
    list: ['_params'],
    productIds: ['id', '_params']
  },
  comment: {
    approve: ['id'],
    count: ['_params'],
    create: ['createComment'],
    get: ['id', '_params'],
    list: ['_params'],
    notSpam: ['id'],
    remove: ['id'],
    restore: ['id'],
    spam: ['id'],
    update: ['id', 'updateComment']
  },
  country: {
    count: [],
    create: ['createCountry'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'updateCountry']
  },
  currency: {
    list: []
  },
  customCollection: {
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  customer: {
    accountActivationUrl: ['id'],
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    search: ['params'],
    update: ['id', 'params'],
    orders: ['id', '_params']
  },
  customerAddress: {
    create: ['customerId', 'params'],
    default: ['customerId', 'id'],
    delete: ['customerId', 'id'],
    get: ['customerId', 'id'],
    list: ['customerId', '_params'],
    set: ['customerId', 'params'],
    update: ['customerId', 'id', 'params']
  },
  customerSavedSearch: {
    count: ['_params'],
    create: ['params'],
    customers: ['id', '_params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  discountCode: {
    create: ['priceRuleId', 'params'],
    delete: ['priceRuleId', 'id'],
    get: ['priceRuleId', 'id'],
    list: ['priceRuleId', '_params'],
    lookup: ['params'],
    update: ['priceRuleId', 'id', '_params']
  },
  discountCodeCreationJob: {
    create: ['priceRuleId', 'params'],
    discountCodes: ['priceRuleId', 'id'],
    get: ['priceRuleId', 'id']
  },
  dispute: {
    get: ['id'],
    list: ['_params']
  },
  draftOrder: {
    complete: ['id', '_params'],
    count: [],
    create: ['params'],
    delete: ['id'],
    get: ['id'],
    list: ['_params'],
    sendInvoice: ['id', '_params'],
    update: ['id', '_params']
  },
  event: {
    count: ['_params'],
    get: ['id', '_params'],
    list: ['_params']
  },
  fulfillment: {
    cancel: ['orderId', 'id'],
    complete: ['orderId', 'id'],
    count: ['orderId', '_params'],
    create: ['orderId', 'params'],
    createV2: ['params'],
    get: ['orderId', 'id', '_params'],
    list: ['orderId', '_params'],
    open: ['orderId', 'id'],
    update: ['orderId', 'id', 'params'],
    updateTracking: ['id', 'params']
  },
  fulfillmentEvent: {
    create: ['orderId', 'fulfillmentId', 'params'],
    delete: ['orderId', 'fulfillmentId', 'id'],
    get: ['orderId', 'fulfillmentId', 'id'],
    list: ['orderId', 'fulfillmentId', '_params'],
    update: ['orderId', 'fulfillmentId', 'id', 'params']
  },
  fulfillmentOrder: {
    cancel: ['id', 'fulfillmentOrder'],
    close: ['id', '_message'],
    get: ['id'],
    list: ['_params'],
    locationsForMove: ['id'],
    move: ['id', 'locationId']
  },
  fulfillmentRequest: {
    accept: ['fulfillmentOrderId', '_message'],
    create: ['fulfillmentOrderId', 'createFulfillmentRequest'],
    reject: ['fulfillmentOrderId', '_message']
  },
  fulfillmentService: {
    create: ['params'],
    delete: ['id'],
    get: ['id'],
    list: ['_params'],
    update: ['id', 'params']
  },
  giftCard: {
    count: ['_params'],
    create: ['params'],
    disable: ['id'],
    get: ['id'],
    list: ['_params'],
    search: ['params'],
    update: ['id', 'params']
  },
  giftCardAdjustment: {
    create: ['giftCardId', 'params'],
    get: ['giftCardId', 'id'],
    list: ['giftCardId']
  },
  graphql: ['data', '_variables'],
  inventoryItem: {
    get: ['id'],
    list: ['_params'],
    update: ['id', 'params']
  },
  inventoryLevel: {
    adjust: ['params'],
    connect: ['params'],
    delete: ['params'],
    list: ['params'],
    set: ['params']
  },
  location: {
    count: [],
    get: ['id'],
    inventoryLevels: ['id', '_params'],
    list: []
  },
  marketingEvent: {
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params'],
    engagements: ['id', 'params']
  },
  metafield: {
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  order: {
    cancel: ['id', '_params'],
    close: ['id'],
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    fulfillmentOrders: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    open: ['id'],
    update: ['id', 'params']
  },
  orderRisk: {
    create: ['orderId', 'params'],
    delete: ['orderId', 'id'],
    get: ['orderId', 'id'],
    list: ['orderId'],
    update: ['orderId', 'id', 'params']
  },
  page: {
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  payment: {
    count: ['checkoutToken'],
    create: ['checkoutToken', 'params'],
    get: ['checkoutToken', 'id'],
    list: ['_checkoutToken']
  },
  payout: {
    get: ['id'],
    list: ['_params']
  },
  policy: {
    list: ['_params']
  },
  priceRule: {
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  product: {
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  productImage: {
    count: ['productId', '_params'],
    create: ['productId', 'params'],
    delete: ['productId', 'id'],
    get: ['productId', 'id', '_params'],
    list: ['productId', '_params'],
    update: ['productId', 'id', 'params']
  },
  productListing: {
    count: [],
    create: ['productId', 'params'],
    delete: ['productId'],
    get: ['productId'],
    list: ['_params'],
    productIds: ['_params']
  },
  productResourceFeedback: {
    create: ['productId', 'params'],
    list: ['productId', '_params']
  },
  productVariant: {
    count: ['productId'],
    create: ['productId', 'params'],
    delete: ['productId', 'id'],
    get: ['id', '_params'],
    list: ['productId', '_params'],
    update: ['id', 'params']
  },
  province: {
    count: ['countryId', '_params'],
    get: ['countryId', 'id', '_params'],
    list: ['countryId', '_params'],
    update: ['countryId', 'id', 'params']
  },
  recurringApplicationCharge: {
    activate: ['id', 'params'],
    create: ['createRecurringApplicationCharge'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    customize: ['id', 'params']
  },
  redirect: {
    count: ['_params'],
    create: ['createRedirect'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'updateRedirect']
  },
  refund: {
    calculate: ['orderId', 'params'],
    create: ['orderId', 'params'],
    get: ['orderId', 'id', '_params'],
    list: ['orderId', '_params']
  },
  report: {
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  resourceFeedback: {
    create: ['params'],
    list: []
  },
  scriptTag: {
    count: ['_params'],
    create: ['createScriptTag'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'updateScriptTag']
  },
  shippingZone: {
    list: ['_params']
  },
  shop: {
    get: ['_params']
  },
  smartCollection: {
    count: ['_params'],
    create: ['params'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    order: ['id', 'params'],
    products: ['id', 'params'],
    update: ['id', 'params']
  },
  storefrontAccessToken: {
    create: ['params'],
    delete: ['id'],
    list: []
  },
  tenderTransaction: {
    list: ['_params']
  },
  theme: {
    create: ['params'],
    delete: ['id'],
    get: ['id', 'params'],
    list: ['_params'],
    update: ['id', 'params']
  },
  transaction: {
    count: ['orderId'],
    create: ['orderId', 'params'],
    get: ['orderId', 'id', '_params'],
    list: ['orderId', '_params']
  },
  usageCharge: {
    create: ['recurringApplicationChargeId', 'createUsageCharge'],
    get: ['recurringApplicationChargeId', 'id', '_params'],
    list: ['recurringApplicationChargeId', '_params']
  },
  user: {
    current: [],
    get: ['id'],
    list: []
  },
  webhook: {
    count: ['_params'],
    create: ['createWebhook'],
    delete: ['id'],
    get: ['id', '_params'],
    list: ['_params'],
    update: ['id', 'updateWebhook']
  }
};

export default shopifyResourceTypes;
