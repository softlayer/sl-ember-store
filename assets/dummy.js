define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit');
    test('ember-cli-qunit/adapter.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/adapter.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit/adapters');
    test('ember-cli-qunit/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit/adapters');
    test('ember-cli-qunit/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit');
    test('ember-cli-qunit/cache.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/cache.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit');
    test('ember-cli-qunit/debug-adapter.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit/initializers');
    test('ember-cli-qunit/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit');
    test('ember-cli-qunit/model.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/model.js should pass jshint.'); 
    });
  });
define("dummy/Ember CLI QUnit/tests/ember-cli-qunit/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-qunit');
    test('ember-cli-qunit/store.js should pass jshint', function() { 
      ok(true, 'ember-cli-qunit/store.js should pass jshint.'); 
    });
  });
define("dummy/app", 
  ["ember","ember/resolver","ember/load-initializers","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim');
    test('ember-cli-es5-shim/adapter.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/adapter.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim/adapters');
    test('ember-cli-es5-shim/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim/adapters');
    test('ember-cli-es5-shim/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim');
    test('ember-cli-es5-shim/cache.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/cache.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim');
    test('ember-cli-es5-shim/debug-adapter.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim/initializers');
    test('ember-cli-es5-shim/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim');
    test('ember-cli-es5-shim/model.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/model.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-es5-shim/tests/ember-cli-es5-shim/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-es5-shim');
    test('ember-cli-es5-shim/store.js should pass jshint', function() { 
      ok(true, 'ember-cli-es5-shim/store.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender');
    test('ember-cli-pretender/adapter.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/adapter.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender/adapters');
    test('ember-cli-pretender/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender/adapters');
    test('ember-cli-pretender/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender');
    test('ember-cli-pretender/cache.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/cache.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender');
    test('ember-cli-pretender/debug-adapter.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender/initializers');
    test('ember-cli-pretender/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender');
    test('ember-cli-pretender/model.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/model.js should pass jshint.'); 
    });
  });
define("dummy/ember-cli-pretender/tests/ember-cli-pretender/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-cli-pretender');
    test('ember-cli-pretender/store.js should pass jshint', function() { 
      ok(true, 'ember-cli-pretender/store.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global');
    test('ember-export-application-global/adapter.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/adapter.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global/adapters');
    test('ember-export-application-global/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global/adapters');
    test('ember-export-application-global/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global');
    test('ember-export-application-global/cache.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/cache.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global');
    test('ember-export-application-global/debug-adapter.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global/initializers');
    test('ember-export-application-global/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global');
    test('ember-export-application-global/model.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/model.js should pass jshint.'); 
    });
  });
define("dummy/ember-export-application-global/tests/ember-export-application-global/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-export-application-global');
    test('ember-export-application-global/store.js should pass jshint', function() { 
      ok(true, 'ember-export-application-global/store.js should pass jshint.'); 
    });
  });
define("dummy/initializers/export-application-global", 
  ["ember","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: 'export-application-global',

      initialize: initialize
    };
  });
define("dummy/initializers/pretender", 
  ["pretender","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Pretender = __dependency1__["default"];

    var fooRecords = [
        {
            id: 1,
            text: 'This is foo record with id: 1',
            bar: {
                id: 1,
                text: 'This is a bar record with id: 1'
            }
        },
        {
            id: 2,
            text: 'This is foo record #2',
            bar: {
                id: 2,
                text: 'This is a bar record with id: 2'
            }

        },
        {
            id: 3,
            text: 'This is foo record #3',
            bar: {
                id: 3,
                text: 'This is a bar record with id: 3'
            }

        },
        {
            id: 4,
            text: 'This is foo record with id: 4',
            bar: {
                id: 4,
                text: 'This is a bar record with id: 4'
            }
        },
        {
            id: 5,
            text: 'This is foo record #5',
            bar: {
                id: 5,
                text: 'This is a bar record with id: 5'
            }

        },
        {
            id: 6,
            text: 'This is foo record #6',
            bar: {
                id: 6,
                text: 'This is a bar record with id: 6'
            }

        }
    ];

    function initialize(/* container, application */) {
        new Pretender(function(){
            this.get( '/foo', function(request){
                var id = request.queryParams.id && ( parseInt( request.queryParams.id ) - 1 ),
                    start = request.queryParams.start || 0,
                    length = request.queryParams.length || fooRecords.length,
                    results = fooRecords.slice( start, length );

                if( request.queryParams.id ){
                    return [
                        200,
                        { "Content-Type":"application/json" },
                        JSON.stringify( { foo: fooRecords[ id ] } )
                    ];
                }

                return [
                    200,
                    { "Content-Type":"application/json" },
                    JSON.stringify( { foo: results, meta: { total: fooRecords.length } })
                ];
            });
            this.post( '/foo', function(request){
                var record = JSON.parse( request.requestBody );
                fooRecords[ record.id ]= record;
                return [
                    200,
                    { "Content-Type":"application/json" },
                    JSON.stringify( record )
                ];
            });
        });
    }

    __exports__.initialize = initialize;__exports__["default"] = {
      name: 'pretender',
      after: 'sl-ember-store',
      initialize: initialize
    };
  });
define("dummy/initializers/sl-ember-store", 
  ["sl-ember-store/initializers/sl-ember-store","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var initializer = __dependency1__["default"];

    __exports__["default"] = {

        name: 'sl-ember-store',

        initialize: initializer
    };
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware');
    test('live-reload-middleware/adapter.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/adapter.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware/adapters');
    test('live-reload-middleware/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware/adapters');
    test('live-reload-middleware/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware');
    test('live-reload-middleware/cache.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/cache.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware');
    test('live-reload-middleware/debug-adapter.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware/initializers');
    test('live-reload-middleware/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware');
    test('live-reload-middleware/model.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/model.js should pass jshint.'); 
    });
  });
define("dummy/live-reload-middleware/tests/live-reload-middleware/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - live-reload-middleware');
    test('live-reload-middleware/store.js should pass jshint', function() { 
      ok(true, 'live-reload-middleware/store.js should pass jshint.'); 
    });
  });
define("dummy/models/bar", 
  ["sl-ember-store/model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"];

    var Bar = Model.extend({
    });


    __exports__["default"] = Bar;
  });
define("dummy/models/car", 
  ["sl-ember-store/model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"];

    var Car = Model.extend({
    });

    Car.reopenClass({
        url: '/api/car',
        serializer: function( result ){
            return result.car;
        }
    });

    __exports__["default"] = Car;
  });
define("dummy/models/foo", 
  ["sl-ember-store/model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"];

    var Foo = Model.extend({
    });

    Foo.reopenClass({
        url: '/foo',
        serializer: function( data, store ){
        	if( data.meta ){
        		store.metaForType( 'foo', data.meta );
        	}

        	return data.foo;
        }
    });

    __exports__["default"] = Foo;
  });
define("dummy/router", 
  ["ember","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function() {
        this.route( 'index', { path: '/' });

        this.resource( 'demos', function() {
            this.route( 'singleModel', { path: '/singleModel/:model_id' } );
            this.route( 'arrayOfModels', { path: '/arrayOfModels' } );
        });
    });

    __exports__["default"] = Router;
  });
define("dummy/routes/demos/array-of-models", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Route.extend({
        actions: {
            addSomeRecords: function(){
                this.loadRecords( { add: true, data: { start: 3, length: 6 } } );            
            },
            loadSomeRecords: function(){
                this.loadRecords( { data: { start: 3, length: 6 } } );            
            },
            addAllRecords: function(){
                this.loadRecords( { add: true } );            
            },
            reloadFirstRecords: function(){
                this.loadRecords( { reload: true, data: { start: 0, length: 3 } } );            
            },
        },

        loadRecords: function( options ){
            var controller = this.controller,
                records = this.store.find( 'foo', options );            

            controller.set( 'model2', records );

            records.then( function(){
                controller.set( 'model2meta', this.store.metadataFor( 'foo' ) );
                this.store.find( 'foo' ).then( function( records ){
                    controller.set( 'model2CachedTotalCount', records.length );    
                });
            }.bind( this ));      
        },

        model: function( ){
            var initialRequest = this.store.find( 'foo', null, { data: { start: 0, length: 3 } } );

            return initialRequest;
        },

        setupController: function( controller, model ){
            controller.set( 'model', model );
            controller.set( 'model2', model );
            controller.set( 'model2CachedTotalCount', model.length );
            controller.set( 'model2meta', this.store.metadataFor( 'foo' ) );
        }
    });
  });
