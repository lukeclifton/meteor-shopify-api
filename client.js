// Setup options (client version with secret omitted)
ShopifyApi = {
    options: {
        appUrl: '',
        shop:   '',
        apiKey: '',
        scopes: '',
        authSuccessRoute: '',
    }
};

/* --------------------------------------
 * Shopify app authorization procedure function
 * --------------------------------------
 * Kicks off the shopify app authenication process for logging in
 * We re-authenticate our app everytime we login as reconmended by shopify
 * ------------------------------------*/
ShopifyApi.authorizeApp = function(params) {

	if (!params.hmac || !params.signature || !params.shop) {
		throw new Error('Cannot authorise app: hmac, signature OR shop parameters missing');
	}

	// Validate signature to ensure its from Shopify
	var validSignature = ShopifyApi.signatureValidation(params);

	// If no signature match then throw an error
	if (!validSignature) {
		throw new Error('Cannot validate Shopify OAuth signature. There maybe a security issue.');
	}

	// Get shop name from shop param
	var shopName = params.shop.replace('.myshopify.com', '');

	var url = 'https://' + shopName + '.myshopify.com/admin/oauth/authorize?' +
	          'client_id=' + ShopifyApi.options.apiKey +
	          '&scope=' + ShopifyApi.options.scopes +
	          '&redirect_uri=' + ShopifyApi.options.appUrl + '/shopify/authenticate';

	// Do the redirect to shopify for authorisation
	window.location.replace(url);
}

/* --------------------------------------
 * Shopify oauth signature validation function
 * --------------------------------------
 * Validates the shopify oauth signature according to: 
 * http://docs.shopify.com/api/authentication/oauth
 * ------------------------------------*/
ShopifyApi.signatureValidation = function(params) {

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

/* --------------------------------------
 * Login with Shopify function
 * --------------------------------------
 * Log the given userId in, used after the a successful shopify authorisation process
 * ------------------------------------*/
loginWithShopify = function(userId) {
	// create a login request with shopify: true, so our custom loginHandler can handle this request
	var loginRequest = {
		shopify: true, 
		userId: userId,
	};

	Accounts.callLoginMethod({
  		methodArguments: [loginRequest],

  		// login success callback
  		userCallback: function (error) {
      		if (!error) {

      			// Route to app index page
           		Router.go(ShopifyApi.options.authSuccessRoute);

      		} else {
      			console.log(error);
      		}
  		}
  	});
};