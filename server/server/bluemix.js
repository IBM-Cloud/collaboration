//------------------------------------------------------------------------------
// Copyright IBM Corp. 2016
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var cfenv = require('./cfenv-wrapper');
var appEnv = cfenv.getAppEnv();

var Cloudant = require('cloudant');

var models = require('./model-config.json'), dataSources = require('./datasources.json');

module.exports = function() {
  return {
  	"setUpCloudant" : function(databaseName, callback) {
         
      var cloudantConfig = appEnv.getService(/cloudant.*/);
      if (!cloudantConfig) {
        var err = 'Error: No Cloudant config found';
        console.log(err);
        callback(err);
      }
      var cloudantUsername = cloudantConfig.credentials.username;
      if (!cloudantUsername) {
        var err = 'Error: No Cloudant user found';
        console.log(err);
        callback(err);
      }
      var cloudantPassword = cloudantConfig.credentials.password;
      if (!cloudantPassword) {
        var err = 'Error: No Cloudant password found';
        console.log(err);
        callback(err);
      }

      var cloudant = Cloudant({account:cloudantUsername, password:cloudantPassword});

      cloudant.db.create(databaseName, function(err) {
        dataSources.cloudant = {
          "name": "cloudant",
          "connector": "cloudant",
          "username": cloudantUsername,
          "password": cloudantPassword,
          "database": databaseName
        };

        callback(null);
      });
  	},
    "setUpSSOAuthentication" : function(app, loopback, boot, callback) {

      var ssoConfig = appEnv.getService(/sso.*/);
      if (!ssoConfig) {
        callback(null); 
      }
      else {
        var loopbackPassport = require('loopback-component-passport');
        var PassportConfigurator = loopbackPassport.PassportConfigurator;
        var passportConfigurator = new PassportConfigurator(app);
        var bodyParser = require('body-parser');
        var flash      = require('express-flash');

        var path = require('path');
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');

        boot(app, __dirname);

        app.middleware('parse', bodyParser.json());
        app.middleware('parse', bodyParser.urlencoded({
          extended: true
        }));

        app.middleware('auth', loopback.token({
          model: app.models.accessToken
        }));

        app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
        app.middleware('session', loopback.session({
          secret: 'kitty',
          saveUninitialized: true,
          resave: true
        }));
        passportConfigurator.init();

        app.use(flash());

        passportConfigurator.setupModels({
          userModel: app.models.Person,
          userIdentityModel: app.models.userIdentity,
          userCredentialModel: app.models.userCredential
        });

        var options = {
          "provider": "ibm",
          "module": "passport-idaas-openidconnect",
          "strategy": "IDaaSOIDCStrategy",
          "clientID": ssoConfig.credentials.clientId,
          "clientSecret": ssoConfig.credentials.secret,
          "authorizationURL": ssoConfig.credentials.authorizationEndpointUrl,
          "tokenURL": ssoConfig.credentials.tokenEndpointUrl,
          "scope": "openid",
          "response_type": "code",
          "callbackURL": "/auth/ibm/callback",
          "skipUserProfile": true,
          "issuer": ssoConfig.credentials.issuerIdentifier,
          "authScheme": "openid connect",
          "authPath": "/auth/ibm",
          "session": true,
          "failureFlash": true
        };
        passportConfigurator.configureProvider("ibm", options);

        var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

        app.get('/auth/account', ensureLoggedIn('/login'), function (req, res, next) {
          res.render('pages/loginProfiles', {
            user: req.user,
            url: req.url
          });
        });

        app.get('/login', function (req, res, next){
          res.render('pages/login', {
            user: req.user,
            url: req.url
           });
        });

        app.get('/auth/logout', function (req, res, next) {
          req.logout();
          res.redirect('/');
        });

        callback(null);
      }
    }
  };
};