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
    var result =  { then: function(){} };
    sinon.spy( cache, 'addPromise');
    cache.addToCache( 'test', 1, false, result );
    ok( cache.addPromise.calledOnce, 'addPromise called once' );
    ok( cache.addPromise.calledWith( 'test' ), 'addPromise calle with correct argsss' );
});
test( 'addToCache, all promise', function(){
});
test( 'addToCache, record', function(){
});

test( 'addPromise', function(){
});

test( 'addAllPromise', function(){
});

test( 'addRecord', function(){
});

test( 'addRecords', function(){
});

test( 'fetch', function(){
});

test( 'fetchOne', function(){
});

test( 'fetchById', function(){
});

test( 'fetchAll', function(){
});

test( '_setupCache', function(){
});

test( '_initializeRecords', function(){
});

test( '_getRecords', function(){
});

test( '_getRecordById', function(){
});

test( '_getAllRecords', function(){
});

test( '_initializePromises', function(){
});

test( '_getPromises', function(){
});

test( '_getPromiseById', function(){
});

test( '_getAllPromise', function(){
});
