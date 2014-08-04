define("sl-model/adapter",
  ["sl-modelize","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ModelizeMixin = __dependency1__["default"] || __dependency1__;

    /**
     * SL-Model/adapter
     *
     *
     * @class adapter
     */
    __exports__["default"] = Ember.Object.extend( ModelizeMixin, {

        /**
         * Run Pre Query Hooks
         * @public
         * @method runPreQueryHooks
         * @param  {object} query an object containing data about the query to be run
         */
        runPreQueryHooks: function( query ){
            this.get( 'container' ).lookup( 'store:main' ).runPreQueryHooks( query );
        },

        /**
         * Run Post Query Hooks
         * @public
         * @method runPostQueryHooks
         * @param  {object} response an object containing the reponse data
         */
        runPostQueryHooks: function( response ){
            this.get( 'container' ).lookup( 'store:main' ).runPostQueryHooks( response );
        },

        /**
         * find place holder function - to be overwritten by child classes
         * @public
         * @method  find
         */
        find: function(){
            Ember.assert( 'Your model should overwrite adapterType', true);
        }
    });
  });
define("sl-model/adapters/ajax",
  ["ember","../adapter","ic-ajax","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var Adapter = __dependency2__["default"] || __dependency2__;
    var icAjax = __dependency3__;

    /**
     * SL-Model/adapters/ajax
     *
     *
     * @class adapters_ajax
     */
    __exports__["default"] = Adapter.extend({


        /**
         * find
         * @public
         * @method find
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

            if ( ! Ember.isNone( id ) ) {
                options.data    = options.data || {};
                options.data.id = parseInt( id, 10 );
            }

            //set up the results, either an object or an array proxy w/ promise mixin
            results     = ( ( options.data && options.data.id  ) || findOne ) ?
                Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin ) :
                Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin );

            queryObj = {
                dataType : 'json',
                url      : url,
                data     : options.data,
                context  : this
            };

            this.runPreQueryHooks( queryObj );

            promise = icAjax.request( queryObj )

            .then( function ajaxAdapterFindTransformResponse( response ){

                var tmpResult;

                //since serializer will probably be overwritten by a child class,
                //need to make sure it is called in the proper context so _super functionality will work
                response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, this.container.lookup( 'store:main' ) );

                //run the modelize mixin to map keys to models
                response = this.modelize( response );

                if ( results instanceof Ember.ArrayProxy ) {
                    //reject if the response if empty
                    if( ! response.length ){
                        throw { message: 'No objects found' };
                    }

                    tmpResult = Ember.A([]);
                    Ember.makeArray( response ).forEach( function ( child ) {
                        tmpResult.pushObject( model.createRecord( child ) );
                    }, this );

                }else{
                    tmpResult = model.createRecord( response );
                }

                return tmpResult;

            }.bind( this ) , null, 'sl-model.ajaxAdapter:find - then' )

            .catch( function ajaxAdapterFindCatch( response ) {
                var errorData = {
                    'statusCode' : response.status,
                    'statusText' : response.statusText,
                    'message'    : response.responseJSON && response.responseJSON.error || "Service Unavailable"
                };

                throw errorData;

            }.bind( this ), 'sl-model.ajaxAdapter:find - catch' )

            .finally( function ajaxAdapaterFindFinally( response ) {

                //run post query hooks
                this.runPostQueryHooks( response );

            }.bind( this ), 'sl-model.ajaxAdapter:find - finally');

            //set the promise on the promiseProxy
            results.set( 'promise', promise );

            return results;
        },

        /**
         * Delete record
         *
         * @public
         * @method deleteRecord
         * @param {string} url  the url to send the DELETE command to
         * @param {integer} id
         * @return {object} Promise
         */
        deleteRecord: function( url, id ) {

            Ember.assert('A url is required to delete a model', url);

            return icAjax.request({
                url  : url,
                type : 'DELETE',
                data : JSON.stringify({ id: id }),
                context: this
            })
            .finally( function ajaxAdapterDeleteFinally( response ) {
                this.runPostQueryHooks( response );
            }.bind( this ) , 'sl-model.ajaxAdapter:deleteRecord - always ');
        },

        /**
         * Save record
         *
         * @public
         * @method save
         * @param url
         * @param context
         * @return {object} Promise
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
  ["ember","../adapter","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var Adapter = __dependency2__["default"] || __dependency2__;

    /**
     * SL-Model/adapters/localstorage
     *
     *
     * @class adapters_localstorage
     */
    var LocalStorageAdapter = Adapter.extend({
        /**
         * find
         * @public
         * @method find
         * @param  {int}    id      record id
         * @param  {object} options hash of options
         * @param  {bool} findOne force return of single recrord
         * @return { ObjectProxy | ArrayProxy } The record or array of records requested
         */
        find: function ( model, id, options, findOne ){
            var url,            
                results,
                promise,
                queryObj;

            options = options || {};

            url = model.getUrlForEndpointAction( options.endpoint, 'get' );

            Ember.assert('A url is required to find a model', url);

            if ( ! Ember.isNone( id ) ) {
                options.data    = options.data || {};
                options.data.id = parseInt( id, 10 );
            }

            //set up the results, either an object or an array proxy w/ promise mixin
            results     = ( ( options.data && options.data.id  ) || findOne ) ?
                Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin ) :
                Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin );

            queryObj = {
                id: id
            };

            this.runPreQueryHooks( queryObj );

            promise = new Ember.RSVP.Promise( function( resolve, reject){
                //todo actual localStorage query
                var db,
                    modelKey,
                    records,
                    response,
                    finalResult;

                db = this._getDb();

                records = this._getRecords( db, url );

                if( options.data && options.data.id ){
                    response = records.findBy( 'id', options.data.id );
                }
                else if( findOne ){
                    //we aren't doing queries based on options at this time,
                    //can add here in the future if needed.
                    response = records[0];
                }
                else {
                    response = records;
                    if( ! response.length ){
                        reject();
                    }
                }

                if( ! response ){
                    reject();
                }

                response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, this.container.lookup( 'store:main' ) );

                response = this.modelize( response );

                if ( results instanceof Ember.ArrayProxy ) {
                    finalResult = Ember.A([]);
                    Ember.makeArray( response ).forEach( function ( child ) {
                        finalResult.pushObject( model.createRecord( child ) );
                    }, this );
                }else{
                    finalResult = model.createRecord( response );
                }

                resolve( finalResult );

            }.bind( this ), 'sl-model.localstorageAdapter:find - Promise ');

            promise.finally( function lsAdapaterFindFinally( response ) {


                //run post query hooks
                this.runPostQueryHooks( response );

            }.bind( this ), 'sl-model.localstorageAdapter:find - finally');


            //set the promise on the promiseProxy
            results.set( 'promise', promise );

            return results;

        },
            /**
         * Delete record
         *
         * @public
         * @method deleteRecord
         * @param {string} url  the url to send the DELETE command to
         * @param {object} context
         * @return {object} Promise
         */
        deleteRecord: function( url, id ) {
            var promise;

            Ember.assert('A url is required to delete a model', url);

            promise = new Ember.RSVP.Promise( function( resolve, reject ){
                var db,
                    records,
                    errorData,
                    recordIndex;

                db = this._getDb();

                records = this._getRecords( db, url );

                recordIndex = this._getRecordIndexById( records, id );

                if( recordIndex >= 0 ){
                    records.splice( recordIndex, 1 );
                }else{
                    errorData = {
                        statusCode: 404,
                        statusText: 'id: '+id+' not found at '+url,
                        message: 'The record with id: `'+id+'` was not found at url:'+url
                    };
                    reject( errorData );
                }

                this._dbWrite( db );

                resolve();

            }.bind( this ));

            promise.finally( function lsAdapterDeleteFinally( response ) {
                this.runPostQueryHooks( response );
            }.bind( this ) , 'sl-model.localstorageAdapter:deleteRecord - always ');

            return promise;
        },

        /**
         * Save record
         *
         * @public
         * @method save
         * @param url
         * @param context
         * @return {object} Promise
         */
        save: function( url, content ) {
            var promise;

            Ember.assert('A url is required to delete a model', url);

            promise = new Ember.RSVP.Promise( function( resolve, reject ){
                var db,
                    records,
                    recordIndex;

                db = this._getDb();

                records = this._getRecords( db, url );

                recordIndex = this._getRecordIndexById( records, content.id );
                if( recordIndex >= 0 ){
                    records.splice( recordIndex, 1 );
                }

                records.push( content );

                this._dbWrite( db );

                resolve( content );

            }.bind( this ));

            promise.finally( function lsAdapterSaveFinally( response ) {
                this.runPostQueryHooks( response );
            }.bind( this ) , 'sl-model.localstorageAdapter:saveRecord - always ');

            return promise;
        },

        /**
         * return the adapter's namespace
         * @method getNamespace
         * @return {string}     namespace
         */
        getNamespace: function(){
            return this.constructor.namespace;
        },

        /**
         * method to get localStorage object, useful for testing
         * @private
         * @method _getLocalStorage
         * @return {object}         localStorage or mockup
         */
        _getLocalStorage: function(){
            return this.get( 'localStorageMockup' ) || window.localStorage;
        },

        /**
         * get the db off of localStorage
         *
         * @private
         * @method _getDb
         *
         */
        _getDb: function(){
            var lsDb = this._getLocalStorage().getItem( this.getNamespace() );
            if( lsDb ){
                return JSON.parse( lsDb );
            }

            return {};
        },

        /**
         * write the db to localStorage
         *
         * @private
         * @method  _dbWrite
         */
        _dbWrite: function( db ){
            this._getLocalStorage().setItem( this.getNamespace(), JSON.stringify( db ));
        },

        /**
         * return the records for a specific model url
         * @method _getRecords
         * @param {object} db the object to find the records on
         * @param  {string}    url the key
         * @return {array}        records
         */
        _getRecords: function( db, url ){
            var modelKey = this._normalizeUrl( url ),
                records = db[ modelKey ];

            if( ! records ){
                records = db[ modelKey ] = Ember.A([]);
            }

            return records;
        },

        /**
         * return the
         * @method _getRecordIndexById
         * @param  {Array}       records array to search
         * @param  {integer}       id    id to search for
         * @return {integer}             -1 if not found
         */
        _getRecordIndexById: function( records, id ){
            var recordIndex = -1;
            if( Array.isArray( records ) ){
                records.forEach( function( item, index ){
                    if( item.id === id ){
                        recordIndex = index;
                    }
                });
            }

            return recordIndex;
        },

        /**
         * normalize a url for using as a key
         * @method _normalizeUrl
         * @param  {string}     url
         * @return {string}         normalized url
         */
        _normalizeUrl: function( url ){
            return url.replace(/^\//, '').replace('\/','_');
        }
    });

    LocalStorageAdapter.reopenClass({
        namespace: 'sl-model'
    });

    __exports__["default"] = LocalStorageAdapter;
  });
