import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Model from 'sl-ember-store/model';
import Adapter from 'sl-ember-store/adapter';
import Store from 'sl-ember-store/store';
import LocalStorageAdapter from 'sl-ember-store/adapters/localstorage';

var localstorageadapter,
    localStorageBackup,
    localStorage,
    container,
    getLocalStorageSpy,
    requestSpy,
    saveSpy,
    response,
    Foo = Model.extend(),
    Bar = Model.extend();

module( 'Unit - sl-ember-store/adapter/localstorage', {
    beforeEach: function() {
       localStorage = {
            _ns: 'testLSObject',
            setItem: function( item, content ){
                this[item] = content;
            },
            getItem: function( item ){
                return this[item];
            }
        };
        container = {
            registry: [],
            cache: {},
            normalize: function( key ){
                return key;
            },
            lookup: function( key ){
                if( this.cache[key] ) return this.cache[key];

                var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                this.cache[key] = obj;
                return obj;
            },
            lookupFactory: function( key ){
                var item = this.registry.findBy( 'key', key );
                return item ? item.factory : undefined;
            }
        };
        localstorageadapter = LocalStorageAdapter.create({
            container: container,
            store: Store.create({ container:container })
        });

        //register mock data
        localstorageadapter.container.cache['store:main']={
            runPostQueryHooks: sinon.spy(),
            runPreQueryHooks: sinon.spy()
        };

        Foo.reopenClass( { url: '/foo', adapter: 'localstorage' } );
        Bar.reopenClass( { url: '/bar', adapter: 'localstorage' } );

        localstorageadapter.container.registry.push( { key: 'model:foo', factory: Foo } );
        localstorageadapter.container.registry.push( { key: 'model:bar', factory: Bar } );

        getLocalStorageSpy = sinon.stub( localstorageadapter, '_getLocalStorage', function(){
            return localStorage;
        });

        localstorageadapter.save( '/foo',  {id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } } );
        localstorageadapter.save( '/bar', { id: 1, quiz: 'bar' } );
        localstorageadapter.save( '/bar', { id: 2, quiz: 'bar2' } );

    //spies
        requestSpy = sinon.spy( localStorage, 'getItem' );
        saveSpy = sinon.spy( localStorage, 'setItem' );

    },
    afterEach: function() {
        localStorage.getItem.restore();
        localStorage.setItem.restore();
        getLocalStorageSpy.restore();
    }
});

asyncTest( '__find single model with id', function( assert ){
    response = localstorageadapter.find( 'foo', 1, { label: '1' } );
    assert.equal(requestSpy.args[0][0], 'sl-ember-store', 'calls request with correct args' );
    assert.ok( response.then, 'response is a promise' );
    assert.ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise' );
    response.then(function( result ){
        assert.ok( response.get( 'content' ) instanceof Foo, 'response content is instace of Foo' );
        start();
    });
});

asyncTest( '__find single model with no id', function( assert ){
    var options =  {data: {main: true }};

    response = localstorageadapter.find( 'foo', null, options, true );

    assert.equal(requestSpy.args[0][0], 'sl-ember-store', 'calls request with correct args' );

    assert.ok( response.then, 'response is a promise' );

    assert.ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise' );

    response.then(function(){
        assert.ok( response.get( 'content' ) instanceof Foo, 'response content is instace of Foo' );
        start();
    });

});

asyncTest( '__find array of models', function( assert ){
    var options =  {data: {main: true }};

    response = localstorageadapter.find( 'bar', null, options, false );

    assert.ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise' );

    response.then(function(){
        assert.ok( response.get( 'content.0' ) instanceof Bar, 'response content is instace of Bar' );
        assert.ok( response.get( 'content.1' ) instanceof Bar, 'response content is instace of Bar' );
        start();
    });
});

asyncTest( 'save', function( assert ){
    var fooContent = { id: 2, test: 'foo', 'bar': { id: 1, quiz: 'bar2' } },
        foo = Foo.create( fooContent );

    response = localstorageadapter.save( '/foo', foo );
    response.then( function(){
        var fooRecords = JSON.parse(localStorage.getItem('sl-ember-store')).foo,
            fooRecord = fooRecords.findBy( 'id', 2 );

        assert.ok( response.then, 'response is a promise' );

        assert.equal( fooRecord.id, 2, 'should have added the record to the mock ls object' );
        start();
    });
});

asyncTest( 'delete', function( assert ){
    var fooContent = { id: 2, test: 'foo', 'bar': { id: 1, quiz: 'bar2' } },
        foo = Foo.create( fooContent ),
        r = localstorageadapter.save( '/foo', foo );

        r.then( function(){

            var response = localstorageadapter.deleteRecord( '/foo', 2 );

            response.then( function(){
                assert.ok( response.then, 'response is a promise' );

                var fooRecords = [ JSON.parse(localStorage.getItem('sl-ember-store')).foo ],
                    fooRecord = fooRecords.findBy( 'id', 2 );

                assert.equal( fooRecord, undefined, 'should have deleted the record to the mock ls object' );
                start();
            });
        });
});

asyncTest( 'quota test', function( assert ){
    var fooContent = { id: 1, test: [] },
        foo,
        r;

    for( var i = 0; i < 10000000; i++){
        fooContent.test[i] = '01000001000000000100010';
    }

    //make sure we actually test the browser's localstorage
    getLocalStorageSpy.restore();

    foo = Foo.create( fooContent );

    r = localstorageadapter.save( '/foo', foo );

    r.then(
        function( result ){
            assert.ok( false, 'Promise did not get rejected!');
            start();
        },
        function( result ){
            assert.equal( result.textStatus, 'error', 'Promise gets rejected for exceeding quota' );
            start();
        });
});
