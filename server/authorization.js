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

var mongodbUtils = require('./mongodb.js')();
var acl = require('acl');

module.exports = function() {
  return {
  	"setUp" : function(app, authenticationUtils) {

      mongodbUtils.getDatabase(function(database) {
        acl = new acl(new acl.mongodbBackend(database, "acl"));
      });

      app.get('/admin/setacl', authenticationUtils.ensureAuthenticated, function (req, res) {
        
        acl.allow('guest', 'blogs', 'view');
        acl.addUserRoles(req.user['id'], 'guest')
        res.write('success');
        res.end();  
      });

      app.get('/admin/testacl', authenticationUtils.ensureAuthenticated, function (req, response) {
  
        acl.isAllowed(req.user['id'], 'blogs', 'view', function (err, res){
          if (res) {
            console.log("Current user is allowed to view blogs");
            response.write('Current user is allowed to view blogs');
            response.end();  
          }
          else {
            response.write('not allowed ');
            response.end();  
          }
        });
      });

      app.get('/admin/userroles', authenticationUtils.ensureAuthenticated , function (req, response) {
        acl.userRoles( req.user['id'], function (err, roles) {
          if (roles) {
            response.write('Roles: ' + roles);
            response.end();  
          }
          else { 
            response.write('No roles');
            response.end();  
          }
        });
      });
      		
  	}
  };
};