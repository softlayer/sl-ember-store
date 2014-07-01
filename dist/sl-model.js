define("sl-model/adapter",
  ["sl-modelize","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ModelizeMixin = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Object.extend( ModelizeMixin, {
        init: function(){
            this.cache = {};
            this.requestCache = {};
        },

        /**
         * Cached results
         *
         * @protected
         * @property {object} cache
         */
        cache: null,

        /**
         * Cache in flight GET requests by URL
         *
         * Destroy cache upon receipt of response
         * @protected
         * @property {object} requestCache
         */
        requestCache: null,

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
         * Add request to requestCache
         *
         * @protected
         * @method addToCache
         * @param {string} API url being requested
         * @param {array}  API url parameters
         * @param {object} Promise to cache
         * @return void
         */
        addToRequestCache: function( url, parameters, promise ) {
            this.requestCache[ this.generateCacheKey( url, parameters ) ] = promise;
        },

        /**
         * Remove request from requestCache
         *
         * @protected
         * @method removeFromCache
         * @param {string} API url being requested
         * @param {array}  API url parameters
         * @return void
         */
        removeFromRequestCache: function( url, parameters ) {
            delete( this.requestCache[ this.generateCacheKey( url, parameters ) ] );
        },

        /**
         * Clear all requestCache values
         *
         * @public
         * @method clearRequestCache
         * @return void
         */
        clearRequestCache: function() {
            this.requestCache = {};
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
         * Run pre-query hooks
         *
         */

        runPreQueryHooks: function( query ){
            this.get( 'container' ).lookup( 'store:main' ).runPreQueryHooks( query );
        },

        /**
         * Run after-query hooks
         *
         */

        runPostQueryHooks: function( response ){
            this.get( 'container' ).lookup( 'store:main' ).runPostQueryHooks( response );
        },

        /**
         * place holder, to be overridden by subclass
         */
        find: function(){
            Ember.assert( 'Your model should overwrite adapterType', true);
        }
    });
  });
define("sl-model/adapters/ajax",
  ["../adapter","ic-ajax","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Adapter = __dependency1__["default"] || __dependency1__;
    var icAjax = __dependency2__;

    __exports__["default"] = Adapter.extend({


        /**
         * find
         * @param  {int}    id      record id
         * @param  {object} options hash of options
         * @param  {bool} findOne force return of single recrord
         * @return { ObjectProxy | ArrayProxy } The record or array of records requested
         */
        find: function ( model, id, options, findOne ){

            var url,
                cacheKey,
                cachedModel,
                results,
                cachedRequest,
                promise,
                initialObj = {},
                queryObj;

            options = options || {};

            url = model.getUrlForEndpointAction( options.endpoint, 'get' );

            Ember.assert('A url is required to find a model', url);

            if ( 'object' === typeof id  && null !== id ) {
                //assume a valid options.data object was passed in as second arg
                options = id;
                initialObj.id = id;
            } else if ( ! Ember.isNone( id ) ) {
                options.data    = options.data || {};
                options.data.id = parseInt( id, 10 );
                initialObj.id = id;
            }

            // Clear previously-cached data
            if ( options.reload ) {
                this.removeFromCache( url, options.data );
            }


            //set up the results, either an object or an array proxy w/ promise mixin
            results     = ( ( options.data && options.data.id  ) || findOne ) ?
                model.createWithMixins( Ember.PromiseProxyMixin, initialObj ) :
                Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin );

            //get cached model, if any
            cacheKey = this.generateCacheKey( url, options.data );
            cachedModel = this.cache[cacheKey];

            //return the cachedModel if possible
            if ( !options.reload && cachedModel ) {

                results.set( 'promise', new Promise( function( resolve ){
                        resolve( cachedModel );
                    })
                );

                return results;
            }

            //check to see if there is an outstanding cachedRequest
            cachedRequest = this.requestCache[cacheKey];

            // Responding with in flight promise if possible
            if ( cachedRequest ) {
                results.set( 'promise', cachedRequest );
                return results;
            }

            queryObj = {
                dataType : 'json',
                url      : url,
                data     : options.data,
                context  : this
            };

            this.runPreQueryHooks( queryObj );

            promise = icAjax.request( queryObj )

            .then( function ajaxAdapterFindTransformResponse( response ){

                var serializer = model.getSerializerForEndpointAction( options.endpoint, 'get' );

                return serializer( response, this.container.lookup( 'store:main' ) );

            }.bind( this ) )

            .then( function ajaxAdapterFindResponse ( response ) {
                var tmpResult;

                //run the modelize mixin to map keys to models
                response = this.modelize( response );

                if ( results instanceof Ember.ArrayProxy ) {
                    tmpResult = Ember.A([]);
                    Ember.makeArray( response ).forEach( function ( child ) {
                        tmpResult.pushObject( model.create( child ) );
                    }, this );
                }else{
                    tmpResult = response;
                }

                // Cache the results
                this.addToCache( url, options.data, tmpResult );

                return tmpResult;

            }.bind( this ) , null, 'sl-model.ajaxAdapter:find - then' )

            .catch( function ajaxAdapterFindCatch( response ) {
                var errorData = {
                    'statusCode' : response.status,
                    'statusText' : response.statusText,
                    'message'    : response.responseJSON && response.responseJSON.error || "Service Unavailable"
                };

                return errorData;

            }.bind( this ), 'sl-model.ajaxAdapter:find - catch' )

            .finally( function ajaxAdapaterFindFinally( response ) {
                // Clearing request cache since it is no longer in flight
                this.removeFromRequestCache( url, options.data );

                //run post query hooks
                this.runPostQueryHooks( response );

            }.bind( this ), 'sl-model.ajaxAdapter:find - finally');

            //set the promise on the promiseProxy
            results.set( 'promise', promise );

            // Cache request object.  Other GET requests for the same URL will receive this
            // response promise while the request remains in flight.  This will prevent us
            // from having multiple simultaneous requests for the same endpoint in flight
            // at the same time
            this.addToRequestCache( url, options.data, promise );

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
        delete: function( url, context ) {

            Ember.assert('A url is required to destroy a model', url);

            return icAjax.request({
                url  : url,
                type : 'DELETE',
                data : JSON.stringify({ id: context.get( 'id' ) }),
                context: this
            })
            .finally( function ajaxAdapterDeleteFinally( response ) {
                this.runPostQueryHooks( response );
            }.bind( this ) , 'sl-model.ajaxAdapter:delete - always ');
        },

        /**
         * Save record
         *
         * @public
         * @method save
         * @param url
         * @param context
         * @publishes saving-/api/orders-success
         * @publishes saving-/api/orders-error
         * @return void
         */
         save: function( url, content ) {
            var promise,
                result;

            Ember.assert('A url property is required to save a model', url);

            promise = icAjax.request({
                url  : url,
                type : 'POST',
                data : JSON.stringify( content ),
                context : this
            })

            .then( function ajaxAdapterSaveResponse( response ) {
                //run the modelize mixin to map keys to models
                return this.modelize( response );

            }.bind( this ), null, 'sl-model:save - then' )

            .catch( function ajaxAdapterSaveCatch( jqxhr, textStatus, error ) {
                var errorData = {
                    'statusCode' : jqxhr.status,
                    'statusText' : jqxhr.statusText,
                    'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable",
                    'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || "Service Unavailable"
                };

                return errorData;

            }.bind( this ), 'sl-model:save - catch' )

            .finally( function ajaxAdapterSaveFinally( response ) {
                this.runPostQueryHooks( response );

            }.bind( this ), 'sl-model.ajaxAdapter:save - finally' );


            return promise;

         }
    });
  });
