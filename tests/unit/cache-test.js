import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Cache from 'sl-model/cache';

var cache,
    fetchByIdSpy,
    fetchOneSpy,
    _getAllPromiseSpy,
    _getAllRecordSpy;

module( 'Unit - sl-model/cache', {
    setup: function(){
        cache = Cache.create();
        fetchByIdSpy = sinon.spy( cache, 'fetchById' );
        fetchOneSpy = sinon.spy( cache, 'fetchOne' );
        _getAllPromiseSpy = sinon.spy( cache, '_getAllPromise' );
        _getAllRecordSpy = sinon.spy( cache, '_getAllRecords' );
    },
    teardown: function(){
        fetchByIdSpy.restore();
        fetchOneSpy.restore();
        _getAllPromiseSpy.restore();
        _getAllRecordSpy.restore();
    } 
}); 

test( 'isCached, id', function(){
    cache.isCached( 'test', 1 );
    ok( fetchByIdSpy.calledOnce, 'fetch by id called once' );
    equal( fetchByIdSpy.args[0][1], 1, 'fetch by the right id' );
});
test( 'isCached, one', function(){
    cache.isCached( 'test', null, true );
    ok( fetchOneSpy.calledOnce, 'fetch one called once' );
    equal( fetchOneSpy.args[0][0], 'test', 'fetch one called with correct type' );
});
test( 'isCached, all', function(){
    cache.isCached( 'test' );
    ok( _getAllPromiseSpy.calledOnce, 'get all called once');
    equal( _getAllPromiseSpy.args[0][0], 'test', 'get all called with correct type' );
    ok( _getAllRecordSpy.calledOnce, 'get all called once');
    equal( _getAllRecordSpy.args[0][0], 'test', 'get all called with correct type' );
});

test( 'clearCache', function(){
    sinon.spy( cache, '_initializeRecords' );
    sinon.spy( cache, '_initializePromises' );
    cache.clearCache( 'test' );
    ok( cache._initializeRecords.calledOnce, 'initialize records called once');
    ok( cache._initializeRecords.calledWith( 'test' ), 'initialize records called with correct arg' );
    ok( cache._initializePromises.calledOnce, 'initialize promises called once');
    ok( cache._initializePromises.calledWith( 'test' ), 'initialize records called with correct arg' );
});

test( 'removeRecord', function(){
    sinon.spy( cache, '_getRecords' );
    cache.removeRecord( 'test', Ember.Object.create() );
    ok( cache._getRecords.calledOnce, '_getRecords called once' );
    ok( cache._getRecords.calledWith( 'test' ), '_getRecords called with correct arg');  
});

test( 'removeRecords', function(){
    sinon.spy( cache, 'removeRecord' );
    cache.removeRecords( 'test', [ Ember.Object.create() ] );
    ok( cache.removeRecord.calledOnce, 'removeRecord called once' );
    ok( cache.removeRecord.calledWith( 'test' ), 'removeRecord called with correct arg' );
});

test( 'addToCache, single promise', function(){
    var result =  new Ember.RSVP.Promise(function( resolve ){ resolve( Ember.Object.create() ); });
    sinon.spy( cache, 'addPromise');
    cache.addToCache( 'test', 1, false, result );
    ok( cache.addPromise.calledOnce, 'addPromise called once' );
    ok( cache.addPromise.calledWith( 'test' ), 'addPromise called with correct args' );
});

test( 'addToCache, all promise', function(){
    var result =  new Ember.RSVP.Promise(function( resolve ){ resolve( [ Ember.Object.create() ] ); });
    sinon.spy( cache, 'addAllPromise');
    cache.addToCache( 'test', false, false, result );
    ok( cache.addAllPromise.calledOnce, 'addAllPromise called once' );
    ok( cache.addAllPromise.calledWith( 'test' ), 'addAllPromise called with correct args' );
});

test( 'addToCache, record', function(){
    sinon.spy( cache, 'addRecord');
    cache.addToCache( 'test', 1, false, Ember.Object.create() );
    ok( cache.addRecord.calledOnce, 'addRecord called once' );
    ok( cache.addRecord.calledWith( 'test' ), 'addRecord called with correct args' );
});

