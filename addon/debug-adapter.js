import Model from "./model";

export default Ember.DataAdapter.extend({

    detect: function(klass) {
        return klass !== Model && Model.detect(klass);
    },

    columnsForType: function( type ) {
        var columns = [],
            type = type._debugContainerKey.replace( 'model:',''),
            record = this.get( 'store' )._cache._getRecords( type ).records[0];

        if( record ){
            Ember.keys( record.content ).forEach( function( key ){
                columns.push( { name: key, desc: key });
            });
        }

        return columns;
    },

    getRecords: function( type ){
        var type = type._debugContainerKey.replace( 'model:','');
        return this.get( 'store' )._cache._getRecords( type ).records;
    },

    getRecordColumnValues: function( record ){
        var values = {};

        if( record ){
            Ember.keys( record.content ).forEach( function( key ){
                values[ key ] = Ember.get( record, key );
            });
        }

        return values;
    },

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