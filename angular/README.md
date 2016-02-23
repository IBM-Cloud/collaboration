Angular Client
================================================================================

With the AngularJS client you can log in as one of the test users, read all user information, read approval requests, read details about specific approval requests and change specific requests.

Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for details.

Make sure the following tools are installed and on your path.

* [node](https://nodejs.org/download/release/v4.2.6/) and npm (it's adviced to use v4.2.6 which is the latest supported version on Bluemix)
* [git](https://git-scm.com/downloads)
* [cf](https://github.com/cloudfoundry/cli#downloads)
* [grunt](http://gruntjs.com/installing-grunt)
* [bower](http://bower.io/#install-bower)

If you also want to you use the [Yeoman Angular generator](https://github.com/yeoman/generator-angular) install these additional modules.

```sh
$npm install -g yo generator-karma generator-angular
```

To run the client start your server first. Then point to the API of your server in [Gruntfile.js](https://github.com/IBM-Bluemix/collaboration/blob/master/angular/Gruntfile.js#L57). Search for 'apiUrl' and define your URL.

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

To run the sample open the path '/', e.g. https://collaboration-ng-farci-custard.mybluemix.net/.

After you've done the initial 'cf push' you should change manifest.yml and replace ${random-word} with your route. Otherwise new routes will be added the next time you invoke 'cf push'.

Here is a screenshot:

![alt text](https://raw.githubusercontent.com/IBM-Bluemix/collaboration/master/screenshots/angular-5s.png "Screenshot")

The initial version of this project has been generated with [yo angular generator](https://github.com/yeoman/generator-angular) version 0.15.1.