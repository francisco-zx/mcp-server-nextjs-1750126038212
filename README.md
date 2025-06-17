# mcp-server-nextjs-1750126038212

Next.js application with an MCP Server generated from an OpenAPI specification.

## Tools Available

- **/api/v1/register**: REGISTER
- **/api/v1/login**: LOGIN
- **/api/v1/logout**: LOGOUT
- **/api/v1/user**: GET USER DATA
- **/api/v1/user**: PATCH USER
- **/api/v1/user**: DELETE USER
- **/api/v1/user/rating**: GET USER RATING
- **/api/v1/user/rating**: CREATE USER RATING
- **/api/v1/user/rating/{userId}**: GET USER RATING LIST
- **/api/v1/user/top**: TOP USERS
- **/api/v1/user/profile**: EDIT USER
- **/api/v1/user/preferences**: GET USER PREFERENCES
- **/api/v1/user/preferences**: EDIT USER PREFERENCES
- **/api/v1/user/sellers**: GET SELLER USER
- **/api/v1/user/personal-data**: EDIT USER PERSONAL DATA
- **/api/v1/user/follow**: FOLLOW USER
- **/api/v1/user/change-password**: CHANGE PASSWORD
- **/api/v1/user/recover-password/start**: VALIDATE EMAIL AVAILABILITY FOR RECOVER PASSWORD
- **/api/v1/user/recover-password/send**: SEND EMAIL VALIDATION CODE FOR RECOVER
- **/api/v1/user/password**: USER HAS PASSWORD
- **/api/v1/user/create-new-password**: CREATE NEW PASSWORD FOR OAUTH USER
- **/api/v1/user/create-password**: SET NEW PASSWORD (RECOVER)
- **/api/v1/user/followed**: GET USER FOLLOWED
- **/api/v1/user/followers**: GET USER FOLLOWERS
- **/api/v1/user/followers/count**: GET USER FOLLOWERS COUNT
- **/api/v1/user/availability/username**: VALIDATE USERNAME AVAILABILITY
- **/api/v1/user/availability/email**: VALIDATE EMAIL AVAILABILITY
- **/api/v1/user/availability/phone**: VALIDATE PHONE AVAILABILITY
- **/api/v1/user/email/send**: SEND EMAIL VALIDATION CODE
- **/api/v1/user/email/verify**: VERIFY EMAIL CODE
- **/api/v1/user/balance**: GET USER BALANCE
- **/api/v1/user/movements**: GET USER MOVEMENTS
- **/api/v1/user/movements**: ADD USER MOVEMENTS
- **/api/v1/user/report**: REPORT USER
- **/api/v1/user/{username}**: GET USER BY USERNAME
- **/api/v1/user/{username}/shop**: SHOP
- **/api/v1/user/{username}/shop/paused**: GET USER PAUSED PRODUCTS
- **/api/v1/user/{username}/likes**: LIKES
- **/api/v1/user/block**: BLOCK USER
- **/api/v1/user/unblock**: UNBLOCK USER
- **/api/v1/user/blocked**: GET BLOCKED USERS
- **/api/v1/user/blocked/{userId}**: IS BLOCKED BY USER
- **/api/v1/user/deleteFull**: DELETE FULL USER
- **/api/v1/user/comission**: GET CURRENT USER COMISSION
- **/api/v1/user/flex**: UPDATE PICKUP SHIPMENT
- **/api/v1/analytics/demography**: GET USER DEMOGRAPHY
- **/api/v1/offers/{as}**: GET OFFERS
- **/api/v1/offer/{as}/{offer}**: GET OFFER
- **/api/v1/offer/create**: CREATE OFFER
- **/api/v1/offer/update**: UPDATE OFFER
- **/api/v1/product/search**: SEARCH PRODUCTS
- **/api/v1/product**: CREATE PRODUCT
- **/api/v1/product/featured**: SEARCH FEATURED PRODUCTS
- **/api/v1/product/delete0PriceVariants**: FIX 0 PRICE VARIANTS
- **/api/v1/product/addrandom**: ADD RANDOM NUMBER
- **/api/v1/product/disable-gift-cards**: DISABLE GIFT CARDS PRODUCTS
- **/api/v1/product/{id}**: GET PRODUCT BY ID
- **/api/v1/product/{id}**: UPDATE PRODUCT
- **/api/v1/product/{id}**: DELETE PRODUCT
- **/api/v1/product/{id}/related**: GET RELATED PRODUCTS
- **/api/v1/product/{id}/related-typesense**: GET RELATED PRODUCTS TYPESENSE
- **/api/v1/product/{id}/status**: SET PRODUCT STATUS
- **/api/v1/product/{id}/discount**: SET PRODUCT VARIANT STATUS
- **/api/v1/product/feature**: FEATURE PRODUCT
- **/api/v1/product/setGender**: SET GENDER TO ALL USER PRODUCTS
- **/api/v1/product/pauseProductsWithoutImages**: PAUSE PRODUCTS WITHOUT IMAGES
- **/api/v1/product/updateUSDProductPrices**: UPDATE USD PRODUCT PRICES
- **/api/v1/product/deleteUserPausedProducts**: DELETE USER PAUSED PRODUCTS
- **/api/v1/product/fixDiscounts**: FIX DISCOUNTS
- **/api/v1/product/generateAllSlugs**: GENERATE ALL SLUGS
- **/api/v1/product/fixRepeatedSlugs**: FIX REPEATED SLUGS
- **/api/v1/product/metaQuery**: META QUERY
- **/api/v1/product/brand/all**: GET ALL BRANDS
- **/api/v1/product/brand/{id}**: GET BRAND BY ID
- **/api/v1/product/brand/{id}**: DELETE BRAND
- **/api/v1/product/brand/{id}**: EDIT BRAND
- **/api/v1/product/brand/name/{term}**: GET BRANDS BY NAME
- **/api/v1/product/brand**: CREATE BRAND
- **/api/v1/product/color/all**: GET ALL COLORS
- **/api/v1/product/color/{name}**: GET COLOR BY NAME
- **/api/v1/product/color**: CREATE COLOR
- **/api/v1/product/color/{id}**: DELETE COLOR
- **/api/v1/product/color/{id}**: EDIT COLOR
- **/api/v1/product/gender/all**: GET ALL GENDERS
- **/api/v1/product/gender/update**: UPDATE PRODUCT GENDER
- **/api/v1/product/size/by-attributes**: GET SIZES BY CATEGORY & GENDER
- **/api/v1/product/size/by-categoryname**: GET SIZES BY CATEGORY NAME & GENDER
- **/api/v1/product/size/all**: GET ALL SIZES
- **/api/v1/product/size/{name}**: GET SIZE BY NAME
- **/api/v1/product/size/{id}**: DELETE SIZE
- **/api/v1/product/size/{id}**: EDIT SIZE
- **/api/v1/product/size**: CREATE SIZE
- **/api/v1/product/state/all**: GET STATES
- **/api/v1/product/state/{name}**: GET STATE BY NAME
- **/api/v1/product/style/all**: GET STYLES
- **/api/v1/product/style/featured**: GET FEATURED STYLES
- **/api/v1/product/style/{id}**: GET STYLE BY ID
- **/api/v1/product/style/{id}**: DELETE STYLES
- **/api/v1/product/style/{id}**: EDIT STYLES
- **/api/v1/product/style**: CREATE STYLES
- **/api/v1/product/{id}/like**: GET PRODUCT LIKES
- **/api/v1/product/{id}/like**: DELETE LIKE
- **/api/v1/product/like**: LIKE PRODUCT
- **/api/v1/product/like/{id}**: GET USER LIKED PRODUCTS
- **/api/v1/product/{id}/comment**: GET PRODUCT COMMENTS
- **/api/v1/product/{id}/comment**: CREATE COMMENT TO PRODUCT
- **/api/v1/product/{id}/comment**: DELETE COMMENT
- **/api/v1/comment/{id}**: REPLY TO COMMENT
- **/api/v1/comment/{id}/reply/{replyId}**: DELETE REPLY
- **/api/v1/product/category/all**: GET ALL CATEGORIES
- **/api/v1/product/category/featured**: GET FEATURED CATEGORIES
- **/api/v1/product/category**: CREATE CATEGORY
- **/api/v1/product/category/[id]**: CREATE SUBCATEGORY
- **/api/v1/product/category/{id}**: DELETE CATEGORY
- **/api/v1/product/category/{id}**: GET CATEGORY BY ID
- **/api/v1/product/category/gender**: GET CATEGORY BY GENDER
- **/api/v1/cart**: GET CART
- **/api/v1/cart**: UPDATE CART ITEM QUANTITY
- **/api/v1/cart**: ADD CART ITEM
- **/api/v1/cart**: DELETE CART ITEM
- **/api/v1/cart/metrics**: GET CART METRICS
- **/api/v1/cart/reset**: RESET CART
- **/api/v1/feed**: GET FEED
- **/api/v1/feed/v2**: GET FEED V2
- **/api/v1/account/address**: GET USER ADDRESSES
- **/api/v1/account/address**: CREATE USER ADDRESS
- **/api/v1/account/address**: EDIT USER ADDRESS
- **/api/v1/account/address**: DELETE USER ADDRESS
- **/api/v1/account/payment_method**: GET USER PAYMENT METHOD
- **/api/v1/account/payment_method**: UPDATE USER ACTIVE PAYMENT METHOD
- **/api/v1/account/balance**: GET ACCOUNT BALANCE
- **/api/v1/account/movements**: GET ACCOUNT MOVEMENTS
- **/api/v1/account/withdraw**: WITHDRAW ACCOUNT BALANCE
- **/api/v1/order**: GET ORDER
- **/api/v1/order**: CREATE ORDER
- **/api/v1/order/existing**: EXPIRE EXISTING ORDER
- **/api/v1/order/purchases**: GET PURCHASES
- **/api/v1/order/sales**: GET SALES
- **/api/v1/order/sales/{id}**: GET SALE
- **/api/v1/order/paymentRes**: GET PAYMENT MP
- **/api/v1/order/{id}**: GET ORDER BY ID
- **/api/v1/order/{id}/step**: UPDATE ORDER CHECKOUT STEP
- **/api/v1/order/{id}/shipment-method**: UPDATE ORDER SHIPMENT METHOD
- **/api/v1/order/shipment-type**: UPDATE ORDER SHIPMENT TYPE
- **/api/v1/order/{id}/payment**: CREATE ORDER PAYMENT
- **/api/v1/order/{id}/preference**: CREATE PAYMENT PREFERENCE
- **/api/v1/order/{id}/mark-paid**: MARK ORDER AS PAID (ONLY FOR ADMIN)
- **/api/v1/order/quote**: GET ZIPPIN QUOTE
- **/api/v1/order/{fulfillmentId}/shipment**: Create Shipment
- **/api/v1/order/label**: Get Shipment Label
- **/api/v1/order/return**: CREATE RETURN
- **/api/v1/order/collectEarnings**: COLLECT EARNINGS
- **/api/v1/order/fulfillment_order/{id}/status**: UPDATE FULFILLMENT ORDER STATUS
- **/api/v1/order/fulfillment_order/{id}/shipment**: GENERATE ORDER SHIPMENT
- **/api/v1/order/test-mp-items**: TEST MP ORDER ITEMS
- **/api/v1/boutique**: GET BOUTIQUES
- **/api/v1/boutique/top**: GET TOP BOUTIQUES
- **/api/v1/boutique/woocommerce**: SET ACCESS TOKEN WOOCOMMERCE
- **/api/v1/boutique/style**: ADD STYLE TO BOUTIQUE
- **/api/v1/boutique/tiendanube/webhooks**: POST WEBHOOKS TIENDANUBE
- **/api/v1/boutique/checkBoutiqueCredentials**: CHECK BOUTIQUE CREDENTIALS
- **/api/v1/boutique/checkAllBoutiqueCredentials**: CHECK ALL BOUTIQUE CREDENTIALS
- **/api/v1/boutique/setInactive**: SET BOUTIQUE INACTIVE
- **/api/v1/boutique/resyncCategories**: RESYNC CATEGORIES
- **/api/v1/tiendanube/app/resumed**: APP RESUMED
- **/api/v1/tiendanube/app/suspended**: APP SUSPENDED
- **/api/v1/tiendanube/app/uninstalled**: APP UNINSTALLED
- **/api/v1/tiendanube/install**: INSTALL
- **/api/v1/tiendanube/order/cancelled**: ORDER CANCEL
- **/api/v1/tiendanube/order/packed**: ORDER PACKED
- **/api/v1/tiendanube/product/created**: PRODUCT CREATED
- **/api/v1/tiendanube/product/updated**: PRODUCT UPDATED
- **/api/v1/tiendanube/product/deleted**: PRODUCT DELETED
- **/api/v1/tiendanube/resync**: RESYNC BOUTIQUE
- **/api/v1/zippin/status**: ZIPPIN STATUS
- **/api/v1/epick/status**: EPICK STATUS
- **/api/v1/woocommerce/{wooid}/product/created**: PRODUCT CREATED
- **/api/v1/woocommerce/{wooid}/product/updated**: PRODUCT UPDATED
- **/api/v1/woocommerce/{wooid}/product/deleted**: PRODUCT DELETED
- **/api/v1/woocommerce/fix**: Fix WOO
- **/api/v1/shopify/verify/{id}**: VERIFY INSTALL
- **/api/v1/shopify/install**: INSTALL
- **/api/v1/shopify/product/created**: PRODUCT CREATED
- **/api/v1/shopify/product/updated**: PRODUCT UPDATED
- **/api/v1/shopify/product/deleted**: PRODUCT DELETED
- **/api/v1/shopify/app/uninstalled**: APP UNINSTALLED
- **/api/v1/shopify/resync**: SHOPIFY RESYNC
- **/api/v1/shopify/postWebhooks**: SHOPIFY POST WEBHOOKS
- **/api/v1/webhooks/mercadopago**: MERCADOPAGO WEBHOOK
- **/api/v1/grid/products**: GET GRID PRODUCTS
- **/api/v1/grid/product**: GET GRID PRODUCT
- **/api/v1/grid/product/created**: GRID PRODUCT CREATED
- **/api/v1/grid/product/updated**: GRID PRODUCT UPDATED
- **/api/v1/grid/product/deleted**: GRID PRODUCT DELETED
- **/api/v1/grid/setToken**: SET ACCESS TOKEN GRID
- **/api/v1/epick/activate**: ACTIVATE EPICK
- **/api/v1/resource**: CREATE RESOURCE
- **/api/v1/push-notifications**: GET PUSH NOTIFICATIONS
- **/api/v1/notifications/read**: MARK ALL NOTIFICATIONS AS READ
- **/api/v1/notifications/topics**: GET TOPICS
- **/api/v1/notifications/preferences**: GET NOTIFICATIONS PREFERENCES
- **/api/v1/notifications/preferences**: SET NOTIFICATIONS PREFERENCES
- **/api/v1/notifications/create**: CREATE NOTIFICATION
- **/api/v1/notifications/email/test**: SEND EMAIL NOTIFICATION
- **/api/v1/notifications/notifyusers**: NOTIFY MATCHING USERS
- **/api/v1/scheduler/execute**: EXECUTE A PREVIOUSLY SCHEDULED JOB
- **/api/v1/payments/accounts**: GET ACCOUNTS
- **/api/v1/payments/accounts/{account_id}/movements**: GET ACCOUNT MOVEMENTS
- **/api/v1/payments/validate/alias**: VALIDATE ALIAS
- **/api/v1/payments/validate/cbu**: VALIDATE CBU
- **/api/v1/payments/transaction/{id}**: GET TRANSACTION
- **/api/v1/search/reindex**: TEMPORARY FOR THE INTEGRATION> DO NOT USE
- **/api/v1/search/index**: UPDATE INDEX BY ID
- **/api/v1/search/reIndexByUserId**: UPDATE INDEX BY USER ID
- **/api/v1/search/federated**: FEDERATED SEARCH WITH PRODUCTS (MARKETPLACE/BOUTIQUE), USERS
- **/api/v1/search/products**: PRODUCT SEARCH
- **/api/v1/search/users**: USERS SEARCH
- **/api/v1/suggested/products**: GET SUGGESTED PRODUCTS
- **/api/v1/search/brands**: GET BRANDS
- **/api/v1/shipping/locations**: GET SHIPPING LOCATIONS
- **/api/v1/shipping/dropoff_locations**: GET SHIPPING LOCATIONS BY SHIPMENT ID
- **/api/v1/shipping/confirm-pickup**: CONFIRM ORDER FOR PICKUP
- **/api/v1/shipping/{shipment_id}/download**: DOWNLOAD SHIPPING INSTRUCTIONS
- **/api/v1/image**: GET S3 PRE SIGNED URL
- **/api/v1/app/check-version**: CHECK APP VERSION

## Getting Started

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The MCP server endpoint is available at `/api/mcp`. You can test it with the [MCP Inspector](https://www.npmjs.com/package/@modelcontextprotocol/inspector).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
