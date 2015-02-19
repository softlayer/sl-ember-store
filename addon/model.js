import Ember from 'ember';

var get = Ember.get;

/**
 * @class model
 */
var Model =  Ember.ObjectProxy.extend({

     /**
     * Save the contents via the configured adapter
     *
     * @function save
     * @param    {object} options
     * @throws   {Ember.assert}
     * @returns  {object} jqXHR from jQuery.ajax()
     */
    save: function( options ) {
        var data,
            endpoint;

        options = options || {};
        endpoint = this.constructor.getUrlForEndpointAction( options.endpoint, 'post' );
        data = this.get( 'content' );

        Ember.assert( 'Endpoint must be configured on ' + this.toString() + ' before calling save.', endpoint );

        return this.container.lookup( 'adapter:' + this.constructor.adapter ).save( endpoint, data )
            .then( Ember.run.bind( this, function( response ) {
                this.set( 'content', response );
                return this;
            }), null, 'sl-ember-store.model:save' );
    },

    /**
     * Delete the record via the configured adapter
     *
     * @function deleteRecord
     * @param    {object} options
     * @throws   {Ember.assert}
     * @returns  {object} jqXHR from jQuery.ajax()
     */
    deleteRecord: function( options ) {
        var endpoint;

        options = options || {};
        endpoint = this.constructor.getUrlForEndpointAction( options.endpoint, 'delete' );

        Ember.assert( 'Enpoint must be configured on ' + this.toString() + ' before calling deleteRecord.', endpoint );

        return this.container.lookup( 'adapter:'+this.constructor.adapter ).deleteRecord( endpoint, this.get( 'id' ) )
            .then( Ember.run.bind( this, function() {
                Ember.run( this, 'destroy' );
            }), null, 'sl-ember-store.model:deleteRecord' );
    }
});

Model.reopenClass({

    /**
     * Default url for this class
     *
     * @property {string} url
     * @default  null
     */
    url: null,

    /**
     * Default serializer
     *
     * @function serializer
     * @param    {object} response - Data to be serialized
     * @returns  {object} Serialized data
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
     * @default  'ajax'
     */
    adapter: 'ajax',

    /**
     * resolves the url by walking down the endpoints object and defaulting to the root:url string
     *
     * @function getUrlForEndpointAction
     * @param    {string} endpoint - The endpoint, leave blank or null for default
     * @param    {string} action   - The action, leave blank or null for default
     * @throwns  {Ember.assert}
     * @returns  {string} The resolved URL
     */
    getUrlForEndpointAction: function( endpoint, action ) {
        var resolvedEndpoint,
            testEndpoint;

        endpoint = endpoint || 'default';

        testEndpoint = get( this, 'endpoints.' + endpoint + '.' + action ) ||
            get( this, 'endpoints.' + endpoint ) || {};

        if ( typeof testEndpoint === 'string' ) {
            resolvedEndpoint = testEndpoint;
        } else {
            resolvedEndpoint = get( testEndpoint, 'url' ) || get( this, 'url' );
        }

        Ember.assert( 'A url needs to be set for ' + this.toString(), resolvedEndpoint );

        return resolvedEndpoint;
    },

    /**
     * Calls the serializer for the specified endpoint and actions
     *
     * @function callSerializerForEndpointAction
     * @param    {string}         endpoint - The endpoint, leave blank or null for default
     * @param    {string}         action   - The action, leave blank or null for default
     * @param    {object}         data     - The data to be serialized
     * @param    {sl-ember-store/store} store    - The app's store, use to store metadata
     * @throws   {Ember.assert}
     * @returns  {Ember.Object} The serialized data
     */
    callSerializerForEndpointAction: function( endpoint, action, data, store ) {
        var resolvedSerializer,
            testEndpoint,
            defaultSerializer;

        endpoint = endpoint || 'default';
        testEndpoint = get( this, 'endpoints.' + endpoint + '.' + action ) || get( this, 'endpoints.' + endpoint ) || {};
        defaultSerializer = get( this, 'endpoints.default.' + action + '.serializer' ) ||
            get( this, 'endpoints.default.serializer' ) ||
            get( this, 'serializer' );

        if ( typeof testEndpoint === 'string' ) {
            resolvedSerializer = defaultSerializer;
        } else {
            resolvedSerializer = get( testEndpoint, 'serializer' ) || defaultSerializer;
        }

        Ember.assert( 'A serializer needs to be set for ' + this.toString(), resolvedSerializer );

        return resolvedSerializer.call( this, data, store );
    }
});

export default Model;
