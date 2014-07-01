import Adapter from '../adapter';
module icAjax from 'ic-ajax';

export default Adapter.extend({


    /**
     * find
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

        if ( 'object' === typeof id  && null !== id ) {
            //assume a valid options.data object was passed in as second arg
            options = id;
            initialObj.id = id;
        } else if ( ! Ember.isNone( id ) ) {
            options.data    = options.data || {};
            options.data.id = parseInt( id, 10 );
            initialObj.id = id;
        }

        // Clear previously-cached data
        if ( options.reload ) {
            this.removeFromCache( url, options.data );
        }


        //set up the results, either an object or an array proxy w/ promise mixin
        results     = ( ( options.data && options.data.id  ) || findOne ) ?
            model.createWithMixins( Ember.PromiseProxyMixin, initialObj ) :
            Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin );

        //get cached model, if any
        cacheKey = this.generateCacheKey( url, options.data );
        cachedModel = this.cache[cacheKey];

        //return the cachedModel if possible
        if ( !options.reload && cachedModel ) {

            results.set( 'promise', new Promise( function( resolve ){
                    resolve( cachedModel );
                })
            );

            return results;
        }

        //check to see if there is an outstanding cachedRequest
        cachedRequest = this.requestCache[cacheKey];

        // Responding with in flight promise if possible
        if ( cachedRequest ) {
            results.set( 'promise', cachedRequest );
            return results;
        }

        queryObj = {
            dataType : 'json',
            url      : url,
            data     : options.data,
            context  : this
        };

        this.runPreQueryHooks( queryObj );

        promise = icAjax.request( queryObj )

        .then( function ajaxAdapterFindTransformResponse( response ){

            var serializer = model.getSerializerForEndpointAction( options.endpoint, 'get' );

            return serializer( response, results );

        }.bind( this ) )

        .then( function ajaxAdapterFindResponse ( response ) {
            var tmpResult;

            //run the modelize mixin to map keys to models
            response = this.modelize( response );

            if ( results instanceof Ember.ArrayProxy ) {
                tmpResult = Ember.A([]);
                Ember.makeArray( response ).forEach( function ( child ) {
                    tmpResult.pushObject( model.create( child ) );
                }, this );
            }else{
                tmpResult = response;
            }

            // Cache the results
            this.addToCache( url, options.data, tmpResult );

            return tmpResult;

        }.bind( this ) , null, 'sl-model.ajaxAdapter:find - then' )

        .catch( function ajaxAdapterFindCatch( response ) {
            var errorData = {
                'statusCode' : response.status,
                'statusText' : response.statusText,
                'message'    : response.responseJSON && response.responseJSON.error || "Service Unavailable"
            };

            return errorData;

        }.bind( this ), 'sl-model.ajaxAdapter:find - catch' )

        .finally( function ajaxAdapaterFindFinally( response ) {
            // Clearing request cache since it is no longer in flight
            this.removeFromRequestCache( url, options.data );

            //run post query hooks
            this.runPostQueryHooks( response );

        }.bind( this ), 'sl-model.ajaxAdapter:find - finally');

        //set the promise on the promiseProxy
        results.set( 'promise', promise );

        // Cache request object.  Other GET requests for the same URL will receive this
        // response promise while the request remains in flight.  This will prevent us
        // from having multiple simultaneous requests for the same endpoint in flight
        // at the same time
        this.addToRequestCache( url, options.data, promise );

        return results;
    },

    /**
     * Delete record
     *
     * @public
     * @method destroy
     * @param {integer} Record Id
     * @return {object} jqXHR from jQuery.ajax()
     */
    delete: function( url, context ) {

        Ember.assert('A url is required to destroy a model', url);

        return icAjax.request({
            url  : url,
            type : 'DELETE',
            data : JSON.stringify({ id: context.get( 'id' ) }),
            context: this
        })
        .finally( function ajaxAdapterDeleteFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.ajaxAdapter:delete - always ');
    },

    /**
     * Save record
     *
     * @public
     * @method save
     * @param url
     * @param context
     * @publishes saving-/api/orders-success
     * @publishes saving-/api/orders-error
     * @return void
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