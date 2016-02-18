Patterns for collaborative Applications on Bluemix
================================================================================

The [collaboration](https://github.com/ibm-bluemix/collaboration) project contains sample code that shows how to build collaborative business applications on [IBM Bluemix](https://bluemix.net), for example document based applications like discussions or approval workflows. 

Technically the project is similar to the popular MEAN stack with some additional functionality. It's basically a CLEAN stack with Cloudant, LoopBack, Express, Angular and Node.

* The project relies heavily on [LoopBack](http://loopback.io/) which provides functionality for authentication, authorization, business objects modeling, API management and more
* The project uses the [Cloudant NoSQL](https://www.ng.bluemix.net/docs/#services/Cloudant/index.html) database provided on [IBM Bluemix](https://bluemix.net) by default, but MongoDB could be used as well

The project contains currently the following functionality:

* Setup of Node.js LoopBack applications on Bluemix and locally
* Usage of Cloudant in LoopBack applications
* Setup of an organization directory with test users on Bluemix (Single Sign On service)
* Authentication from Node.js against the Single Sign On service or test users in Cloudant
* Authorization in Node.js applications on application level and on document level via roles
* REST APIs to access sample business objects 'persons' and 'approvalRequests'

I'm writing a series of blog articles about this project:

* [Creating Business Objects and REST APIs with LoopBack](http://heidloff.net/article/creating-rest-apis-loopback)
* Usage of Cloudant in LoopBack applications
* Authenticating from LoopBack against Bluemix
* Tuning the generated REST APIS
* Authorization
* Consuming Watson services
* AngularJS client
* Mobile client

Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for more information.

![alt text](https://raw.githubusercontent.com/IBM-Bluemix/collaboration/tree/master/screenshots/api-overview.png "APIs")

Author: Niklas Heidloff [@nheidloff](http://twitter.com/nheidloff)


Prerequisites
================================================================================

Make sure the following tools are installed and on your path.

* [node](https://nodejs.org/download/release/v4.2.6/) and npm (it's adviced to use v4.2.6 which is the latest supported version on Bluemix)
* [git](https://git-scm.com/downloads)
* [cf](https://github.com/cloudfoundry/cli#downloads)
* [slc](http://loopback.io/getting-started/)


Setup of the Application on Bluemix
================================================================================

When running the application for the first, time test data and test users are created in the Cloudant database. By default authentication is done with these test users. Alternatively you can use the Bluemix Single Sign On service for authentication. 

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

To run the sample open this URL:

* https://collaboration-farci-custard.mybluemix.net/explorer


Setup of the Single Sign On Service
================================================================================

In order to create the Single Sign On service invoke these commands.

```sh
$ cf login -a api.ng.bluemix.net
$ cf create-service SingleSignOn standard collab-sso
```

Before you can use the SSO service you need to configure the it via the dashboard UI. Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for details.

* Create cloud directory
* Create users

Define the callback in the SSO dashboard, e.g. https://collaboration-farci-custard.mybluemix.net/auth/ibm/callback.

To authenticate open this URL:

* https://collaboration-farci-custard.mybluemix.net/explorer


Setup of the Application locally
================================================================================

In order to run the application locally you need to do some additional configuration.

Copy all credentials of your Bluemix service(s) into a new file 'env.json'. There is a sample file '[env_sample.json](https://github.com/IBM-Bluemix/collaboration/blob/master/server/env_sample.json)' that shows the structure. You can get the credentials by invoking the command 'cf env collaboration'.

The SSO service only allows to define one callback per Bluemix application. However to run the application locally the callback needs to point to a local URL like 'http://localhost:3000/auth/ibm/callback'. To work around this you can create a second Node.js application, bind the same SSO service to it and define a second callback. Make sure you copy the credentials of this second instance into env.json.

To run the application locally invoke 'node .'.