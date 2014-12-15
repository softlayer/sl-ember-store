import Ember from 'ember';
import Model from './model';

export default Ember.DataAdapter.extend({

    /**
     * detect if a class is a model
     * @param  {Object} klass 
     * @return {boolean}       is Model and ancestor of `klass` 
     */
    detect: function(klass) {
        return klass !== Model && Model.detect(klass);
    },

    /**
     * Returns the columns for a specific model type
     * @param  {Object} type Model Class
     * @return {Array}      Array of objs describing model columns
     */
    columnsForType: function( typeClass ) {
        var columns = [],
            type = typeClass._debugContainerKey.replace( 'model:',''),
            record = this.get( 'store' )._cache._getRecords( type ).records[0];

        if( record ){
            Ember.keys( record.content ).forEach( function( key ){
                columns.push( { name: key, desc: key });
            });
        }

        return columns;
    },

    /**
     * Returns the array of records for the model type
     * @param {Object} type Model Class
     * @return {Array} array of model records
     */
    getRecords: function( typeClass ){
        var type = typeClass._debugContainerKey.replace( 'model:','');
        return this.get( 'store' )._cache._getRecords( type ).records;
    },

    /**
     * Returns the values for the columns in a record
     * @param  {Object} record
     * @return {Object}        The values for the keys of this record
     */
    getRecordColumnValues: function( record ){
        var values = {};

        if( record ){
            Ember.keys( record.content ).forEach( function( key ){
                values[ key ] = Ember.get( record, key );
            });
        }

        return values;
    },

    /**
     * Sets up observers for records
     * @param  {Object} record
     * @param  {Function} recordUpdated callback when a record is updated
     * @return {Function}               callback when a record is destroyed
     */
    observeRecord: function( record, recordUpdated ){
        var releaseMethods = Ember.A(),
            self = this,
            keysToObserve = Ember.keys( record.content );

        keysToObserve.forEach(function(key) {
            var handler = function() {
                recordUpdated(self.wrapRecord(record));
            };
            Ember.addObserver(record, key, handler);
            releaseMethods.push(function() {
                Ember.removeObserver(record, key, handler);
            });
        });

        var release = function() {
            releaseMethods.forEach(function(fn) { fn(); } );
        };

        return release;
    }

});