define("sl-model/adapters/localstorage",
  ["../adapter","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Adapter = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Adapter.extend({

    });
  });
define("sl-model/initializers/main",
  ["../store","../adapter","../adapters/ajax","../adapters/localstorage","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Store = __dependency1__["default"] || __dependency1__;
    var Adapter = __dependency2__["default"] || __dependency2__;
    var AjaxAdapter = __dependency3__["default"] || __dependency3__;
    var LocalAdapter = __dependency4__["default"] || __dependency4__;

    __exports__["default"] = {

        name: 'sl-model',

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
define("sl-model",
  ["./model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Model;
  });
define("sl-model/model",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var get = Ember.get;

    var Model =  Ember.ObjectProxy.extend({

        url: '',

        container: null,

         /**
         * Save the contents via the configured adapter
         *
         * @public
         * @method save
         */
        save: function( options ) {
            var data,
                endpoint;

            options = options || {};

            endpoint  = this.constructor.getEndpointForAction( options.endpoint, 'post' );

            data = this.get( 'content' );

            Ember.assert( 'Endpoint must be configured on '+this.toString()+' before save.', endpoint );


            return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( endpoint, data )
                .then( function( response ){
                    this.set( 'content', response );
                }.bind( this ), null, 'sl-model.model:save');
        },

        /**
         * Delete the record via the configured adapter
         *
         * @public
         * @method destroy
         * @param {integer} Record Id
         * @return {object} jqXHR from jQuery.ajax()
         */
        delete: function( options ) {
            var data,
                endpoint;

            options = options || {};

            data = this.get( 'content' ) || this;

            endpoint  = this.constructor.getEndpointForAction( options.endpoint, 'delete' );

            Ember.assert( 'Enpoint must be configure on '+this.toString()+' before delete.', endpoint );

            return this.container.lookup( 'adapter:'+this.constructor.adapter ).delete( endpoint, data )
                .then( function( response ){
                    this.destroy();
                }.bind( this ), null, 'sl-model.model:delete' );
        }
    });

    Model.reopenClass({

        //set default adapter
        adapter: "ajax",

        getUrlForEndpointAction: function( endpoint, action ) {
            var resolvedEndpoint,
                testEndpoint;

            endpoint = endpoint || 'default';
            testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action );

            if( testEndpoint === 'string' ){
                resolvedEndpoint = testEndpoint;
            } else {
                resolvedEndpoint = get( testEndpoint, 'url' ) || get( this, 'url' );
            }

            return resolvedEndpoint;
        },

        getSerializerForEndpointAction: function( endpoint, action ) {
            var resolvedSerializer,
                testEndpoint,
                defaultSerializer,
                passThroughSerializer = function( response ){ return response; };

            endpoint = endpoint || 'default';
            testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action );
            defaultSerializer = get( this, 'endpoints.default.'+action+'.serializer' );

            if( testEndpoint === 'string' ){
                resolvedSerializer = defaultSerializer || passThroughSerializer;
            } else {
                resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer || passThroughSerializer;
            }

            return resolvedSerializer;
        }

    });

    __exports__["default"] = Model;
  });
