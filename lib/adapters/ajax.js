"use strict";

import Adapter from '../adapter';

export default Adapter.extend({


    /**
     * _find protected method
     * @param  {int}    id      record id
     * @param  {object} options hash of options
     * @param  {bool} findOne force return of single recrord
     * @return { ObjectProxy | ArrayProxy } The record or array of records requested
     */
    __find: function ( url, id, options, findOne ){

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

        // Return previously-retrieved data if exist
        var cacheKey = this.generateCacheKey( url, options.data ),
            cachedModel = this.cache[cacheKey];

        if ( !options.reload && cachedModel ) {
            Ember.run.once( this, function() {
                cachedModel.trigger( 'isLoaded' );
            });
            return cachedModel;
        }

        var results     = ( ( options.data && options.data.id  ) || findOne ) ?
            Ember.ObjectProxy.createWithMixins( Ember.Evented, { content: null } ) :
            Ember.ArrayProxy.createWithMixins( Ember.Evented, { content: Em.A([]) } ),
            _parameters = options.data,
            topic       = Ember.String.dasherize( this.toString().replace( 'SF.', '' ) );


        var cachedRequest = this.requestCache[cacheKey];
        if ( cachedRequest ) {
            // Responding with in flight promise
            return cachedRequest;
        }

        $.ajax({
            dataType : 'json',
            url      : url,
            data     : options.data,
            context  : this

        }).done(
            function ( response ) {
                response = this.emberizeResponse( response );
                if ( results instanceof Ember.ArrayProxy ) {
                    Ember.makeArray( response ).forEach( function ( child ) {
                        results.pushObject( this.create( child ) );
                    }, this );

                } else {
                    results.set( 'content', this.create( response ) );
                }

                // Cache the results
                this.addToCache( url, _parameters, results );

                SF.MessageBus.push( 'finding-' + topic + '-success', response );
                results.set( 'isLoaded', true );
                results.trigger( 'isLoaded' );
            }
        )

        .fail( function( jqxhr, textStatus, error ) {
            var errorData = {
                'statusCode' : jqxhr.status,
                'statusText' : jqxhr.statusText,
                'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable"
            };

            results.error = errorData;
            SF.MessageBus.push( 'finding-' + topic + '-error', errorData );
            results.set( 'isError', true );
            results.trigger( 'isError', errorData );
        })

        .always( function( jqxhr ) {
            // Clearing request cache since it is no longer in flight
            delete this.requestCache[cacheKey];

            if( 401 === jqxhr.status ){
                this.__forceLogout();

            } else if ( 401 != jqxhr.status ) {
                SF.MessageBus.push( 'session-keep-alive' );
            }
        });

        // Preset the id, if one was used for the find, to support things like serialize on the route
        if ( options.data && options.data.id ) {
            results.set( 'id', options.data.id );
        }

        // Cache request object.  Other GET requests for the same URL will receive this
        // response promise while the request remains in flight.  This will prevent us
        // from having multiple simultaneous requests for the same endpoint in flight
        // at the same time
        this.requestCache[cacheKey] = results;
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
    destroy: function( url, context ) {

        Ember.assert('A url is required to destroy a model', url);

        return $.ajax({
            url  : url,
            type : 'DELETE',
            data : JSON.stringify({ id: context.get( 'id' ) }),
            context: this
        })
        .always( function( jqxhr ) {
            if( 401 === jqxhr.status ){
                this.__forceLogout();

            } else if ( 401 != jqxhr.status ) {
                SF.MessageBus.push( 'session-keep-alive' );

            }
        });
    },

    /**
     * Save record
     *
     * @public
     * @method save
     * @param {SF.Model}
     * @publishes saving-/api/orders-success
     * @publishes saving-/api/orders-error
     * @return void
     */
     save: function( url, context ) {
        Ember.assert('A url property is required to save a model', url);

        var defer  = Ember.Deferred.create(),
            action = ( context.action ) ? '-' + context.action : '',
            topic  = Ember.String.dasherize( this.toString().replace( 'SF.', '' ) ) + action;

        $.ajax({
            url  : url,
            type : 'POST',
            data : JSON.stringify( context ),
            context : this
        })
        .done( function ( response ) {
            SF.MessageBus.push( 'saving-' + topic + '-success', response );
            defer.resolve( response );
        })
        .fail( function( jqxhr, textStatus, error ) {
            var errorData = {
                'statusCode' : jqxhr.status,
                'statusText' : jqxhr.statusText,
                'message'    : jqxhr.responseJSON && jqxhr.responseJSON.error || "Service Unavailable",
                'details'    : jqxhr.responseJSON && jqxhr.responseJSON.details || "Service Unavailable"
            };

            SF.MessageBus.push( 'saving-' + topic + '-error', errorData );
            defer.reject( errorData );
        })
        .always( function( jqxhr ) {
            if( 401 === jqxhr.status ){
                this.__forceLogout();

            } else if ( 401 != jqxhr.status ) {
                SF.MessageBus.push( 'session-keep-alive' );
            }
        });

        return defer;
     }
});