define("dummy/routes/demos/single-model", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Route.extend({
        model: function( params ){
            return this.store.find( 'foo', params.model_id );
        }
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize');
    test('sl-ember-modelize/adapter.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/adapter.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize/adapters');
    test('sl-ember-modelize/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize/adapters');
    test('sl-ember-modelize/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize');
    test('sl-ember-modelize/cache.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/cache.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize');
    test('sl-ember-modelize/debug-adapter.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize/initializers');
    test('sl-ember-modelize/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize');
    test('sl-ember-modelize/model.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/model.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-modelize/tests/sl-ember-modelize/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-modelize');
    test('sl-ember-modelize/store.js should pass jshint', function() { 
      ok(true, 'sl-ember-modelize/store.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store');
    test('sl-ember-store/adapter.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/adapter.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/adapters/ajax.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store/adapters');
    test('sl-ember-store/adapters/ajax.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/adapters/ajax.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/adapters/localstorage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store/adapters');
    test('sl-ember-store/adapters/localstorage.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/adapters/localstorage.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/cache.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store');
    test('sl-ember-store/cache.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/cache.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/debug-adapter.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store');
    test('sl-ember-store/debug-adapter.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/debug-adapter.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/initializers/sl-ember-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store/initializers');
    test('sl-ember-store/initializers/sl-ember-store.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/initializers/sl-ember-store.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store');
    test('sl-ember-store/model.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/model.js should pass jshint.'); 
    });
  });
define("dummy/sl-ember-store/tests/sl-ember-store/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - sl-ember-store');
    test('sl-ember-store/store.js should pass jshint', function() { 
      ok(true, 'sl-ember-store/store.js should pass jshint.'); 
    });
  });
define("dummy/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("<i class=\"fa fa-home\"></i> Home");
      }

      data.buffer.push("<br>\n<div class=\"container\">\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"btn-group pull-right\">\n                <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n                    <i class=\"fa fa-reorder\"></i> <span class=\"caret\"></span>\n                </button>\n\n                <ul class=\"dropdown-menu\" role=\"menu\">\n                <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/README.md\"><i class=\"fa fa-wrench\"></i> Get Started</a></li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/CONTRIBUTING.md\"><i class=\"fa fa-cog\"></i> Contribution Guide</a></li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/stargazers\"><i class=\"fa fa-star\"></i> Star Our Repo</a></li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/fork\"><i class=\"fa fa-code-fork\"></i> Fork Our Repo</a></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n\n    ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    <br><br>\n    <div class=\"row\">\n        <div class=\"col-md-12 text-center\">\n            <p>npm install sl-ember-store</p>\n            <p><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/LICENSE.md\">MIT Licensed</a></p>\n        </div>\n    </div>\n</div>");
      return buffer;
      
    });
  });
define("dummy/templates/demos", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Demo Application");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("Single model example");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("Array of models example");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12 text-center\">\n        <h1>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos", options) : helperMissing.call(depth0, "link-to", "demos", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n        <p class=\"lead\">View the source code of the dummy application for syntax employed in this demo</p>\n    </div>\n</div>\n\n<div class=\"row\">\n    <div class=\"col-md-12 text-center\">\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data},helper ? helper.call(depth0, "demos.singleModel", 1, options) : helperMissing.call(depth0, "link-to", "demos.singleModel", 1, options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos.arrayOfModels", options) : helperMissing.call(depth0, "link-to", "demos.arrayOfModels", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n</div>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      
    });
  });
define("dummy/templates/demos/array-of-models", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n            <h4>Foo Model</h4>\n\n            <ul>\n            <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "demos.singleModel", "model.id", options) : helperMissing.call(depth0, "link-to", "demos.singleModel", "model.id", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n            <li>Text: ");
      stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n            ");
      stack1 = helpers['if'].call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("ID: ");
      stack1 = helpers._triageMustache.call(depth0, "model.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n                <ul>\n                <h4>Bar Model</h4>\n                <li>ID: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                <li>Text: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                </ul>\n            </ul>\n            ");
      return buffer;
      }

    function program6(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n                    <h4>Foo Model</h4>\n\n                    <ul>\n                    <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "demos.singleModel", "model.id", options) : helperMissing.call(depth0, "link-to", "demos.singleModel", "model.id", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                    <li>Text: ");
      stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                    ");
      stack1 = helpers['if'].call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n                ");
      return buffer;
      }
    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n                        <ul>\n                        <h4>Bar Model</h4>\n                        <li>ID: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                        <li>Text: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                        </ul>\n                    </ul>\n                    ");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12\">\n\n        <h2>Array of Models</h2>\n\n        <p>These records can be loaded in our route's model hook with the following code:</p>\n\n        <code>this.store.find('foo');</code>\n\n        <br><br>\n        <p>The `foo` model has its adapter set to the ajax adapter*.  The \"/foo\" resource contains foo records with embedded \"bar\" records.  These records are automatically created as an instance of the \"Bar\" model when the data is returned from the adapter.</p>\n\n        <br>\n        ");
      stack1 = helpers.each.call(depth0, "model", "in", "controller", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n        <br>\n        <p>The original JSON for this resource:</p>\n\n        <pre>\n{\n    id: 1,\n    text: 'This is foo record with id: 1',\n    bar: {\n        id: 1,\n        text: 'This is a bar record with id: 1'\n    }\n},\n{\n    id: 2,\n    text: 'This is foo record #2',\n    bar: {\n        id: 2,\n        text: 'This is a bar record with id: 2'\n    }\n\n},\n{\n    id: 3,\n    text: 'This is foo record #3',\n    bar: {\n        id: 3,\n        text: 'This is a bar record with id: 3'\n    }\n\n}\n        </pre>\n        <p>* We are actually using <a href=\"https://github.com/rwjblue/ember-cli-pretender\">Pretender</a> to mockup our data. This library is great for static gh-pages!</p>\n\n        <h3>Cacheing and Options</h3>\n\n        <p>Our store implements a simple cacheing layer.  The cacheing layer recoginzes requests for multiple records and will check to see if one has already been made.  If so then it returns the records in its cache.  However, you may wish to override this default behavior and fetch the records again through the adapter.  This can be accomplished by passing a flag through the <code>store.find</code> method's <code>options</code> parameter.</p>\n\n        <p>When fetching many records there are two flags you can pass along in the <code>options</code> object to control how your records are cached:\n            <dl>\n                <dt>options.reload</dt>\n                <dd>Clear the cache for this record type and load new records from the adapter</dd>\n\n                <dt>options.add</dt>\n                <dd>Request new records from the adapter and add them to the cache</dd>\n            </dl>\n\n        <p>Additionally there is a third key on the options object:</p>\n            <dl>\n                <dt>options.data</dt>\n                <dd>An object of key/value pairs that will be passed to the adapter\n            </dl>\n       In the case of the ajax adapter these key/value pairs will be transformed into query parameters.</p>\n\n        <p>Earlier I said that these records can be loaded with <code>this.store.find('foo')</code>.  While that is true, the code we actually used was <code>this.store.find( 'foo', { data: { start: 0, length: 3} } )</code>.  This only loaded a subset of the records available.  The following two buttons will demonstrate the functionality of the <code>reload</code> and <code>add</code> flags:</p>\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <ul class=\"list-group\">\n                <li class=\"list-group-item\"><button class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "addSomeRecords", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Add Some Records</button> will run <code>this.store.find( 'foo', { add: true, data: { start: 3, length: 6 } } ) </code></li>\n                <li class=\"list-group-item\"><button class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "addAllRecords", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Add All Records</button> will run <code>this.store.find( 'foo', { add: true } ) //server responds with all records</code></li>\n                <li class=\"list-group-item\"><button class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "reloadFirstRecords", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Reload First Records</button> will run to <code>this.store.find( 'foo', { reload: true, data: { start: 0, length: 3} } )</code></li>\n                </ul>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <ul class=\"list-group\">\n                    <li class=\"list-group-item\">Total records on server: <span class=\"badge\">");
      stack1 = helpers._triageMustache.call(depth0, "model2meta.total", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span></li>\n                    <li class=\"list-group-item\">Total records in cache: <span class=\"badge\">");
      stack1 = helpers._triageMustache.call(depth0, "model2CachedTotalCount", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span></li>\n                    <li class=\"list-group-item\">Total records in controller: <span class=\"badge\">");
      stack1 = helpers._triageMustache.call(depth0, "model2.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span></li>\n                </ul>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n\n                ");
      stack1 = helpers.each.call(depth0, "model", "in", "controller.model2", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            </div>\n        </div>\n        <p>If you specify <code>options.data</code> key value pairs without specifying <code>add</code> or <code>reload</code> then we assume <code>add</code> by default.</p>\n    </div>\n</div>");
      return buffer;
      
    });
  });
