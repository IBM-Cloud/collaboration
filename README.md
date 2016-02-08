Patterns for collaborative Applications on Bluemix
================================================================================

The [collaboration](https://github.com/ibm-bluemix/collaboration) project contains sample code that shows how to build collaborative applications on [IBM Bluemix](https://bluemix.net). It's basically an extension of the popular MEAN stack including MongoDB, Node.js, Express and Angular with some additional techniques showing how to do authentication, authorization, REST API calls and other typical collaborative functionality.

The project will (hopefully) evolve over time. The first step shows how to do authentication of users via the [Single Sign On](https://www.ng.bluemix.net/docs/#services/SingleSignOn/index.html) service. Developers can run this application on Bluemix or locally. 

Here is a screenshot of the SSO service configuration. For more screenshots check out the [screenshots](https://github.com/ibm-bluemix/collaboration/tree/master/screenshots) folder.

![alt text](https://raw.githubusercontent.com/ibm-bluemix/collaboration/master/screenshots/sso-setup-4.png "Single Sign On")

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

Once you have a route, define the callback in the SSO dashboard, e.g. https://collaboration-farci-custard.mybluemix.net/auth/sso/callback.

To run the sample open these URLs:

* https://collaboration-farci-custard.mybluemix.net/
* https://collaboration-farci-custard.mybluemix.net/admin/currentuser


Setup and run the Application locally
================================================================================

In order to run the application locally you need to do some additional configuration.

First copy all credentials of your Bluemix services into a new file 'env.json'. There is a sample file 'env_sample.json' that shows the structure. You can get the credentials by invoking the command 'cf env collaboration'.

Unfortunately I didn't manage to access the MongoDB service on Bluemix remotely. At this point you need to install [MongoDB](https://www.mongodb.org) locally and point to it by defining the local URL 'mongodb://localhost:27017/db' in env.json. I'd like to switch to MongoDB by Compose in the future which is another MongoDB service on Bluemix.

The SSO service only allows to define one callback. However the callback needs to point to a local URL like 'http://localhost:6013/auth/sso/callback'. So you either need to create a second SSO service (in another space) or you need to change the callback URL in the SSO service back and forth when running on the server and locally.