define("sl-model/store",
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
     * SL-Model/Store
     *
     *
     * @class sl-model/store
     */

    __exports__["default"] = Ember.Object.extend({

        /**
         * preQueryHooks is an array of functions to be run before an adapter runs a query
         * @type {array}
         */
        preQueryHooks: Ember.A([]),

        /**
         * postQueryHooks is an array of functions to be run after an adapter runs a query
         * @type {array}
         */
        postQueryHooks: Ember.A([]),

        /**
         * modelFor returns the model class for a given model type
         * @param  {string} type - lower case name of the model class
         * @return {function} - model constructor
         */
        modelFor: function( type ){
            var normalizedKey = this.container.normalize( 'model:'+type ),
                factory = this.container.lookupFactory( normalizedKey );

            if( !factory ){
                throw new Ember.Error( "No model was found for `"+type+"`");
            }

            return factory;
        },

        /**
         * private variable that store all the metadata for all the models
         * @type {Object}
         */
        _metadataCache: {},

        /**
         * metaForType sets the metadata object for the specified model type
         * @param  {string} type the lowercase model name
         * @param  {object} metadata the metadata to save
         */
        metaForType: function( type, metadata ){
            this.set( '_metadataCache.'+type, metadata );
        },

        /**
         * metadataFor returns the metadata object for the specified model type
         * @param  {string} type lower case model name
         * @return {object}      the metadata object that was saved with metaForType
         */
        metadataFor: function( type ){
            return this.get( '_metadataCache.'+type );
        },

        /**
         * adapterFor returns the configured adapter for the specified model type
         * @param  {string} type - the lower case name of the model class
         * @return {object} the adapter singleton
         */
        adapterFor: function( type ){
            var adapterType = this.modelFor(type).adapter,
                adapter = this.container.lookup( 'adapter:'+adapterType );

            return adapter;
        },

        /**
         * findOne returns an object proxy, does not use an id to perform a lookup (use the options obj instead).
         * @param  {string} type    lower case name of the model
         * @param  {Object} options hash of options to be passed on to the adapter
         * @return {Object}         Ember.ObjectProxy
         */
        findOne: function( type, options ) {
            return this.__find( type, null, options, true );
        },

        /**
         * find a/an record(s) using an id or options
         * @param  {string} type    lower case name of the model class
         * @param  {int} id
         * @param  {object} options hash of options to be passed on to the adapter
         * @return {object / array}         an object or an array depending on whether you specified an id
         */
        find: function( type, id, options ) {
            return this.__find( type, id, options, false );
        },

        __find: function( type, id, options, findOne ) {
            var model = this.modelFor( type );
            return this.adapterFor( type ).find( model, id, options, findOne );
        },

        /**
         * create a new record, it will not have been saved via an adapter yet
         * @param  {string} type lower case name of model class
         * @return {object}      model object, instance of Ember.ObjectProxy
         */
        createRecord: function( type ){
            var factory = this.modelFor( type );
            return factory.create( {
                    container: this.container
                });
        },

        /**
         * registerPreQueryHook add a function to ther prequery hooks array
         * @param  {function} f a function
         *
         */
        registerPreQueryHook: function( f ){
            this.get( 'preQueryHooks' ).push( f );
        },

        /**
         * runPreQueryHooks
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        runPreQueryHooks: function( query ){
            var preQueryHooks = this.get( 'preQueryHooks' );
            if( Ember.isArray( preQueryHooks ) ){
                preQueryHooks.forEach( function( f ){ f( query ); } );
            }
        },

        /**
         * registerPostQueryHook add a function to the postquery array
         * @param  {function} f a function to be run after a query
         */
        registerPostQueryHook: function( f ){
            this.get( 'postQueryHooks' ).push( f );
        },

        /**
         * runPostQueryHooks call the post query hooks with the response obj
         * @param  {obj} response the response from the adapter
         */
        runPostQueryHooks: function( response ){
            var postQueryHooks = this.get( 'postQueryHooks' );
            if( Ember.isArray( postQueryHooks ) ){
                postQueryHooks.forEach( function( f ){ f( response ); } );
            }
        },
    });
  });