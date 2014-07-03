import Ember from 'ember';

/**
 * SL-Model/Store
 *
 *
 * @class store
 */
export default Ember.Object.extend({

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
    createRecord: function( type, defaults ){
        var factory = this.modelFor( type ),
            record = factory.create( {
                container: this.container
            });

            record.setProperties( defaults );

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