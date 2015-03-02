Package.describe({
  name: 'lukeclifton:shopify-api-meteor',
  summary: 'Shopify API Package for Meteor.js',
  version: '1.0.0',
  git: 'https://github.com/lukeclifton/shopify-api-meteor'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');

  // Both client and server
  api.use([
    'mongo',
    'iron:router',
    'accounts-base',
    'service-configuration',
  ], ['client', 'server']);

  // Client only
  api.use([
    'templating',
    'jparker:crypto-sha256',
    'jparker:crypto-hmac',
  ], 'client');

  // Server only
  api.use([
    'http'
  ], 'server');

  api.addFiles([
    'views/shopify-api-connector.html',
    'client.js',
    'router.js',
    'shopify-api-meteor.js',
  ]);

  api.export('ShopifyApi');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('lukeclifton:shopify-api-meteor');
  api.addFiles('lukeclifton:shopify-api-meteor-tests.js');
});