import Ember from 'ember';
export default Ember.Route.extend({
    actions: {
        addSomeRecords: function(){
            this.loadRecords( { add: true, data: { start: 3, length: 6 } } );            
        },
        loadSomeRecords: function(){
            this.loadRecords( { data: { start: 3, length: 6 } } );            
        },
        addAllRecords: function(){
            this.loadRecords( { add: true } );            
        },
        reloadFirstRecords: function(){
            this.loadRecords( { reload: true, data: { start: 0, length: 3 } } );            
        },
    },

    loadRecords: function( options ){
        var controller = this.controller,
            records = this.store.find( 'foo', options );            

        controller.set( 'model2', records );

        records.then( function(){
            controller.set( 'model2meta', this.store.metadataFor( 'foo' ) );
            this.store.find( 'foo' ).then( function( records ){
                controller.set( 'model2CachedTotalCount', records.length );    
            });
        }.bind( this ));      
    },

    model: function( ){
        var initialRequest = this.store.find( 'foo', null, { data: { start: 0, length: 3 } } );

        return initialRequest;
    },

    setupController: function( controller, model ){
        controller.set( 'model', model );
        controller.set( 'model2', model );
        controller.set( 'model2CachedTotalCount', model.length );
        controller.set( 'model2meta', this.store.metadataFor( 'foo' ) );
    }
});