define("sl-model/initializers/main",
  ["sl-model","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var SlModel = __dependency1__;

    /**
     * SL-Model/initializers/main
     *
     *
     * @class initializers_main
     */
    __exports__["default"] = {

        name: 'sl-model',

        initialize: function ( container, application ) {
            var LocalstorageAdapter = SlModel.LocalstorageAdapter.extend();

            LocalstorageAdapter.reopenClass({
                namespace: container.lookup('application:main').get('modulePrefix')
            });

            container.register('store:main', SlModel.Store );

            container.register('adapter:ajax', SlModel.AjaxAdapter );

            container.register('adapter:localstorage', LocalstorageAdapter );

            application.inject('controller', 'store', 'store:main');

            application.inject('route', 'store', 'store:main');

        }
    };
  });
define("sl-model",
  ["./model","./store","./adapter","./adapters/ajax","./adapters/localstorage","./module-for-sl-model","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Model = __dependency1__["default"] || __dependency1__;
    var Store = __dependency2__["default"] || __dependency2__;
    var Adapter = __dependency3__["default"] || __dependency3__;
    var AjaxAdapter = __dependency4__["default"] || __dependency4__;
    var LocalstorageAdapter = __dependency5__["default"] || __dependency5__;
    var moduleForSlModel = __dependency6__["default"] || __dependency6__;


    /**
     * SL-Model exports sl-model/model as its default export.
     *
     * This allows you to do:
     *
     * ```javascript
     * import SlModel from 'sl-model'
     *
     * export default SlModel.extend({})
     *```
     * In your model files.
     *
     * @class sl-model
     */
    __exports__["default"] = Model;

    __exports__.Model = Model;
    __exports__.Store = Store;
    __exports__.Adapter = Adapter;
    __exports__.AjaxAdapter = AjaxAdapter;
    __exports__.LocalstorageAdapter = LocalstorageAdapter;
    __exports__.moduleForSlModel = moduleForSlModel;
  });
