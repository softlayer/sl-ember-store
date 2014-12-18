import Ember from 'ember';
import cache from './cache';

/**
 * @class store
 */
export default Ember.Object.extend({

    /**
     * Array of functions to be run before an adapter runs a query
     *
     * @property {Ember.Array} preQueryHooks
     * @default  {array}
     */
    preQueryHooks: [],

    /**
     * Array of functions to be run after an adapter runs a query
     *
     * @property {Ember.Array} postQueryHooks
     * @default  {array}
     */
    postQueryHooks: [],

    /**
     * Stores all the metadata for all the models
     *
     * @private
     * @property {Ember.Object} _metadataCache
     * @default  {object}
     */
    _metadataCache: {},

    /**
     * Initialize the cache
     *
     * @function  setupcache
     * @observers "init" event
     * @returns   {void}
     */
    setupcache: function() {
        this.set( '_cache', cache.create() );
    }.on( 'init' ),

    /**
     * Returns the model class for a given model type
     *
     * @function modelFor
     * @param    {string} type - Name of the model class
     * @throws   {Ember.assert}
     * @returns  {function} Model constructor
     */
    modelFor: function( type ) {
        var normalizedKey = this.container.normalize( 'model:' + type ),
            factory       = this.container.lookupFactory( normalizedKey );

        Ember.assert( 'No model was found for `' + type + '`', factory );

        return factory;
    },

    /**
     * Sets the metadata object for the specified model type
     *
     * @function metaForType
     * @param    {string} type     - The model name
     * @param    {object} metadata - The metadata to save
     * @returns  {void}
     */
    metaForType: function( type, metadata ) {
        this.set( '_metadataCache.' + type, metadata );
    },

    /**
     * Returns the metadata object for the specified model type
     *
     * @function metadataFor
     * @param    {string} type - The model name
     * @returns  {object} The metadata object that was saved with metaForType
     */
    metadataFor: function( type ) {
        return this.get( '_metadataCache.' + type );
    },

    /**
     * Returns the configured adapter for the specified model type
     *
     * @function adapterFor
     * @param    {string} type - The name of the model class
     * @returns  {object} The adapter singleton
     */
    adapterFor: function( type ) {
        var adapterType = this.modelFor( type ).adapter;

        return this.container.lookup( 'adapter:' + adapterType );
    },

    /**
     * Returns an object proxy
     *
     * Does not use an id to perform a lookup (use the options object instead).
     *
     * @function findOne
     * @param    {string} type    - Name of the model
     * @param    {object} options - Hash of options to be passed on to the adapter
     * @returns  {Ember.ObjectProxy}
     */
    findOne: function( type, options ) {
        return this.__find( type, null, options, true );
    },

    /**
     * Find (a) record(s) using an id or options
     *
     * @function find
     * @param    {string}  type    - Name of the model class
     * @param    {integer} id      - ID of the record
     * @param    {object}  options - Hash of options to be passed on to the adapter, alternatively can be passed
     * in as the second param for find:many queries
     * @returns  {object / array} An object or an array depending on whether you specified an ID
     */
    find: function( type, id, options ) {
        if ( typeof id === 'object' && typeof options === 'undefined' ) {
            return this.__find( type, null, id, false );
        }

        if ( typeof id === 'undefined' && typeof options === 'undefined' ) {
            return this.__find( type, null, null, false );
        }

        return this.__find( type, id, options, false );
    },

    /**
     * Create a new record, it will not have been saved via an adapter yet
     *
     * @function createRecord
     * @param    {string} type - Name of model class
     * @returns  {Ember.ObjectProxy} Model object, instance of Ember.ObjectProxy
     */
    createRecord: function( type, content ) {
        var factory = this.modelFor( type ),
            record  = factory.create({
                container: this.get( 'container' )
            });

        record.set( 'content', content || {} );

        return record;
    },

    /**
     * Add a function to the prequery hooks array
     *
     * @function registerPreQueryHook
     * @param    {function} hookFunction
     * @returns  {void}
     */
    registerPreQueryHook: function( hookFunction ) {
        this.get( 'preQueryHooks' ).push( hookFunction );
    },

    /**
     * Call the pre query hooks with the query
     *
     * @function runPreQueryHooks
     * @param    {object} query
     * @returns  {void}
     */
    runPreQueryHooks: function( query ) {
        var preQueryHooks = this.get( 'preQueryHooks' );

        if ( Ember.isArray( preQueryHooks ) ) {
            preQueryHooks.forEach( function( hookFunction ) {
                hookFunction( query );
            });
        }
    },

    /**
     * Add a function to the postquery array
     *
     * @function registerPostQueryHook
     * @param    {function} hookFunction - A function to be run after a query
     * @returns  {void}
     */
    registerPostQueryHook: function( hookFunction ) {
        this.get( 'postQueryHooks' ).push( hookFunction );
    },

    /**
     * Call the post query hooks with the response obj
     *
     * @function runPostQueryHooks
     * @param    {object} response - The response from the adapter
     * @returns  {void}
     */
    runPostQueryHooks: function( response ) {
        var postQueryHooks = this.get( 'postQueryHooks' );

        if ( Ember.isArray( postQueryHooks ) ) {
            postQueryHooks.forEach( function( hookFunction ) {
                hookFunction( response );
            });
        }
    },

    /**
     * Private find method
     *
     * @private
     * @function __find
     * @param    {string}         type    - Model name
     * @param    {integer|string} id      - Record identifier
     * @param    {object}         options - Objects containing all options for query
     * @param    {boolean}        findOne - Whether to force the retrieval of a single record (true)
     * @returns  {Ember.Object} An ember object / array proxy with the promise proxy mixin
     */
    __find: function( type, id, options, findOne ) {
        var cache           = this.get( '_cache' ),
            reload          = options && options.reload,
            add             = options && options.add,
            loadFromServer  = reload || add || ( options && options.data ),
            result;

        if ( loadFromServer || !cache.isCached( type, id, findOne ) ) {
            result = this.adapterFor( type ).find( type, id, options, findOne );

            if ( reload ) {
                cache.clearCache( type );
            }

            cache.addToCache( type, id, findOne, result );

            return result;
        }

        return cache.fetch( type, id, findOne );
    }
});
