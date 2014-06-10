# interface-model

## use this to provide a nice-ish model layer for interface apps

In order to use this just include this package in your bower.json like so:

```javascript
{
    dependencies: {
        "interface-model": "git@gitlab.softlayer.local:mmarcum/interface-model.git#master"
    }
}
```

And then be sure and initialize it before your app in app.js:

```javascript
loadInitializers(App, 'interface-model');
```

You may want to set up some pre/post query hooks that run after every query.  If so just create an initializer in your apps initializers folder:

```javascript
export default {
    name: 'interface-model-hooks',
    after: 'interface-model',
    initialize: function( container ){
        container.lookup( 'store:main' ).registerPostQueryHook(
            function( status ){
                if( 401 === status ){
                    container.lookup( 'controller:application' ).send( 'forceLogout' );
                } else if ( 401 != status ) {
                    var msgbus = container.lookup( 'messagebus:main' );
                    if( msgbus ){
                        msgbus.push( 'session-keep-alive' );
                    }
                }
            }
        );
    }
};
```





