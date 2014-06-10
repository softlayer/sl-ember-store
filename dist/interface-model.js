define("interface-model/adapter",
  ["emberize-model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    'use strict';

    var EmberizeModel = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Object.extend({
        /**
         * Cached results
         *
         * @protected
         * @property {object} cache
         */
        cache: {},

        /**
         * Cache in flight GET requests by URL
         *
         * Destroy cache upon receipt of response
         * @protected
         * @property {object} requestCache
         */
        requestCache: {},

         /**
         * Add payload to cache
         *
         * @protected
         * @method addToCache
         * @param {string} API url being requested
         * @param {array}  API url parameters
         * @param {object} Payload to cache
         * @return void
         */
        addToCache: function( url, parameters, payload ) {
            this.cache[ this.generateCacheKey( url, parameters ) ] = payload;
        },

        /**
         * Remove payload from cache
         *
         * @protected
         * @method removeFromCache
         * @param {string} API url being requested
         * @param {array}  API url parameters
         * @return void
         */
        removeFromCache: function( url, parameters ) {
            delete( this.cache[ this.generateCacheKey( url, parameters ) ] );
        },

        /**
         * Clear all cache values
         *
         * @public
         * @method clearCache
         * @return void
         */
        clearCache: function() {
            this.cache = {};
        },

        /**
         * Generate cache key
         *
         * @protected
         * @method generateCacheKey
         * @param {string} API url being requested
         * @param {array}  API url parameters
         * @return {string}
         */
        generateCacheKey: function( url, parameters ) {
            return url + ( JSON.stringify( parameters ) || '' );
        },

        /**
         * Recursively convert objects to Ember objects
         *
         * @protected
         * @method emberizeResponse
         * @param {object}
         * @return {object}
         */
        emberizeResponse: EmberizeModel,

        /**
         * Run pre-query hooks
         *
         */

        runPreQueryHooks: function(){
            this.get( 'container' ).lookup( 'store:main' ).get( 'preQueryHooks').forEach( function( f ){ f(); } );
        },

        /**
         * Run after-query hooks
         *
         */

        runPostQueryHooks: function(){
            this.get( 'container' ).lookup( 'store:main' ).get( 'postQueryHooks').forEach( function( f ){ f(); } );
        }
    });
  });
