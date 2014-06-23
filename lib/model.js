var Model =  Ember.ObjectProxy.extend({

    url: '',

    container: null,

     /**
     * Save the contents via the configured adapter
     *
     * @public
     * @method save
     */
    save: function() {
        var data,
            promise;

        Ember.assert( 'Url must be set on '+this.toString()+' before save.', this.constructor.url );

        data = this.get( 'content' );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( this.constructor.url, data )
            .then( function( response ){
                this.set( 'content', response );
            }.bind( this ), null, 'sl-model.model:save');
    },

    /**
     * Delete the record via the configured adapter
     *
     * @public
     * @method destroy
     * @param {integer} Record Id
     * @return {object} jqXHR from jQuery.ajax()
     */
    delete: function() {
        var data;
        
        Ember.assert( 'Url must be set on '+this.toString()+' before delete.', this.constructor.url);
        
        data = this.get( 'content' ) || this;

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).delete( this.constructor.url, data )
            .then( function( response ){
                this.destroy();
            }.bind( this ), null, 'sl-model.model:delet' );
    }
});

Model.reopenClass({

    //set default adapter
    adapter: "ajax"
});

export default Model;