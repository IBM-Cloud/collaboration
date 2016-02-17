Patterns for collaborative Applications on Bluemix
================================================================================

The [collaboration](https://github.com/ibm-bluemix/collaboration) project contains sample code that shows how to build collaborative applications on [IBM Bluemix](https://bluemix.net), for example document based applications like discussions or approval workflows. 

Technically the project is similar to the popular MEAN stack with some additional functionality:

* The project relies heavily on [LoopBack](http://loopback.io/) which provides functionality for authentication, authorization, business objects modeling, API management and more
* The project uses the [Cloudant NoSQL](https://www.ng.bluemix.net/docs/#services/Cloudant/index.html) database provided on [IBM Bluemix](https://bluemix.net) by default, but MongoDB could be used as well

The project will (hopefully) evolve over time. So far it includes the following functionality:

* Setup of Cloudant on Bluemix
* Setup of a Node.js application on Bluemix (or locally)
* Setup of an organization directory with test users on Bluemix (Single Sign On service)
* Authentication from Node.js against the directory
* Authorization on application level via roles
* Authorization on document level via roles
* REST APIs to access sample business objects 'persons' and 'approvalRequests'

Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for more information.

![alt text](https://raw.githubusercontent.com/IBM-Bluemix/collaboration/tree/master/screenshots/api-overview.png "APIs")

Author: Niklas Heidloff [@nheidloff](http://twitter.com/nheidloff)


Setup and run the Application on Bluemix
================================================================================

Make sure the following tools are installed and on your path.

* [node](https://nodejs.org/download/release/v4.2.6/) and npm (it's adviced to use v4.2.6 which is the latest supported version on Bluemix)
* [git](https://git-scm.com/downloads)
* [cf](https://github.com/cloudfoundry/cli#downloads)
* [slc](http://loopback.io/getting-started/)

You can, but don't have to use the Bluemix Single Sign On service for authentication. If you don't want to use it and instead authenticate with the test users in Cloudant, you can skip the following steps. In order to create the Single Sign On service invoke these commands.

```sh
$ cf login -a api.ng.bluemix.net
$ cf create-service SingleSignOn standard collab-sso
```

Before you can create the application and bind the SSO service you need to configure the service in the dashboard UI. Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for details.

* Create cloud directory
* Create users

Invoke the following commands to create the Cloudant service and deploy the application to Bluemix.

```sh
$ cf login -a api.ng.bluemix.net
$ cf create-service cloudantNoSQLDB Shared collab-cloudant
$ git clone https://github.com/ibm-bluemix/collaboration.git
$ cd collaboration
$ cd server
$ npm install
$ cf push
```

Once you have a route, define the callback in the SSO dashboard, e.g. https://collaboration-farci-custard.mybluemix.net/auth/ibm/callback.

After you've done the initial 'cf push' you should change manifest.yml and replace ${random-word} with your route. Otherwise new routes will be added the next time you invoke 'cf push'.

To run the sample open this URL:

* https://collaboration-farci-custard.mybluemix.net/explorer
* https://collaboration-farci-custard.mybluemix.net/login


Setup and run the Application locally
================================================================================

In order to run the application locally you need to do some additional configuration.

Copy all credentials of your Bluemix services into a new file 'env.json'. There is a sample file 'env_sample.json' that shows the structure. You can get the credentials by invoking the command 'cf env collaboration'.

The SSO service only allows to define one callback per Bluemix application. However to run the application locally the callback needs to point to a local URL like 'http://localhost:3000/auth/ibm/callback'. To work around this you can create a second Node.js application, bind the same SSO service to it and define a second callback. Make sure you copy the credentials of this second instance into env.json.

To run the application locally invoke 'node .'.