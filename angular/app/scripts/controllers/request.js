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

'use strict';

angular
  .module('angularApp')
  .controller('RequestController', ['$scope', '$state', '$routeParams', 'ApprovalRequest', 
    function($scope, $state, $routeParams, ApprovalRequest) {
      
      $scope.request = {};
      function getRequest() {
        //ApprovalRequest.find({ filter: { where: { id: $routeParams.id } } })
        ApprovalRequest.expanded({id:$routeParams.id})
          .$promise
          .then(function(result) {
            $scope.request = result;
          });
      }
      if ($routeParams.id) {
        if (!$scope.changeRequest) {
          getRequest();
        }
      }
      
      $scope.changeRequest = function() {
        ApprovalRequest
          .upsert($scope.request.approvalRequest)
          .$promise
          .then(function() {
            $scope.request = '';
            $scope.requestForm.title.$setPristine();
            getRequest();
          }, 
          function(err) {
            $scope.requestError = err.statusText;
          });
      };

  }]);
