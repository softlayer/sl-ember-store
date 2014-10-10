import Ember from 'ember';
import Adapter from '../adapter';

/** @module SL-Model/adapters/localstorage */
var LocalStorageAdapter = Adapter.extend({

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
            id: id
        };

        this.runPreQueryHooks( queryObj );

        promise = new Ember.RSVP.Promise( function( resolve, reject) {
            var db,
                records,
                response,
                finalResult;

            db = this._getDb();

            records = this._getRecords( db, url );

            if ( options.data && options.data.id ) {
                response = records.findBy( 'id', options.data.id );
            }
            else if ( findOne ) {
                // we aren't doing queries based on options at this time,
                // can add here in the future if needed.
                response = records[0];
            }
            else {
                response = records;
                if ( ! response.length ) {
                    reject();
                }
            }

            if ( !response ) {
                reject();
            }

            response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, store );

            response = this.modelize( response );

            if ( results instanceof Ember.ArrayProxy ) {
                finalResult = Ember.A([]);
                Ember.makeArray( response ).forEach( function ( child ) {
                    finalResult.pushObject( store.createRecord( type, child ) );
                }, this );
            }else{
                finalResult = store.createRecord( type, response );
            }

            resolve( finalResult );

        }.bind( this ), 'sl-model.localstorageAdapter:find - Promise' );

        promise.finally( function lsAdapaterFindFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ), 'sl-model.localstorageAdapter:find - finally');

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
        var promise;

        Ember.assert( 'A url is required to delete a model', url );

        promise = new Ember.RSVP.Promise( function( resolve, reject ) {
            var db,
                records,
                errorData,
                recordIndex;

            db = this._getDb();

            records = this._getRecords( db, url );

            recordIndex = this._getRecordIndexById( records, id );

            if ( recordIndex >= 0 ) {
                records.splice( recordIndex, 1 );

            } else {
                errorData = {
                    statusCode : 404,
                    statusText : 'id: '+id+' not found at '+url,
                    message    : 'The record with id: `'+id+'` was not found at url:'+url
                };
                reject( errorData );
            }

            this._dbWrite( db );

            resolve();

        }.bind( this ));

        promise.finally( function lsAdapterDeleteFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.localstorageAdapter:deleteRecord - always' );

        return promise;
    },

    /**
     * Save record
     *
     * @public
     * @function save
     * @argument {string} url  the url to send the POST command to
     * @argument {object} content  data to save
     * @return {Ember.RSVP} Promise
     */
    save: function( url, content ) {
        var promise;

        Ember.assert( 'A url is required to save a model', url );

        promise = new Ember.RSVP.Promise( function( resolve ) {
            var db,
                records,
                recordIndex;

            db = this._getDb();

            records = this._getRecords( db, url );

            recordIndex = this._getRecordIndexById( records, content.id );

            if ( recordIndex >= 0 ) {
                records.splice( recordIndex, 1 );
            }

            records.push( content );

            this._dbWrite( db );

            resolve( content );

        }.bind( this ));

        promise.finally( function lsAdapterSaveFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.localstorageAdapter:saveRecord - always' );

        return promise;
    },

    /**
     * Return the adapter's namespace
     *
     * @function getNamespace
     * @return {string} namespace
     */
    getNamespace: function() {
        return this.constructor.namespace;
    },

    /**
     * Return localStorage object
     *
     * Useful for testing
     *
     * @private
     * @function _getLocalStorage
     * @return {object} localStorage or mockup
     */
    _getLocalStorage: function() {
        return window.localStorage;
    },

    /**
     * Get the DB off of localStorage
     *
     * @private
     * @function _getDb
     * @return {object}
     */
    _getDb: function() {
        var lsDb = this._getLocalStorage().getItem( this.getNamespace() );
        if ( lsDb ) {
            return JSON.parse( lsDb );
        }

        return {};
    },

    /**
     * Write the DB to localStorage
     *
     * @private
     * @function _dbWrite
     * @argument {object} db
     * @return {void}
     */
    _dbWrite: function( db ) {
        this._getLocalStorage().setItem( this.getNamespace(), JSON.stringify( db ) );
    },

    /**
     * Return the records for a specific model url
     *
     * @function _getRecords
     * @argument {object} db the object to find the records on
     * @argument {string} url the key
     * @return {array} records
     */
    _getRecords: function( db, url ) {
        var modelKey = this._normalizeUrl( url ),
            records  = db[ modelKey ];

        if ( !records ) {
            records = db[ modelKey ] = Ember.A([]);
        }

        return records;
    },

    /**
     * Return the record index for the specified ID
     *
     * @function _getRecordIndexById
     * @argument {Array}   records  array to search
     * @argument {integer} id       id to search for
     * @return {integer}   -1 if not found
     */
    _getRecordIndexById: function( records, id ) {
        var recordIndex = -1;

        if ( Array.isArray( records ) ) {
            records.forEach( function( item, index ) {
                if ( item.id === id ) {
                    recordIndex = index;
                }
            });
        }

        return recordIndex;
    },

    /**
     * Normalize a url for use as a key
     *
     * @function _normalizeUrl
     * @argument {string}  url
     * @return {string}    normalized url
     */
    _normalizeUrl: function( url ) {
        return url.replace( /^\//, '' ).replace( '\/', '_' );
    }
});

LocalStorageAdapter.reopenClass({
    namespace: 'sl-model'
});

export default LocalStorageAdapter;
