### Meteor JS Package
# shopify-api

Meteor JS package for building embedded Shopify apps that use the Shopify API.
This package handles everything needed to set-up an embedded Shopify app including app authenication / login process and with the Shopify API.

This package does not include all of the Shopify API endpoints, you can add your own as required depending on the functionality of your app.

[View package on Atmosphere](https://atmospherejs.com/cliffers/shopify-api)

#### Install package

```
meteor add cliffers:shopify-api
```

#### Package Init

##### Client Init
```
// Setup Shopify API options for client
ShopifyApi.init({
    appUrl: 		'https://yourAppUrl.com',
    apiKey: 		'App API Key...',
    scopes: 		'Shopify API scopes', 		// https://docs.shopify.com/api/authentication/oauth#scopes
    shopOverride: 	'shop-name.myshopify.com' 	// See 'shopOverride Option' section below (default is false)
```

##### Server Init
```
// Setup Shopify API options for server
ShopifyApi.init({
    apiKey: 	'App API Key...',
    secret: 	'App Secret...',
    shopOverride: 'shop-name.myshopify.com' // See 'shopOverride Option' section below (default is false)
});
```

##### shopOverride Option
This override option is useful during app development when working locally, outside of Shopify admin.
Passing a shopify shop url into this option will force the app to use this shop for the API and the app won't look for a shop parameter in the url from Shopify. 
Don't forget to remove this override in production!

#### Package Use

##### Using the Shopify API

This package gives you a API method for use with all of the Shopify API endpoints.

Just call `Meteor.call('shopify/api/call', 'GET', endpoint);`

You can replace 'GET' with any of the Meteor HTTP Methods such as:
'GET', 'POST', 'PUT', 'DEL'

Example custom endpoint method that you would add into your app:

```
Meteor.methods({
	
	/* ------------------------------------------------
	 * Example Shopify API Endpoint Method
	 * ------------------------------------------------
	 * Create your custom endpoint methods like this..
	 * ----------------------------------------------*/
	'shopify/api/product/get': function(variantId) {

		// Specifiy your the Shopify API endpoint
		var endpoint = '/admin/products/' + variantId + '.json';

		// Call the shopify/api/call method that comes with this package
		var result = Meteor.call('shopify/api/call', 'GET', endpoint);

		return result;
	},
});
```

*** Package is still in development ***