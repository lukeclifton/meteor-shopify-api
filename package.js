Package.describe({
	name: 'lukeclifton:shopify-api',
	summary: 'Package for the Shopify API. Also handles OAuth authentication for embedded Shopify apps built with Meteor',
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
	api.use(['http'], 'server');

	api.addFiles('server.js', 'server');
	api.addFiles('client.js', 'client');
	api.addFiles('router.js', 'client');

	api.export('ShopifyApi');
});