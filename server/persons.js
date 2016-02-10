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
var authenticationUtils = require('./authentication.js')();

module.exports = function() {
  return {
  	"setUp" : function(app, acl) {
      var self = this;

      app.get('/api/persons', authenticationUtils.ensureAuthenticated, function (req, res) {

        acl.isAllowed(req.user['id'], 'persons', 'view', function (err, response) {
          if (response) {

            mongodbUtils.getDatabase(function(err, db) {
              if (db) {
                db.collection('persons').find({}, {sort:[['displayName', 'desc']]}, function(err, cursor) {
                  if (err) {
                    console.log(err);
                    res.write(err);
                    res.end();
                  } 
                  else {
                    cursor.toArray(function(err, items) {
                      if (err) {
                        console.log(err);
                        res.write(err);
                        res.end();
                      } 
                      else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify(items));
                        res.end();
                      }
                    });
                  }
                });     
              } 
              else {
                console.log(err);
                res.write(err);
                res.end();
              }
            });
          }
          else {
            console.log('Error: Not allowed');
            res.sendStatus(403);
          }
        });
      });

      app.get('/api/person/add', authenticationUtils.ensureAuthenticated, function (req, res) {

        acl.isAllowed(req.user['id'], 'persons', 'add', function (err, response) {
          if (response) {
            self.addPerson(
              'PersonDirectoryId' + new Date(),
              'PersonDisplayName' + new Date(),
              "http://heidloff.net/wp-content/uploads/2015/11/4Y7B9422-4.jpg",
              "Developer Advocate",
              function(err, result) {
                if (err) {
                  res.write('Error: Person not added');
                  res.end(); 
                }
                else {              
                  res.write('Success: Person added');
                  res.end();  
                }
              }
            );              
          }
          else {
            console.log('Error: Not allowed');
            res.sendStatus(403);
          }
        });
      });

      app.get('/api/person/update', authenticationUtils.ensureAuthenticated, function (req, res) {

        acl.isAllowed(req.user['id'], 'persons', 'update', function (err, response) {
          if (response) {
                      
          }
          else {
            console.log('Error: Not allowed');
            res.sendStatus(403);
          }
        });
      });

  	},

    "addPerson" : function(directoryId, displayName, pictureUrl, title, callback) {  
      var person = {
        directoryId: directoryId,
        displayName: displayName,
        pictureUrl: pictureUrl,
        title: title};

      mongodbUtils.getDatabase(function(err, db) {
        if (db) {
          db.collection('persons').insertOne(person, function(err, result) {
            if (err) {
              callback(err, null);
            }
            else {
              callback(null, result);
            }
          });
        }
        else {
          callback(err, null);
        }
      });
    }

  };
};