asyncTest( 'addPromise, resolve', function(){
    var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
        testPromise = new Ember.RSVP.Promise( function( resolve ){
           setTimeout( resolve( testRecord ), 1000);
        }),
        rPromise;        

    sinon.spy( cache, '_getPromises' );
    sinon.spy( cache, '_getRecords' );

    rPromise = cache.addPromise( 'test', 1, testPromise );
    ok( cache._getPromises.calledOnce, '_getPromises called once' );
    equal( cache.get( '_promises.test.ids.1' ), testPromise, 'promise got added to promise cache' );

    //test that promise gets removed from promise hash on resolution
    rPromise.finally( function(){
        equal( cache.get( '_promises.test.ids.1' ), undefined, 'promise was removed from cache' );
        ok( cache._getRecords.calledOnce, '_getRecords called once' );
        equal( cache.get( '_records.test.ids.1' ), testRecord, 'record was added to record cache' );
        start(); 
    });

});
asyncTest( 'addPromise, reject', function(){
    var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
        testPromise = new Ember.RSVP.Promise( function( resolve, reject ){
           setTimeout( reject( testRecord ), 1000);
        }),
        rPromise;        

    sinon.spy( cache, '_getPromises' );
    sinon.spy( cache, '_getRecords' );

    rPromise = cache.addPromise( 'test', 1, testPromise );
    ok( cache._getPromises.calledOnce, '_getPromises called once' );
    equal( cache.get( '_promises.test.ids.1' ), testPromise, 'promise got added to promise cache' );

    //test that promise gets removed from promise hash on resolution
    rPromise.finally( function(){
        equal( cache.get( '_promises.test.ids.1' ), undefined, 'promise was removed from cache' );
        ok( !cache._getRecords.called, '_getRecords not called' );
        equal( cache.get( '_records.test.ids.1' ), undefined, 'record was not added to record cache' );
        start(); 
    });

});


asyncTest( 'addAllPromise, resolve', function(){
    var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
        testPromise = new Ember.RSVP.Promise( function( resolve ){
           setTimeout( resolve( [ testRecord ]  ), 100);
        }),
        rPromise;        

    sinon.spy( cache, '_getPromises' );
    sinon.spy( cache, 'addRecords' );

    rPromise = cache.addAllPromise( 'test', testPromise );
    ok( cache._getPromises.calledOnce, '_getPromises called once' );
    equal( cache.get( '_promises.test.all' ), testPromise, 'promise was added to promise cache' );
    rPromise.then( function(){
        equal( cache.get( '_promises.test.all' ), undefined, 'promise was removed from promise cache' );
        ok( cache.addRecords.calledOnce, 'addrecords called once' );
        equal( cache.get( '_records.test.ids.1'), testRecord, 'record was added to record cache' );
        start();
    });
});

asyncTest( 'addAllPromise, reject', function(){
    var testRecord =  Ember.Object.create({ id: 1, test: 'test' }),
        testPromise = new Ember.RSVP.Promise( function( resolve, reject ){
           setTimeout( reject( [ testRecord ]  ), 100);
        }),
        rPromise;        

    sinon.spy( cache, '_getPromises' );
    sinon.spy( cache, 'addRecords' );

    rPromise = cache.addAllPromise( 'test', testPromise );
    ok( cache._getPromises.calledOnce, '_getPromises called once' );
    equal( cache.get( '_promises.test.all' ), testPromise, 'promise was added to promise cache' );
    rPromise.finally( function(){
        equal( cache.get( '_promises.test.all' ), undefined, 'promise was removed from promise cache' );
        ok( !cache.addRecords.calledOnce, 'addrecords not called once' );
        equal( cache.get( '_records.test.ids.1'), undefined, 'record was added to record cache' );
        start();
    });
});

