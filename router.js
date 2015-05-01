/* --------------------------------------
 * Shopify app authenticate route
 * --------------------------------------
 * This route takes the passed code and shop params returned from shopify authorization redirect
 * and calls the generateAccessToken method to generate and save a permanent access token
 * If successfull, then we log the shopify user in
 * ------------------------------------*/
Router.route('shopifyAuthenticate', {
	path: '/shopify/authenticate',

	action: function() {

		var code = this.params.query.code;
		var shop = this.params.query.shop;

        Meteor.call('shopify/oauth/generateAccessToken', code, shop, function(error, result) {

            if (result) {

            	// Shopify authentication successfull, so log the user in
            	loginWithShopify(result.userId);

            } else if (error) {
            	console.error(error.reason);
            }
        });
	}
});
