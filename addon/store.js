import Ember from 'ember';
import cache from './cache';

/** @module SL-Model/store */
export default Ember.Object.extend({

    /**
     * Initialize the cache
     *
     * @function  setupcache
     * @observers 'init'
     * @return    {void}
     */
    setupcache: function() {
        this.set( '_cache', cache.create() );
    }.on( 'init' ),

    /**
     * Array of functions to be run before an adapter runs a query
     *
     * @property {array} preQueryHooks
     * @type     {Ember.Array}
     * @default  {array}
     */
    preQueryHooks: Ember.A([]),

    /**
     * Array of functions to be run after an adapter runs a query
     *
     * @property {array} postQueryHooks
     * @type     {Ember.Array}
     * @default  {array}
     */
    postQueryHooks: Ember.A([]),

    /**
     * Returns the model class for a given model type
     *
     * @function modelFor
     * @argument {string}     type lower case name of the model class
     * @throws {Ember.assert} If [this condition is met]
     * @return {function}     model constructor
     */
    modelFor: function( type ) {
        var normalizedKey = this.container.normalize( 'model:'+type ),
            factory       = this.container.lookupFactory( normalizedKey );

        Ember.assert( "No model was found for `"+type+"`", factory );

        return factory;
    },

    /**
     * Stores all the metadata for all the models
     *
     * @private
     * @property {object} _metadataCache
     * @type     {Ember.Object}
     * @default  {Ember.Object}
     */
    _metadataCache: {},

    /**
     * Sets the metadata object for the specified model type
     *
     * @function metaForType
     * @argument {string} type the lowercase model name
     * @argument {object} metadata the metadata to save
     * @return   {void}
     */
    metaForType: function( type, metadata ) {
        this.set( '_metadataCache.'+type, metadata );
    },

    /**
     * Returns the metadata object for the specified model type
     *
     * @function metadataFor
     * @argument {string} type lower case model name
     * @return   {object} the metadata object that was saved with metaForType
     */
    metadataFor: function( type ) {
        return this.get( '_metadataCache.'+type );
    },

    /**
     * The inflection dictionary for nonstandard words
     *
     * @private
     * @property {object} _inflectionDict
     * @type     {Ember.Object}
     * @default  {Ember.Object}
     */
    _inflectionDict: {},

    /**
     * Pluralize the provided word
     *
     * @function pluralize
     * @argument {string} word
     * @return   {string}
     */
    pluralize: function( word ) {
        return this.get( '_inflectionDict.'+word ) || word.match(/s$/) ? word+'es' : word+'s';
    },

    /**
     * Singularize the provided word
     *
     * @function singularize
     * @argument {string} word
     * @return   {string}
     */
    singularize: function( word ) {
        var inflectionDict = this.get( '_inflectionDict' ),
            foundDef       = inflectionDict.keys().reduce( function( word, key ) {
                var def      = inflectionDict.get( key ),
                    defRegex = new RegExp( '^'+word );

                if ( defRegex.test( def ) ) {
                    return def;
                }

                return word;
            });

        return foundDef || word.replace( /s$/, '' );
    },

    /**
     * Set pluralized word value
     *
     * @function defineInflection
     * @argument {string} word
     * @argument {string} pluralizedWord
     * @return   {void}
     */
    defineInflection: function( word, pluralizedWord ) {
        this.set( '_inflectionDict.'+word, pluralizedWord );
    },

    /**
     * Returns the configured adapter for the specified model type
     *
     * @function  adapterFor
     * @argument  {string} type the lower case name of the model class
     * @return    {object} the adapter singleton
     */
    adapterFor: function( type ) {
        var adapterType = this.modelFor(type).adapter,
            adapter     = this.container.lookup( 'adapter:'+adapterType );

        return adapter;
    },

    /**
     * Returns an object proxy
     *
     * Does not use an id to perform a lookup (use the options object instead).
     *
     * @function  findOne
     * @argument  {string} type    lower case name of the model
     * @argument  {object} options hash of options to be passed on to the adapter
     * @return    {Ember.ObjectProxy}
     */
    findOne: function( type, options ) {
        return this.__find( type, null, options, true );
    },

    /**
     * Find a/an record(s) using an id or options
     *
     * @function  find
     * @argument  {string}  type     lower case name of the model class
     * @argument  {integer} id
     * @argument  {object}  options  hash of options to be passed on to the adapter
     * @return {object / array}      an object or an array depending on whether you specified an id
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
     * Private find method
     *
     * @function  __find
     * @private
     * @argument  {string} type            lowercase model name
     * @argument  {integer / string} id    record identifier
     * @argument  {object} options         objects containing all options for query
     * @argument  {boolean} findOne        force the retrieval of a single record
     * @return                             an ember object / array proxy with the promise proxy mixin
     */
    __find: function( type, id, options, findOne ) {
        var cache  = this.get( '_cache' ),
            reload = options && options.reload,
            result;

        if ( reload || !cache.isCached( type, id, findOne ) ) {
            result = this.adapterFor( type ).find( type, id, options, findOne );

            if ( !id || !findOne ) {
                cache.clearCache( type );

            } else {
                cache.removeRecord( type, id || 0 );
            }

            cache.addToCache( type, id, findOne, result );

            return result;
        }

        return cache.fetch( type, id, findOne );
    },

    /**
     * Create a new record, it will not have been saved via an adapter yet
     *
     * @function  createRecord
     * @argument  {string} type         lower case name of model class
     * @return    {Ember.ObjectProxy}   model object, instance of Ember.ObjectProxy
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
     * @function  registerPreQueryHook
     * @argument  {function} f   a function
     * @return    {void}
     */
    registerPreQueryHook: function( f ) {
        this.get( 'preQueryHooks' ).push( f );
    },

    /**
     * Call the pre query hooks with the query
     *
     * @function  runPreQueryHooks
     * @argument  {object}  query
     * @return    {void}
     */
    runPreQueryHooks: function( query ) {
        var preQueryHooks = this.get( 'preQueryHooks' );

        if ( Ember.isArray( preQueryHooks ) ) {
            preQueryHooks.forEach( function( f ){ f( query ); } );
        }
    },

    /**
     * Add a function to the postquery array
     *
     * @function  registerPostQueryHook
     * @argument  {function} f  function to be run after a query
     * @return    {void}
     */
    registerPostQueryHook: function( f ) {
        this.get( 'postQueryHooks' ).push( f );
    },

    /**
     * Call the post query hooks with the response obj
     *
     * @function  runPostQueryHooks
     * @argument  {object} response   the response from the adapter
     * @return    {void}
     */
    runPostQueryHooks: function( response ) {
        var postQueryHooks = this.get( 'postQueryHooks' );

        if ( Ember.isArray( postQueryHooks ) ) {
            postQueryHooks.forEach( function( f ){ f( response ); } );
        }
    }
});
