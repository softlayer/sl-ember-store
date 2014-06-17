var Model =  Ember.Object.extend({

    url: '',

     /**
     * Proxy the current instance to the class save method
     *
     * @public
     * @method save
     */
    save: function() {
        var data;

        Ember.assert( 'Url must be set on '+this.toString()+' before save.', this.constructor.url );
        if ( arguments[0] ) {
            data = arguments[0];
        }

        data = data || this;

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( this.constructor.url, data );
    },

    /**
     * Delete record
     *
     * @public
     * @method destroy
     * @param {integer} Record Id
     * @return {object} jqXHR from jQuery.ajax()
     */
    delete: function() {
        var data;
        
        Ember.assert( 'Url must be set on '+this.toString()+' before delete.', this.constructor.url);
        if ( arguments[0] ) {
            data = arguments[0];
        }

        data = data || this;
        return this.container.lookup( 'adapter:'+this.constructor.adapter ).delete( this.constructor.url, data );
    }
});

Model.reopenClass({
    adapter: "ajax"
});

export default Model;