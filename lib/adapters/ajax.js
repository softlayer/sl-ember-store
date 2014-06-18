import Adapter from '../adapter';
module icAjax from 'ic-ajax';

export default Adapter.extend({


    /**
     * _find protected method
     * @param  {int}    id      record id
     * @param  {object} options hash of options
     * @param  {bool} findOne force return of single recrord
     * @return { ObjectProxy | ArrayProxy } The record or array of records requested
     */
    __find: function ( model, id, options, findOne ){

        var url = model.url,
            cacheKey,
            cachedModel,
            results,
            cachedRequest,
            promise;

        Ember.assert('A url is required to find a model', url);

        options = options || {};

        if ( 'object' === typeof id  && null !== id ) {
            options = id;
        } else if ( undefined !== id ) {
            options.data    = options.data || {};
            options.data.id = parseInt( id, 10 );
        }

        // Clear previously-cached data
        if ( options.reload ) {
            this.removeFromCache( url, options.data );
        }

        //get cached model, if any
        cacheKey = this.generateCacheKey( url, options.data );
        cachedModel = this.cache[cacheKey];
        
        //check to see if there is an outstanding cachedRequest
        cachedRequest = this.requestCache[cacheKey];

        //set up the results, either an object or an array proxy w/ promise mixin
        results     = ( ( options.data && options.data.id  ) || findOne ) ?
            Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin ) :
            Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin );


        //return the cachedModel if possible
        if ( !options.reload && cachedModel ) {

            results.set( 'promise', new Promise( function( resolve ){
                    resolve( cachedModel );
                }) 
            );
   
            return results;
        }

        // Responding with in flight promise if possible
        if ( cachedRequest ) {
            results.set( 'promise', cachedRequest );
            return results;
        }
 
        promise = icAjax.request({
            dataType : 'json',
            url      : url,
            data     : options.data,
            context  : this
        }).then(
            function ( response ) {
                var tmpResult;

                //run the modelize mixin to map keys to models
                response = this.modelize( response );

                if ( results instanceof Ember.ArrayProxy ) {
                    tmpResult = Ember.A([]);

                    //make each entry a model
                    Ember.makeArray( response ).forEach( function ( child ) {
                        tmpResult.pushObject( model.create( child ) );
                    }, this );

                } else {
                    //put the response in the model
                    tmpResult = model.create( response );
                }

                // Cache the results
                this.addToCache( url, options.data, tmpResult );

                return tmpResult;

            }.bind( this ) , null, 'sl-model: then process ic-ajax request'
        )

        .catch( function( results ) {
            var errorData = {
                'statusCode' : jqxhr.status,
                'statusText' : jqxhr.statusText,
                'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable"
            };

            return errorData;

        }.bind( this ), 'sl-model: catch ic-ajax request error' )

        .finally( function( results ) {
            // Clearing request cache since it is no longer in flight
            this.removeFromRequestCache( url, options.data );

            //run post query hooks
            this.runPostQueryHooks( results );

        }.bind( this ), 'sl-model: finally process ic-ajax request');

        //set the promise on the promiseProxy
        results.set( 'promise', promise );

        // Preset the id, if one was used for the find, to support things like serialize on the route
        // ! disabled for now due to conflict with objectProxy/PromiseProxyMixin
        // if ( options.data && options.data.id ) {
        //     results.set( 'id', options.data.id );
        // }

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

        return $.ajax({
            url  : url,
            type : 'DELETE',
            data : JSON.stringify({ id: context.get( 'id' ) }),
            context: this
        })
        .always( function( jqxhr ) {
            this.runPostQueryHooks( jqxhr.status );
        });
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
     save: function( url, context ) {
        Ember.assert('A url property is required to save a model', url);

        return $.ajax({
            url  : url,
            type : 'POST',
            data : JSON.stringify( context ),
            context : this
        })
        .done( function ( response ) {
            defer.resolve( response );
        })
        .fail( function( jqxhr, textStatus, error ) {
            var errorData = {
                'statusCode' : jqxhr.status,
                'statusText' : jqxhr.statusText,
                'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable",
                'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || "Service Unavailable"
            };

            defer.reject( errorData );
        })
        .always( function( jqxhr ) {
            this.runPostQueryHooks( jqxhr.status );
        });

     }
});