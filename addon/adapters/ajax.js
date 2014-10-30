import Ember from 'ember';
import Adapter from '../adapter';
module icAjax from 'ic-ajax';

/** @module SL-Model/adapters/ajax */
export default Adapter.extend({

    /**
     * Find record(s)
     *
     * @public
     * @function find
     * @argument {string} type    model name
     * @argument {int}    id      record id
     * @argument {object} options hash of options
     * @argument {bool}   findOne force return of single record
     * @throws {Ember.assert}
     * @return   { ObjectProxy | ArrayProxy } The record or array of records requested
     */
    find: function ( type, id, options, findOne ) {

        var store = this.get( 'store' ),
            model = store.modelFor( type ),
            url,
            results,
            promise,
            queryObj;

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

            .then( function ajaxAdapterFindTransformResponse( response ){

                var tmpResult;

                // since serializer will probably be overwritten by a child class,
                // need to make sure it is called in the proper context so _super functionality will work
                response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, store );

                //run the modelize mixin to map keys to models
                response = this.modelize( response );

                if ( results instanceof Ember.ArrayProxy ) {
                    //reject if the response if empty
                    if( ! response.length ){
                        throw { message: 'No objects found' };
                    }

                    tmpResult = Ember.A([]);
                    Ember.makeArray( response ).forEach( function ( child ) {
                        tmpResult.pushObject( store.createRecord( type, child ) );
                    }, this );

                }else{
                    tmpResult = store.createRecord( type, response );
                }

                return tmpResult;

            }.bind( this ) , null, 'sl-model.ajaxAdapter:find - then' )

            .catch( function ajaxAdapterFindCatch( response ) {

                throw response;

            }.bind( this ), 'sl-model.ajaxAdapter:find - catch' )

            .finally( function ajaxAdapaterFindFinally( response ) {
                this.runPostQueryHooks( response );
            }.bind( this ), 'sl-model.ajaxAdapter:find - finally' );

        //set the promise on the promiseProxy
        results.set( 'promise', promise );

        return results;
    },

    /**
     * Delete record
     *
     * @public
     * @function deleteRecord
     * @argument {string} url  the url to send the DELETE command to
     * @argument {integer} id
     * @throws {Ember.assert}
     * @return {Ember.RSVP} Promise
     */
    deleteRecord: function( url, id ) {
        var queryObj = {
            url     : url,
            type    : 'DELETE',
            data    : JSON.stringify({ id: id }),
            context : this
        };

        Ember.assert( 'A url is required to delete a model', url );

        this.runPreQueryHooks( queryObj );

        return icAjax.request( queryObj )
        .finally( function ajaxAdapterDeleteFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.ajaxAdapter:deleteRecord - always' );
    },

    /**
     * Save record
     *
     * @public
     * @function save
     * @argument {string} url  the url to send the POST command to
     * @argument {object} content  data to save
     * @throws {Ember.assert}
     * @return {Ember.RSVP} Promise
     */
     save: function( url, content ) {
        var promise,
            queryObj = {
                url     : url,
                type    : 'POST',
                data    : JSON.stringify( content ),
                context : this
            };

        Ember.assert( 'A url property is required to save a model', url );

        this.runPreQueryHooks( queryObj );

        promise = icAjax.request( queryObj )
            .then( function ajaxAdapterSaveResponse( response ) {
                // run the modelize mixin to map keys to models
                return this.modelize( response );
            }.bind( this ), null, 'sl-model:save - then' )

            .catch( function ajaxAdapterSaveCatch( jqxhr ) {
                var errorData = {
                    'statusCode' : jqxhr.status,
                    'statusText' : jqxhr.statusText,
                    'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || 'Service Unavailable',
                    'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || 'Service Unavailable'
                };

                return errorData;

            }.bind( this ), 'sl-model:save - catch' )

            .finally( function ajaxAdapterSaveFinally( response ) {
                this.runPostQueryHooks( response );

            }.bind( this ), 'sl-model.ajaxAdapter:save - finally' );

        return promise;
     }
});
