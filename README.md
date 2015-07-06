
[![Latest Release](https://img.shields.io/github/release/softlayer/sl-ember-store.svg)](https://github.com/softlayer/sl-ember-store/releases) ![Ember CLI version](https://img.shields.io/badge/ember%20cli-0.1.15-orange.svg) [![License](https://img.shields.io/npm/l/sl-ember-store.svg)](LICENSE.md) [![Downloads](https://img.shields.io/npm/dm/sl-ember-store.svg)](https://www.npmjs.com/package/sl-ember-store)

[![Dependencies](https://img.shields.io/david/softlayer/sl-ember-store.svg)](https://david-dm.org/softlayer/sl-ember-store) [![Dev Dependencies](https://img.shields.io/david/dev/softlayer/sl-ember-store.svg)](https://david-dm.org/softlayer/sl-ember-store#info=devDependencies)

[![Build Status](https://img.shields.io/travis/softlayer/sl-ember-store/master.svg)](https://travis-ci.org/softlayer/sl-ember-store) [![Code Climate](https://img.shields.io/codeclimate/github/softlayer/sl-ember-store.svg)](https://codeclimate.com/github/softlayer/sl-ember-store)

To see which issues are currently being worked on or are scheduled to be worked on next, visit [https://huboard.com/softlayer/sl-ember-store/#/](https://huboard.com/softlayer/sl-ember-store/#/)

---

### Is currently in BETA

---

# What sl-ember-store is

A library for managing model data in your Ember.js applications. It is designed to be agnostic to the underlying
persistence mechanism, so it works just as well with JSON APIs over HTTP as it does with streaming WebSockets or local storage.

This library **does not** support relationships or manage data state such as how Ember Data does.

What this library **DOES** do is allow you to work with models that do not have to be pre-defined.  Having a dependency on [sl-ember-modelize](https://github.com/softlayer/sl-ember-modelize), this libary is able to dynamically set data returned from an endpoint onto the correct model objects without having any knowledge of the data it will be receiving.

This library is also compatible with [Ember Inspector](https://github.com/emberjs/ember-inspector)

---

# Demo

## Live

[http://softlayer.github.io/sl-ember-store/#/demos](http://softlayer.github.io/sl-ember-store/#/demos)

## Development Environment

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* View the demo at http://localhost:4200

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

---

# How to use this addon in your application

## Install this addon as a Node module

```
ember install:addon sl-ember-store
```

## Instantiating the Store

In *sl-ember-store*, the store is responsible for managing the lifecycle of your models. Every time you need a model or a collection of models, you'll ask the store for it.

To create a store, you don't need to do anything. Just by loading the *sl-ember-store* library all of the routes and
controllers in your application will get a new store property. This property is an instance of *sl-ember-store/Store* that will be shared across all of the routes and controllers in your app.


## Defining Your Models

### Using the generator

To add a model to your project, simple do `ember g model <modelname>`.  You can also specify the url and/or the
adapter by appending the options:

    ember g model <modelname> url:<url> adapter:<adapter>

More on these options later.

### Creating by hand

First create a new model in your */models* folder:

    $touch models/foo.js

Add inside that file:

```javascript
import Model from 'sl-ember-store/model';

var Foo = Model.extend({ });
```

## Using Adapters:
sl-ember-store has two adapters out of the box: ajax and localstorage.  You can specify your adapter in your model by reopening it's class:

```javascript
Foo.reopenClass({
    adapter: 'ajax'
});
```

Models have `ajax` specified as default, so you don't need to do this unless you want to use a different adapter.

sl-ember-store adapters always return [Ember Promise Proxies](http://emberjs.com/api/classes/Ember.PromiseProxyMixin.html).
If you request a single object then you will get an `Ember.ObjectProxy` with the promise proxy mixin applied.  Requests for
Multiple records will return an `Ember.ArrayProxy` with the promise proxy mixin applied.

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
            post: '/superFooPost',
            put: '/superFooPut',
            delete: 'superFooDelete'
        },
        'boringFoo': {
            url: '/boringFoo',
            serializer: someSerializer
        },
        'superBoringFoo': '/superBoringFoo'
    }
});

export default Foo;
```
In the example above, the `superFoo:post` endpoint will use the default serializer.  Please note that specific endpoint
actions ( get, post, put, and delete ) MUST be in lowercase.
All HTTP verbs on the `boringfoo` endpoint will use the `someSerializer` function as their serializer.
All HTTP verbs on the `superBoringFoo` endpoint will use the default serializer.

Models should always have a `url` specified.  Further urls can be specified in the `endpoints` object.  Urls and
Serializers can be specified on a per endpoint/action basis and will default to the top level url and serializer.

The creation of a new record, one in which an id has not yet been assigned by your API, will result in a POST action.
Updating a record, one in which an id has been assigned by your API, will result in a PUT action.  The model's save()
method is responsible for both the creation and update of a record.  In both cases, the request body payload will be passed through.
The difference in whether a POST or a PUT is sent is dependent on whether the record already has an id assigned to it from the API.
The deletion of a record requires that a record has an id already assigned to it from the API.

If you find you need an `inflection` service to support your api, we recommend
you use [Ember-Inflector](https://github.com/stefanpenner/ember-inflector).  You
can then use `Ember.Inflector` in your serializers and models.

### Local Storage Adapter
The `localstorage` adapter works in much the same way as the ajax adapter.  It returns Object and Array proxies,
with the promise proxy mixin applied.  In the case of errors the promise will get rejected with an error object
similar to the `ic-ajax` error object, minus the `jqXHR` key and object.

#### If you installed *sl-ember-store* as an Ember CLI Addon

The localStorage adapter is initialized by default with your project's namespace.

If you want to change the default namespace then you will want to create an initializer:

    ember g localstorage-initializer

Now edit the file that was generated in `app/initializers/localstorage-initializer.js` and define the `namespace` value.

```javascript
import LocalstorageAdapter from 'sl-ember-store/adapters/localstorage';

export default {
    name: 'sl-ember-store-localstorage',

    after: 'sl-ember-store',

    initialize: function( container ) {
        var localStorageAdapter = LocalstorageAdapter;

        localStorageAdapter.reopenClass({
            namespace: '<namespace>'
        });

        container.register( 'adapter:localstorage', localStorageAdapter );
    }
};
```

#### If you are manually importing *sl-ember-store*

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

## Using the `store`

The `store` variable is injected into every route and controller and is the entry-point into the Sl-Ember-Store system.  Store has the
`find`, `findOne`, `createRecord`, and `metadataFor` methods.


### Some example use cases in a route:

`find`:

```javascript
model: function() {
    return this.store.find( 'foo' );
}
```

```javascript
model: function() {
    //load foo with id 23
    return this.store.find( 'foo', 23 );
}
```

```javascript
model: function() {
    //send query params to the server: ?start=0&limit=25
    return this.store.find( 'foo', { data: { start: 0, limit: 25 }} );
}
```


```javascript
setupController: function( controller, model ) {
    //would cause the route to skip the loading state and transition immediately to route while model is loading
    controller.set( 'model', this.store.find( 'foo' ) );
}
```

`findOne`:

```javascript
model: function() {
    //would return the first record from the cache or make a request for the first record
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
        this.controller.setProperties( this.store.metadataFor( 'foo' ) );
    }.bind( this ) );

    return model;
}
```

### Some example use cases in a controller

```javascript
actions: {
    //change to a different page
    changePage: function( page ) {
        var model;

        if( this.isPageLoaded( page ) ){
            //records are in cache
            model = this.store.find( 'device' ).then( function( records ){
                        //extract just the records for this page
                        return this.getPage( records, page );
                    });
        } else {
            //records are requested and will be added to cache, only the records
            //returned by the request will be present here
            model = this.store.find( 'device', { data: { page: page } } );
        }

        model.then( function() {
            this.pageIsLoaded( page );
            this.set( 'currentPage', page );
            this.set( 'model', model );
        }.bind(this) );
    },
    reloadModel: function() {
        //a request will be made just for this page, the cache will be cleared
        var model = this.store.find( 'device', {
            reload: true,
            data: { page: this.get( 'currentPage' ) } } );

        model.then( function() {
            this.set( 'model', model );
        }.bind(this) );
    }
}
```

### Options parameter in the `store.find` method

The `store.find` method can take up to three parameters.  The first parameter is always the model type.  The second parameter can either be a number or an object.  In the case of a number it is interpreted as an id and a single record will be returned.  In the case of an object it will be parsed as the `options` object.  If the second parameter is a number, then the third parameter (if present) will be the `options` object.  The `options` object has three importan keys:

    * reload    Boolean flag, clears the cache and loads data from the adapter
    * add       Boolean flag, load data from the adapter
    * data      Object, load data from the adapter with these key/value pairs

It is up to the specified adapter to determine how the `data` key/value pairs will be utilized.  The built in `ajax` adapter send these key/value pairs as query parameters.  The `localstorage` adapter does not make use of them.  The `add` and `reload` flags control how the store utilizes the cache.  In the case of `add` the records are requested from the adapter then added to the cache.  Records of the same `id` will get replaced.  In the case of `reload` the records are requested from the adapter, the cache is cleared, then the new records are added to the cache.  If only the `data` property is set on the `options` parameter then the request will be handled the same as if `add` had been specified.

---

# Hooks

You may want to set up some pre/post query hooks that run after every query.  If so just create an initializer in your
application's initializers folder:

```javascript
export default {
    name: 'sl-ember-store-hooks',

    after: 'sl-ember-store',

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
sl-ember-store and its source files are Copyright © 2014 [SoftLayer Technologies, Inc.](http://www.softlayer.com/) The software is [MIT Licensed](LICENSE.md)

---

# Warranty
This software is provided “as is” and without any express or implied warranties, including, without limitation, the
implied warranties of merchantability and fitness for a particular purpose.
