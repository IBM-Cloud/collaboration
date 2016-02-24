Collaborative Line of Business Applications on Bluemix
================================================================================

The [collaboration](https://github.com/ibm-bluemix/collaboration) project contains sample code that shows how to build collaborative line of business applications on [IBM Bluemix](https://bluemix.net), for example document based applications like discussions or approval workflows. 

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
* Web client via AngularJS
* Mobile hybrid client via Ionic, Cordova and AngularJS

I'm writing a series of blog articles about this project:

* [Creating Business Objects and REST APIs with LoopBack](http://heidloff.net/article/creating-rest-apis-loopback)
* [Usage of Cloudant in LoopBack Applications](http://heidloff.net/article/cloudant-loopback-nodejs)
* [Authentication in LoopBack Applications against Bluemix](http://heidloff.net/article/authentication-loopback-bluemix)
* [Customization of Authentication Pages in Bluemix](http://heidloff.net/article/customization-authentication-bluemix)
* [Customization of REST APIs in LoopBack Applications](http://heidloff.net/article/customization-rest-apis-loopback-bluemix)
* [Authorization in LoopBack Applications on Bluemix](http://heidloff.net/article/authorization-loopback-bluemix)
* Web client
* Mobile client
* Consuming Bluemix services

Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for more information.

![alt text](https://raw.githubusercontent.com/IBM-Bluemix/collaboration/master/screenshots/api-overview.png "APIs")

Author: Niklas Heidloff [@nheidloff](http://twitter.com/nheidloff)


Prerequisites
================================================================================

In order to run this sample you need an Bluemix account. [Sign up](https://console.ng.bluemix.net/registration/) if you don't have an account yet.

If you want to modify the sample locally, make sure the following tools are installed and on your path.

* [node](https://nodejs.org/download/release/v4.2.6/) and npm (it's adviced to use v4.2.6 which is the latest supported version on Bluemix)
* [git](https://git-scm.com/downloads)
* [cf](https://github.com/cloudfoundry/cli#downloads)
* [slc](http://loopback.io/getting-started/)


Setup of the Application on Bluemix
================================================================================

In order to run the APIs on Bluemix you can deploy the (server) application via one click.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/collaboration)

When running the application for the first time, test data and test users are created in the Cloudant database. By default authentication is done with these test users. Alternatively you can use the Bluemix Single Sign On service for authentication. 

As alternative to the Deploy Button you can also invoke the following commands to create the Cloudant service and deploy the application to Bluemix. This will allow you to do local changes and then push updates.

```sh
$ cf login -a api.ng.bluemix.net
$ cf create-service cloudantNoSQLDB Shared collab-cloudant
$ git clone https://github.com/ibm-bluemix/collaboration.git
$ cd collaboration
$ cd server
$ npm install
$ cf push
```

After you've done the initial 'cf push' you should change manifest.yml and replace ${random-word} with your route. Otherwise new routes will be added the next time you invoke 'cf push'.

To run the sample open one of these URLs:

* /, e.g. https://collaboration-farci-custard.mybluemix.net/
* /explorer, e.g. https://collaboration-farci-custard.mybluemix.net/explorer

Invoke the API '/api/Persons/login' with the following credentials. You can find the credentials of the other users in [sample-data.js](https://github.com/IBM-Bluemix/collaboration/blob/master/server/server/boot/sample-data.js).

{ "username": "Admin", "email": "admin@mydomain.com", "password": "password" }

Copy the token from the id field, paste it in the text field at the top and press 'Set Access Token' ([screenshot](https://raw.githubusercontent.com/IBM-Bluemix/collaboration/master/screenshots/api-login.png)). After this you can invoke all other APIs.


Setup of the Single Sign On Service
================================================================================

In order to create the Single Sign On service invoke these commands.

```sh
$ cf login -a api.ng.bluemix.net
$ cf create-service SingleSignOn standard collab-sso
```

Before you can use the SSO service you need to configure it via the dashboard UI. Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for details.

* Create cloud directory
* Create users

Define the callback in the SSO dashboard, e.g. https://collaboration-farci-custard.mybluemix.net/auth/ibm/callback.

To authenticate open this URL:

* /login, e.g. https://collaboration-farci-custard.mybluemix.net/login


Setup of the Application locally
================================================================================

In order to run the application locally you need to do some additional configuration.

Copy all credentials of your Bluemix service(s) into a new file 'env.json'. There is a sample file '[env_sample.json](https://github.com/IBM-Bluemix/collaboration/blob/master/server/env_sample.json)' that shows the base structure with the Cloudant service. The file '[env_sample_services.json](https://github.com/IBM-Bluemix/collaboration/blob/master/server/env_sample_services.json)' contains additional Bluemix services. You can get the credentials by invoking the command 'cf env collaboration'. 

The SSO service only allows to define one callback per Bluemix application. However to run the application locally the callback needs to point to a local URL like 'http://localhost:3000/auth/ibm/callback'. To work around this you can create a second Node.js application, bind the same SSO service to it and define a second callback. Make sure you copy the credentials of this second instance into env.json.

To run the application locally invoke 'node .'.


Web client via AngularJS
================================================================================

With the AngularJS client you can log in as one of the test users, read all user information, read approval requests, read details about specific approval requests and change specific requests.

Check out the [angular](https://github.com/IBM-Bluemix/collaboration/tree/master/angular) directory for details.


Mobile hybrid client via Ionic, Cordova and AngularJS
================================================================================

With the Ionic client you can log in as one of the test users, read all user information, read approval requests, read details about specific approval requests and change specific requests.

You can run the client in a browser for testing purposes and you can create platforms for iOS and Android.

Check out the [ionic](https://github.com/IBM-Bluemix/collaboration/tree/master/ionic) directory for details.


Consuming Bluemix Services
================================================================================

When Bluemix services are created and bound to Bluemix applications credentials are created for developers to access the services via REST APIs. When running this application on Bluemix the credentials are automatically read from the Bluemix context (VCAP_SERVICES). When running locally the credentials are read from the file 'env.json' which you need to create as described above.

The code in [approval-request.js](https://github.com/IBM-Bluemix/collaboration/blob/master/server/common/models/approval-request.js) shows how to invoke the Watson Language Translation service via the [Watson Developer Cloud Node.js SDK](https://github.com/watson-developer-cloud/node-sdk).

To add the Watson service to the app invoke these commands (change the app name):

```sh
cf create-service language_translation standard collab-translation
cf bind-service collaboration-nheidloff-1534 collab-translation
cf restart collaboration-nheidloff-1534
```