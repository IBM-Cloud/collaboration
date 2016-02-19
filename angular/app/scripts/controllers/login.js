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

angular.module('angularApp')
  .controller('LoginCtrl', ['$scope', '$state', '$routeParams', 'Person', 
    function($scope, $state, $routeParams, Person) {
    
	$scope.loginAsAdmin = function() {
      Person.login({
  		email: 'admin@mydomain.com',
  		password: 'password'
		}, function() {
			getCurrentPerson();
		});
    };

    $scope.loginAsManager = function() {
      Person.login({
  		email: 'manager@mydomain.com',
  		password: 'password'
		}, function() {
			getCurrentPerson();
		});
    };

    $scope.loginAsMike = function() {
      Person.login({
  		email: 'mike@mydomain.com',
  		password: 'password'
		}, function() {
			getCurrentPerson();
		});
    };

    $scope.loginAsJohn = function() {
      Person.login({
  		email: 'john@mydomain.com',
  		password: 'password'
		}, function() {
			getCurrentPerson();
		});
    };

    $scope.logout = function() {
      Person.logout(function() {
        getCurrentPerson();
      });
    };

  	$scope.currentUser = Person;

  	var getCurrentPerson = function() {
  		Person.getCurrent(function(current) {
  			$scope.currentPerson = current;
  		});
  	};

  }]);
