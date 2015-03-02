if (Meteor.isClient) {

	Router.onBeforeAction(function() {

		// Handle the OAuth login process before anything else
		shopifyAppLogin(this.params.query);
	}, { except: ['shopifyAuthenticate'] });

	Router.route('shopifyAuthenticate', {
		path: '/shopify/authenticate',

		action: function() {

			console.log('Back from Shopify!');

			var code = this.params.query.code;
			var shop = this.params.query.shop;

        	Meteor.call('shopify/api/auth', code, shop, function(error, result) {
            	if (result) {
            		
            		console.log(result);

            	} else if (error) {
                	console.log(error.reason)
            	}
        	});
		}
	});

	Router.route('shopifyApiConnector', {
		path: '/shopify/connector',
	});

	var shopifyAppLogin = function(params) {

		if (!params.hmac || !params.signature || !params.shop) {
			throw new Error('Missing params from shopify, cannot login');
		}

		// Validate signature to ensure its from Shopify
		validSignature = shopifySignatureValidation(params);

		// If no signature match then throw an error
		//if (!validSignature) {
			//throw new Error('Cannot validate Shopify OAuth signature. There maybe a security issue.');
		//}

		// Get shop name from shop param
		var shopName = params.shop.replace('.myshopify.com', '');

		var url = 'https://' + shopName + '.myshopify.com/admin/oauth/authorize?' +
	            'client_id=' + ShopifyApi.options.apiKey +
	            '&scope=' + ShopifyApi.options.scopes +
	            '&redirect_uri=' + ShopifyApi.options.appUrl + '/shopify/authenticate';

		// Do the redirect to shopify for authorisation
		window.location.replace(url);
	}

	// Shopify oauth signature validation
	// http://docs.shopify.com/api/authentication/oauth
	var shopifySignatureValidation = function(params) {

		var hmac = params.hmac;

		// Delete signature and hmac as shopify docs specifies
		delete params.signature;
		delete params.hmac;

		// Create message string
		var message = $.param(params);

		// Do the hmac sha256 encrypting
		var hash = CryptoJS.HmacSHA256(message, ShopifyApi.options.secret).toString();

		// Return true if we have a match, otherwise return false
		return hash === hmac;
	}
}