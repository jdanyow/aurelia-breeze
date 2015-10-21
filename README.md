# ![aurelia-breeze](aurelia-breeze.png)

This library is a plugin for the [Aurelia](http://www.aurelia.io/) framework.  It's goal is to make using [Breeze](http://www.getbreezenow.com/breezejs) with Aurelia as seamless as possible.

What's included:

1. An adapter for observing Breeze entities.
2. A Breeze [ajax adapter](http://www.getbreezenow.com/documentation/controlling-ajax) that uses Aurelia's [http-client](https://github.com/aurelia/http-client).
3. A [light-weight substitute](https://github.com/jdanyow/aurelia-breeze/blob/master/src/promise-adapter.js) for Breeze's dependency on [Q](https://github.com/kriskowal/q) that uses [ES6 promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
4. Automatic form validation for Breeze entities.  Info [here](http://www.danyow.net/form-validation-with-breeze-and-aurelia/).


## FAQ

**Why does Aurelia need an adapter to observe Breeze entities?**

Breeze entity properties have defined getters and setters created using Object.defineProperty.  Properties defined in this manner are incompatible with Object.observe, Aurelia's preferred way to do data-binding.  In situations where Object.observe cannot be used Aurelia falls back to dirty-checking which can be less performant.  We can avoid dirty-checking by providing Aurelia with an adapter that knows to subscribe to the Breeze [propertyChanged](http://www.breezejs.com/sites/all/apidocs/classes/EntityAspect.html#event_propertyChanged) event in order to observe Breeze entities.

**Which model libraries are supported with this plugin?**

Breeze can create entities using a variety of model binding libraries such as [Knockout](http://knockoutjs.com/) and [Backbone](http://backbonejs.org/) which provide great data-binding support for legacy browsers.  Chances are if you're using Aurelia, legacy browser support is not a concern.  The aurelia-breeze plugin only supports Breeze's native model library: "backingStore".  Upon installation this plugin will make "backingStore" the default model library:
```javascript
breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
```

**Do I need jQuery?**

No.  Breeze doesn't force you to use a particular ajax implementation.  By default it uses jQuery however it can be configured to use Angular's $http or even a custom ajax adapter.  This is where we come in... this plugin provides Breeze with an ajax implementation that uses Aurelia's http-client.

**Do I need Q?**

No.  Normally Breeze depends on [Q](https://github.com/kriskowal/q) for it's Promise implementation.  Since you're using Aurelia which depends upon [ES6 promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) we can assume a Promise implementation is already defined.  This means we can give Breeze [an object](https://github.com/jdanyow/aurelia-breeze/blob/master/src/promise-adapter.js) that has a Q style API but uses ES6 Promises behind the scenes.

**Are detached entities supported?**

Yes.  This is a beta feature and may be removed in a future release.  More info [here](https://github.com/jdanyow/aurelia-breeze/issues/7).

## Using The Adapter

This guide uses [jspm](http://jspm.io/) and assumes you've already setup your Aurelia project according to the guide [here](http://aurelia.io/get-started.html).

1. Use jspm to install aurelia-breeze.

  ```shell
  jspm install aurelia-breeze
  ```
2. Install Breeze:

  ```shell
  jspm install breeze
  ```
3. Use the plugin in your app's main.js:

  ```javascript
  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .plugin('aurelia-breeze');  // <--------<<

    aurelia.start().then(a => a.setRoot());
  }
  ```
4. Now you're ready to use Breeze in your Aurelia application:

  ```javascript
  import breeze from 'breeze';

  var query = new breeze.EntityQuery();
  ...
  ```

## Dependencies

* [aurelia-binding](https://github.com/aurelia/binding)
* [aurelia-dependency-injection](https://github.com/aurelia/dependency-injection)
* [aurelia-http-client](https://github.com/aurelia/http-client)
* [breeze](http://www.getbreezenow.com/breezejs)

## Platform Support

This library can be used in the **browser** only.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```
4. You can now run the tests with this command:

  ```shell
  karma start
  ```
