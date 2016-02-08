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

var express = require('express');
var mongodbUtils = require('./mongodb.js')();
var authenticationUtils = require('./authentication.js')();
var authorizationUtils = require('./authorization.js')();
var cfenv = require('./cfenv-wrapper');
var appEnv = cfenv.getAppEnv();

var app = express();

authenticationUtils.setUp(app);

authorizationUtils.setUp(app, authenticationUtils);

app.use(express.static(__dirname + '/public'));
app.listen(appEnv.port, function() {
  console.log("Server starting on " + appEnv.url);
});