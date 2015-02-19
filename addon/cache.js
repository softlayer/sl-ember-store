import Ember from 'ember';

/**
 * @class cache
 */
export default Ember.Object.extend({

    /*
     * The record cache
     *
     * @private
     * @property {Ember.Object} _records
     * @default  null
     */
    _records: null,

    /*
     * The promise cache
     *
     * @private
     * @property {Ember.Object} _promises
     * @default  null
     */
    _promises: null,

    /**
     * Initialize the cache properties
     *
     * @private
     * @function _setupCache
     * @observes "init" event
     * @returns  {void}
     */
    _setupCache: function() {
        this.setProperties({
            '_records'  : Ember.Object.create(),
            '_promises' : Ember.Object.create()
        });
    }.on( 'init' ),

    /**
     * Checks both caches to see if a record exists
     *
     * @function isCached
     * @param    {string}  type    - The model type of the record to check
     * @param    {integer} id      - The record ID to check for cached status
     * @param    {boolean} findOne - Whether to check a single record (true)
     * @returns  {boolean} Whether the record is cached (true) or not (false)
     */
    isCached: function( type, id, findOne ) {
        if ( id ) {
            return !!this.fetchById( type, id );
        }

        if ( findOne ) {
            return !!this.fetchOne( type );
        }

        return !!( this._getManyPromise( type ) || this._getManyRecordsCached( type ) );
    },

    /**
     * Returns a record or array of records wrapped in a promise.
     *
     * If there are in-flight promises then those will be returned instead.
     *
     * @function fetch
     * @param    {string}  type
     * @param    {integer} id
     * @param    {boolean} findOne
     * @returns  {Ember.Object|Ember.Array}
     */
    fetch: function( type, id, findOne ) {
        if ( id ) {
            return  this.fetchById( type, id );
        }

        if ( findOne ) {
            return this.fetchOne( type );
        }

        return this.fetchMany( type );
    },

    /**
     * Returns a record wrapped in a promise.
     *
     * If there is an in-flight promise then it will be returned instead.
     *
     * @function fetchOne
     * @param    {string} type
     * @returns  {Ember.Promise|false}
     */
    fetchOne: function( type ) {
        var promise = this._getPromises( type ).get( 'ids.0' ),
            record;

        if ( promise ) {
            return promise;
        }

        record = this._getRecords( type ).get( 'records.0' );

        if ( !record ) {
            return false;
        }

        return Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', Ember.RSVP.Promise.resolve( record ) );
    },

    /**
     * Return an object promise for this single record
     *
     * If there is an in-flight promise for this record that will be returned instead
     *
     * @function fetchById
     * @param    {string}  type
     * @param    {integer} id
     * @returns  {Ember.Promise|false}
     */
    fetchById: function( type, id ) {
        var promise = this._getPromiseById( type, id ),
            record;

        if ( promise ) {
            return promise;
        }

        record = this._getRecordById( type, id );

        if ( !record ) {
            return false;
        }

        return Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', Ember.RSVP.Promise.resolve( record ) );
    },

    /**
     * Return an array promise with all the records for this type
     *
     * If there is an in-flight array promise then that will be returned instead.
     *
     * @function fetchMany
     * @param    {string} type
     * @returns  {Ember.Array|false}
     */
    fetchMany: function( type ) {
        var findManyPromise = this._getManyPromise( type ),
            records;

        if ( findManyPromise ) {
            return findManyPromise;
        }

        records = this._getRecords( type ).records;

        if ( !records.length ) {
            return false;
        }

        return Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', Ember.RSVP.Promise.resolve( records ) );
    },

    /**
     * Standard entry point for the store to add things to the cache
     *
     * @function addToCache
     * @param    {string}     type
     * @param    {integer}    id
     * @param    {boolean}    findOne
     * @param    {Ember.RSVP} result
     * @returns  {Ember.Object|Ember.Array}
     */
    addToCache: function( type, id, findOne, result ) {

        if ( id || findOne ) {
            id = id || 0;

            if ( result.then ) {
                return this.addPromise( type, id, result );
            } else {
                return this.addRecord( type, result );
            }
        }

        if ( result.then ) {
            return this.addManyPromise( type, result );
        } else {
            return this.addManyRecords( type, result );
        }
    },

    /**
     * Adds a promise that will resolve to a single record
     *
     * @function addPromise
     * @param    {string}     type
     * @param    {integer}    id
     * @param    {Ember.RSVP} promise
     * @returns  {Ember.Object} ObjectProxy or PromiseProxyMixin
     */
    addPromise: function( type, id, promise ) {
        var _self = this;

        this._getPromises( type ).set( 'ids.' + id, promise );

        promise.then( function( record ) {
            _self.addRecord( type, record );
            delete _self._getPromises( type ).get( 'ids' )[ id ];
        })
        .catch( function() {
            delete _self._getPromises( type ).get( 'ids' )[ id ];
        });

        return promise;
    },

    /**
     * Adds a `find all` promise that will resolve to an array of records
     *
     * @function addManyPromise
     * @param    {string}     type
     * @param    {Ember.RSVP} promise
     * @returns  {Ember.Array} ArrayProxy or PromiseProxyMixin
     */
    addManyPromise: function( type, promise ) {
        var _self = this;

        this._getPromises( type ).get( 'many' ).addObject( promise );

        promise.then( function( records ) {
            _self.addManyRecords( type, records );
            _self._getPromises( type ).get( 'many' ).removeObject( promise );
        })
        .catch( function() {
            _self._getPromises( type ).get( 'many' ).removeObject( promise );
        });

        return promise;
    },

    /**
     * Add record to cache
     *
     * @function addRecord
     * @param    {string} type
     * @param    {Ember.Object} record
     * @returns  {void}
     */
    addRecord: function( type, record ) {
        var typeRecords = this._getRecords( type ),
            id          = record.get( 'id' ) || 0,
            oldRecord   = typeRecords.ids[ id ];

        if ( oldRecord ) {
            this.removeRecord( type, oldRecord );
        }

        typeRecords.ids[ id ] = record;
        typeRecords.records.push( record );
    },

    /**
     * Add multiple records to cache
     *
     * @function addRecords
     * @param    {string} type
     * @param    {array}  records
     * @returns  {void}
     */
    addRecords: function( type, records ) {
        var _self = this;

        records.forEach( function( record ) {
            _self.addRecord( type, record );
        });
    },

    /**
     * add all records for a type
     *
     * @function addManyRecords
     * @param    {string} type    - Type of model
     * @param    {array}  records - Array of model records
     * @returns  {void}
     */
    addManyRecords: function( type, records ) {
        this.addRecords( type, records );
        this._getRecords( type ).set( 'all', true );
    },

    /**
     * Remove record from cache
     *
     * @function removeRecord
     * @param    {string}       type
     * @param    {Ember.Object} record
     * @returns  {void}
     */
    removeRecord: function( type, record ) {
        var typeRecords = this._getRecords( type ),
            id          = record.get( 'id' ) || 0,
            idx         = typeRecords.records.indexOf( record );

        if ( typeRecords ) {
            delete typeRecords.ids[ id ];
            typeRecords.records.splice( idx, 1 );
        }
    },

    /**
     * Remove multiple records
     *
     * @function removeRecords
     * @param    {string} type
     * @param    {array}  records
     * @returns  {void}
     */
    removeRecords: function( type, records ) {
        var _self = this;

        records.map( function( record ) {
            _self.removeRecord( type, record );
        });
    },

    /**
     * Clear the cache
     *
     * @function clearCache
     * @param    {string} type
     * @returns  {void}
     */
    clearCache: function( type ) {
        this._initializeRecords( type );
        this._initializePromises( type );
    },

    /**
     * Initialize entry in records cache
     *
     * @private
     * @function _initializeRecords
     * @param    {string} type
     * @returns  {void}
     */
    _initializeRecords: function( type ) {
        this.set( '_records.'+type, Ember.Object.create({
            all     : false,
            records : [],
            ids     : Ember.Object.create()
        }));
    },

    /**
     * Return the record cache
     *
     * @private
     * @function _getRecords
     * @param    {string} type
     * @returns  {Ember.Object}
     */
    _getRecords: function( type ) {
        var typeRecords = this.get( '_records.' + type );

        if ( !typeRecords ) {
            this._initializeRecords( type );
            typeRecords = this.get( '_records.' + type );
        }

        return typeRecords;
    },

    /**
     * Return record for specified ID
     *
     * @private
     * @function _getRecordById
     * @param    {string} type
     * @param    {integer} id
     * @returns  {Ember.Object}
     */
    _getRecordById: function( type, id ) {
        return this._getRecords( type ).ids[ id ];
    },

    /**
     * Get all records
     *
     * @private
     * @function _getManyRecordsCached
     * @param    {string} type
     * @returns  {Ember.Object}
     */
    _getManyRecordsCached: function( type ) {
        return this._getRecords( type ).all;
    },

    /**
     * Initialize entry in promises cache
     *
     * @private
     * @function _initializePromises
     * @param    {string} type
     * @returns  {void}
     */
    _initializePromises: function( type ) {
        this.set( '_promises.' + type, Ember.Object.create({
            many : Ember.ArrayProxy.create( { content: [] } ),
            ids : Ember.Object.create()
        }));
    },

    /**
     * Return the promise cache
     *
     * @private
     * @function _getPromises
     * @param    {string} type
     * @returns  {Ember.Object}
     */
    _getPromises: function( type ) {
        var typePromises = this.get( '_promises.' + type );

        if ( !typePromises ) {
            this._initializePromises( type );
            typePromises = this.get( '_promises.' + type );
        }

        return typePromises;
    },

    /**
     * Return promise for specified ID
     *
     * @private
     * @function _getPromiseById
     * @param    {string}  type
     * @param    {integer} id
     * @returns  {Promise}
     */
    _getPromiseById: function( type, id ) {
        return this.get( '_promises.' + type + '.ids.' + id );
    },

    /**
     * Get all promises
     *
     * @private
     * @function getManyPromise
     * @param    {string} type
     * @returns  {Promise}
     */
    _getManyPromise: function( type ) {
        var promises = this.get( '_promises.' + type + '.many' );

        if( promises && promises.get( 'length' ) ){
            return Ember.RSVP.allSettled( promises.get( 'content' ) ).then(
                function( results ){
                    var records = [];
                    results.forEach( function( result ){
                        if( result.state === 'fulfilled' ){
                            records = records.concat( result.value );
                        }
                    });
                    return records;
                }
            );
        }

        return undefined;
    }

});
