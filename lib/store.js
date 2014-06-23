/**
 * SL-Model/Store
 *
 * 
 * @class sl-model/store
 */

export default Ember.Object.extend({

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