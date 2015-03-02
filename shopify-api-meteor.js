// Set-up the package options and api endpoints
ShopifyApi = {
    options: {
        appUrl: '',
        apiKey: '',
        secret: '',
        scopes: '',
        authSuccessRoute: '',
    }
};

// Ensure that all the required package options are set, if not then throw an error
if (Meteor.isServer) {
    Meteor.startup(function() {

        if (!ShopifyApi.options.hasOwnProperty('appUrl') || ShopifyApi.options.appUrl === '') { 
            throw new Meteor.Error('400', 'Required appUrl option missing for Shopify API Package');
        }
        if (!ShopifyApi.options.hasOwnProperty('apiKey') || ShopifyApi.options.apiKey === '') { 
            throw new Meteor.Error('400', 'Required apiKey option missing for Shopify API Package');
        }
        if (!ShopifyApi.options.hasOwnProperty('secret') || ShopifyApi.options.secret === '') { 
            throw new Meteor.Error('400', 'Required secret option missing for Shopify API Package');
        }
        if (!ShopifyApi.options.hasOwnProperty('scopes') || ShopifyApi.options.scopes === '') { 
            throw new Meteor.Error('400', 'Required scopes option missing for Shopify API Package');
        }
        if (!ShopifyApi.options.hasOwnProperty('authSuccessRoute') || ShopifyApi.options.authSuccessRoute === '') { 
            throw new Meteor.Error('400', 'Required authSuccessRoute option missing for Shopify API Package');
        }


        // Set up shopify as meteor oauth external service
        ServiceConfiguration.configurations.upsert(
          { service: 'shopify' },
          {
            $set: {
                clientId: ShopifyApi.options.apiKey,
                loginStyle: 'popup',
                secret: ShopifyApi.options.secret,
            }
          }
        );
    });

    Meteor.methods({
        
        'shopify/api/auth': function(code, shop) {
    
            if (!shop || !code) {
                throw new Meteor.Error('400', 'Params missing for shopifyAuth');
            }
    
            this.unblock();
    
            var apiKey = ShopifyApi.options.apiKey,
                secret = ShopifyApi.options.secret;
        
            var url = 'https://' + shop + '/admin/oauth/access_token';
            var data = { 
                client_id: apiKey, 
                client_secret: secret, 
                code: code 
            };
    
            var result = HTTP.post(url, { params: data }); 
            
            if (result.statusCode === 200) {

                var user = Meteor.call('shopify/updateOrCreateUser', shop, result.data.access_token);

                return user.userId;
                
            } else {
                throw new Meteor.Error('503', 'Shopify authorization failed');
            }
        },
    
        'shopify/updateOrCreateUser': function(shop, accessToken) {

            var serviceData = {
                id: shop,
                accessToken: accessToken,
                shopName: shop,
                shop: shop,
            }

            return Accounts.updateOrCreateUserFromExternalService('shopify', serviceData);
        },

        'shopify/api/credentials': function() {
            var shopifyCredentials = ShopifyCredentials.findOne({});
            
            return {
                shop: shopifyCredentials.shop,
                token: shopifyCredentials.token,
            }
        },
    
        'shopify/api/get': function(endpoint, options) {
    
            var shop = Meteor.call('shopify/api/credentials').shop,
                token = Meteor.call('shopify/api/credentials').token,
                apiUrl = 'https://' + shop + endpoint;
    
            if (!shop || !token || !apiUrl) {
                throw new Meteor.Error('400', 'Missing parameter for Shopify API call');
            }
    
            this.unblock();
    
            var res = HTTP.get(apiUrl,
                { headers: { "X-Shopify-Access-Token": token }, params: options });
    
            if (res.statusCode === 200) {
                return res.data;
            } else {
                return res.error;
            }
        },
    
        'shopify/api/post': function(endpoint, content) {

            var shop = Meteor.call('shopify/api/credentials').shop,
                token = Meteor.call('shopify/api/credentials').token,
                apiUrl = 'https://' + shop + endpoint;
    
            if (!shop || !token || !apiUrl) {
                throw new Meteor.Error('400', 'Missing parameter for Shopify API call');
            }
    
            this.unblock();
    
            var res = HTTP.post(apiUrl, { headers: { "X-Shopify-Access-Token": token, "content-type": "application/json" }, content: content });
        
            if (res.statusCode === 201) {
                return res.data;
            } else {
                return res.error;
            }
        },
    
        'shopify/api/put': function(endpoint, content) {
    
            var shop = Meteor.call('shopify/api/credentials').shop,
                token = Meteor.call('shopify/api/credentials').token,
                apiUrl = 'https://' + shop + endpoint;
    
            if (!shop || !token || !apiUrl) {
                throw new Meteor.Error('400', 'Missing parameter for Shopify API call');
            }
    
            this.unblock();
    
            var res = HTTP.put(apiUrl, { headers: { "X-Shopify-Access-Token": token, "content-type": "application/json" }, content: content });
        
            if (res.statusCode === 201) {
                return res.data;
            } else {
                return res.error;
            }
        }
    });
}