define("interface-model/adapters/ajax",
  ["../adapter","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    "use strict";

    var Adapter = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Adapter.extend({


        /**
         * _find protected method
         * @param  {int}    id      record id
         * @param  {object} options hash of options
         * @param  {bool} findOne force return of single recrord
         * @return { ObjectProxy | ArrayProxy } The record or array of records requested
         */
        __find: function ( url, id, options, findOne ){

            Ember.assert('A url is required to find a model', url);

            options = options || {};

            if ( 'object' === typeof id  && null !== id ) {
                options = id;
            } else if ( undefined !== id ) {
                options.data    = options.data || {};
                options.data.id = parseInt( id, 10 );
            }

            // Clear previously-cached data
            if ( options.reload ) {
                this.removeFromCache( url, options.data );
            }

            // Return previously-retrieved data if exist
            var cacheKey = this.generateCacheKey( url, options.data ),
                cachedModel = this.cache[cacheKey];

            if ( !options.reload && cachedModel ) {
                Ember.run.once( this, function() {
                    cachedModel.trigger( 'isLoaded' );
                });
                return cachedModel;
            }

            var results     = ( ( options.data && options.data.id  ) || findOne ) ?
                Ember.ObjectProxy.createWithMixins( Ember.Evented, { content: null } ) :
                Ember.ArrayProxy.createWithMixins( Ember.Evented, { content: Em.A([]) } ),
                _parameters = options.data,
                topic       = Ember.String.dasherize( this.toString().replace( 'SF.', '' ) );


            var cachedRequest = this.requestCache[cacheKey];
            if ( cachedRequest ) {
                // Responding with in flight promise
                return cachedRequest;
            }

            $.ajax({
                dataType : 'json',
                url      : url,
                data     : options.data,
                context  : this

            }).done(
                function ( response ) {
                    response = this.emberizeResponse( response );
                    if ( results instanceof Ember.ArrayProxy ) {
                        Ember.makeArray( response ).forEach( function ( child ) {
                            results.pushObject( this.create( child ) );
                        }, this );

                    } else {
                        results.set( 'content', this.create( response ) );
                    }

                    // Cache the results
                    this.addToCache( url, _parameters, results );

                    SF.MessageBus.push( 'finding-' + topic + '-success', response );
                    results.set( 'isLoaded', true );
                    results.trigger( 'isLoaded' );
                }
            )

            .fail( function( jqxhr, textStatus, error ) {
                var errorData = {
                    'statusCode' : jqxhr.status,
                    'statusText' : jqxhr.statusText,
                    'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable"
                };

                results.error = errorData;
                SF.MessageBus.push( 'finding-' + topic + '-error', errorData );
                results.set( 'isError', true );
                results.trigger( 'isError', errorData );
            })

            .always( function( jqxhr ) {
                // Clearing request cache since it is no longer in flight
                delete this.requestCache[cacheKey];
                this.runPostQueryHooks( jqxhr.status );
            });

            // Preset the id, if one was used for the find, to support things like serialize on the route
            if ( options.data && options.data.id ) {
                results.set( 'id', options.data.id );
            }

            // Cache request object.  Other GET requests for the same URL will receive this
            // response promise while the request remains in flight.  This will prevent us
            // from having multiple simultaneous requests for the same endpoint in flight
            // at the same time
            this.requestCache[cacheKey] = results;
            return results;
        },

        /**
         * Delete record
         *
         * @public
         * @method destroy
         * @param {integer} Record Id
         * @return {object} jqXHR from jQuery.ajax()
         */
        destroy: function( url, context ) {

            Ember.assert('A url is required to destroy a model', url);

            return $.ajax({
                url  : url,
                type : 'DELETE',
                data : JSON.stringify({ id: context.get( 'id' ) }),
                context: this
            })
            .always( function( jqxhr ) {
                this.runPostQueryHooks( jqxhr.status );
            });
        },

        /**
         * Save record
         *
         * @public
         * @method save
         * @param {SF.Model}
         * @publishes saving-/api/orders-success
         * @publishes saving-/api/orders-error
         * @return void
         */
         save: function( url, context ) {
            Ember.assert('A url property is required to save a model', url);

            var defer  = Ember.Deferred.create(),
                action = ( context.action ) ? '-' + context.action : '',
                topic  = Ember.String.dasherize( this.toString().replace( 'SF.', '' ) ) + action;

            $.ajax({
                url  : url,
                type : 'POST',
                data : JSON.stringify( context ),
                context : this
            })
            .done( function ( response ) {
                SF.MessageBus.push( 'saving-' + topic + '-success', response );
                defer.resolve( response );
            })
            .fail( function( jqxhr, textStatus, error ) {
                var errorData = {
                    'statusCode' : jqxhr.status,
                    'statusText' : jqxhr.statusText,
                    'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable",
                    'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || "Service Unavailable"
                };

                defer.reject( errorData );
            })
            .always( function( jqxhr ) {
                this.runPostQueryHooks( jqhx.status );
            });

            return defer;
         }
    });
  });
define("interface-model/adapters/localstorage",
  ["../adapter","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    'use strict';

    var Adapter = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Adapter.extend({

    });
  });
define("interface-model/initializers/main",
  ["../store","../adapter","../adapters/ajax","../adapters/localstorage","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    'use strict';

    var Store = __dependency1__["default"] || __dependency1__;
    var Adapter = __dependency2__["default"] || __dependency2__;
    var AjaxAdapter = __dependency3__["default"] || __dependency3__;
    var LocalAdapter = __dependency4__["default"] || __dependency4__;

    __exports__["default"] = {

        name: 'interface-model',

        initialize: function ( container, application ) {

            container.register('store:main', Store );

            container.register('adapter:default', Adapter );

            container.register('adapter:ajax', AjaxAdapter );

            container.register('adapter:localstorage', LocalAdapter );

            application.inject('controller', 'store', 'store:main');

            application.inject('route', 'store', 'store:main');

        }
    };
  });
