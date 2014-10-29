import Ember from 'ember';

/** @module SL-Model/cache */
export default Ember.Object.extend({

    /*
     * The record cache
     *
     * @private
     * @property {object} _records
     * @type     {Ember.Object}
     * @default  null
     */
    _records: null,

    /*
     * The promise cache
     *
     * @private
     * @property {object} _promises
     * @type     {Ember.Object}
     * @default  null
     */
    _promises: null,

    /**
     * Initialize the cache properties
     *
     * @private
     * @function _setupCache
     * @observes 'init'
     * @return {void}
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
     * @argument {string}  type
     * @argument {integer} id
     * @argument {boolean} findOne
     * @return   {Ember.Object}
     */
    isCached: function( type, id, findOne ) {
        if ( id ) {
            return !!this.fetchById( type, id );
        }

        if ( findOne ) {
            return !!this.fetchOne( type );
        }

        return !!( this._getAllPromise( type ) || this._getAllRecords( type ).all );
    },

    /**
     * Returns a record or array of records wrapped in a promise.
     *
     * If there are in-flight promises then those will be returned instead.
     *
     * @function fetch
     * @argument {string}  type
     * @argument {integer} id
     * @argument {boolean} findOne
     * @return {Object|Array via Ember.Promise}
     */
    fetch: function( type, id, findOne ) {
        if ( id ) {
            return  this.fetchById( type, id );
        }

        if ( findOne ) {
            return this.fetchOne( type );
        }

        return this.fetchAll( type );
    },

    /**
     * Returns a record wrapped in a promise.
     *
     * If there is an in-flight promise then it will be returned instead.
     *
     * @function fetchOne
     * @argument {string} type
     * @return {Ember.Promise|false}
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
     * @argument {string}  type
     * @argument {integer} id
     * @return {Ember.Promise|false}
     */
    fetchById: function( type, id ) {
        var promise = this._getPromiseById( type, id ),
            record;

        if ( promise ) {
            return promise;
        }

        record = this._getRecordById( type, id );

        if ( ! record ) {
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
     * @function fetchAll
     * @argument {string}  type
     * @return {Ember.Array via Ember.Promise|false}
     */
    fetchAll: function( type ) {
        var findAllPromise = this._getAllPromise( type ),
            records;

        if ( findAllPromise ) {
            return findAllPromise;
        }

        records = this._getAllRecords( type );

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
     * @argument {string}     type
     * @argument {integer}    id
     * @argument {boolean}    findOne
     * @argument {Ember.RSVP} result
     * @return {Object|Array via Ember.Promise}
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

        return this.addAllPromise( type, result );
    },

    /**
     * Adds a promise that will resolve to a single record
     *
     * @function addPromise
     * @argument {string}     type
     * @argument {integer}    id
     * @argument {Ember.RSVP} promise
     * @return   {Object} ObjectProxy|PromiseProxyMixin
     */
    addPromise: function( type, id, promise ) {
        this._getPromises( type ).set( 'ids.'+ id, promise );

        promise.then( function( record ) {
            this.addRecord( type, record );
            delete this._getPromises( type ).get( 'ids' )[ id ];
        }.bind(this))
        .catch( function(){
            delete this._getPromises( type ).get( 'ids' )[ id ];
        }.bind(this));

        return promise;
    },

    /**
     * Adds a `find all` promise that will resolve to an array of records
     *
     * @function addAllPromise
     * @argument {string}     type
     * @argument {Ember.RSVP} promise
     * @return {Array} ArrayProxy|PromiseProxyMixin
     */
    addAllPromise: function( type, promise ) {
        this._getPromises( type ).set( 'all', promise );

        promise.then( function( records ) {
            this.addRecords( type, records );
            this._getPromises( type ).set( 'all', undefined );
        }.bind(this))
        .catch( function(){
            this._getPromises( type ).set( 'all', undefined );
        }.bind(this));

        return promise;
    },

    /**
     * Add record to cache
     *
     * @function addRecord
     * @argument {string} type
     * @argument {Ember.Object} record
     * @return {void}
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
     * @argument {string} type
     * @argument {array}  records
     * @return   {void}
     */
    addRecords: function( type, records ) {
        records.map( function( record ) {
            this.addRecord( type, record );
        }.bind(this));
    },

    addAllRecords: function( type, records ) {
        this.addRecords( type, records );
        this._getRecords( type ).set( 'all', true );
    },

    /**
     * Remove record from cache
     *
     * @function removeRecord
     * @argument {string} type
     * @argument {Ember.Object} record
     * @return   {void}
     */
    removeRecord: function( type, record ) {
        var typeRecords = this._getRecords( type ),
            id          = record.get( 'id' ) || 0,
            idx         = typeRecords.records.indexOf( record );

        if ( typeRecords ) {
            delete typeRecords.ids[ id ];
            typeRecords.records = typeRecords.records.splice( idx, 1 );
        }
    },

    /**
     * Remove multiple records
     *
     * @function removeRecords
     * @argument {string} type
     * @argument {array}  records
     * @return   {void}
     */
    removeRecords: function( type, records ) {
        records.map( function( record ) {
            this.removeRecord( type, record );
        }.bind(this));
    },

    /**
     * Clear the cache
     *
     * @function clearCache
     * @argument {string} type
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
     * @argument {string} type
     * @return {void}
     */
    _initializeRecords: function( type ) {
        this.set( '_records.'+type, Ember.Object.create({
            all     : false,
            records : Ember.A([]),
            ids     : Ember.Object.create()
        }));
    },

    /**
     * Return the record cache
     *
     * @private
     * @function _getRecords
     * @argument {string} type
     * @return   {Ember.Object}
     */
    _getRecords: function( type ) {
        var typeRecords = this.get( '_records.'+type );

        if ( !typeRecords ) {
            this._initializeRecords( type );
            typeRecords = this.get( '_records.'+type );
        }

        return typeRecords;
    },

    /**
     * Return record for specified ID
     *
     * @private
     * @function _getRecordById
     * @argument {string} type
     * @argument {integer} id
     * @return   {Ember.Object}
     */
    _getRecordById: function( type, id ) {
        return this._getRecords( type ).ids[ id ];
    },

    /**
     * Get all records
     *
     * @private
     * @function _getAllRecords
     * @argument {string} type
     * @return   {Ember.Object}
     */
    _getAllRecords: function( type ) {
        return this._getRecords( type ).records;
    },

    /**
     * Initialize entry in promises cache
     *
     * @private
     * @function _initializePromises
     * @argument {string} type
     * @return   {void}
     */
    _initializePromises: function( type ) {
        this.set( '_promises.'+type, Ember.Object.create({
            all : null,
            ids : Ember.Object.create()
        }));
    },

    /**
     * Return the promise cache
     *
     * @private
     * @function _getPromises
     * @argument {string} type
     * @return   {Ember.Object}
     */
    _getPromises: function( type ) {
        var typePromises = this.get( '_promises.'+type );

        if ( !typePromises ) {
            this._initializePromises( type );
            typePromises = this.get( '_promises.'+type );
        }

        return typePromises;
    },

    /**
     * Return promise for specified ID
     *
     * @private
     * @function _getPromiseById
     * @argument {string}  type
     * @argument {integer} id
     * @return   {Ember.Object}
     */
    _getPromiseById: function( type, id ) {
        return this.get( '_promises.'+type+'.ids.'+id );
    },

    /**
     * Get all promises
     *
     * @private
     * @function getAllPromise
     * @argument {string} type
     * @return   {Ember.Object}
     */
    _getAllPromise: function( type ) {
        return this.get( '_promises.'+type+'.all');
    }
});
