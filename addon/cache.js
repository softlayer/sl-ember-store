import Ember from 'ember';

/**
 * SL-Model/cache
 *
 *
 * @class cache
 */
export default Ember.Object.extend({
    
    /*
     * holds the record cache
     * @member object _records
     * @access private
     */    
    _records: null,
    
    /*
     * holds the promise cache
     * @member object _promises
     * @access private
     */
    _promises: null,

    
    /**
     * _setupCache
     * @access private
     *
     */
    _setupCache: function(){
        this.setProperties( {
            '_records': Ember.Object.create(),
            '_promises': Ember.Object.create()
        } );
    }.on( 'init' ),

    /**
     * _initializeRecords
     *
     * @access private
     * @param {String} type 
     */
    _initializeRecords: function( type ){

        this.set( '_records.'+type, Ember.Object.create({
            records: Ember.A([]),
            ids: Ember.A([])
        }));
    },

    /**
     * _getRecords returns the record cache
     *
     * @access private
     * @param {String} type 
     * @return {Object}
     */
    _getRecords: function( type ){
        var typeRecords = this.get( '_records.'+type );
        
        if( ! typeRecords ){
            this._initializeRecords( type );
            typeRecords = this.get( '_records.'+type );
        }

        return typeRecords;
    },

    /**
     * _getRecordById gets a record by id
     *
     * @access private
     * @param type
     * @param id 
     * @return {Object}
     */
    _getRecordById: function( type, id ){
        return this._getRecords( type ).ids[ id ];
    },

    /**
     * _getAllRecords gets all records
     *
     * @access private
     * @param type 
     * @return {Object}
     */
    _getAllRecords: function( type ){
        return this._getRecords( type ).records;
    },
    
    /**
     * _initializePromises 
     *
     * @access private
     * @param type 
     * @return {Object}
     */
    _initializePromises: function( type ){
        this.set( '_promises.'+type, Ember.Object.create({
            all: null,
            ids: Ember.A([])
        }));
    },

    /**
     * _getPromises
     *
     * @access private
     * @param type 
     * @return {Object}
     */
    _getPromises: function( type ){
        var typePromises = this.get( '_promises.'+type );
        
        if( ! typePromises ){
            this._initializePromises( type );
            typePromises = this.get( '_promises.'+type );
        }
        
        return typePromises;
    },

    /**
     * _getPromiseById
     *
     * @access private
     * @param type
     * @param id 
     * @return {Object}
     */
    _getPromiseById: function( type, id ){
        return this.get( '_promise.'+type+'.ids.'+id );
    },

    /**
     * _getAllPromise
     *
     * @access private
     * @param type 
     * @return {Object}
     */
    _getAllPromise: function( type ){
        return this.get( '_promises.'+type+'.all');
    },

    /**
     * isCached checks both caches to see if a record exists
     *
     * @param type
     * @param id
     * @param findOne 
     * @return {Object}
     */
    isCached: function( type, id, findOne ){

        if( id ){
            return !!this.fetchById( type, id );
        }
        
        if( findOne ){
            return !!this.fetchOne( type );
        }

        return !!( this._getAllPromise( type ) || this._getAllRecords( type ).length );
    },

    /**
     * fetch returns a record or array of records wrapped in a promise. 
     * If there are inflight promises then those will be returned instead.
     *
     * @param type
     * @param id
     * @param findOne 
     * @return {Object|Array}
     */
    fetch: function( type, id, findOne ){
 
        if( id ){
            return  this.fetchById( type, id );
        }

        if( findOne ){
            return this.fetchOne( type );
        }

        return this.fetchAll( type );
    },

    fetchOne: function( type ){
        var self = this,
            record,
            promise = this._getPromises( type ).get( 'ids.0' );

        if( promise ){
            return promise;
        }

        record = this._getRecords( type ).get( 'records.0' );

        if( ! record ){
            return false;
        }
        
        return Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', new Ember.RSVP.Promise( function( resolve, reject ){
                resolve( record );
            }));

    },

    /**
     * fetchById will return an object promise for this single record
     * If there is an inflight promise for this record that will be returned instead
     *
     * @param type
     * @param id 
     * @return {Object}
     */
    fetchById: function( type, id ) {
        var self = this,
            record,
            promise = this._getPromiseById( type, id );

        if( promise ){
            return promise;
        }

        record = this._getRecordById( type, id );

        if( ! record ){
            return false;
        }

        return Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', new Ember.RSVP.Promise( function( resolve, reject ){
                resolve( record );
            }));
    },
    
    /**
     * fetchAll will return an array promise with all the records for this type
     * If there is an inflight array promise then that will be returned instead.
     *
     * @param type 
     * @return {Array}
     */
    fetchAll: function( type ) {
        var self = this,
            records,
            findAllPromise = this._getAllPromise( type );

        if( findAllPromise ){
            return findAllPromise;
        }

        records = self._getAllRecords( type );

        if( ! records ){
            return false;
        }

        return Ember.ArrayProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', new Ember.RSVP.Promise( function( resolve, reject){
                resolve( records );
            }));
    },

    /**
     * addToCache is the standard entry point for the store to add things to the cache
     *
     * @param type
     * @param id
     * @param findOne
     * @param result 
     * @return {Object|Array}
     */
    addToCache: function( type, id, findOne, result ){

        if( id || findOne ){
            
            id = id || 0;

            if( result.then ){
                return this.addPromise( type, id, result );
            } else {
                return this.addRecord( type, result );
            }
        }
        
        return this.addAllPromise( type, result );
    },

    /**
     * addPromise adds a promise that will resolve to a single record
     *
     * @param type
     * @param id
     * @param promise 
     * @return {Object} ObjectProxy|PromiseProxyMixin
     */
    addPromise: function( type, id, promise ){
        var self = this;

        this._getPromises( type ).set( 'ids.'+ id, promise );

        promise.then( function( record ){
            self.addRecord( type, record );
            delete self._getPromises( type ).get( 'ids' )[ id ];
        });

        return promise;
    },

    /**
     * addAllPromise adds a `find all` promise that will resolve to an array of records
     *
     * @param type
     * @param promise 
     * @return {Array} ArrayProxy|PromiseProxyMixin
     */
    addAllPromise: function( type, promise ){
        var self = this;
        
        this._getPromises( type ).set( 'all', promise );
        
        promise.then( function( records ){
            self.addRecords( type, records );
            self._getPromises( type ).set( 'all', undefined );
        }, function(){
            self._getPromises( type ).set( 'all', undefined );
        });

        return promise;
    },

    /**
     * addRecord
     *
     * @param type
     * @param record 
     * @return {Object}
     */
    addRecord: function( type, record ) {
        var typeRecords = this._getRecords( type ),
            oldRecord = typeRecords.ids[ id ],
            id = record.get( 'id' ) || 0;

        if( oldRecord ){
            this.removeRecord( type, oldRecord ); 
        }

        typeRecords.ids[ id ] = record;
        typeRecords.records.push( record );

        return record;
    },

    /**
     * addRecords
     *
     * @param type
     * @param records 
     * @return {Array}
     */
    addRecords: function( type, records ) {
        var self = this;

        return records.map( function( record ) {
            return self.addRecord( type, record );
        });
    },

    /**
     * removeRecord
     *
     * @param type
     * @param record 
     */
    removeRecord: function( type, record ) {
        var typeRecords = this._getRecords( type ),
            id = record.get( 'id' ) || 0,
            idx = typeRecords.records.indexOf( record );

        if( typeRecords ){
            delete typeRecords.ids[ id ];
            typeRecords.records = typeRecords.records.splice(idx, 1);
        }

    },

    /**
     * removeRecords
     *
     * @param type
     * @param records 
     */
    removeRecords: function( type, records ) {
        var self = this;

        records.map( function( record ) {
            self.removeRecord( type, record );
        });
    },

    /**
     * clearCache
     *
     * @param type 
     */
    clearCache: function( type ){
        this._initializeRecords( type );
        this._initializePromises( type );
    }

});
