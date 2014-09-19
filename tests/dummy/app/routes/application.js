import Ember from 'ember';
export default Ember.Route.extend({

    beforeModel: function(){
        var self = this;
        this.store.find( 'test' ).then( function( testModels ){
            console.log( 'found models', testModels );
        })
        .catch( function(){
            console.log( 'no model found!' );

        });
    }

});
