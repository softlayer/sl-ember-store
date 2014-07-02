# sl-model

## use this to provide a nice-ish model layer for interface apps


### Installation

In order to use this just include this package in your bower.json like so:

```javascript
{
    dependencies: {

        "sl-model": "git@gitlab.softlayer.local:interface/sl-model.git#v0.1.1"
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

To add a model to your project, first create a new model in your models/ folder:

$touch models/foo.js

Add inside that file:

```javascript

import SlModel from 'sl-model'

var Foo = SlModel.extend({ });

Foo.reopenClass({
    endpoints: {
        default: '/foo',
        'superFoo': {
            url: '/superFoo',
            serialzer: function( response, store ){
                store.metaForType( 'device', {
                    totalCount: response.totalCount,
                    totalPages: response.totalPages
                });

                return response.result;
            }
        }
    }
});

export default Foo;
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
