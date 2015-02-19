import Ember from 'ember';
import Adapter from '../adapter';

/**
 * @module adapters
 * @class  localstorage
 */
var LocalStorageAdapter = Adapter.extend({

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
    find: function ( type, id, options, findOne ) {
        var store = this.get( 'store' ),
            model = store.modelFor( type ),
            _this = this,
            url,
            results,
            promise,
            queryObj;

        Ember.assert( 'Type is required', type && Ember.typeOf(type) === 'string' );

        options = options || {};

        url = model.getUrlForEndpointAction( options.endpoint, 'get' );

        Ember.assert( 'A url is required to find a model', url );

        if ( !Ember.isNone( id ) ) {
            options.data    = options.data || {};
            options.data.id = parseInt( id, 10 );
        }

        // Set up the results, either an object or an array proxy w/ promise mixin)
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

            db = _this._getDb();

            records = _this._getRecords( db, url );

            if ( options.data && options.data.id ) {
                response = records.findBy( 'id', options.data.id );
            } else if ( findOne ) {
                // We aren't doing queries based on options at this time,
                // can add here in the future if needed.
                response = records[ 0 ];
            } else {
                response = records;
                if ( ! response.length ) {
                    reject( { textStatus: 'error', errorThrown: 'Not Found' });
                }
            }

            if ( !response ) {
                reject( { textStatus: 'error', errorThrown: 'Not Found' });
            }

            response = model.callSerializerForEndpointAction( options.endpoint, 'get', response, store );

            response = _this.modelize( response );

            if ( results instanceof Ember.ArrayProxy ) {
                finalResult = [];
                Ember.makeArray( response ).forEach( function ( child ) {
                    finalResult.pushObject( store.createRecord( type, child ) );
                }, this );
            } else {
                finalResult = store.createRecord( type, response );
            }

            resolve( finalResult );

        }, 'sl-ember-store.localstorageAdapter:find - Promise' )

        .then( function lsAdapterFindThen( response ) {
            _this.runPostQueryHooks( response );
            return response;
        }, 'sl-ember-store.localstorageAdapter:find - then' );

        //set the promise on the promiseProxy
        results.set( 'promise', promise );

        return results;

    },

    /**
     * Delete record
     *
     * @function deleteRecord
     * @param    {string}  url - The URL to send the DELETE request to
     * @param    {integer} id  - The ID of the record to delete
     * @throws   {Ember.assert}
     * @returns  {Ember.RSVP} Promise
     */
    deleteRecord: function( url, id ) {
        var _this = this,
            promise;

        Ember.assert( 'A url is required to delete a model', url );

        promise = new Ember.RSVP.Promise( function( resolve, reject ) {
            var db,
                records,
                recordIndex,
                exception = {};

            db = _this._getDb();

            records = _this._getRecords( db, url );

            recordIndex = _this._getRecordIndexById( records, id );

            if ( recordIndex >= 0 ) {
                records.splice( recordIndex, 1 );

            } else {
                reject( { textStatus: 'error', errorThrown: 'Not Found' } );
            }

            if ( !_this._dbWrite( db, exception ) ) {
                reject( { textStatus: 'error', errorThrown: exception.msg } );
            }

            resolve();

        })

        .then( function lsAdapterDeleteFinally( response ) {
            _this.runPostQueryHooks( response );
            return response;
        }, 'sl-ember-store.localstorageAdapter:deleteRecord - always' );

        return promise;
    },

    /**
     * Save record
     *
     * @function save
     * @param    {string} url     - The URL to send the POST request to
     * @param    {object} content - The data to save
     * @returns  {Ember.RSVP} Promise
     */
    save: function( url, content ) {
        var _this = this,
            promise;

        Ember.assert( 'A url is required to save a model', url );

        promise = new Ember.RSVP.Promise( function( resolve, reject ) {
            var db,
                records,
                recordIndex,
                exception = {};

            db = _this._getDb();

            records = _this._getRecords( db, url );

            recordIndex = _this._getRecordIndexById( records, content.id );

            if ( recordIndex >= 0 ) {
                records.splice( recordIndex, 1 );
            }

            records.push( content );

            if( ! _this._dbWrite( db, exception ) ) {
                reject( { textStatus: 'error', errorThrown: exception.msg } );
            }

            resolve( content );

        })
        .then( function lsAdapterSaveFinally( response ) {
            _this.runPostQueryHooks( response );
            return response;
        } , 'sl-ember-store.localstorageAdapter:saveRecord - always' );

        return promise;
    },

    /**
     * Return the adapter's namespace
     *
     * @function getNamespace
     * @returns  {string} Namespace
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
     * @returns  {object} localStorage or mockup
     */
    _getLocalStorage: function() {
        return window.localStorage;
    },

    /**
     * Get the DB off of localStorage
     *
     * @private
     * @function _getDb
     * @returns  {object} The database instance data
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
     * @param    {object} db        - The database instance data
     * @param    {object} exception - Passed-on exception data
     * @returns  {boolean} Whether the write operation was successful (true) or not (false)
     */
    _dbWrite: function( db, exception ) {
        try {
            this._getLocalStorage().setItem( this.getNamespace(), JSON.stringify( db ) );
        } catch( domException ) {
            exception.msg = domException.message;
            return false;
        }

        return true;
    },

    /**
     * Return the records for a specific model url
     *
     * @private
     * @function _getRecords
     * @param    {object} db  - The object to find the records on
     * @param    {string} url - The key
     * @returns  {array} Records for the specified URL
     */
    _getRecords: function( db, url ) {
        var modelKey = this._normalizeUrl( url ),
            records  = db[ modelKey ];

        if ( !records ) {
            records = db[ modelKey ] = [];
        }

        return records;
    },

    /**
     * Return the record index for the specified ID
     *
     * @private
     * @function _getRecordIndexById
     * @param    {Array}   records - Array to search
     * @param    {integer} id      - ID to search for
     * @returns  {integer} -1 if not found
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
     * @private
     * @function _normalizeUrl
     * @param    {string} url - The URL string to normalize
     * @returns  {string} Normalized url
     */
    _normalizeUrl: function( url ) {
        return url.replace( /^\//, '' ).replace( '\/', '_' );
    }
});

LocalStorageAdapter.reopenClass({
    namespace: 'sl-ember-store'
});

export default LocalStorageAdapter;
