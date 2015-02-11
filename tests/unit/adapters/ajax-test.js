import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Model from 'sl-ember-store/model';
import Adapter from 'sl-ember-store/adapter';
import Store from 'sl-ember-store/store';
import AjaxAdapter from 'sl-ember-store/adapters/ajax';
module icAjax from 'ic-ajax';

var ajaxAdapter,
    Foo = Model.extend(),
    Bar = Model.extend(),
    defineFixture = icAjax.defineFixture,
    response,
    requestSpy;

module( 'Unit - sl-ember-store/adapter/ajax', {
    setup: function() {
        var container = {
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

        ajaxAdapter = AjaxAdapter.create({
            container: container,
            store: Store.create({ container:container })
        });
        //register mock data
        ajaxAdapter.container.cache['store:main']={
            runPostQueryHooks: sinon.spy(),
            runPreQueryHooks: sinon.spy()
        };

        ajaxAdapter.container.registry.push( { key: 'model:foo', factory: Foo } );
        ajaxAdapter.container.registry.push( { key: 'model:bar', factory: Bar } );

        defineFixture( '/foo', {
            response: { id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } },
            jqXHR: {},
            textStatus: 'success'
        });
        defineFixture( '/foo-fail', {
            errorThrown: 'this is an error msg',
            jqXHR: {},
            textStatus: 'error'
        });
        defineFixture( '/bar', {
            response:  [ { id: 1, quiz: 'bar' }, { id: 2, quiz: 'bar2' } ],
            jqXHR: {},
            textStatus: 'success'
        });
        defineFixture( '/no-results', {
            response:  [],
            jqXHR: {},
            textStatus: 'success'
        });
        Foo.reopenClass( {
            url: '/foo',
            endpoints: {
                fail: {
                    url: '/foo-fail'
                },
                noResults: {
                    url: '/no-results'
                }
            }
        });

        Bar.reopenClass( { url: '/bar'});

        //spies
        requestSpy = sinon.spy( icAjax, 'request' );
    },
    teardown: function() {
        icAjax.request.restore();
    }
});

function ajaxTestSuite(){
    ok( requestSpy.calledOnce, 'request called once' );
    ok( response.then, 'response is a promise' );
    ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise proxy' );
}

asyncTest( '__find single model with id', function(){

    expect(6);
    response = ajaxAdapter.find( 'foo', 1 );

    equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax.request with the correct arguments');

    equal( requestSpy.args[0][0].data.id, 1, 'should call icAjax.request with the correct arguments');

    ajaxTestSuite();

    response.then( function(){
        ok( response.get('content') instanceof Foo, 'response is instance of Foo' );
        start();
    });
});

asyncTest( '__find single model with no id', function(){
    var options =  {data: {main: true }};

    response = ajaxAdapter.find( 'foo', null, options, true );

    equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax.request with the correct arguments');

    ok( requestSpy.args[0][0].data.main, 'should call icAjax.request with the correct arguments');

    ajaxTestSuite();

    response.then( function(){
        ok( response.get('content') instanceof Foo, 'response is instance of Foo' );
        start();
    });

});

asyncTest( '__find array of model', function(){
    var options =  {data: {main: true }};
    //request
    response = ajaxAdapter.find( 'bar', null, options, false );

    ajaxTestSuite();

    ok( response instanceof Ember.ArrayProxy, 'should return an instance of Ember.ArrayProxy' );
    response.then( function(){
        ok( response.content[0] instanceof Bar, 'should return an array of Bar models' );
        ok( response.content[1] instanceof Bar, 'should return an array of Bar models' );
        start();
    });
});


asyncTest( 'find should throw error if request fails', function(){
    var options = { endpoint: 'fail' },
        promise = ajaxAdapter.find( 'foo', null, options, false );

    promise.then( function( result ){
        ok( false, 'find did not throw an error!' );
        start();
    },
    function( result ){
        equal( result.textStatus, 'error', 'find did throw error' );
        start();
    });
});

asyncTest( 'find should not throw error if response is empty', function(){
    var options = { endpoint: 'noResults' },
        promise = ajaxAdapter.find( 'foo', null, options, false );

    promise.then( function( result ){
        ok( true, 'find did not throw an error.' );
        start();
    },
    function( result ){
        ok( false, 'find threw an error!' );
        start();
    });
});

test( 'save', function(){
    var foo = Foo.create({ test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
    response = ajaxAdapter.save( '/foo', foo );
    ok( requestSpy.calledOnce, 'should call icAjax request once' );
    equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax with correct url');
    equal( requestSpy.args[0][0].type, 'POST', 'should call icAjax with correct method');
    equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
});

test( 'save, should call $.ajax with the correct arguments', function(){
    var foo = Foo.create({ test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
    response = ajaxAdapter.save( '/foo', foo );
    ok( requestSpy.calledOnce, 'request called once' );
    equal( requestSpy.args[0][0].url, '/foo' );
    equal( requestSpy.args[0][0].type, 'POST' );
    equal( typeof requestSpy.args[0][0].data, 'string' );
    ok( response.then, 'response is a promise' );
});

test( 'delete, should call icAjax.request once', function(){
    var foo = Foo.create({ id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
    response = ajaxAdapter.deleteRecord( '/foo', 1 );

    ok( requestSpy.calledOnce );
    equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax with correct url');
    equal( requestSpy.args[0][0].type, 'DELETE', 'should call icAjax with correct url');
    equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
    ok( response.then, 'response is a proxy' );
});