test( 'addRecord', function(){
    var testRecord =  Ember.Object.create({ id: 1, test: 'test' });
    var testRecord2 =  Ember.Object.create({ id: 1, test: 'test2' });

    sinon.spy( cache, 'removeRecord' );
    
    cache.addRecord( 'test', testRecord );

    equal( cache.get( '_records.test.ids.1' ), testRecord, 'testRecord added to record cache' );

    ok( ! cache.removeRecord.called, 'removeRecord was not called on initial add');

    cache.addRecord( 'test', testRecord2 );
    
    ok( cache.removeRecord.called, 'removeRecord was called on 2nd add');
    
    equal( cache.get( '_records.test.ids.1' ), testRecord2, 'testRecord2 replaced old record in cache' );
});

test( 'addRecords', function(){
    var testRecord =  Ember.Object.create({ id: 1, test: 'test' });
    var testRecord2 =  Ember.Object.create({ id: 2, test: 'test2' });
   
    sinon.spy( cache, 'addRecord' );

    cache.addRecords( 'test', [ testRecord, testRecord2 ] );
    
    equal( cache.addRecord.callCount, 2, 'addRecord called for each record' );

});

test( 'fetch, id', function(){
    cache.fetch( 'test', 1 );
    ok( fetchByIdSpy.calledOnce, 'fetch by id called once' );
    equal( fetchByIdSpy.args[0][1], 1, 'fetch by the right id' );
});
test( 'fetch, one', function(){
    cache.fetch( 'test', null, true );
    ok( fetchOneSpy.calledOnce, 'fetch one called once' );
    equal( fetchOneSpy.args[0][0], 'test', 'fetch one called with correct type' );
});
test( 'fetch, all', function(){
    cache.fetch( 'test' );
    ok( _getAllPromiseSpy.calledOnce, 'get all called once');
    equal( _getAllPromiseSpy.args[0][0], 'test', 'get all called with correct type' );
    ok( _getAllRecordSpy.calledOnce, 'get all called once');
    equal( _getAllRecordSpy.args[0][0], 'test', 'get all called with correct type' );
});


asyncTest( 'fetchOne - promise', function(){
    var testRecord = Ember.Object.create({ id: 1});

    cache.addPromise( 'test', 1, Ember.RSVP.Promise.resolve( testRecord ) )
    .then( function(){ 
        
        sinon.spy( cache, '_getPromises' );    
        
        var response = cache.fetchOne( 'test' );

        ok( cache._getPromises.calledOnce, 'getPromise called once' );

        response.then( function(){
            equal( response.get('content'), testRecord, 'fetchOne returned correct record' ); 
        
            start();
        });
    });

});

asyncTest( 'fetchOne - record', function(){
    var testRecord = Ember.Object.create({ id: 1});

    cache.addRecord( 'test', testRecord );

    sinon.spy( cache, '_getRecords' );

    var response = cache.fetchOne( 'test' );

    ok( cache._getRecords.calledOnce, 'getRecords called once' );

    response.then( function(){
        equal( response.get('content'), testRecord, 'fetchOne returned the correct record' );
        start();
    });
});


asyncTest( 'fetchById - promise', function(){
    var testRecord = Ember.Object.create({ id: 1});

    cache.addPromise( 'test', 1, Ember.RSVP.Promise.resolve( testRecord ) )
    .then( function(){ 
        
        sinon.spy( cache, '_getPromiseById' );    
        
        var response = cache.fetchById( 'test', 1 );

        ok( cache._getPromiseById.calledOnce, 'getPromiseById called once' );

        response.then( function(){
            equal( response.get('content'), testRecord, 'fetchById returned correct record' ); 
        
            start();
        });
    });

});

asyncTest( 'fetchById - record', function(){
    var testRecord = Ember.Object.create({ id: 1});

    cache.addRecord( 'test', testRecord );
        
    sinon.spy( cache, '_getRecordById' );    
    
    var response = cache.fetchById( 'test', 1 );

    ok( cache._getRecordById.calledOnce, 'getRecordById called once' );

    response.then( function(){
        equal( response.get('content'), testRecord, 'fetchById returned correct record' ); 
    
        start();
    });

});