define("dummy/templates/demos/single-model", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12\">\n\n        <h2>Single Model</h2>\n\n        <p>This record is loaded in our route's model hook with the following code:</p>\n\n        <code>this.store.find( 'foo', params.model_id );</code>\n\n        <br><br>\n        <p>The model is loaded by the store via the ajax adapter.  The \"/foo?id=1\" resource contains an embedded \"bar\" record, and this record is automatically created as an instance of the \"Bar\" model.</p>\n\n        <br>\n        <h4>Foo Model</h4>\n\n        <ul>\n        <li>ID: ");
      stack1 = helpers._triageMustache.call(depth0, "model.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n        <li>Text: ");
      stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n            <ul>\n                <h4>Bar Model</h4>\n                <li>ID: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n                <li>Text: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n            </ul>\n        </ul>\n\n        <br>\n        <p>The original JSON for this resource:</p>\n\n        <pre>\n{\n    id: ");
      stack1 = helpers._triageMustache.call(depth0, "model.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(",\n    text: '");
      stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("',\n    bar: {\n        id: ");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(",\n        text: '");
      stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("'\n    }\n}\n</pre>\n\n    </div>\n</div>");
      return buffer;
      
    });
  });
define("dummy/templates/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("<i class=\"fa fa-cubes fa-5x\"></i>");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("<b>Demo</b>");
      }

      data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12 text-center\">\n        <h1>sl-ember-store</h1>\n        <p class=\"lead\">An Ember CLI Addon to provide a model layer for an Ember application.</p>\n    </div>\n</div>\n\n<div class=\"row\">\n    <div class=\"col-md-4 text-center\">\n        <h3>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos", options) : helperMissing.call(depth0, "link-to", "demos", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h3>\n        <p>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos", options) : helperMissing.call(depth0, "link-to", "demos", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</p>\n    </div>\n    <div class=\"col-md-4 text-center\">\n        <h3><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/README.md\"><i class=\"fa fa-book fa-5x\"></i></a></h3>\n        <p><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/README.md\"><b>Documentation</b></a></p>\n    </div>\n    <div class=\"col-md-4 text-center\">\n        <h3><a href=\"https://github.com/softlayer/sl-ember-store\"><i class=\"fa fa-github fa-5x\"></i></a></h3>\n        <p><a href=\"https://github.com/softlayer/sl-ember-store\"><b>Available on GitHub</b></a></p>\n    </div>\n</div>");
      return buffer;
      
    });
  });
define("dummy/tests/acceptance/array-of-models-test", 
  ["ember","dummy/tests/helpers/start-app","dummy/models/foo","ember-qunit"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var startApp = __dependency2__["default"];
    var Foo = __dependency3__["default"];
    var test = __dependency4__.test;
    var moduleFor = __dependency4__.moduleFor;

    var App;

    module('Acceptance: ArrayOfModels', {
      setup: function() {
        App = startApp();
      },
      teardown: function() {
        Ember.run(App, 'destroy');
      }
    });

    test('visiting /arrayOfModels', function() {
      visit('/demos/arrayOfModels');

      andThen(function() {
        var arrayModelController = App.__container__.lookup('controller:demos/arrayOfModels');
        equal(currentPath(), 'demos.arrayOfModels');
        ok( arrayModelController.get('model.0') instanceof Foo, 'Controllers model is instance of Foo' );

      });
    });
  });
define("dummy/tests/acceptance/single-model-test", 
  ["ember","dummy/tests/helpers/start-app","dummy/models/foo","ember-qunit"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var startApp = __dependency2__["default"];
    var Foo = __dependency3__["default"];
    var test = __dependency4__.test;
    var moduleFor = __dependency4__.moduleFor;

    var App;

    module( 'Acceptance: SingleModel', {
      setup: function() {
        App = startApp();
      },
      teardown: function() {
        Ember.run(App, 'destroy');
      }
    });

    test('visiting /singleModel', function() {
      visit('/demos/singleModel/1');

      andThen(function() {
        var singleModelController = App.__container__.lookup('controller:demos/singleModel');
        equal(currentPath(), 'demos.singleModel');
        ok( singleModelController.get('model') instanceof Foo, 'Controllers model is instance of Foo' );
      });
    });
  });
define("dummy/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/acceptance/array-of-models-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/acceptance');
    test('dummy/tests/acceptance/array-of-models-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/acceptance/array-of-models-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/acceptance/single-model-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/acceptance');
    test('dummy/tests/acceptance/single-model-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/acceptance/single-model-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/helpers/module-for-sl-ember-model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/helpers');
    test('dummy/tests/helpers/module-for-sl-ember-model.js should pass jshint', function() { 
      ok(true, 'dummy/tests/helpers/module-for-sl-ember-model.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/helpers');
    test('dummy/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'dummy/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/helpers');
    test('dummy/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'dummy/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests');
    test('dummy/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'dummy/tests/test-helper.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/adapters-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit');
    test('dummy/tests/unit/adapters-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/adapters-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/adapters/ajax-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit/adapters');
    test('dummy/tests/unit/adapters/ajax-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/adapters/ajax-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/adapters/localstorage-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit/adapters');
    test('dummy/tests/unit/adapters/localstorage-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/adapters/localstorage-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/cache-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit');
    test('dummy/tests/unit/cache-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/cache-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/initializers/sl-ember-model-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit/initializers');
    test('dummy/tests/unit/initializers/sl-ember-model-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/initializers/sl-ember-model-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/model-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit');
    test('dummy/tests/unit/model-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/model-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/dummy/tests/unit/store-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - dummy/tests/unit');
    test('dummy/tests/unit/store-test.js should pass jshint', function() { 
      ok(true, 'dummy/tests/unit/store-test.js should pass jshint.'); 
    });
  });
define("dummy/tests/helpers/module-for-sl-ember-model", 
  ["ember-qunit","ember","sl-ember-store/store","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var Ember = __dependency2__["default"];
    var Store = __dependency3__["default"];


    __exports__["default"] = function moduleForSlEmberModel(name, description, callbacks) {

        moduleFor('model:' + name, description, callbacks, function(container, context, defaultSubject) {

            container.register('store:main', Store );

            context.__setup_properties__.store = function(){
                return container.lookup('store:main');
            };

            if (context.__setup_properties__.subject === defaultSubject) {
                context.__setup_properties__.subject = function(options) {
                    return Ember.run(function() {
                        return container.lookup('store:main').createRecord(name, options);
                    });
                };
            }
        });
    }
  });
define("dummy/tests/helpers/resolver", 
  ["ember/resolver","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("dummy/tests/helpers/start-app", 
  ["ember","dummy/app","dummy/router","dummy/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function() {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("dummy/tests/initializers/pretender.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - initializers');
    test('initializers/pretender.js should pass jshint', function() { 
      ok(true, 'initializers/pretender.js should pass jshint.'); 
    });
  });
define("dummy/tests/models/bar.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/bar.js should pass jshint', function() { 
      ok(true, 'models/bar.js should pass jshint.'); 
    });
  });
define("dummy/tests/models/car.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/car.js should pass jshint', function() { 
      ok(true, 'models/car.js should pass jshint.'); 
    });
  });
define("dummy/tests/models/foo.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/foo.js should pass jshint', function() { 
      ok(true, 'models/foo.js should pass jshint.'); 
    });
  });
define("dummy/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("dummy/tests/routes/demos/array-of-models.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/demos');
    test('routes/demos/array-of-models.js should pass jshint', function() { 
      ok(true, 'routes/demos/array-of-models.js should pass jshint.'); 
    });
  });
define("dummy/tests/routes/demos/single-model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/demos');
    test('routes/demos/single-model.js should pass jshint', function() { 
      ok(true, 'routes/demos/single-model.js should pass jshint.'); 
    });
  });
define("dummy/tests/test-helper", 
  ["dummy/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

    QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
    var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
    document.getElementById('ember-testing-container').style.visibility = containerVisibility;
  });
define("dummy/tests/unit/adapters-test", 
  ["ember","ember-qunit","sl-ember-store/adapter"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;
    var Adapter = __dependency3__["default"];

    var adapter,
        store = {
            runPostQueryHooks: sinon.spy(),
            runPreQueryHooks: sinon.spy()
        };

    module( 'Unit - sl-ember-store/adapter', {
        setup: function() {
            adapter = Adapter.create({
                container:{
                    lookup: function( type ){
                        if( type === 'store:main' )
                            return store;
                        else
                            Ember.Assert( 'Container could not find "'+type+'"', false);
                    }
                }
            });
        },
        teardown: function() {
            store.runPostQueryHooks.reset();
            store.runPreQueryHooks.reset();
        }
    });
    test( 'runPreQueryHooks should run the prequeryhook once', function() {
        adapter.runPreQueryHooks();
        ok( store.runPreQueryHooks.calledOnce );
    });

    test( 'runPreQueryHooks should not have run postqueryhook', function() {
        adapter.runPreQueryHooks();
        equal( store.runPostQueryHooks.callCount,0 );
    });

    test( 'runPostQueryHooks should run the postqueryhook once', function() {
         adapter.runPostQueryHooks();
         ok( store.runPostQueryHooks.calledOnce );
    });
    test( 'runPostQueryHooks should not have run the prequeryhook', function() {
         adapter.runPostQueryHooks();
         equal( store.runPreQueryHooks.callCount,0 );
    });
  });
