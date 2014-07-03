import Ember from 'ember';

var get = Ember.get;

/**
 * SL-Model/Model
 *
 *
 * @class model
 */
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
     * @param {integer} Record Id
     * @return {object} jqXHR from jQuery.ajax()
     */
    deleteRecord: function( options ) {
        var data,
            endpoint;

        options = options || {};

        data = this.get( 'content' ) || this;

        endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'delete' );

        Ember.assert( 'Enpoint must be configured on '+this.toString()+' before calling deleteRecord.', endpoint );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).deleteRecord( endpoint, data )
            .then( function( response ){
                this.destroy();
            }.bind( this ), null, 'sl-model.model:deleteRecord' );
    }
});

Model.reopenClass({

    //set default adapter
    adapter: "ajax",

    getUrlForEndpointAction: function( endpoint, action ) {
        var resolvedEndpoint,
            testEndpoint;

        endpoint = endpoint || 'default';
        testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || {};

        if( typeof testEndpoint === 'string' ){
            resolvedEndpoint = testEndpoint;
        } else {
            resolvedEndpoint = get( testEndpoint, 'url' ) || get( this, 'url' );
        }

        return resolvedEndpoint;
    },

    getSerializerForEndpointAction: function( endpoint, action ) {
        var resolvedSerializer,
            testEndpoint,
            defaultSerializer,
            passThroughSerializer = function( response ){ return response; };

        endpoint = endpoint || 'default';
        testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || {};
        defaultSerializer = get( this, 'endpoints.default.'+action+'.serializer' );

        if( testEndpoint === 'string' ){
            resolvedSerializer = defaultSerializer || passThroughSerializer;
        } else {
            resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer || passThroughSerializer;
        }

        return resolvedSerializer;
    }

});

export default Model;