import ModelizeMixin from 'sl-modelize';

export default Ember.Object.extend( ModelizeMixin, {
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
    },

    __find: function(){
        Ember.assert( 'Your model should overwrite adapterType', true);
    }
});