define("sl-model/model",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var get = Ember.get;

    /**
     * SL-Model/Model
     *
     *
     * @class model
     */
    var Model =  Ember.ObjectProxy.extend({
        
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

            endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'post' );

            data = this.get( 'content' );

            Ember.assert( 'Endpoint must be configured on '+this.toString()+' before calling save.', endpoint );


            return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( endpoint, data )
                .then( function( response ){
                    this.set( 'content', response );
                    return this;
                }.bind( this ), null, 'sl-model.model:save');
        },

        /**
         * Delete the record via the configured adapter
         *
         * @public
         * @method deleteRecord
         * @param {object} optional
         * @return {object} jqXHR from jQuery.ajax()
         */
        deleteRecord: function( options ) {
            var endpoint;

            options = options || {};

            endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'delete' );

            Ember.assert( 'Enpoint must be configured on '+this.toString()+' before calling deleteRecord.', endpoint );

            return this.container.lookup( 'adapter:'+this.constructor.adapter ).deleteRecord( endpoint, this.get( 'id' ) )
                .then( function( response ){
                    Ember.run(this, 'destroy');
                }.bind( this ), null, 'sl-model.model:deleteRecord' );
        }
    });

    Model.reopenClass({

        /**
         * the default url for this class
         * @type {string}
         */
        url: null,

        createRecord: function( content ){
            var record = this.create();
            record.set( 'content', content || {} );
            return record;
        },

        /**
         * the default serializer
         * @method serializer
         * @param  {object}   response data to be serialized
         * @return {object}            serialized data
         */
        serializer: function( response ){ return response; },

        /**
         * the default adapter, currently either 'ajax' or 'localstorage'
         * @type {String}
         */
        adapter: "ajax",

        /**
         * resolves the url by walking down the endpoints object and defaulting to the root:url string
         * @method getUrlForEndpointAction
         * @param  {string}                endpoint the endpoint, leave blank or null for default
         * @param  {string}                action   the action, leave blank or null for default
         * @return {string}                         resolved url
         */
        getUrlForEndpointAction: function( endpoint, action ) {
            var resolvedEndpoint,
                testEndpoint;

            endpoint = endpoint || 'default';

            testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'endpoints.'+endpoint ) || {};

            if( typeof testEndpoint === 'string' ){
                resolvedEndpoint = testEndpoint;
            } else {
                resolvedEndpoint = get( testEndpoint, 'url' ) || get( this, 'url' );
            }

            Ember.assert( 'A url needs to be set for '+this.toString(), resolvedEndpoint );

            return resolvedEndpoint;
        },

        /**
         * calls the serializer for the specified endpoint and actions
         * @method callSerializerForEndpointAction
         * @param  {string}                        endpoint
         * @param  {string}                        action
         * @param  {object}                        data     the data to be serialized
         * @param  {object}                        store    the app's store, use to store metadata
         * @return {object}                                 the serialized data
         */
        callSerializerForEndpointAction: function( endpoint, action, data, store ) {
            var resolvedSerializer,
                testEndpoint,
                defaultSerializer;

            endpoint = endpoint || 'default';
            testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'endpoints.'+endpoint ) || {};
            defaultSerializer = get( this, 'endpoints.default.'+action+'.serializer' ) ||
                get( this, 'endpoints.default.serializer' ) ||
                get( this, 'serializer' );

            if( typeof testEndpoint === 'string' ){
                resolvedSerializer = defaultSerializer;
            } else {
                resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer;
            }

            Ember.assert( 'A serializer needs to be set for '+this.toString(), resolvedSerializer );

            return resolvedSerializer.call( this, data, store );
        }

    });

    __exports__["default"] = Model;
  });
