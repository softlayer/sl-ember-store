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
        return this.get( '_promise.'+type+'.all');
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

        if( id || findOne ){
            id = id || 0;
            return !!this.fetchById( type, id );
        }

        return !!( this._getAllPromise( type ) || this._getAllRecords( type ).length );
    },

    /**
     * fetch returns a record or array of records
     *
     * @param type
     * @param id
     * @param findOne 
     * @return {Object|Array}
     */
    fetch: function( type, id, findOne ){
 
        if( id || findOne ){
            id = id || 0;
            return  this.fetchById( type, id );
        }

        return this.fetchAllByType( type );
    },

    /**
     * fetchById
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

        record = self._getRecordById( type, id );

        if( ! record ){
            return false;
        }

        return Ember.ObjectProxy.createWithMixins( Ember.PromiseProxyMixin )
            .set( 'promise', new Ember.RSVP.Promise( function( resolve, reject ){
                resolve( record );
            }));
    },
    
    /**
     * fetchAllByType
     *
     * @param type 
     * @return {Array}
     */
    fetchAllByType: function( type ) {
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
                resolve( records);
            }));
    },

    /**
     * addToCache
     *
     * @param type
     * @param id
     * @param findOne
     * @param result 
     * @return {Object|Array}
     */
    addToCache: function( type, id, findOne, result ){

        if( id || findOne ){
            if( result.then ){
                return this.addPromise( type, id, result );
            } else {
                return this.addRecord( type, result );
            }
        }
        
        return this.addAllPromise( type, result );
    },

    /**
     * addPromise
     *
     * @param type
     * @param id
     * @param promise 
     * @return {Object} ObjectProxy|PromiseProxyMixin
     */
    addPromise: function( type, id, promise ){
        var self = this;

        this._getPromises( type ).get( 'ids' )[ id ] = promise;

        promise.then( function( records ){
            self.addRecord( type, record );
            delete this._getPromises( type ).get( 'ids' )[ id ];
        });

        return promise;
    },

    /**
     * addAllPromise
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
            id = record.get( 'id' ) || 0;

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
        var typeRecords = this.get( '_records.'+type ),
            id = record.get( 'id' ),
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