define("interface-model",
  ["./model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Model;
  });
define("interface-model/model",
  ["exports"],
  function(__exports__) {
    "use strict";
    'use strict';

    var Model =  Ember.Object.extend({
         /**
         * Proxy the current instance to the class save method
         *
         * @public
         * @method save
         */
        save: function() {
            var data;

            if ( arguments[0] ) {
                data = arguments[0];
            }

            data = data || this;

            return this.constructor.adapter.save( this.url, data );
        },

        /**
         * Delete record
         *
         * @public
         * @method destroy
         * @param {integer} Record Id
         * @return {object} jqXHR from jQuery.ajax()
         */
        destroy: function( context ) {
            return this.constructor.adapter.destroy( this.url, context );
        }
    });

    Model.reopenClass({
        //default adapter
        adapter: 'ajax',

        /**
         * Find One record without using an id
         * alias to find( null, options, true )
         *
         * @public
         * @method  findOne
         * @param {object} options hash of options for find method
         * @return {Ember.ObjectProxy}
         */
        findOne: function( options ) {
            return this.__find( null, options, true );
        },

        /**
         * Find all records for associated endpoint
         *
         * Example structure of the `options` parameter:
         *
         *   {
         *     data : {      // url parameters
         *       limit: 2
         *     },
         *     reload: true  // refresh cached data
         *   }
         *
         * @public
         * @method findAll
         * @param {integer} id
         * @param {object}  options
         * @return {Ember.ArrayProxy}
         */
        find: function( id, options ) {
            return this.__find( id, options, false );
        },

        /**
         * _find protected method
         * @param  {int}    id      record id
         * @param  {object} options hash of options
         * @param  {bool} findOne force return of single recrord
         * @return { ObjectProxy | ArrayProxy } The record or array of records requested
         */

        __find: function( id, options, findOne ) {
            return this.adapter.__find( this.url, id, options, findOne );
        },

        /**
         * Delete record
         *
         * @public
         * @method destroy
         * @param {integer} Record Id
         * @return {object} jqXHR from jQuery.ajax()
         */
        destroy: function( context ) {
            return this.adapter.destroy( this.url, context );
        }
    });

    __exports__["default"] = Model;
  });
define("interface-model/store",
  ["exports"],
  function(__exports__) {
    "use strict";
    'use strict';

    __exports__["default"] = Ember.Object.extend({

        preQueryHooks: null,

        postQueryHooks: null,

        adapterFor: function( type ){
            var adapterType = this.modelFor(type).adapter,
                adapter = this.container.lookupFactory( 'adapter:'+adapterType );

            return adapter;
        },

        modelFor: function( type ){
            var normalizedKey = this.container.normalize( 'model:'+type ),
                factory = this.container.lookupFactory( normalizedKey );

            if( !factory ){
                throw new Ember.Error( "No model was found for `"+type+"`");
            }

            return factory;
        },

        findOne: function( type, options ) {
            return this.__find( type, null, options, true );
        },

        find: function( type, id, options ) {
            return this.__find( type, id, options, false );
        },

        __find: function( type, id, options, findOne ) {
            var factory = this.modelFor( type );

            factory.reopenClass({ adapter: this.adapterFor( type ).create({container: this.container }) });

            return factory.__find( id, options, findOne );
        },

        createRecord: function( type ){
            var factory = this.modelFor( type );
            return factory.create( { container: this.container } );
        },

        registerPreQueryHook: function( f ){
            var preQueryHooks = this.get( 'preQueryHooks' );
            if( ! preQueryHooks ){
                this.set( 'preQueryHooks', [] );
                preQueryHooks = this.get( 'preQueryHooks' )
            }
            preQueryHooks.push( f );
        },

        registerPostQueryHook: function( f ){
            var postQueryHooks = this.get( 'postQueryHooks' );
            if( ! postQueryHooks ){
                this.set( 'postQueryHooks', [] );
                postQueryHooks = this.get( 'postQueryHooks' );
            }
            postQueryHooks.push( f );
        }
    });
  });