define("sl-model/module-for-sl-model",
  ["ember-qunit","ember","sl-model","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var Ember = __dependency2__["default"] || __dependency2__;
    var SlModel = __dependency3__;


    __exports__["default"] = function moduleForSlModel(name, description, callbacks) {

        moduleFor('model:' + name, description, callbacks, function(container, context, defaultSubject) {

            container.register('store:main', SlModel.Store );

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
define("sl-model/store",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * SL-Model/Store
     *
     *
     * @class store
     */
    __exports__["default"] = Ember.Object.extend({

        /**
         * preQueryHooks is an array of functions to be run before an adapter runs a query
         *
         * @property preQueryHooks
         * @type {Array}
         */
        preQueryHooks: Ember.A([]),

        /**
         * postQueryHooks is an array of functions to be run after an adapter runs a query
         *
         * @property postQueryHooks
         * @type {Array}
         */
        postQueryHooks: Ember.A([]),

        /**
         * modelFor returns the model class for a given model type
         *
         * @public
         * @method modelFor
         * @type {method}
         * @param  {string} type lower case name of the model class
         * @return {function} - model constructor
         */
        modelFor: function( type ){
            var normalizedKey = this.container.normalize( 'model:'+type ),
                factory = this.container.lookupFactory( normalizedKey );

            Ember.assert( "No model was found for `"+type+"`", factory );

            return factory;
        },

        /**
         * private variable that store all the metadata for all the models
         *
         * @property _metadataCache
         * @private
         * @type {Object}
         */
        _metadataCache: {},

        /**
         * metaForType sets the metadata object for the specified model type
         * @method metaForType
         * @public
         * @param  {string} type the lowercase model name
         * @param  {object} metadata the metadata to save
         */
        metaForType: function( type, metadata ){
            this.set( '_metadataCache.'+type, metadata );
        },

        /**
         * metadataFor returns the metadata object for the specified model type
         * @method  metadataFor
         * @public
         * @param  {string} type lower case model name
         * @return {object}      the metadata object that was saved with metaForType
         */
        metadataFor: function( type ){
            return this.get( '_metadataCache.'+type );
        },

        /**
         * adapterFor returns the configured adapter for the specified model type
         * @method  adapterFor
         * @public
         * @param  {string} type the lower case name of the model class
         * @return {object} the adapter singleton
         */
        adapterFor: function( type ){
            var adapterType = this.modelFor(type).adapter,
                adapter = this.container.lookup( 'adapter:'+adapterType );

            return adapter;
        },

        /**
         * findOne returns an object proxy, does not use an id to perform a lookup (use the options obj instead).
         * @method  findOne
         * @public
         * @param  {string} type    lower case name of the model
         * @param  {Object} options hash of options to be passed on to the adapter
         * @return {Object}         Ember.ObjectProxy
         */
        findOne: function( type, options ) {
            return this.__find( type, null, options, true );
        },

        /**
         * find a/an record(s) using an id or options
         * @method  find
         * @public
         * @param  {string} type    lower case name of the model class
         * @param  {int} id
         * @param  {object} options hash of options to be passed on to the adapter
         * @return {object / array}         an object or an array depending on whether you specified an id
         */
        find: function( type, id, options ) {
            if( typeof id === 'object' && typeof options === 'undefined' ){
                return this.__find( type, null, id, false );
            }
            if( typeof id === 'undefined' && typeof options === 'undefined' ){
                return this.__find( type, null, null, false );
            }
            return this.__find( type, id, options, false );
        },

        /**
         * private find method
         * @private
         * @method  __find
         * @param  {string} type    lowercase model name
         * @param  {integer / string} id      record identifier
         * @param  {object} options objects containing all options for query
         * @param  {boolean} findOne force the retrieval of a single record
         * @return {object}         an ember object / array proxy with the promise proxy mixin
         */
        __find: function( type, id, options, findOne ) {
            var model = this.modelFor( type );
            return this.adapterFor( type ).find( model, id, options, findOne );
        },

        /**
         * create a new record, it will not have been saved via an adapter yet
         * @method  createRecord
         * @public
         * @param  {string} type lower case name of model class
         * @return {object}      model object, instance of Ember.ObjectProxy
         */
        createRecord: function( type, content ){
            var factory = this.modelFor( type ),
                record = factory.createRecord( content );

                return record;
        },

        /**
         * registerPreQueryHook add a function to ther prequery hooks array
         *
         * @method  registerPreQueryHook
         * @public
         * @param  {function} f a function
         *
         */
        registerPreQueryHook: function( f ){
            this.get( 'preQueryHooks' ).push( f );
        },

        /**
         * runPreQueryHooks
         * @method  runPreQueryHooks
         * @public
         * @param  {object} query
         */
        runPreQueryHooks: function( query ){
            var preQueryHooks = this.get( 'preQueryHooks' );
            if( Ember.isArray( preQueryHooks ) ){
                preQueryHooks.forEach( function( f ){ f( query ); } );
            }
        },

        /**
         * registerPostQueryHook add a function to the postquery array
         * @method  registerPostQueryHook
         * @public
         * @param  {function} f function to be run after a query
         */
        registerPostQueryHook: function( f ){
            this.get( 'postQueryHooks' ).push( f );
        },

        /**
         * runPostQueryHooks call the post query hooks with the response obj
         * @method  runPostQueryHooks
         * @public
         * @param  {object} response the response from the adapter
         */
        runPostQueryHooks: function( response ){
            var postQueryHooks = this.get( 'postQueryHooks' );
            if( Ember.isArray( postQueryHooks ) ){
                postQueryHooks.forEach( function( f ){ f( response ); } );
            }
        },
    });
  });