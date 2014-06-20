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

        runPreQueryHooks: function(){
            this.get( 'container' ).lookup( 'store:main' ).runPreQueryHooks();
        },

        /**
         * Run after-query hooks
         *
         */

        runPostQueryHooks: function(){
            this.get( 'container' ).lookup( 'store:main' ).runPostQueryHooks();
        },

        __find: function(){
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
         * _find protected method
         * @param  {int}    id      record id
         * @param  {object} options hash of options
         * @param  {bool} findOne force return of single recrord
         * @return { ObjectProxy | ArrayProxy } The record or array of records requested
         */
        find: function ( model, id, options, findOne ){

            var url = model.url,
                cacheKey,
                cachedModel,
                results,
                cachedRequest,
                promise,
                initialObj = {};

            Ember.assert('A url is required to find a model', url);

            options = options || {};

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
     
            promise = icAjax.request({
                dataType : 'json',
                url      : url,
                data     : options.data,
                context  : this
            }).then(
                function ajaxAdapterFindResponse ( response ) {
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
define("sl-model",
  ["./model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Model;
  });
define("sl-model/model",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Model =  Ember.ObjectProxy.extend({

        url: '',

        container: null,

         /**
         * Proxy the current instance to the class save method
         *
         * @public
         * @method save
         */
        save: function() {
            var data,
                promise;

            Ember.assert( 'Url must be set on '+this.toString()+' before save.', this.constructor.url );

            data = this.get( 'content' );

            return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( this.constructor.url, data )
                .then( function( response ){
                    this.set( 'content', response );
                }.bind( this ), null, 'sl-model.model:save');
        },

        /**
         * Delete record
         *
         * @public
         * @method destroy
         * @param {integer} Record Id
         * @return {object} jqXHR from jQuery.ajax()
         */
        delete: function() {
            var data;
            
            Ember.assert( 'Url must be set on '+this.toString()+' before delete.', this.constructor.url);
            
            data = this.get( 'content' ) || this;

            return this.container.lookup( 'adapter:'+this.constructor.adapter ).delete( this.constructor.url, data )
                .then( function( response ){
                    this.destroy();
                }.bind( this ), null, 'sl-model.model:delet' );
        }
    });

    Model.reopenClass({
        adapter: "ajax"
    });

    __exports__["default"] = Model;
  });
define("sl-model/store",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Object.extend({

        preQueryHooks: Ember.A([]),

        postQueryHooks: Ember.A([]),

        modelFor: function( type ){
            var normalizedKey = this.container.normalize( 'model:'+type ),
                factory = this.container.lookupFactory( normalizedKey );

            if( !factory ){
                throw new Ember.Error( "No model was found for `"+type+"`");
            }

            return factory;
        },

        adapterFor: function( type ){
            var adapterType = this.modelFor(type).adapter,
                adapter = this.container.lookup( 'adapter:'+adapterType );

            return adapter;
        },

        findOne: function( type, options ) {
            return this.__find( type, null, options, true );
        },

        find: function( type, id, options ) {
            return this.__find( type, id, options, false );
        },

        __find: function( type, id, options, findOne ) {
            var model = this.modelFor( type );
            return this.adapterFor( type ).find( model, id, options, findOne );
        },

        createRecord: function( type ){
            var factory = this.modelFor( type );
            return factory.create( { 
                    container: this.container 
                }); 
        },

        registerPreQueryHook: function( f ){
            this.get( 'preQueryHooks' ).push( f );
        },

        runPreQueryHooks: function(){
            var preQueryHooks = this.get( 'preQueryHooks' );
            if( Ember.isArray( preQueryHooks ) ){
                preQueryHooks.forEach( function( f ){ f(); } );
            }
        },

        registerPostQueryHook: function( f ){
            this.get( 'postQueryHooks' ).push( f );
        },

        runPostQueryHooks: function(){
            var postQueryHooks = this.get( 'postQueryHooks' );
            if( Ember.isArray( postQueryHooks ) ){
                postQueryHooks.forEach( function( f ){ f(); } );
            }
        },
    });
  });