test( 'fetchAll - promise', function(){

    var testRecord = Ember.Object.create({ id: 1});
    var testPromise =  Ember.RSVP.Promise.resolve( [ testRecord] ); 

    cache.addAllPromise( 'test', testPromise);
    var response = cache.fetchAll( 'test', testPromise );
    ok( cache._getAllPromise.calledOnce, 'calls _getAllPromise once' );
    equal( response, testPromise, 'returns the test promise' );
});

asyncTest( 'fetchAll - record', function(){

    var testRecord = Ember.Object.create({ id: 1});
    cache.addRecords( 'test', [ testRecord ] );
    var response = cache.fetchAll( 'test' );
    ok( cache._getAllRecords.calledOnce, 'calls _getAllRecords once' );
    response.then( function(){
        equal( response.get( 'content.0' ), testRecord, 'returns the test record in an array' );
        start();
    });

});

test( '_setupCache', function(){
    cache._setupCache();
    equal( Object.keys( cache._records ).length, 0, 'records object is empty' );
    equal( Object.keys( cache._promises ).length, 0, 'promises object is empty' );
});

test( '_initializeRecords', function(){
    cache._initializeRecords( 'test' );
    equal( cache._records.test.records.length, 0, 'sets up `test` records array' );
    ok( cache._records.test.ids instanceof Ember.Object, 'sets up `test` records object' );
});

test( '_getRecords, none', function(){
    var response = cache._getRecords( 'test' );
    equal( response.records.length, 0, 'returns 0 records');
});

test( '_getRecords, some', function(){
    cache.addRecord( 'test', Ember.Object.create({id:1}));
    var response = cache._getRecords( 'test' );
    equal( response.records[0].id, 1, 'returns an array with the test record' );
});

test( '_getRecordById, not found', function(){
    var response = cache._getRecordById( 'test', 12 );
    equal( response, undefined, 'record should not be found');
});

test( '_getRecordById, found', function(){
    var testRecord = Ember.Object.create({id:1});
    cache.addRecord( 'test', testRecord);
    var response = cache._getRecordById( 'test', 1 );
    equal( response, testRecord, 'returns the correct record' );
});

test( '_getAllRecords, empty', function(){
    var response = cache._getAllRecords( 'test' );
    equal( response.length, 0,  'returns an empty array' );
});

test( '_getAllRecords, some', function(){
    var testRecord = Ember.Object.create({id:1});
    cache.addRecord( 'test', testRecord);
    var response = cache._getAllRecords( 'test' );
    equal( response[0], testRecord, 'returns the test record in an array' ); 
});

test( '_initializePromises', function(){
    cache._initializePromises( 'test' );
    equal( cache._promises.test.all, null, 'test all promise is null ');
    equal( Object.keys(cache._promises.test.ids).length, 0, 'test promise object is empty' );
});

test( '_getPromises, empty', function(){
    sinon.spy( cache, '_initializePromises' );
    var response = cache._getPromises('test');
    ok( cache._initializePromises.calledOnce, 'calls initializePromises' );
    
});

test( '_getPromises, some', function(){
    var testPromise = Ember.RSVP.Promise.resolve( Ember.Object.create({id:1}) );
    cache.addPromise( 'test', 1, testPromise );
    var response = cache._getPromises( 'test' );
    equal( response.ids[1], testPromise, 'has testpromise set' );
});

test( '_getPromiseById, none', function(){
    var response = cache._getPromiseById( 'test', 1 );
    equal( response, undefined, 'no promise should be found' );
});
test( '_getPromiseById, some', function(){
    var testPromise = Ember.RSVP.Promise.resolve( Ember.Object.create({id:1}));
    cache.addPromise( 'test', 1, testPromise );
    var response = cache._getPromiseById( 'test', 1 );
    equal( response, testPromise, 'promise should be found' );
});

test( '_getAllPromise, none', function(){
    var response = cache._getAllPromise( 'test' );
    equal( response, undefined, 'response should be undefined' );
});
test( '_getAllPromise, some', function(){
    var testRecord = Ember.Object.create({id:1}),
        testPromise = Ember.RSVP.Promise.resolve( [ testRecord ] );

    cache.addAllPromise( 'test', testPromise ); 

    var response = cache._getAllPromise( 'test' );

    equal( testPromise, response, 'should return promise' );
});
