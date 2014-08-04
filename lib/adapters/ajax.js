import Ember from 'ember';
import Adapter from '../adapter';
module icAjax from 'ic-ajax';

/**
 * SL-Model/adapters/ajax
 *
 *
 * @class adapters_ajax
 */
export default Adapter.extend({


    /**
     * find
     * @public
     * @method find
     * @param  {int}    id      record id
     * @param  {object} options hash of options
     * @param  {bool} findOne force return of single recrord
     * @return { ObjectProxy | ArrayProxy } The record or array of records requested
     */
    find: function ( model, id, options, findOne ){

        var url,
            cacheKey,
            cachedModel,
            results,
            cachedRequest,
            promise,
            initialObj = {},
            queryObj;

        options = options || {};

        url = model.getUrlForEndpointAction( options.endpoint, 'get' );

        Ember.assert('A url is required to find a model', url);

        if ( ! Ember.isNone( id ) ) {
            options.data    = options.data || {};
            options.data.id = parseInt( id, 10 );
        }

        //set up the results, either an object or an array proxy w/ promise mixin
        results     = ( ( options.data && options.data.id  ) || findOne ) ?
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

            //since serializer will probably be overwritten by a child class,
            //need to make sure it is called in the proper context so _super functionality will work
            response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, this.container.lookup( 'store:main' ) );

            //run the modelize mixin to map keys to models
            response = this.modelize( response );

            if ( results instanceof Ember.ArrayProxy ) {
                //reject if the response if empty
                if( ! response.length ){
                    throw { message: 'No objects found' };
                }

                tmpResult = Ember.A([]);
                Ember.makeArray( response ).forEach( function ( child ) {
                    tmpResult.pushObject( model.createRecord( child ) );
                }, this );

            }else{
                tmpResult = model.createRecord( response );
            }

            return tmpResult;

        }.bind( this ) , null, 'sl-model.ajaxAdapter:find - then' )

        .catch( function ajaxAdapterFindCatch( response ) {
            var errorData = {
                'statusCode' : response.status,
                'statusText' : response.statusText,
                'message'    : response.responseJSON && response.responseJSON.error || "Service Unavailable"
            };

            throw errorData;

        }.bind( this ), 'sl-model.ajaxAdapter:find - catch' )

        .finally( function ajaxAdapaterFindFinally( response ) {

            //run post query hooks
            this.runPostQueryHooks( response );

        }.bind( this ), 'sl-model.ajaxAdapter:find - finally');

        //set the promise on the promiseProxy
        results.set( 'promise', promise );

        return results;
    },

    /**
     * Delete record
     *
     * @public
     * @method deleteRecord
     * @param {string} url  the url to send the DELETE command to
     * @param {integer} id
     * @return {object} Promise
     */
    deleteRecord: function( url, id ) {

        Ember.assert('A url is required to delete a model', url);

        return icAjax.request({
            url  : url,
            type : 'DELETE',
            data : JSON.stringify({ id: id }),
            context: this
        })
        .finally( function ajaxAdapterDeleteFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.ajaxAdapter:deleteRecord - always ');
    },

    /**
     * Save record
     *
     * @public
     * @method save
     * @param url
     * @param context
     * @return {object} Promise
     */
     save: function( url, content ) {
        var promise,
            result;

        Ember.assert('A url property is required to save a model', url);

        promise = icAjax.request({
            url  : url,
            type : 'POST',
            data : JSON.stringify( content ),
            context : this
        })

        .then( function ajaxAdapterSaveResponse( response ) {
            //run the modelize mixin to map keys to models
            return this.modelize( response );

        }.bind( this ), null, 'sl-model:save - then' )

        .catch( function ajaxAdapterSaveCatch( jqxhr, textStatus, error ) {
            var errorData = {
                'statusCode' : jqxhr.status,
                'statusText' : jqxhr.statusText,
                'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable",
                'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || "Service Unavailable"
            };

            return errorData;

        }.bind( this ), 'sl-model:save - catch' )

        .finally( function ajaxAdapterSaveFinally( response ) {
            this.runPostQueryHooks( response );

        }.bind( this ), 'sl-model.ajaxAdapter:save - finally' );


        return promise;

     }
});
