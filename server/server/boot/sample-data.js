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
  
  var Person = app.models.Person;
  var ApprovalRequest = app.models.ApprovalRequest;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  
  Person.find ({ where: { username: "Admin" }}, function (err, users) {
    if (users) {
      if (users.length < 1) {
        Person.create([
            { "username": "Admin", "email": "admin@mydomain.com", "password": "password" },
            { "username": "Manager", "email": "manager@mydomain.com", "password": "password" },
            { "username": "EmployeeMike", "email": "mike@mydomain.com", "password": "password" },
            { "username": "EmployeeJohn", "email": "john@mydomain.com", "password": "password" }
          ], 
          function(err, users) {
            if (err) {
              throw err;
            }
            console.log('Created test users: ', users);

            ApprovalRequest.create({
                title: 'Trip to Customer XYZ',
                description: 'need to travel to Munich next week',
                state: 'WaitingForApproval',
                dueDate: "2016-06-15",
                requesterId: getPersonId(users, 'EmployeeMike'),
                approverId: getPersonId(users, 'Manager')
              }, function(err, approvalRequest) {
                if (err) throw err;

                console.log('Created approval request:', approvalRequest);
            });

            ApprovalRequest.create({
                title: 'Trip to ABC Conference',
                description: 'need to present our product to developers',
                state: 'WaitingForApproval',
                dueDate: "2016-06-16",
                requesterId: getPersonId(users, 'EmployeeJohn'),
                approverId: getPersonId(users, 'Manager')
              }, function(err, approvalRequest) {
                if (err) throw err;

                console.log('Created approval request:', approvalRequest);
            });

            Role.create({
              name: 'Admin'
              }, function(err, role) {
                if (err) throw err;
                console.log('Created role:', role);

                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: getPersonId(users, 'Admin')
                  }, function(err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                  }
                );
              }
            );

            Role.create({
              name: 'Manager'
              }, function(err, role) {
                if (err) throw err;
                console.log('Created role:', role);

                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: getPersonId(users, 'Manager')
                  }, function(err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                  }
                );
              }
            );

            Role.create({
              name: 'Employee'
              }, function(err, role) {
                if (err) throw err;
                console.log('Created role:', role);

                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: getPersonId(users, 'EmployeeMike')
                  }, function(err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                  }
                );

                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: getPersonId(users, 'EmployeeJohn')
                  }, function(err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                  }
                );
              }
            );

          }
        );
      }
    }
  });

  getPersonId = function(users, username) {
    var output = null;
    if (!users) return output;
    for(var i = 0; i < users.length; i++) {
      if (users[i].username == username) {
        output = users[i].id;
      }
    }
    return output;
  }
}