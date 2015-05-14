import Ember from 'ember';
import Adapter from '../adapter';

var icAjax = require( 'ic-ajax' );

/**
 * @module adapters
 * @class  ajax
 */
export default Adapter.extend({

    /**
     * Find record(s)
     *
     * @function find
     * @param    {string} type    - Model name
     * @param    {int}    id      - Record ID
     * @param    {object} options - Hash of options
     * @param    {bool}   findOne - Force return of single record
     * @throws   {Ember.assert}
     * @returns  {ObjectProxy | ArrayProxy} The record or array of records requested
     */
    find: function( type, id, options, findOne ) {
        var store = this.get( 'store' ),
            model = store.modelFor( type ),
            _self = this,
            url,
            results,
            promise,
            queryObj;

        Ember.assert( 'Type is required', type && Ember.typeOf(type) === 'string' );

        options = options || {};

        url = model.getUrlForEndpointAction( options.endpoint, 'get' );

        Ember.assert( 'A url is required to find a model', url );

        if ( ! Ember.isNone( id ) ) {
            options.data    = options.data || {};
            options.data.id = parseInt( id, 10 );
        }

        //set up the results, either an object or an array proxy w/ promise mixin
        results = ( ( options.data && options.data.id  ) || findOne ) ?
            Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin ) :
            Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin );

        queryObj = {
            dataType : 'json',
            url      : url,
            data     : options.data,
            context  : this
        };

        this.runPreQueryHooks( queryObj );

        promise = icAjax.request( queryObj )
            .then( function ajaxAdapterFindTransformResponse( response ) {
                var tmpResult;

                // Since serializer will probably be overwritten by a child class,
                // need to make sure it is called in the proper context so _super functionality will work
                response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, store );

                // Run the modelize mixin to map keys to models
                response = _self.modelize( response );

                if ( results instanceof Ember.ArrayProxy ) {
                    tmpResult = [];
                    Ember.makeArray( response ).forEach( function ( child ) {
                        tmpResult.pushObject( store.createRecord( type, child ) );
                    }, this );
                } else {
                    tmpResult = store.createRecord( type, response );
                }

                _self.runPostQueryHooks( tmpResult );

                return tmpResult;
            }, null, 'sl-ember--model.ajaxAdapter:find - then' );

        // Set the promise on the promiseProxy
        results.set( 'promise', promise );

        return results;
    },

    /**
     * Delete record
     *
     * @function deleteRecord
     * @param    {string} url - The URL to send the DELETE command to
     * @param    {integer} id  - The model record's ID
     * @throws   {Ember.assert}
     * @returns  {Ember.RSVP} Promise
     */
    deleteRecord: function( url, id ) {
        var _self = this,
            queryObj;

        Ember.assert( 'A url is required to delete a model', url );
        Ember.assert( 'An id property is required to delete a model', id );

        queryObj = {
            url     : url + '/' + id,
            type    : 'DELETE',
            data    : JSON.stringify({ id: id }),
            context : this
        };

        this.runPreQueryHooks( queryObj );

        return icAjax.request( queryObj )
            .then( function ajaxAdapterDeleteFinally( response ) {
                _self.runPostQueryHooks( response );
            } , 'sl-ember-store.ajaxAdapter:deleteRecord' );
    },

     /**
     * Save record
     *
     * @function save
     * @param    {string} url     - The URL to send the POST/PUT command to (depends on whether an id exists or not).
     * @param    {object} content - Data to save
     * @throws   {Ember.assert}
     * @returns  {Ember.RSVP} Promise
     */
     save: function( url, content ) {
        var _self = this,
            promise,
            queryObj;

        Ember.assert( 'A url property is required to save a model', url );
        Ember.assert(
            'save() expects parameter to be an Object',
            'object' === typeof content && !Array.isArray( content )
        );

        if ( Ember.get( content, 'id' ) ) {
            url = url + '/' + Ember.get( content, 'id' );
        }

        queryObj = {
            url     : url,
            type    : ( content.id && !Ember.isEmpty( content.id ) ) ? 'PUT' : 'POST',
            data    : JSON.stringify( content ),
            context : this
        };

        this.runPreQueryHooks( queryObj );

        promise = icAjax.request( queryObj )
            .then( function ajaxAdapterSaveResponse( response ) {
                var modelized = _self.modelize( response );
                // run the modelize mixin to map keys to models
                _self.runPostQueryHooks( modelized );
                return modelized;
            }, null, 'sl-ember-store:save - then' )

            .catch( function ajaxAdapterSaveCatch( jqxhr ) {
                var errorData = {
                    'statusCode' : jqxhr.status,
                    'statusText' : jqxhr.statusText,
                    'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || 'Service Unavailable',
                    'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || 'Service Unavailable'
                };

                return errorData;

            }, 'sl-ember-store:save - catch' );

        return promise;
     }
});
