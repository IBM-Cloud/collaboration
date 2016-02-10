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
var mongodb = require('mongodb');

module.exports = function() {
  return {
  	"setUp" : function(app, acl) {
      var self = this;

      // sample for access control on application level
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

      // sample for access control on document level
      app.post('/api/person/update', authenticationUtils.ensureAuthenticated, function (req, res) {

        var personUpdate = req.body;
        var documentId = personUpdate['_id'];
        if (!documentId) {
          res.write('Error: No _id provided');
          res.end(); 
        }
        mongodbUtils.getDatabase(function(err, db) {
          if (db) {
            db.collection('persons').findOne({ _id: mongodb.ObjectId(documentId) }, function(err, document) {
              if (err) {
                res.write('Error: Document cannot be found');
                res.end(); 
              }
              else {
                acl.isAllowed(req.user['id'], documentId, 'update', function (err, response) { 
                  if (response) {
                    var displayName = document.displayName;
                    if (personUpdate.displayName) {
                      displayName = personUpdate.displayName;
                      document.displayName = personUpdate.displayName;
                    }
                    var pictureUrl = document.pictureUrl;
                    if (personUpdate.pictureUrl) {
                      pictureUrl = personUpdate.pictureUrl;
                      document.pictureUrl = personUpdate.pictureUrl;
                    }
                    var title = document.title;
                    if (personUpdate.title) {
                      title = personUpdate.title;
                      document.title = personUpdate.title;
                    }

                    db.collection('persons').updateOne({ _id: mongodb.ObjectId(documentId) }, 
                        { displayName:displayName, pictureUrl:pictureUrl, title:title}, function(err, result) {
                      if (err) {
                        res.write('Error: Document cannot be updated');
                        res.end(); 
                      }
                      else {
                        var access = { canRead: true,
                                       canUpdate: true,
                                       canDelete: false};

                        var output = { person: document, access: access};

                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify(output));
                        res.end();
                      }
                    });                    
                  }
                  else {
                    console.log('Error: Not allowed');
                    res.sendStatus(403);
                  }
                });
              }
            });
          }
          else {
            res.write('Error: Database cannot be opened');
            res.end(); 
          }
        });
      });

      // sample how to return access rights meta data in addition to document
      app.get('/api/person', authenticationUtils.ensureAuthenticated, function (req, res) {

        acl.isAllowed(req.user['id'], 'persons', 'view', function (err, response) {
          if (response) {
            var documentId = req.query.id;
            if (!documentId) {
              res.write('Error: No id provided');
              res.end();
            }
            mongodbUtils.getDatabase(function(err, db) {
              if (db) {
                db.collection('persons').findOne({ _id: mongodb.ObjectId(documentId) }, function(err, document) {
                  if (err) {
                    res.write('Error: Document cannot be found');
                    res.end(); 
                  }
                  else {
                    var canUpdate = false;
                    acl.isAllowed(req.user['id'], documentId, 'update', function (err, response) { 
                      if (response) {
                        canUpdate = true;
                      }

                      var access = { canRead: true,
                                   canUpdate: canUpdate,
                                   canDelete: false};

                      var output = { person: document, access: access};

                      res.writeHead(200, {'Content-Type': 'application/json'});
                      res.write(JSON.stringify(output));
                      res.end();
                    });
                  }
                });
              }
              else {
                res.write('Error: Database cannot be opened');
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

  	},

    "addPerson" : function(directoryId, displayName, pictureUrl, title, id, callback) {  
      var person = {
        _id: mongodb.ObjectId(id),
        directoryId: directoryId,
        displayName: displayName,
        pictureUrl: pictureUrl,
        title: title
      };

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