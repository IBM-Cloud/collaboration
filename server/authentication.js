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
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var mongodbUtils = require('./mongodb.js')();

module.exports = function() {
  return {
  	"setUp" : function(app, callback) {
      var store;

      var mongodbConfig = appEnv.getService(/mongodb.*/);
      if (!mongodbConfig) {
        var err = 'Error: No MongoDB config found';
        console.log(err);
        callback(err);
      }
      var mongodbUrl = mongodbConfig.credentials.url;
      if (!mongodbUrl) {
        var err = 'Error: No MongoDB URL found';
        console.log(err);
        callback(err);
      }

      store = new MongoDBStore({ 
        uri: mongodbUrl,
        collection: 'mySessions'
      });
      store.on('error', function(error) {
        console.log('Error: MongoDBStore ' + error);
      });

      app.use(cookieParser());
      app.use(session({
        store: store,
        cookie: {
          maxAge: 1000 * 60 * 60 * 1 // 1 hour ?
        },
        resave: 'true',
        saveUninitialized: 'true',
        secret: 'top secr8t'
      }));

      app.use(passport.initialize());
      app.use(passport.session());

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(obj, done) {
        done(null, obj);
      });

      var ssoConfig = appEnv.getService(/sso.*/);
      var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
      var Strategy = new OpenIDConnectStrategy({
        authorizationURL : ssoConfig.credentials.authorizationEndpointUrl,
        tokenURL : ssoConfig.credentials.tokenEndpointUrl,
        clientID : ssoConfig.credentials.clientId,
        scope: 'openid',
        response_type: 'code',
        clientSecret : ssoConfig.credentials.secret,
        callbackURL : appEnv.url + '/auth/sso/callback',
        skipUserProfile: true,
        issuer: ssoConfig.credentials.issuerIdentifier},
        function(accessToken, refreshToken, profile, done) {
          process.nextTick(function() {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
          })
        });

      passport.use(Strategy);
      app.get('/login', passport.authenticate('openidconnect', {}));

      app.get('/auth/sso/callback',function(req,res,next) {
        var redirect_url = req.session.originalUrl;
        passport.authenticate('openidconnect',{
          successRedirect: redirect_url,
          failureRedirect: '/failure',
        })(req, res, next);
      });

      app.get('/failure', function(req, res) {
        res.send('Error: Login failed'); 
      });

      app.get('/admin/currentuser', this.ensureAuthenticated, function(req, res) {
        res.send('Logged in user: '+ req.user['id']);
      });

      app.get('/admin/usersessions', this.ensureAuthenticated, function (req, res) {
        var errorText = 'Error: Sessions cannot be read from MongoDB';
        mongodbUtils.getDatabase(function(err, db) {
          if (db) {
            db.collection('mySessions').find({}, {limit:10, sort:[['_id', 'desc']]}, function(err, cursor) {
            if (err) {
              console.log(errorText, err);
              res.write(errorText);
              res.end();
            } 
            else {
              cursor.toArray(function(err, items) {
                if (err) {
                  console.log(errorText, err);
                  res.write(errorText);
                  res.end();
                } 
                else {
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  for (i=0; i < items.length; i++) {
                    res.write(JSON.stringify(items[i]) + "\n");
                  }
                  res.end();
                }
              });
            }
            });     
          } 
          else {
            console.log(errorText);
            res.write(errorText);
            res.end();
          }
        });
      });
      callback(null);
  	},
    "ensureAuthenticated" : function(req, res, next) {      
      var useBasicAuthorization = false;
      var authorizationHeader = req.headers['authorization'];
      if (authorizationHeader) {
        useBasicAuthorization = true;
      }
      if (useBasicAuthorization) {
        res.sendStatus(403);
        /*
        var user = auth(req);
        if (user.name == 'elusuario') { // tbd: remove hardcoded test case
          next();
        }
        else {
          res.sendStatus(403);
        }
        */
      } 
      else {
        if (!req.isAuthenticated()) {
          req.session.originalUrl = req.originalUrl;
          res.redirect('/login');
        } 
        else {
          next();
        }
      }
	  }
  };
};