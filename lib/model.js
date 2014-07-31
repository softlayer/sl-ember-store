import Ember from 'ember';

var get = Ember.get;

/**
 * SL-Model/Model
 *
 *
 * @class model
 */
var Model =  Ember.ObjectProxy.extend({

    container: null,

    content: {},

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
                return this;
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
                Ember.run(this, 'destroy');
            }.bind( this ), null, 'sl-model.model:deleteRecord' );
    }
});

Model.reopenClass({

    /**
     * the default url for this class
     * @type {string}
     */
    url: null,

    /**
     * the default serializer
     * @method serializer
     * @param  {object}   response data to be serialized
     * @return {object}            serialized data
     */
    serializer: function( response ){ return response; },

    /**
     * the default adapter, currently either 'ajax' or 'localstorage'
     * @type {String}
     */
    adapter: "ajax",

    /**
     * resolves the url by walking down the endpoints object and defaulting to the root:url string
     * @method getUrlForEndpointAction
     * @param  {string}                endpoint the endpoint, leave blank or null for default
     * @param  {string}                action   the action, leave blank or null for default
     * @return {string}                         resolved url
     */
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

    /**
     * calls the serializer for the specified endpoint and actions
     * @method callSerializerForEndpointAction
     * @param  {string}                        endpoint
     * @param  {string}                        action
     * @param  {object}                        data     the data to be serialized
     * @param  {object}                        store    the app's store, use to store metadata
     * @return {object}                                 the serialized data
     */
    callSerializerForEndpointAction: function( endpoint, action, data, store ) {
        var resolvedSerializer,
            testEndpoint,
            defaultSerializer;

        endpoint = endpoint || 'default';
        testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'endpoints.'+endpoint ) || {};
        defaultSerializer = get( this, 'endpoints.default.'+action+'.serializer' ) ||
            get( this, 'endpoints.default.serializer' ) ||
            get( this, 'serializer' );

        if( typeof testEndpoint === 'string' ){
            resolvedSerializer = defaultSerializer;
        } else {
            resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer;
        }

        Ember.assert( 'A serializer needs to be set for '+this.toString(), resolvedSerializer );

        return resolvedSerializer.call( this, data, store );
    }

});

export default Model;