define("dummy/tests/unit/adapters/ajax-test", 
  ["ember","ember-qunit","sl-ember-store/model","sl-ember-store/adapter","sl-ember-store/store","sl-ember-store/adapters/ajax","ic-ajax"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;
    var Model = __dependency3__["default"];
    var Adapter = __dependency4__["default"];
    var Store = __dependency5__["default"];
    var Ajaxadapter = __dependency6__["default"];
    var icAjax = __dependency7__;

    var ajaxadapter,
        Foo = Model.extend(),
        Bar = Model.extend(),
        defineFixture = icAjax.defineFixture,
        response,
        requestSpy;

    module( 'Unit - sl-ember-store/adapter/ajax', {
        setup: function() {
            var container = {
                    registry: [],
                    cache: {},
                    normalize: function( key ){
                        return key;
                    },
                    lookup: function( key ){
                        if( this.cache[key] ) return this.cache[key];

                        var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                        this.cache[key] = obj;
                        return obj;
                    },
                    lookupFactory: function( key ){
                        var item = this.registry.findBy( 'key', key );
                        return item ? item.factory : undefined;
                    }
                };

            ajaxadapter = Ajaxadapter.create({
                container: container,
                store: Store.create({ container:container })
            });
            //register mock data
            ajaxadapter.container.cache['store:main']={
                runPostQueryHooks: sinon.spy(),
                runPreQueryHooks: sinon.spy()
            };

            ajaxadapter.container.registry.push( { key: 'model:foo', factory: Foo } );
            ajaxadapter.container.registry.push( { key: 'model:bar', factory: Bar } );

            defineFixture( '/foo', {
                response: { id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } },
                jqXHR: {},
                textStatus: 'success'
            });
            defineFixture( '/fooFail', {
                errorThrown: 'this is an error msg',
                jqXHR: {},
                textStatus: 'error'
            });
            defineFixture( '/bar', {
                response:  [ { id: 1, quiz: 'bar' }, { id: 2, quiz: 'bar2' } ],
                jqXHR: {},
                textStatus: 'success'
            });
            Foo.reopenClass( {
                url: '/foo',
                endpoints: {
                    fail: {
                        url: '/fooFail'
                    }
                }
            });

            Bar.reopenClass( { url: '/bar'});

            //spies
            requestSpy = sinon.spy( icAjax, 'request' );
        },
        teardown: function() {
            icAjax.request.restore();
        }
    });

    function ajaxTestSuite(){
        ok( requestSpy.calledOnce, 'request called once' );
        ok( response.then, 'response is a promise' );
        ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise proxy' );
    }

    asyncTest( '__find single model with id', function(){

        expect(6);
        response = ajaxadapter.find( 'foo', 1 );

        equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax.request with the correct arguments');

        equal( requestSpy.args[0][0].data.id, 1, 'should call icAjax.request with the correct arguments');

        ajaxTestSuite();

        response.then( function(){
            ok( response.get('content') instanceof Foo, 'response is instance of Foo' );
            start();
        });
    });

    asyncTest( '__find single model with no id', function(){
        var options =  {data: {main: true }};

        response = ajaxadapter.find( 'foo', null, options, true );

        equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax.request with the correct arguments');

        ok( requestSpy.args[0][0].data.main, 'should call icAjax.request with the correct arguments');

        ajaxTestSuite();

        response.then( function(){
            ok( response.get('content') instanceof Foo, 'response is instance of Foo' );
            start();
        });

    });

    asyncTest( '__find array of model', function(){
        var options =  {data: {main: true }};
        //request
        response = ajaxadapter.find( 'bar', null, options, false );

        ajaxTestSuite();

        ok( response instanceof Ember.ArrayProxy, 'should return an instance of Ember.ArrayProxy' );
        response.then( function(){
            ok( response.content[0] instanceof Bar, 'should return an array of Bar models' );
            ok( response.content[1] instanceof Bar, 'should return an array of Bar models' );
            start();
        });
    });


    asyncTest( 'find should throw error if request fails', function(){
        var options = { endpoint: 'fail' },
            promise = ajaxadapter.find( 'foo', null, options, false );

        promise.then( function( result ){
            ok( false, 'find did not throw an error!' );
            start();
        },
        function( result ){
            equal( result.textStatus, 'error', 'find did throw error' );
            start();
        });
    });

    test( 'save', function(){
        var foo = Foo.create({ test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
        response = ajaxadapter.save( '/foo', foo );
        ok( requestSpy.calledOnce, 'should call icAjax request once' );
        equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax with correct url');
        equal( requestSpy.args[0][0].type, 'POST', 'should call icAjax with correct method');
        equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
    });

    test( 'save, should call $.ajax with the correct arguments', function(){
        var foo = Foo.create({ test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
        response = ajaxadapter.save( '/foo', foo );
        ok( requestSpy.calledOnce, 'request called once' );
        equal( requestSpy.args[0][0].url, '/foo' );
        equal( requestSpy.args[0][0].type, 'POST' );
        equal( typeof requestSpy.args[0][0].data, 'string' );
        ok( response.then, 'response is a promise' );
    });

    test( 'delete, should call icAjax.request once', function(){
        var foo = Foo.create({ id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
        response = ajaxadapter.deleteRecord( '/foo', 1 );

        ok( requestSpy.calledOnce );
        equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax with correct url');
        equal( requestSpy.args[0][0].type, 'DELETE', 'should call icAjax with correct url');
        equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
        ok( response.then, 'response is a proxy' );
    });
  });
define("dummy/tests/unit/adapters/localstorage-test", 
  ["ember","ember-qunit","sl-ember-store/model","sl-ember-store/adapter","sl-ember-store/store","sl-ember-store/adapters/localstorage"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;
    var Model = __dependency3__["default"];
    var Adapter = __dependency4__["default"];
    var Store = __dependency5__["default"];
    var LocalStorageAdapter = __dependency6__["default"];

    var localstorageadapter,
        localStorageBackup,
        localStorage,
        container,
        getLocalStorageSpy,
        requestSpy,
        saveSpy,
        response,
        Foo = Model.extend(),
        Bar = Model.extend();

    module( 'Unit - sl-ember-store/adapter/localstorage', {
        setup: function() {
           localStorage = {
                _ns: 'testLSObject',
                setItem: function( item, content ){
                    this[item] = content;
                },
                getItem: function( item ){
                    return this[item];
                }
            };
            container = {
                registry: [],
                cache: {},
                normalize: function( key ){
                    return key;
                },
                lookup: function( key ){
                    if( this.cache[key] ) return this.cache[key];

                    var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                    this.cache[key] = obj;
                    return obj;
                },
                lookupFactory: function( key ){
                    var item = this.registry.findBy( 'key', key );
                    return item ? item.factory : undefined;
                }
            };
            localstorageadapter = LocalStorageAdapter.create({
                container: container,
                store: Store.create({ container:container })
            });

            //register mock data
            localstorageadapter.container.cache['store:main']={
                runPostQueryHooks: sinon.spy(),
                runPreQueryHooks: sinon.spy()
            };

            Foo.reopenClass( { url: '/foo', adapter: 'localstorage' } );
            Bar.reopenClass( { url: '/bar', adapter: 'localstorage' } );

            localstorageadapter.container.registry.push( { key: 'model:foo', factory: Foo } );
            localstorageadapter.container.registry.push( { key: 'model:bar', factory: Bar } );

            getLocalStorageSpy = sinon.stub( localstorageadapter, '_getLocalStorage', function(){
                return localStorage;
            });

            localstorageadapter.save( '/foo',  {id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } } );
            localstorageadapter.save( '/bar', { id: 1, quiz: 'bar' } );
            localstorageadapter.save( '/bar', { id: 2, quiz: 'bar2' } );

        //spies
            requestSpy = sinon.spy( localStorage, 'getItem' );
            saveSpy = sinon.spy( localStorage, 'setItem' );

        },
        teardown: function() {
            localStorage.getItem.restore();
            localStorage.setItem.restore();
            getLocalStorageSpy.restore();
        }
    });

    asyncTest( '__find single model with id', function(){
        response = localstorageadapter.find( 'foo', 1, { label: '1' } );
        equal(requestSpy.args[0][0], 'sl-ember-store', 'calls request with correct args' );
        ok( response.then, 'response is a promise' );
        ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise' );
        response.then(function( result ){
            ok( response.get( 'content' ) instanceof Foo, 'response content is instace of Foo' );
            start();
        });
    });

    asyncTest( '__find single model with no id', function(){
        var options =  {data: {main: true }};

        response = localstorageadapter.find( 'foo', null, options, true );

        equal(requestSpy.args[0][0], 'sl-ember-store', 'calls request with correct args' );

        ok( response.then, 'response is a promise' );

        ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise' );

        response.then(function(){
            ok( response.get( 'content' ) instanceof Foo, 'response content is instace of Foo' );
            start();
        });

    });

    asyncTest( '__find array of models', function(){
        var options =  {data: {main: true }};

        response = localstorageadapter.find( 'bar', null, options, false );

        ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise' );

        response.then(function(){
            ok( response.get( 'content.0' ) instanceof Bar, 'response content is instace of Bar' );
            ok( response.get( 'content.1' ) instanceof Bar, 'response content is instace of Bar' );
            start();
        });
    });

    asyncTest( 'save', function(){
        var fooContent = { id: 2, test: 'foo', 'bar': { id: 1, quiz: 'bar2' } },
            foo = Foo.create( fooContent );

        response = localstorageadapter.save( '/foo', foo );
        response.then( function(){
            var fooRecords = JSON.parse(localStorage.getItem('sl-ember-store')).foo,
                fooRecord = fooRecords.findBy( 'id', 2 );

            ok( response.then, 'response is a promise' );

            equal( fooRecord.id, 2, 'should have added the record to the mock ls object' );
            start();
        });
    });

    asyncTest( 'delete', function(){
        var fooContent = { id: 2, test: 'foo', 'bar': { id: 1, quiz: 'bar2' } },
            foo = Foo.create( fooContent ),
            r = localstorageadapter.save( '/foo', foo );

            r.then( function(){

                var response = localstorageadapter.deleteRecord( '/foo', 2 );

                response.then( function(){
                    ok( response.then, 'response is a promise' );

                    var fooRecords = [ JSON.parse(localStorage.getItem('sl-ember-store')).foo ],
                        fooRecord = fooRecords.findBy( 'id', 2 );

                    equal( fooRecord, undefined, 'should have deleted the record to the mock ls object' );
                    start();
                });
            });
    });

    asyncTest( 'quota test', function(){
        var fooContent = { id: 1, test: [] },
            foo,
            r;

        for( var i = 0; i < 10000000; i++){
            fooContent.test[i] = '01000001000000000100010';
        }

        //make sure we actually test the browser's localstorage
        getLocalStorageSpy.restore();

        foo = Foo.create( fooContent );

        r = localstorageadapter.save( '/foo', foo );

        r.then(
            function( result ){
                ok( false, 'Promise did not get rejected!');
                start();
            },
            function( result ){
                equal( result.textStatus, 'error', 'Promise gets rejected for exceeding quota' );
                start();
            });
    });
  });
define("dummy/tests/unit/cache-test", 
  ["ember","ember-qunit","sl-ember-store/cache"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;
    var Cache = __dependency3__["default"];

    var cache,
        fetchByIdSpy,
        fetchOneSpy,
        _getManyPromiseSpy,
        _getRecordSpy;

    module( 'Unit - sl-ember-store/cache', {
        setup: function(){
            cache = Cache.create();
            fetchByIdSpy = sinon.spy( cache, 'fetchById' );
            fetchOneSpy = sinon.spy( cache, 'fetchOne' );
            _getManyPromiseSpy = sinon.spy( cache, '_getManyPromise' );
            _getRecordSpy = sinon.spy( cache, '_getRecords' );
        },
        teardown: function(){
            fetchByIdSpy.restore();
            fetchOneSpy.restore();
            _getManyPromiseSpy.restore();
            _getRecordSpy.restore();
        }
    });

    test( 'isCached, id', function(){
        cache.isCached( 'test', 1 );
        ok( fetchByIdSpy.calledOnce, 'fetch by id called once' );
        equal( fetchByIdSpy.args[0][1], 1, 'fetch by the right id' );
    });
    test( 'isCached, one', function(){
        cache.isCached( 'test', null, true );
        ok( fetchOneSpy.calledOnce, 'fetch one called once' );
        equal( fetchOneSpy.args[0][0], 'test', 'fetch one called with correct type' );
    });
    test( 'isCached, all', function(){
        cache.isCached( 'test' );
        ok( _getManyPromiseSpy.calledOnce, 'get all called once');
        equal( _getManyPromiseSpy.args[0][0], 'test', 'get all called with correct type' );
        ok( _getRecordSpy.calledOnce, 'get all called once');
        equal( _getRecordSpy.args[0][0], 'test', 'get all called with correct type' );
    });

    test( 'clearCache', function(){
        sinon.spy( cache, '_initializeRecords' );
        sinon.spy( cache, '_initializePromises' );
        cache.clearCache( 'test' );
        ok( cache._initializeRecords.calledOnce, 'initialize records called once');
        ok( cache._initializeRecords.calledWith( 'test' ), 'initialize records called with correct arg' );
        ok( cache._initializePromises.calledOnce, 'initialize promises called once');
        ok( cache._initializePromises.calledWith( 'test' ), 'initialize records called with correct arg' );
    });

    test( 'removeRecord', function(){
        cache.removeRecord( 'test', Ember.Object.create() );
        ok( cache._getRecords.calledOnce, '_getRecords called once' );
        ok( cache._getRecords.calledWith( 'test' ), '_getRecords called with correct arg');
    });

    test( 'removeRecords', function(){
        sinon.spy( cache, 'removeRecord' );
        cache.removeRecords( 'test', [ Ember.Object.create() ] );
        ok( cache.removeRecord.calledOnce, 'removeRecord called once' );
        ok( cache.removeRecord.calledWith( 'test' ), 'removeRecord called with correct arg' );
    });

    test( 'addToCache, single promise', function(){
        var result =  new Ember.RSVP.Promise(function( resolve ){ resolve( Ember.Object.create() ); });
        sinon.spy( cache, 'addPromise');
        cache.addToCache( 'test', 1, false, result );
        ok( cache.addPromise.calledOnce, 'addPromise called once' );
        ok( cache.addPromise.calledWith( 'test' ), 'addPromise called with correct args' );
    });

    test( 'addToCache, all promise', function(){
        var result =  new Ember.RSVP.Promise(function( resolve ){ resolve( [ Ember.Object.create() ] ); });
        sinon.spy( cache, 'addManyPromise');
        cache.addToCache( 'test', false, false, result );
        ok( cache.addManyPromise.calledOnce, 'addManyPromise called once' );
        ok( cache.addManyPromise.calledWith( 'test' ), 'addManyPromise called with correct args' );
    });

    test( 'addToCache, record', function(){
        sinon.spy( cache, 'addRecord');
        cache.addToCache( 'test', 1, false, Ember.Object.create() );
        ok( cache.addRecord.calledOnce, 'addRecord called once' );
        ok( cache.addRecord.calledWith( 'test' ), 'addRecord called with correct args' );
    });

    asyncTest( 'addPromise, resolve', function(){
        var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
            testPromise = new Ember.RSVP.Promise( function( resolve ){
               setTimeout( resolve( testRecord ), 1000);
            }),
            rPromise;

        sinon.spy( cache, '_getPromises' );

        rPromise = cache.addPromise( 'test', 1, testPromise );
        ok( cache._getPromises.calledOnce, '_getPromises called once' );
        equal( cache.get( '_promises.test.ids.1' ), testPromise, 'promise got added to promise cache' );

        //test that promise gets removed from promise hash on resolution
        rPromise.finally( function(){
            equal( cache.get( '_promises.test.ids.1' ), undefined, 'promise was removed from cache' );
            ok( cache._getRecords.calledOnce, '_getRecords called once' );
            equal( cache.get( '_records.test.ids.1' ), testRecord, 'record was added to record cache' );
            start();
        });

    });
    asyncTest( 'addPromise, reject', function(){
        var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
            testPromise = new Ember.RSVP.Promise( function( resolve, reject ){
               setTimeout( reject( testRecord ), 1000);
            }),
            rPromise;

        sinon.spy( cache, '_getPromises' );

        rPromise = cache.addPromise( 'test', 1, testPromise );
        ok( cache._getPromises.calledOnce, '_getPromises called once' );
        equal( cache.get( '_promises.test.ids.1' ), testPromise, 'promise got added to promise cache' );

        //test that promise gets removed from promise hash on resolution
        rPromise.finally( function(){
            equal( cache.get( '_promises.test.ids.1' ), undefined, 'promise was removed from cache' );
            ok( !cache._getRecords.called, '_getRecords not called' );
            equal( cache.get( '_records.test.ids.1' ), undefined, 'record was not added to record cache' );
            start();
        });

    });


    asyncTest( 'addManyPromise, resolve', function(){
        var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
            testPromise = new Ember.RSVP.Promise( function( resolve ){
               setTimeout( resolve( [ testRecord ]  ), 100);
            }),
            rPromise;

        sinon.spy( cache, '_getPromises' );
        sinon.spy( cache, 'addRecords' );

        rPromise = cache.addManyPromise( 'test', testPromise );
        ok( cache._getPromises.called >= 1, '_getPromises called at least once' );
        equal( cache.get( '_promises.test.many.firstObject' ), testPromise, 'promise was added to promise cache' );
        rPromise.then( function(){
            equal( cache.get( '_promises.test.many.length' ), 0, 'promise was removed from promise cache' );
            ok( cache.addRecords.calledOnce, 'addrecords called once' );
            equal( cache.get( '_records.test.ids.1'), testRecord, 'record was added to record cache' );
            start();
        });
    });

    asyncTest( 'addManyPromise, reject', function(){
        var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
            testPromise = new Ember.RSVP.Promise( function( resolve, reject ){
               setTimeout( reject( [ testRecord ]  ), 100);
            }),
            rPromise;

        sinon.spy( cache, '_getPromises' );
        sinon.spy( cache, 'addRecords' );

        rPromise = cache.addManyPromise( 'test', testPromise );
        ok( cache._getPromises.called >= 1, '_getPromises called at least once' );
        equal( cache.get( '_promises.test.many.firstObject' ), testPromise, 'promise was added to promise cache' );
        rPromise.finally( function(){
            equal( cache.get( '_promises.test.many.length' ), 0, 'promise was removed from promise cache' );
            ok( !cache.addRecords.calledOnce, 'addrecords not called once' );
            equal( cache.get( '_records.test.ids.1'), undefined, 'record was added to record cache' );
            start();
        });
    });

    test( 'addRecord', function(){
        var testRecord =  Ember.Object.create({ id: 1, test: 'test' });
        var testRecord2 =  Ember.Object.create({ id: 1, test: 'test2' });

        sinon.spy( cache, 'removeRecord' );

        cache.addRecord( 'test', testRecord );

        equal( cache.get( '_records.test.ids.1' ), testRecord, 'testRecord added to record cache' );

        ok( ! cache.removeRecord.called, 'removeRecord was not called on initial add');

        cache.addRecord( 'test', testRecord2 );

        ok( cache.removeRecord.called, 'removeRecord was called on 2nd add');

        equal( cache.get( '_records.test.ids.1' ), testRecord2, 'testRecord2 replaced old record in cache' );
    });

    test( 'addRecords', function(){
        var testRecord =  Ember.Object.create({ id: 1, test: 'test' });
        var testRecord2 =  Ember.Object.create({ id: 2, test: 'test2' });

        sinon.spy( cache, 'addRecord' );

        cache.addRecords( 'test', [ testRecord, testRecord2 ] );

        equal( cache.addRecord.callCount, 2, 'addRecord called for each record' );

    });

    test( 'fetch, id', function(){
        cache.fetch( 'test', 1 );
        ok( fetchByIdSpy.calledOnce, 'fetch by id called once' );
        equal( fetchByIdSpy.args[0][1], 1, 'fetch by the right id' );
    });
    test( 'fetch, one', function(){
        cache.fetch( 'test', null, true );
        ok( fetchOneSpy.calledOnce, 'fetch one called once' );
        equal( fetchOneSpy.args[0][0], 'test', 'fetch one called with correct type' );
    });
    test( 'fetch, all', function(){
        cache.fetch( 'test' );
        ok( _getManyPromiseSpy.calledOnce, 'get all called once');
        equal( _getManyPromiseSpy.args[0][0], 'test', 'get all called with correct type' );
        ok( _getRecordSpy.calledOnce, 'get all called once');
        equal( _getRecordSpy.args[0][0], 'test', 'get all called with correct type' );
    });


    asyncTest( 'fetchOne - promise', function(){
        var testRecord = Ember.Object.create({ id: 1});

        cache.addPromise( 'test', 1, Ember.RSVP.Promise.resolve( testRecord ) )
        .then( function(){

            sinon.spy( cache, '_getPromises' );

            var response = cache.fetchOne( 'test' );

            ok( cache._getPromises.calledOnce, 'getPromise called once' );

            response.then( function(){
                equal( response.get('content'), testRecord, 'fetchOne returned correct record' );

                start();
            });
        });

    });

    asyncTest( 'fetchOne - record', function(){
        var testRecord = Ember.Object.create({ id: 1});

        cache.addRecord( 'test', testRecord );

        var response = cache.fetchOne( 'test' );

        ok( cache._getRecords.called, 'getRecords called once' );

        response.then( function(){
            equal( response.get('content'), testRecord, 'fetchOne returned the correct record' );
            start();
        });
    });


    asyncTest( 'fetchById - promise', function(){
        var testRecord = Ember.Object.create({ id: 1});

        cache.addPromise( 'test', 1, Ember.RSVP.Promise.resolve( testRecord ) )
        .then( function(){

            sinon.spy( cache, '_getPromiseById' );

            var response = cache.fetchById( 'test', 1 );

            ok( cache._getPromiseById.calledOnce, 'getPromiseById called once' );

            response.then( function(){
                equal( response.get('content'), testRecord, 'fetchById returned correct record' );

                start();
            });
        });

    });

    asyncTest( 'fetchById - record', function(){
        var testRecord = Ember.Object.create({ id: 1});

        cache.addRecord( 'test', testRecord );

        sinon.spy( cache, '_getRecordById' );

        var response = cache.fetchById( 'test', 1 );

        ok( cache._getRecordById.calledOnce, 'getRecordById called once' );

        response.then( function(){
            equal( response.get('content'), testRecord, 'fetchById returned correct record' );

            start();
        });

    });

    test( 'fetchMany - promise', function(){

        var testRecord = Ember.Object.create({ id: 1});
        var testPromise =  Ember.RSVP.Promise.resolve( [ testRecord] );

        cache.addManyPromise( 'test', testPromise);
        var response = cache.fetchMany( 'test' );
        ok( cache._getManyPromise.calledOnce, 'calls _getManyPromise once' );
        ok( response, testPromise, 'returns the test promise' );
    });

    asyncTest( 'fetchMany - record', function(){

        var testRecord = Ember.Object.create({ id: 1});
        cache.addRecords( 'test', [ testRecord ] );
        var response = cache.fetchMany( 'test' );
        ok( cache._getRecords.called, 'calls _getManyRecordsCached once' );
        response.then( function(){
            equal( response.get( 'content.0' ), testRecord, 'returns the test record in an array' );
            start();
        });

    });

    test( '_setupCache', function(){
        cache._setupCache();
        equal( Object.keys( cache._records ).length, 0, 'records object is empty' );
        equal( Object.keys( cache._promises ).length, 0, 'promises object is empty' );
    });

    test( '_initializeRecords', function(){
        cache._initializeRecords( 'test' );
        equal( cache._records.test.records.length, 0, 'sets up `test` records array' );
        ok( cache._records.test.ids instanceof Ember.Object, 'sets up `test` records object' );
    });

    test( '_getRecords, none', function(){
        var response = cache._getRecords( 'test' );
        equal( response.records.length, 0, 'returns 0 records');
    });

    test( '_getRecords, some', function(){
        cache.addRecord( 'test', Ember.Object.create({id:1}));
        var response = cache._getRecords( 'test' );
        equal( response.records[0].id, 1, 'returns an array with the test record' );
    });

    test( '_getRecordById, not found', function(){
        var response = cache._getRecordById( 'test', 12 );
        equal( response, undefined, 'record should not be found');
    });

    test( '_getRecordById, found', function(){
        var testRecord = Ember.Object.create({id:1});
        cache.addRecord( 'test', testRecord);
        var response = cache._getRecordById( 'test', 1 );
        equal( response, testRecord, 'returns the correct record' );
    });

    test( '_getRecords, empty', function(){
        var response = cache._getRecords( 'test' ).records;
        equal( response.length, 0,  'returns an empty array' );
    });

    test( '_getRecords, some', function(){
        var testRecord = Ember.Object.create({id:1});
        cache.addRecord( 'test', testRecord);
        var response = cache._getRecords( 'test' ).records;
        equal( response[0], testRecord, 'returns the test record in an array' );
    });

    test( '_initializePromises', function(){
        cache._initializePromises( 'test' );
        equal( cache._promises.test.many.firstObject, null, 'test all promise is null ');
        equal( Object.keys(cache._promises.test.ids).length, 0, 'test promise object is empty' );
    });

    test( '_getPromises, empty', function(){
        sinon.spy( cache, '_initializePromises' );
        var response = cache._getPromises('test');
        ok( cache._initializePromises.calledOnce, 'calls initializePromises' );

    });

    test( '_getPromises, some', function(){
        var testPromise = Ember.RSVP.Promise.resolve( Ember.Object.create({id:1}) );
        cache.addPromise( 'test', 1, testPromise );
        var response = cache._getPromises( 'test' );
        equal( response.ids[1], testPromise, 'has testpromise set' );
    });

    test( '_getPromiseById, none', function(){
        var response = cache._getPromiseById( 'test', 1 );
        equal( response, undefined, 'no promise should be found' );
    });
    test( '_getPromiseById, some', function(){
        var testPromise = Ember.RSVP.Promise.resolve( Ember.Object.create({id:1}));
        cache.addPromise( 'test', 1, testPromise );
        var response = cache._getPromiseById( 'test', 1 );
        equal( response, testPromise, 'promise should be found' );
    });

    test( '_getManyPromise, none', function(){
        var response = cache._getManyPromise( 'test' );
        equal( response, undefined, 'response should be undefined' );
    });
    asyncTest( '_getManyPromise, some', function(){
        var testRecord = Ember.Object.create({id:1}),
            testPromise = Ember.RSVP.Promise.resolve( [ testRecord ] );

        cache.addManyPromise( 'test', testPromise );

        var response = cache._getManyPromise( 'test' );

        response.then( function( records ){
            equal( testRecord, records[0], 'should return promise' );
            start();
        });
    });

    asyncTest( '_getManyPromise, more', function(){
        var testRecord = Ember.Object.create({id:1}),
            testRecord2 = Ember.Object.create({id:2}),
            testPromise = Ember.RSVP.Promise.resolve( [ testRecord ] ),
            testPromise2 = Ember.RSVP.Promise.resolve( [ testRecord2 ] );

        cache.addManyPromise( 'test', testPromise );
        cache.addManyPromise( 'test', testPromise2 );

        var response = cache._getManyPromise( 'test' );

        response.then( function( records ){
            equal( testRecord, records[0], 'first record should be testRecord' );
            equal( testRecord2, records[1], 'first record should be testRecord' );
            start();
        });
    });
  });
define("dummy/tests/unit/initializers/sl-ember-model-test", 
  ["ember","ember-qunit","dummy/tests/helpers/start-app","sl-ember-store/store","sl-ember-store/adapters/ajax","sl-ember-store/adapters/localstorage"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleForComponent = __dependency2__.moduleForComponent;
    var startApp = __dependency3__["default"];
    var Store = __dependency4__["default"];
    var AjaxAdapter = __dependency5__["default"];
    var LocalstorageAdapter = __dependency6__["default"];

    var App,
        container;

    module( 'Unit - initializer: sl-ember-store', {
        setup: function() {
            App = startApp();
            container = App.__container__;
        },

        teardown: function() {
            Ember.run( App, App.destroy );
        }
    });

    test( 'LocalStorage adapter gets namespace set', function(){
        var lsAdapter = container.lookupFactory( 'adapter:localstorage' );
        equal( lsAdapter.namespace, container.lookup( 'application:main' ).get( 'modulePrefix' ) );
    });

    test( 'store:main gets registered', function(){
        var store = container.lookupFactory( 'store:main' );
        ok( Store.detect( store ) );
    });

    test( 'adapter:ajax gets registered', function(){
        var ajaxAdapter = container.lookupFactory( 'adapter:ajax' );
        ok( AjaxAdapter.detect( ajaxAdapter ) );
    });

    test( 'adapter:localstorage gets registered', function(){
        var lsAdapter = container.lookupFactory( 'adapter:localstorage' );
        ok( LocalstorageAdapter.detect( lsAdapter ) );
    });

    test( 'store gets injected into controllers, routes, adapters', function(){
        var appRoute = container.lookup( 'route:demos/single-model' ),
            appController,
            ajaxAdapter = container.lookup( 'adapter:ajax' ),
            store = container.lookup( 'store:main' );

        expect( 3 );

        equal( appRoute.get( 'store' ), store );
        equal( ajaxAdapter.get( 'store' ), store );

        visit( '/' ).then(function() {
            appController = container.lookup( 'controller:application' );
            equal( appController.get( 'store' ), store );
        });
    });
  });
define("dummy/tests/unit/model-test", 
  ["ember","ember-qunit","dummy/models/foo","dummy/models/bar","sl-ember-store/model"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;
    var Foo = __dependency3__["default"];
    var Bar = __dependency4__["default"];
    var Model = __dependency5__["default"];

    var foo,
        bar,
        adapter,
        container,
        fooResponse   = { id: 1, test: 'true' },
        ajaxMock      = function() {
            return new Ember.RSVP.Promise( function(resolve) { resolve( fooResponse ); });
        },
        serRespons1   = { test: true },
        serResponse2  = { test: false },
        serializer1   = function( response, store ){ return response; },
        serializer2   = function( response, store ){ return response; },
        testResponse1 = { test:true },
        testResponse2 = { test: false },
        TestModel     = Model.extend({});
        TestModel.reopenClass({
            serializer: function( response, store ){
                return testResponse1;
            },
            endpoints: {
                test: {
                    get: {
                        serializer: function( response, store ){
                            return testResponse2;
                        }
                    }
                }
            }
        });

    module( 'Unit - sl-ember-store/model', {
        setup: function() {

            Foo.reopenClass({
                url       :'/foo',
                endpoints : {
                    doo: {
                        url: '/doo'
                    },
                    goo: {
                        serializer: serializer1,
                        post: {
                            url: '/goo',
                            serializer: serializer2
                        }
                    }
                }
            });

            Bar.reopenClass({
                url       : '/bar',
                endpoints : {
                    default: {
                            post: '/barUpdate',
                            delete: '/barDelete',
                            serializer: serializer1
                    },
                    car: {
                        post: {
                            url: '/carUpdate',
                            serializer: serializer2,
                        },
                        delete: '/carDelete'
                    }
                }
            });

            adapter = {
                save         : ajaxMock,
                deleteRecord : ajaxMock,
            };

            sinon.spy( adapter, 'save' );
            sinon.spy( adapter, 'deleteRecord' );

            container = {
                registry: [],
                cache: {},
                normalize: function( key ) {
                    return key;
                },
                lookup: function( key ) {
                    if ( this.cache[key] ) return this.cache[key];

                    var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                    this.cache[key] = obj;
                    return obj;
                },
                lookupFactory: function( key ){
                    var item = this.registry.findBy( 'key', key );
                    return item ? item.factory : undefined;
                }
            };

            container.cache['adapter:ajax'] = adapter;

            foo = Foo.create({
                content: {
                    test: 'foo',
                    'bar': { id: 1, quiz: 'bar' },
                },
                container: container
            });


            bar = Bar.create({
                content: {
                    test: 'bar',
                    'car': { id: 1, quiz: 'car' },
                },
                container: container
            });
        },
        teardown: function() {
            adapter.save.reset();
            adapter.deleteRecord.reset();
            foo = Foo.create({
                content: {
                    test: 'foo',
                    'bar': { id: 1, quiz: 'bar' },
                },
                container: container
            });
            bar = Bar.create({
                content: {
                    test: 'bar',
                    'car': { id: 1, quiz: 'car' },
                },
                container: container
            });
        }
    });

    test( 'getUrlForEndpointAction:should return /bar for ( null, `get` )', function() {
        equal( Bar.getUrlForEndpointAction( null, 'get' ), '/bar' );
    });

    test( 'getUrlForEndpointAction:should return /barUpdate for ( null, `post` )', function() {
        equal( Bar.getUrlForEndpointAction( null, 'post' ), '/barUpdate' );
    });

    test( 'getUrlForEndpointAction:should return /barDelete for ( null, `delete` )', function() {
        equal( Bar.getUrlForEndpointAction( null, 'delete' ), '/barDelete' );
    });

    test( 'getUrlForEndpointAction:should return /bar for ( `default`, `get` )', function() {
        equal( Bar.getUrlForEndpointAction( 'default', 'get' ), '/bar' );
    });

    test( 'getUrlForEndpointAction:should return /barUpdate for ( `default`, `post` )', function() {
        equal( Bar.getUrlForEndpointAction( 'default', 'post' ), '/barUpdate' );
    });

    test( 'getUrlForEndpointAction:should return /barDelete for ( `default`, `delete` )', function() {
        equal( Bar.getUrlForEndpointAction( 'default', 'delete' ), '/barDelete' );
    });

    test( 'getUrlForEndpointAction:should return /bar for ( `car`, `get` )', function() {
        equal( Bar.getUrlForEndpointAction( 'car', 'get' ), '/bar' );
    });

    test( 'getUrlForEndpointAction:should return /carUpdate for ( `car`, `post` )', function() {
        equal( Bar.getUrlForEndpointAction( 'car', 'post' ), '/carUpdate' );
    });

    test( 'getUrlForEndpointAction:should return /carDelete for ( `car`, `delete` )', function() {
        equal( Bar.getUrlForEndpointAction( 'car', 'delete' ), '/carDelete' );
    });

    test( 'callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `null`, `get` ) ', function() {
        var testResponse = TestModel.callSerializerForEndpointAction( null, 'get', {} );
        equal( testResponse, testResponse1 );
    });

    test( 'callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `test`, `get` ) ', function() {
        var testResponse = TestModel.callSerializerForEndpointAction( 'test', 'get', {} );
        equal( testResponse, testResponse2 );
    });

    test( 'save-default:should call adapter.save with correct arguments', function() {
        expect(2);
        foo.save().then( function() {
            equal( adapter.save.args[0][0], '/foo' );
            equal( adapter.save.args[0][1].test, 'foo' );
        });
    });

    test( 'save-default:should update its content with fooResponse', function() {
        expect(1);
        foo.save().then(function() {
            deepEqual( foo.get('content'), fooResponse );
        });
    });

    test( 'save-endpoint:should call adapter.save with correct arguments', function() {
        expect(2);
        bar.save().then( function() {
            equal( adapter.save.args[0][0], '/barUpdate' );
            equal( adapter.save.args[0][1].test, 'bar' );
        });
    });
    test( 'save-endpoint:should update its content with fooResponse', function() {
        expect(1);
        bar.save().then( function() {
            deepEqual( bar.get('content'), fooResponse );
        });
    });

    test( 'save-endpoint:car: should call adapter.save with correct arguments', function() {
        expect(2);
        bar = Bar.create({
            content: {
                test: 'bar',
                'car': { id: 1, quiz: 'car' },
            },
            container: container
        });
        bar.save({endpoint:'car'}).then( function() {
            equal( adapter.save.args[0][0], '/carUpdate' );
            equal( adapter.save.args[0][1].test, 'bar' );
        });
    });

    test( 'save-endpoint:car: should update its content with fooResponse', function() {
        bar = Bar.create({
            content: {
                test: 'bar',
                'car': { id: 1, quiz: 'car' },
            },
            container: container
        });
        bar.save({endpoint:'car'}).then( function() {
            deepEqual( bar.get('content'), fooResponse );
        });
    });

    test( 'delete: should call adapter.deleteRecord with correct arguments', function() {
        expect(1);
        foo.deleteRecord().then( function() {
            ok( adapter.deleteRecord.calledWith( '/foo' ) );
        });
    });

    test( 'delete: should destroy foo', function() {
        expect(1);
        foo.deleteRecord().then( function() {
            ok( foo.isDestroyed );
        });

    });

    test( 'delete-endpoint: should call adapter.delete with correct arguments', function() {
        expect(1);
        bar.deleteRecord().then( function() {
            ok( adapter.deleteRecord.calledWith( '/barDelete' ) );
        });
    });

    test( 'delete-endpoint: should destroy bar', function() {
        expect(1);
        bar.deleteRecord().then( function() {
            ok( bar.isDestroyed );
        });
    });

    test( 'delete-endpoint:car: should call adapter.delete with correct arguments', function() {
        expect(1);
        bar.deleteRecord({endpoint:'car'}).then( function() {
            ok( adapter.deleteRecord.calledWith( '/carDelete' ) );
        });
    });

    test( 'delete-endpoint:car: should destroy bar', function() {
        expect(1);
        bar.deleteRecord({endpoint:'car'}).then( function() {
            ok( bar.isDestroyed );
        });
    });
  });
define("dummy/tests/unit/store-test", 
  ["ember","ember-qunit","sl-ember-store/store","sl-ember-store/model"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;
    var Store = __dependency3__["default"];
    var Model = __dependency4__["default"];

    var Foo,
        Bar,
        store,
        AjaxAdapter,
        ajaxAdapter,
        LocalstorageAdapter,
        queryHook;

    module( 'Unit - sl-ember-store/store', {

        setup: function() {
            Foo = Model.extend();
            Bar = Model.extend();
            Bar.reopenClass({ adapter: 'localstorage' });

            AjaxAdapter = Ember.Object.extend({
                type: 'ajax',
                __find: function(){},
                find: function(){
                    return Ember.RSVP.resolve( [ Ember.Object.create() ] );
                }
            });

            LocalstorageAdapter = Ember.Object.extend({ type: 'localstorage' });

            store = Store.create({
                container: {
                    registry: [],
                    cache: {},
                    normalize: function( key ){
                        return key;
                    },
                    lookup: function( key ){
                        if( this.cache[key] ) return this.cache[key];

                        var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                        this.cache[key] = obj;
                        return obj;
                    },
                    lookupFactory: function( key ){
                        return this.registry.findBy( 'key', key ).factory;
                    }
                }
            });
            store.container.registry.push( { key: 'adapter:ajax', factory: AjaxAdapter } );
            store.container.registry.push( { key: 'adapter:localstorage', factory: LocalstorageAdapter } );

            store.container.registry.push( { key: 'model:foo', factory: Foo } );
            store.container.registry.push( { key: 'model:bar', factory: Bar } );

            ajaxAdapter = store.container.lookup('adapter:ajax');


            //sinon spies
            sinon.spy( store, '__find' );
            sinon.spy( store, 'modelFor' );
            sinon.spy( store, 'adapterFor' );
            sinon.spy( ajaxAdapter, 'find' );
            sinon.spy( Foo, 'create' );
            queryHook = sinon.spy();
        },
        teardown: function() {
            store.__find.restore();
            store.modelFor.restore();
            store.adapterFor.restore();
            ajaxAdapter.find.restore();
            Foo.create.restore();
            queryHook.reset();
        }
    });

    test( 'modelFor: should return the model "Foo" for type "foo" ', function() {
        ok( store.modelFor( 'foo' ) === Foo );
    });

    test( 'modelFor: should return the model "Bar" for type "bar" ', function() {
        ok( store.modelFor( 'bar' ) === Bar );
    });

    test( 'adapterFor: should return the adapter ajax for model type foo', function() {
        ok( store.adapterFor( 'foo' ) instanceof AjaxAdapter );
    });

    test( 'adapterFor: should return the adapter localstorage for model type bar', function() {
        ok( store.adapterFor( 'bar' ) instanceof LocalstorageAdapter );
    });

    test( 'findOne: should call __find with correct args', function() {
        var options = { "otherId":1 },
            args;

        store.findOne( 'foo', options );

        ok( store.__find.calledWith( 'foo', null, options, true ) );
    });

    test( 'find should call __find with numeric id', function() {
        var options = { "otherId": 1 };
        store.find( 'foo', 1, options );
        ok( store.__find.calledWith( 'foo', 1, options, false ) );
    });

    test( 'find should call __find with object for first param', function() {
        var options = { "otherId": 1 };
        store.find( 'foo', options );
        ok( store.__find.calledWith( 'foo', null, options, false ) );
    });

    test( 'find should call __find with only the type', function() {
        store.find( 'foo' );
        ok( store.__find.calledWith( 'foo', null, null, false ) );
    });

    test( '__find should have called modelFor', function() {
        store.__find( 'foo', 1, {}, false );
        ok( store.modelFor.calledWith( 'foo' ) );
    });

    test( '__find should have called adapterFor', function() {
        store.__find( 'foo', 1, {}, false );
        ok( store.adapterFor.calledWith( 'foo' ) );
    });

    test( '__find should have called AjaxAdapter.find', function() {
        store.__find( 'foo', 1, {}, false );
        ok( ajaxAdapter.find.calledWith( 'foo', 1, {}, false ) );
    });

    test( 'createRecord should have called modelFor', function() {
        store.createRecord( 'foo' );
        ok( store.modelFor.calledWith( 'foo' ) );
    });

    test( 'createRecord should have called Foo.create once', function() {
        store.createRecord( 'foo' );
        ok( Foo.create.calledOnce );
    });

    test( 'createRecord should have called Foo.create with an object container', function() {
        store.createRecord( 'foo' );
        ok( Foo.create.calledWith( { container: store.container } ) );
    });

    test( 'registerPreQueryHook should add an entry to preQueryHooks', function() {
        store.registerPreQueryHook( queryHook );
        ok( store.get( 'preQueryHooks' ).length === 1 );
    });

    test( 'runPreQueryHooks should run query hook once', function() {
        store.registerPostQueryHook( queryHook );
        store.runPostQueryHooks();
        ok( queryHook.calledOnce );
    });
  });
/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dummy/tests/test-helper");
} else {
  require("dummy/app")["default"].create({});
}

/* jshint ignore:end */
//# sourceMappingURL=dummy.map