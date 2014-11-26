
Ember CLI version: **0.1.2**

NPM package name: **sl-ember-model**

License: [MIT](LICENSE.md)

---

# Is currently a BETA release.

---

# What sl-ember-model is

A library for managing model data in your Ember.js applications. It is designed to be agnostic to the underlying
persistence mechanism, so it works just as well with JSON APIs over HTTP as it does with streaming WebSockets or local storage.

This library **does not** support relationships or manage data state such as how Ember Data does.

What this library **DOES** do is allow you to work with models that do not have to be pre-defined.  Having a dependency on [sl-ember-modelize](https://github.com/softlayer/sl-ember-modelize), this libary is able to dynamically set data returned from an endpoint onto the correct model objects without having any knowledge of the data it will be receiving.

---

# Working Demo

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* View the demo at http://localhost:4200

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

---

# How to use this addon in your application

## Install this addon as a Node module

```
npm install --save-dev sl-ember-model
```

## Instantiating the Store

In *sl-ember-model*, the store is responsible for managing the lifecycle of your models. Every time you need a model or a collection of models, you'll ask the store for it.

To create a store, you don't need to do anything. Just by loading the *sl-ember-model* library all of the routes and
controllers in your application will get a new store property. This property is an instance of *sl-ember-model/Store* that will be shared across all of the routes and controllers in your app.


## Defining Your Models

### Using the generator

To add a model to your project, simple do `ember g slmodel <modelname>`.  You can also specify the url and/or the
adapter by appending the options:

    ember g slmodel <modelname> url:<url> adapter:<adapter>

More on these options later.

### Creating by hand

First create a new model in your */models* folder:

    $touch models/foo.js

Add inside that file:

```javascript
import SlModel from 'sl-ember-model';

var Foo = SlModel.extend({ });
```

## Using Adapters:
Sl-Ember-Model has two adapters out of the box: ajax and localstorage.  You can specify your adapter in your model by reopening it's class:

```javascript
Foo.reopenClass({
    adapter: 'ajax'
});
```

Models have `ajax` specified as default, so you don't need to do this unless you want to use a different adapter.

SL-Ember-Model adapters always return [Ember Promise Proxies](http://emberjs.com/api/classes/Ember.PromiseProxyMixin.html).
If you request a single object then you will get an `Ember.ObjectProxy` with the promise proxy mixin applied.  Requests for
Multiple records will return an `Ember.ArrayProxy` with the promise proxiy mixin applied.

### Ajax adapter
The `ajax` adapter uses [ic-ajax](https://github.com/instructure/ic-ajax) to make `xhr` requests to your remote api.
Successful responses will be serialized and then applied to a new created instance of your model.
In the case of an error, the promise will be rejected and you will be provided with the exact response provided
by `ic-ajax`.

### Urls, Endpoints, Serializers:

When using the `ajax` adapter you can setup a single url if your api is restful or  multiple endpoints if you need fine grain control.  Multiple endpoints come in handy if your api isn't so restful.

The base level `url` and `serializer` will be used by default.  Override them or add different ones at any endpoint.
Endpoints that return multiple records should only return an array.  You can add any metadata for those queries to the store via the `metaForType` function.

```javascript
Foo.reopenClass({
    url: '/foo',
    serializer: function( response, store ) { return xformData( response ); },
    endpoints: {
        'superFoo': {
            get: {
                url: '/superFoo',
                serializer: function( response, store ) {
                    store.metaForType( 'device', {
                        totalCount: response.totalCount,
                        totalPages: response.totalPages
                    });

                    return response.result;
                }
            },
            post: '/superFooPost'
        },
        'boringFoo': {
            url: '/boringFoo',
            serializer: someSerializer
        },
        'superBoringFoo': '/superBoringFoo',
    }
});

export default Foo;
```
In the example above, the `superFoo:post` endpoint will use the default serializer.
All HTTP verbs on the `boringfoo` endpoint will use the `someSerializer` function as their serializer.
All HTTP verbs on the `superBoringFoo` endpoint will use the default serializer.

Models should always have a `url` specified.  Further urls can be specified in the `endpoints` object.  Urls and
Serializers can be specified on a per endpoint/action basis and will default to the top level url and serializer.

If you find you need an `inflection` service to support your api, we recommend
you use [Ember-Inflector](https://github.com/stefanpenner/ember-inflector).  You
can then use `Ember.Inflector` in your serializers and models.

### Local Storage Adapter
The `localstorage` adapter works in much the same way as the ajax adapter.  It returns Object and Array proxies,
with the promise proxy mixin applied.  In the case of errors the promise will get rejected with an error object
similar to the `ic-ajax` error object, minus the `jqXHR` key and object.

#### If you installed *sl-ember-model* as an Ember CLI Addon

The localStorage adapter is initialized by default with your project's namespace.

If you want to change the default namespace then you will want to create an initializer:

    ember g localstorage-initializer

Now edit the file that was generated in `app/initializers/localstorage-initializer.js` and define the `namespace` value.

```javascript
module SlModel from 'sl-ember-model';

export default {
    name: 'sl-ember-model-localstorage',

    after: 'sl-ember-model',

    initialize: function( container ) {
        var localStorageAdapter = SlModel.LocalstorageAdapter;

        localStorageAdapter.reopenClass({
            namespace: '<namespace>'
        });

        container.register( 'adapter:localstorage', localStorageAdapter );
    }
};
```

#### If you are manually importing *sl-ember-model*

You will want to create an initializer:

    ember g initializer localstorage-initializer <namespace>


#### Assign the localstorage adapter to your models

```javascript
Foo.reopenClass({
    adapter: 'localstorage',
    url: '/foo'
});
```

Notice that the url variable is still needed as it will be used to store this model's records under the adapter's
namespace in localStorage.

### Error handling

Both the `ajax` adapter and the `localstorage` adapter

## Usage in Routes

In your routes, simply use the `store` variable that is injected into every route and controller.  Store has the
`find`, `findOne`, `createRecord`, and `metadataFor` methods.  Some example use cases:

`find`:

```javascript
model: function() {
    return this.store.find( 'foo' );
}
```

```javascript
setupController: function() {
    this.set( 'model', this.store.find( 'foo' ) );
}
```

`findOne`:

```javascript
model: function() {
    return this.store.findOne( 'foo' );
}
```

`createRecord`:

```javascript
setupController: function() {
    this.set( 'model', this.store.createRecord( 'foo' ) );
}
```

`metadataFor`:

```javascript
model: function() {
    var model = this.store.find( 'foo' );

    model.then( function() {
        this.controllerFor( 'foo/index' ).setProperties( this.store.metadataFor( 'foo' ) );
    }.bind( this ) );

    return model;
}
```

If you want to load a particular record via an `id` then pass the `id` in as the second parameter to `store.find`:

```javascript
    this.store.find( 'foo', 23 );
```

## Usage in Controllers
In your controller you have access to the `store` too.  You can create an options object to handle extra parameters for
to be added onto the url being queried.  Simply list the parameters in an object on the `data` key.

```javascript
actions: {
    changePage: function( page ) {
        var model = this.store.find( 'device', { data: { page: page } } );

        model.then( function() {
            this.set( 'currentPage', page );
            this.set( 'model', model );
        }.bind(this) );
    }
}
```

The options object can also take a `reload` parameter to bypass the caching mechanism:

```javascript
this.store.find( 'device', { reload: true } );
```

---

# Hooks

You may want to set up some pre/post query hooks that run after every query.  If so just create an initializer in your
application's initializers folder:

```javascript
export default {
    name: 'sl-ember-model-hooks',

    after: 'sl-ember-model',

    initialize: function( container ) {
        container.lookup( 'store:main' ).registerPostQueryHook(
            function( status ) {
                if ( 401 === status ) {
                    container.lookup( 'controller:application' ).send( 'forceLogout' );
                } else if ( 401 != status ) {
                    var authController = container.lookup( 'controller:auth' );

                    if ( authController ) {
                        authController.sendAction( 'session-keep-alive' );
                    }
                }
            }
        );
    }
};
```

---

# Versioning
Employs [Semantic Versioning 2.0.0](http://semver.org/)

---

# Contribution
[See CONTRIBUTING.md](CONTRIBUTING.md)

---

# Copyright and License
sl-ember-model and its source files are Copyright © 2014 [SoftLayer Technologies, Inc.](http://www.softlayer.com/) The software is [MIT Licensed](LICENSE.md)

---

# Warranty
This software is provided “as is” and without any express or implied warranties, including, without limitation, the
implied warranties of merchantability and fitness for a particular purpose.
