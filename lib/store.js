'use strict';

import Ember from 'ember';

export default Ember.Object.extend({
    adapterFor: function( type ){
        var adapterType = this.modelFor(type).adapter,
            adapter = this.container.lookupFactory( 'adapter:'+adapterType );

        return adapter;
    },

    modelFor: function( type ){
        var normalizedKey = this.container.normalize( 'model:'+type ),
            factory = this.container.lookupFactory( normalizedKey );

        if( !factory ){
            throw new Ember.Error( "No model was found for `"+type+"`");
        }

        return factory;
    },

    findOne: function( type, options ) {
        return this.__find( type, null, options, true );
    },

    find: function( type, id, options ) {
        return this.__find( type, id, options, false );
    },

    __find: function( type, id, options, findOne ) {
        var factory = this.modelFor( type );

        factory.reopenClass({ adapter: this.adapterFor( type ).create({container: this.container }) });

        return factory.__find( id, options, findOne );
    },

    createRecord: function( type ){
        var factory = this.modelFor( type );
        return factory.create( { container: this.container } );
    }
});