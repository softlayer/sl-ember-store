import Ember from 'ember';

var get = Ember.get;

/** @module SL-Model/model */
var Model =  Ember.ObjectProxy.extend({

     /**
     * Save the contents via the configured adapter
     *
     * @function save
     * @argument {object} optional options
     * @throws   {Ember.assert}
     * @return   {object} jqXHR from jQuery.ajax()
     */
    save: function( options ) {
        var data,
            endpoint;

        options = options || {};

        endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'post' );

        data = this.get( 'content' );

        Ember.assert( 'Endpoint must be configured on '+this.toString()+' before calling save.', endpoint );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).save( endpoint, data )
            .then( function( response ) {
                this.set( 'content', response );
                return this;
            }.bind( this ), null, 'sl-model.model:save' );
    },

    /**
     * Delete the record via the configured adapter
     *
     * @function deleteRecord
     * @argument {object} optional options
     * @throws   {Ember.assert}
     * @return   {object} jqXHR from jQuery.ajax()
     */
    deleteRecord: function( options ) {
        var endpoint;

        options = options || {};

        endpoint  = this.constructor.getUrlForEndpointAction( options.endpoint, 'delete' );

        Ember.assert( 'Enpoint must be configured on '+this.toString()+' before calling deleteRecord.', endpoint );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).deleteRecord( endpoint, this.get( 'id' ) )
            .then( function() {
                Ember.run( this, 'destroy' );
            }.bind( this ), null, 'sl-model.model:deleteRecord' );
    }
});

Model.reopenClass({

    /**
     * Default url for this class
     *
     * @property {string} url
     * @type     {string}
     * @default  null
     */
    url: null,

    /**
     * Default serializer
     *
     * @function serializer
     * @argument  {object} response  data to be serialized
     * @return {object} serialized data
     */
    serializer: function( response ) {
        return response;
    },

    /**
     * Default adapter
     *
     * Possible values are: 'ajax' or 'localstorage'
     *
     * @property {string} adapter
     * @type     {string}
     * @default  'ajax'
     */
    adapter: 'ajax',

    /**
     * resolves the url by walking down the endpoints object and defaulting to the root:url string
     *
     * @function getUrlForEndpointAction
     * @argument {string}  endpoint  the endpoint, leave blank or null for default
     * @argument {string}  action    the action, leave blank or null for default
     * @throwns  {Ember.assert}
     * @return   {string}            resolved url
     */
    getUrlForEndpointAction: function( endpoint, action ) {
        var resolvedEndpoint,
            testEndpoint;

        endpoint = endpoint || 'default';

        testEndpoint = get( this, 'endpoints.'+endpoint+'.'+action ) || get( this, 'endpoints.'+endpoint ) || {};

        if ( typeof testEndpoint === 'string' ) {
            resolvedEndpoint = testEndpoint;
        } else {
            resolvedEndpoint = get( testEndpoint, 'url' ) || get( this, 'url' );
        }

        Ember.assert( 'A url needs to be set for '+this.toString(), resolvedEndpoint );

        return resolvedEndpoint;
    },

    /**
     * Calls the serializer for the specified endpoint and actions
     *
     * @function callSerializerForEndpointAction
     * @argument {string}  endpoint  the endpoint, leave blank or null for default
     * @argument {string}  action    the action, leave blank or null for default
     * @argument {object}  data      the data to be serialized
     * @argument {sl-Model/store}    store     the app's store, use to store metadata
     * @throws   {Ember.assert}
     * @return   {Ember.Object}      the serialized data
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

        if ( typeof testEndpoint === 'string' ) {
            resolvedSerializer = defaultSerializer;
        } else {
            resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer;
        }

        Ember.assert( 'A serializer needs to be set for '+this.toString(), resolvedSerializer );

        return resolvedSerializer.call( this, data, store );
    }
});

export default Model;
