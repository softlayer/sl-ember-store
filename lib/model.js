import Ember from 'ember';

var get = Ember.get;

var Model =  Ember.ObjectProxy.extend({

    url: '',

    container: null,

     /**
     * Save the contents via the configured adapter
     *
     * @public
     * @method save
     */
    save: function( options ) {
        var data,
            endpoint;

        options = options || {};

        endpoint  = this.constructor.getEndpointForAction( options.endpoint, 'post' );

        data = this.get( 'content' );

        Ember.assert( 'Endpoint must be configured on '+this.toString()+' before save.', endpoint );


        return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( endpoint, data )
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
    delete: function( options ) {
        var data,
            endpoint;

        options = options || {};

        data = this.get( 'content' ) || this;

        endpoint  = this.constructor.getEndpointForAction( options.endpoint, 'delete' );

        Ember.assert( 'Enpoint must be configure on '+this.toString()+' before delete.', endpoint );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).delete( endpoint, data )
            .then( function( response ){
                this.destroy();
            }.bind( this ), null, 'sl-model.model:delete' );
    }
});

Model.reopenClass({

    //set default adapter
    adapter: "ajax",

    getEndpointForAction: function( endpoint, action ) {
        endpoint = endpoint || 'default';

        return get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'url' );
    }

});

export default Model;