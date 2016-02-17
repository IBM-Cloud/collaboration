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

module.exports = function(app) {
  var Role = app.models.Role;
  Role.registerResolver('Requester', function(role, context, cb) {

    var notAuthorizedError = {
      "name": "Error",
      "status": 401,
      "message": "Authorization Required",
      "statusCode": 401,
      "code": "AUTHORIZATION_REQUIRED",
    }
  
    if (context.modelName !== 'ApprovalRequest') {
      cb(notAuthorizedError, false);
    }
    else {
      var userId = context.accessToken.userId;
      if (!userId) {
        cb(notAuthorizedError, false);
      }
      else {
        if (!context.modelId) {
          cb(notAuthorizedError, false);
        }
        else {
          context.model.findById(context.modelId, function(err, approvalRequest) {
            if(err || !approvalRequest) {              
              cb(err, false);
            }
            else {
              if (approvalRequest.requesterId == userId) {
                cb(null, true);
              }
              else {
                cb(notAuthorizedError, false);
              }
            }
          });
        }
      }
    }
  });
};