import ModelizeMixin from 'sl-modelize';

/**
 * SL-Model/adapter
 *
 *
 * @class adapter
 */
export default Ember.Object.extend( ModelizeMixin, {
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
     * @public
     * @method generateCacheKey
     * @param {string} API url being requested
     * @param {array}  API url parameters
     * @return {string}
     */
    generateCacheKey: function( url, parameters ) {
        return url + ( JSON.stringify( parameters ) || '' );
    },


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