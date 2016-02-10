Patterns for collaborative Applications on Bluemix
================================================================================

The [collaboration](https://github.com/ibm-bluemix/collaboration) project contains sample code that shows how to build collaborative applications on [IBM Bluemix](https://bluemix.net), for example document based applications like discussions or approval workflows. 

Technically the project is basically an extension of the popular MEAN stack including MongoDB, Node.js, Express and AngularJS with some additional techniques showing how to do authentication, authorization and other typical collaborative functionality.

The project will (hopefully) evolve over time. So far it includes the following functionality:

* Setup of a MongoDB on Bluemix (or locally)
* Setup of a Node.js application on Bluemix (or locally)
* Setup of an organization directory with test users on Bluemix
* Authentication from Node.js against the directory via cookies incl. multi instance applications
* Authorization on application level via roles
* Authorization on document level via roles
* REST APIs (first draft only) to access a sample business object 'person'

Author: Niklas Heidloff [@nheidloff](http://twitter.com/nheidloff)


Setup and run the Application on Bluemix
================================================================================

Make sure the following tools are installed and on your path.

* [node](https://nodejs.org/download/release/v4.2.6/) and npm (it's adviced to use v4.2.6 which is the latest supported version on Bluemix)
* [git](https://git-scm.com/downloads)
* [cf](https://github.com/cloudfoundry/cli#downloads)

Invoke the following commands to create the the MongoDB service and the SSO service. Alternatively you can use the user interface as described in the article [Scale single sign-on for your Node.js cloud apps](https://www.ibm.com/developerworks/library/wa-scale-sso-for-node-apps-trs-bluemix/).

```sh
$ cf login -a api.ng.bluemix.net
$ cf create-service mongodb 100 collab-mongodb
$ cf create-service SingleSignOn standard collab-sso
```

Before you can create the application and bind the SSO service you need to configure the service in the dashboard UI. Check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder for details.

* Create cloud directory
* Create users

Invoke the following commands to create the application and bind the services.

```sh
$ git clone https://github.com/ibm-bluemix/collaboration.git && cd collaboration && server
$ npm install
$ cf push
```

After you've done the initial 'cf push' you should change manifest.yml and replace ${random-word} with your route. Otherwise new routes will be added the next time you invoke 'cf push'.

Once you have a route, define the callback in the SSO dashboard, e.g. https://collaboration-farci-custard.mybluemix.net/auth/sso/callback.

To run the sample open these URLs:

* https://collaboration-farci-custard.mybluemix.net/
* https://collaboration-farci-custard.mybluemix.net/admin/currentuser
* https://collaboration-farci-custard.mybluemix.net/admin/usersessions


Setup and run the Application locally
================================================================================

In order to run the application locally you need to do some additional configuration.

First copy all credentials of your Bluemix services into a new file 'env.json'. There is a sample file 'env_sample.json' that shows the structure. You can get the credentials by invoking the command 'cf env collaboration'.

Unfortunately I didn't manage to access the MongoDB service on Bluemix remotely. At this point you need to install [MongoDB](https://www.mongodb.org) locally and point to it by defining the local URL 'mongodb://localhost:27017/db' in env.json. I'd like to switch to MongoDB by Compose in the future which is another MongoDB service on Bluemix.

The SSO service only allows to define one callback per Bluemix application. However to run the application locally the callback needs to point to a local URL like 'http://localhost:6013/auth/sso/callback'. To work around this you can create a second Node.js application, bind the same SSO service to it and define a second callback. Make sure you copy the credentials of this second instance into env.json.


Authorization Demo
================================================================================

To understand the authorization capabilities check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder. Here are the steps to see the authorization functionality in action:

* Create two test users in the cloud directory, e.g. admin and user
* Log on in Chrome as admin (/login)
* In Chrome add the admin as person document in MongoDB and add the application role admin (/admin/addadmin)
* Log on in FF as user (/login)
* In FF add the user as person document in MongoDB and add the application role user (/admin/adduser)
* In either browser read the person documents which can be read by all users with the roles admin or user (/api/persons)
* In FF read the person document for the user 'user' and make sure you have rights to update it (/api/person?id=56bb5af9bd7a6b2bcbcb1560)
* In FF read the person document for the user 'admin' and make sure you don't have rights to update it (/api/person?id=56bb5a4abd7a6b2bcbcb155f)
* In Chrome you should see that the admin is able to update both documents
* In FF RESTClient invoke a post request. Set the Content-Type to application/json. You can copy one of the documents as JSON from the previous step (/api/persons). Change for example the title and try to update the documents. Again, for one document it should work, for the other one it's forbidden