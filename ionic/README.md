Ionic Client
================================================================================

With the Ionic client you can log in as one of the test users, read all user information, read approval requests, read details about specific approval requests and change specific requests.

You can run the client in a browser for testing purposes and you can create platforms for iOS and Android.

Make sure the following tools are installed and on your path.

* [node](https://nodejs.org/download/release/v4.2.6/) and npm (it's adviced to use v4.2.6 which is the latest supported version on Bluemix)
* [git](https://git-scm.com/downloads)
* [ionic](http://ionicframework.com/getting-started/)
* [cordova](https://cordova.apache.org/#getstarted)
* [bower](http://bower.io/#install-bower)
* [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

To set up the client you need to invoke the following commands:

```sh
$ git clone https://github.com/ibm-bluemix/collaboration.git
$ cd collaboration
$ cd ionic
$ npm install
$ bower install
```

To run the client start your server first. Then point to the API of your server in the file 'www/js/lb-services.js' at the top (variable 'urlBase'). In contrast to the [Angular client](https://github.com/IBM-Bluemix/collaboration/tree/master/angular) lb-services.js is not generated automatically in a build script. Instead you need to run the Angular client build and copy the file if you make changes to the server APIs.

To launch the client in a browser you need to invoke one of the following commands:

```sh
$ ionic serve
$ ionic serve -l
```

In order to create an iOS platform invoke these commands. After this you can open the project in Xcode.

```sh
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

You can also create an Android platform and open the project in Android Studio. But you have to set the 'Content-Security-Policy' in index.html and define permissions in config.xml.

```sh
$ ionic platform add android
$ ionic build android
$ ionic emulate android
```

Here is a screenshot:

![alt text](https://github.com/IBM-Bluemix/collaboration/blob/master/screenshots/ionic-android-1.png "Screenshot")

The initial version of this project has been generated with [ionic start loopback tabs](http://ionicframework.com/getting-started/).