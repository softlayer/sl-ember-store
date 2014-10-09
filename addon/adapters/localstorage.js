import Ember from 'ember';
import Adapter from '../adapter';

/**
 * SL-Model/adapters/localstorage
 *
 *
 * @class adapters_localstorage
 */
var LocalStorageAdapter = Adapter.extend({
    /**
     * find
     * @public
     * @method find
     * @param  {int}    id      record id
     * @param  {object} options hash of options
     * @param  {bool} findOne force return of single recrord
     * @return { ObjectProxy | ArrayProxy } The record or array of records requested
     */
    find: function ( type, id, options, findOne ){
        var url,            
            results,
            promise,
            queryObj,
            store = this.get( 'store' ),
            model = store.modelFor( type );

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
            id: id
        };

        this.runPreQueryHooks( queryObj );

        promise = new Ember.RSVP.Promise( function( resolve, reject){
            var db,
                records,
                response,
                finalResult;

            db = this._getDb();

            records = this._getRecords( db, url );

            if( options.data && options.data.id ){
                response = records.findBy( 'id', options.data.id );
            }
            else if( findOne ){
                //we aren't doing queries based on options at this time,
                //can add here in the future if needed.
                response = records[0];
            }
            else {
                response = records;
                if( ! response.length ){
                    reject();
                }
            }

            if( ! response ){
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

        }.bind( this ), 'sl-model.localstorageAdapter:find - Promise ');

        promise.finally( function lsAdapaterFindFinally( response ) {

            //run post query hooks
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
     * @method deleteRecord
     * @param {string} url  the url to send the DELETE command to
     * @param {object} context
     * @return {object} Promise
     */
    deleteRecord: function( url, id ) {
        var promise;

        Ember.assert('A url is required to delete a model', url);

        promise = new Ember.RSVP.Promise( function( resolve, reject ){
            var db,
                records,
                errorData,
                recordIndex;

            db = this._getDb();

            records = this._getRecords( db, url );

            recordIndex = this._getRecordIndexById( records, id );

            if( recordIndex >= 0 ){
                records.splice( recordIndex, 1 );
            }else{
                errorData = {
                    statusCode: 404,
                    statusText: 'id: '+id+' not found at '+url,
                    message: 'The record with id: `'+id+'` was not found at url:'+url
                };
                reject( errorData );
            }

            this._dbWrite( db );

            resolve();

        }.bind( this ));

        promise.finally( function lsAdapterDeleteFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.localstorageAdapter:deleteRecord - always ');

        return promise;
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
        var promise;

        Ember.assert('A url is required to save a model', url);

        promise = new Ember.RSVP.Promise( function( resolve ){
            var db,
                records,
                recordIndex;

            db = this._getDb();

            records = this._getRecords( db, url );

            recordIndex = this._getRecordIndexById( records, content.id );
            if( recordIndex >= 0 ){
                records.splice( recordIndex, 1 );
            }

            records.push( content );

            this._dbWrite( db );

            resolve( content );

        }.bind( this ));

        promise.finally( function lsAdapterSaveFinally( response ) {
            this.runPostQueryHooks( response );
        }.bind( this ) , 'sl-model.localstorageAdapter:saveRecord - always ');

        return promise;
    },

    /**
     * return the adapter's namespace
     * @method getNamespace
     * @return {string}     namespace
     */
    getNamespace: function(){
        return this.constructor.namespace;
    },

    /**
     * method to get localStorage object, useful for testing
     * @private
     * @method _getLocalStorage
     * @return {object}         localStorage or mockup
     */
    _getLocalStorage: function(){
        return window.localStorage;
    },

    /**
     * get the db off of localStorage
     *
     * @private
     * @method _getDb
     *
     */
    _getDb: function(){
        var lsDb = this._getLocalStorage().getItem( this.getNamespace() );
        if( lsDb ){
            return JSON.parse( lsDb );
        }

        return {};
    },

    /**
     * write the db to localStorage
     *
     * @private
     * @method  _dbWrite
     */
    _dbWrite: function( db ){
        this._getLocalStorage().setItem( this.getNamespace(), JSON.stringify( db ));
    },

    /**
     * return the records for a specific model url
     * @method _getRecords
     * @param {object} db the object to find the records on
     * @param  {string}    url the key
     * @return {array}        records
     */
    _getRecords: function( db, url ){
        var modelKey = this._normalizeUrl( url ),
            records = db[ modelKey ];

        if( ! records ){
            records = db[ modelKey ] = Ember.A([]);
        }

        return records;
    },

    /**
     * return the
     * @method _getRecordIndexById
     * @param  {Array}       records array to search
     * @param  {integer}       id    id to search for
     * @return {integer}             -1 if not found
     */
    _getRecordIndexById: function( records, id ){
        var recordIndex = -1;
        if( Array.isArray( records ) ){
            records.forEach( function( item, index ){
                if( item.id === id ){
                    recordIndex = index;
                }
            });
        }

        return recordIndex;
    },

    /**
     * normalize a url for using as a key
     * @method _normalizeUrl
     * @param  {string}     url
     * @return {string}         normalized url
     */
    _normalizeUrl: function( url ){
        return url.replace(/^\//, '').replace('\/','_');
    }
});

LocalStorageAdapter.reopenClass({
    namespace: 'sl-model'
});

export default LocalStorageAdapter;
