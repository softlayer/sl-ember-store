import Ember from 'ember';

var get = Ember.get;

/**
 * SL-Model/Model
 *
 *
 * @class model
 */
var Model =  Ember.ObjectProxy.extend({

    content: {},

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

        endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'post' );

        data = this.get( 'content' );

        Ember.assert( 'Endpoint must be configured on '+this.toString()+' before calling save.', endpoint );


        return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( endpoint, data )
            .then( function( response ){
                this.set( 'content', response );
            }.bind( this ), null, 'sl-model.model:save');
    },

    /**
     * Delete the record via the configured adapter
     *
     * @public
     * @method deleteRecord
     * @param {object} optional
     * @return {object} jqXHR from jQuery.ajax()
     */
    deleteRecord: function( options ) {
        var endpoint;

        options = options || {};

        endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'delete' );

        Ember.assert( 'Enpoint must be configured on '+this.toString()+' before calling deleteRecord.', endpoint );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).deleteRecord( endpoint, this.get( 'id' ) )
            .then( function( response ){
                this.destroy();
            }.bind( this ), null, 'sl-model.model:deleteRecord' );
    }
});

Model.reopenClass({

    url: null,

    serializer: function( response ){ return response; },

    //set default adapter
    adapter: "ajax",

    getUrlForEndpointAction: function( endpoint, action ) {
        var resolvedEndpoint,
            testEndpoint;

        endpoint = endpoint || 'default';

        testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'endpoints.'+endpoint ) || {};

        if( typeof testEndpoint === 'string' ){
            resolvedEndpoint = testEndpoint;
        } else {
            resolvedEndpoint = get( testEndpoint, 'url' ) || get( this, 'url' );
        }

        Ember.assert( 'A url needs to be set for '+this.toString(), resolvedEndpoint );

        return resolvedEndpoint;
    },

    getSerializerForEndpointAction: function( endpoint, action ) {
        var resolvedSerializer,
            testEndpoint,
            defaultSerializer;

        endpoint = endpoint || 'default';
        testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'endpoints.'+endpoint ) || {};
        defaultSerializer = get( this, 'endpoints.default.'+action+'.serializer' ) || get( this, 'endpoints.default.serializer' );

        if( typeof testEndpoint === 'string' ){
            resolvedSerializer = defaultSerializer;
        } else {
            resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer || get( this, 'serializer' );
        }

        Ember.assert( 'A serializer needs to be set for '+this.toString(), resolvedSerializer );

        return resolvedSerializer;
    }

});

export default Model;