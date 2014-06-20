/**
 * SL-Model/Store
 *
 * 
 * @class sl-model/store
 */

export default Ember.Object.extend({

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