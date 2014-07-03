# sl-model

## use this to provide a nice-ish model layer for interface apps


### Installation

In order to use this just include this package in your bower.json like so:

```javascript
{
    dependencies: {
        "sl-model": "git@gitlab.softlayer.local:interface/sl-model.git#v0.1.3"
    }
}
```

Add sl-model and sl-modelize to your Brocfile.js:

```javascript
app.import( 'vendor/sl-modelize/dist/sl-modelize.js' );

app.import( 'vendor/sl-model/dist/sl-model.js', {
    exports: {
        'sl-model': [ 'default' ]
    }
});
````

And then be sure and initialize it before your app in app.js:

```javascript
loadInitializers(App, 'sl-model');
```

### Usage

#### Model

To add a model to your project, first create a new model in your models/ folder:

$touch models/foo.js

Add inside that file:

```javascript

import SlModel from 'sl-model';

var Foo = SlModel.extend({ });

Foo.reopenClass({
    url: '/foo',
    serializer: function( response, store ){ return xformData( response ); },
    endpoints: {
        'superFoo': {
            get: {
                url: '/superFoo',
                serialzer: function( response, store ){
                    store.metaForType( 'device', {
                        totalCount: response.totalCount,
                        totalPages: response.totalPages
                    });

                    return response.result;
                }
            },
            post: '/superFooPost'
        },
        'superDuperFoo': '/supdupfoo',
        'boringFoo': {
            url: '/boringFoo',
            serializer: someSerializer
        }
    }
});

export default Foo;
```
Models should always have a `url` specified.  Further urls can be specified in the `endpoints` object.  Urls and Serializers can be specified on a per endpoint/action basis and will default to the top level url and serializer.


#### Route

In your routes, simply used the `store` variable that is injected into every route and controller.  Store has the `find`, `createRecord`, and 'metadataFor' methods.

```javascript
    model: function(){
        var model = this.store.find( 'foo' );

        model.then( function(){
            this.controllerFor( 'foo/index' ).setProperties( this.store.metadataFor( 'foo' ) );
        }.bind( this ) );

        return model;
    }
```

If you want to load a particular record via an `id` then pass the `id` in as the second parameter to `store.find`:

```javasctript
    this.store.find( 'foo', 23 );
```

#### Controller
In your controller you have access to the `store` too.  You can create an options object to handle extra params for the query.  Simply list the params in an object on the `data` key.

```javascript

    actions: {

        changePage: function( page ){

            var model = this.store.find( 'device', null, { data: {page: page } } );

            model.then( function(){
                this.set( 'currentPage', page );
                this.set( 'model', model );
            }.bind(this));

        }
    }
```

The options object can also take a `reload` parameter to bypass the cache:

```javascript
this.store.find( 'device', null, { reload: true } );
```


### Hooks

You may want to set up some pre/post query hooks that run after every query.  If so just create an initializer in your apps initializers folder:

```javascript
export default {
    name: 'sl-model-hooks',
    after: 'sl-model',
    initialize: function( container ){
        container.lookup( 'store:main' ).registerPostQueryHook(
            function( status ){
                if( 401 === status ){
                    container.lookup( 'controller:application' ).send( 'forceLogout' );
                } else if ( 401 != status ) {
                    var authController = container.lookup( 'controller:auth' );
                    if( authController ){
                        authController.sendAction( 'session-keep-alive' );
                    }
                }
            }
        );
    }
};
```
