# aurelia-breeze

This library is a plugin for the [Aurelia](http://www.aurelia.io/) framework that provides an adapter for observing [Breeze](http://www.getbreezenow.com/breezejs) entities.

**Why does Aurelia need an adapter to observe Breeze entities?**

Breeze entity properties have defined getters and setters created using Object.defineProperty.  Properties defined in this manner are incompatible with Object.observe, Aurelia's preferred way to do data-binding.  In situations where Object.observe cannot be used Aurelia falls back to dirty-checking which can be less performant.  We can avoid dirty-checking by providing Aurelia with an adapter that knows to subscribe to the Breeze [propertyChanged](http://www.breezejs.com/sites/all/apidocs/classes/EntityAspect.html#event_propertyChanged) event in order to observe Breeze entities.

**Which model libraries are supported with this plugin?**

Breeze can create entities using a variety of model binding libraries such as [Knockout](http://knockoutjs.com/) and [Backbone](http://backbonejs.org/) which provide great data-binding support for legacy browsers.  Chances are if you're using Aurelia, legacy browser support is not a concern.  The aurelia-breeze plugin only supports Breeze's native model library: "backingStore".  To use "backingStore" make sure you include this line of code in your project:
```javascript
breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
```

## Using The Adapter

This guide uses [jspm](http://jspm.io/) and assumes you've already setup your Aurelia project according to the guide [here](http://aurelia.io/review/get-started.html).

1. Use jspm to install aurelia-breeze.  This will install the plugin as well as [Breeze](http://www.getbreezenow.com/breezejs) and it's dependencies: [Q](https://github.com/kriskowal/q) and [jQuery](http://jquery.com/).

  ```shell
  jspm install github:jdanyow/aurelia-breeze
  ```
2. Re-install Breeze:

  ```shell
  jspm install github:Breeze/breeze.js -o "{ directories: { lib: 'build' },  main: 'breeze.min.js' }"
  ```
  > Note: Breeze is being added to the jspm registry.  When completed this step will not be needed.

3. todo:  ....instructions for installing the plugin and using breeze....  

## Dependencies

* [aurelia-binding](https://github.com/aurelia/binding)

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
4. Install Breeze using a package override:

  ```shell
  jspm install github:Breeze/breeze.js -o "{ directories: { lib: 'build' },  main: 'breeze.min.js' }"
  ```
> Note: Breeze is being added to the jspm registry.  When completed this step will not be needed.

5. You can now run the tests with this command:

  ```shell
  karma start
  ```
