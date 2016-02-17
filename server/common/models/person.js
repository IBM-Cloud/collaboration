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

module.exports = function(Person) {

	Person.disableRemoteMethod('createChangeStream', true); 
	Person.disableRemoteMethod("create", true);
	Person.disableRemoteMethod("upsert", true);
	Person.disableRemoteMethod("updateAll", true);
	Person.disableRemoteMethod("findOne", true);
	Person.disableRemoteMethod("updateAttributes", false);
	Person.disableRemoteMethod("deleteById", true);
	Person.disableRemoteMethod("confirm", true);
	Person.disableRemoteMethod("count", true);
	Person.disableRemoteMethod("exists", true);
	Person.disableRemoteMethod("resetPassword", true);
	Person.disableRemoteMethod('__count__accessTokens', false);
	Person.disableRemoteMethod('__create__accessTokens', false);
	Person.disableRemoteMethod('__delete__accessTokens', false);
	Person.disableRemoteMethod('__destroyById__accessTokens', false);
	Person.disableRemoteMethod('__findById__accessTokens', false);
	Person.disableRemoteMethod('__get__accessTokens', false);
	Person.disableRemoteMethod('__updateById__accessTokens', false);
	Person.disableRemoteMethod('__get__credentials', false);
	Person.disableRemoteMethod('__set__credentials', false);
	Person.disableRemoteMethod('__create__credentials', false);
	Person.disableRemoteMethod('__delete__credentials', false);
	Person.disableRemoteMethod('__findById__credentials', false);
	Person.disableRemoteMethod('__count__credentials', false);
	Person.disableRemoteMethod('__updateById__credentials', false);
	Person.disableRemoteMethod('__destroyById__credentials', false);
	Person.disableRemoteMethod('__get__identities', false);
	Person.disableRemoteMethod('__set__identities', false);
	Person.disableRemoteMethod('__create__identities', false);
	Person.disableRemoteMethod('__delete__identities', false);
	Person.disableRemoteMethod('__findById__identities', false);
	Person.disableRemoteMethod('__count__identities', false);
	Person.disableRemoteMethod('__updateById__identities', false);
	Person.disableRemoteMethod('__destroyById__identities', false);
 
};