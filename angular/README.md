Angular Client
================================================================================

With the AngularJS client you can log in as one of the test users, read all user information, read approval requests, read details about specific approval requests and change specific requests.

Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for details.

To run the client start your server first. Then point to the API of your server in the Gruntfile.js. Search for 'apiUrl' and define your URL.

Before you can launch the client you need to build it.

```sh
$ git clone https://github.com/ibm-bluemix/collaboration.git
$ cd collaboration
$ cd angular
$ npm install
$ bower install
$ grunt --force
```

In order to run the client locally invoke this command.

```sh
$ grunt serve
```

In order to deploy the application to Bluemix you need to change the 'apiUrl' as described above. After this you need to invoke these commands.

```sh
$ cf login -a api.ng.bluemix.net
$ cf push
```

To run the sample open this URL:

* /, e.g. https://collaboration-ng-farci-custard.mybluemix.net/

After you've done the initial 'cf push' you should change manifest.yml and replace ${random-word} with your route. Otherwise new routes will be added the next time you invoke 'cf push'.

![alt text](https://raw.githubusercontent.com/IBM-Bluemix/collaboration/master/screenshots/angular-5.png "Screenshot")

The initial version of this project has been generated with [yo angular generator](https://github.com/yeoman/generator-angular) version 0.15.1.