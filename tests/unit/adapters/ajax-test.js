import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Model from 'sl-ember-store/model';
import Adapter from 'sl-ember-store/adapter';
import Store from 'sl-ember-store/store';
import AjaxAdapter from 'sl-ember-store/adapters/ajax';

var icAjax = require( 'ic-ajax' );

var ajaxAdapter,
    Foo = Model.extend(),
    Bar = Model.extend(),
    defineFixture = icAjax.defineFixture,
    response,
    requestSpy;

module( 'Unit - sl-ember-store/adapter/ajax', {
    beforeEach: function() {
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
    afterEach: function() {
        icAjax.request.restore();
    }
});

function ajaxTestSuite( assert ){
    assert.ok( requestSpy.calledOnce, 'request called once' );
    assert.ok( response.then, 'response is a promise' );
    assert.ok( Ember.PromiseProxyMixin.detect( response ), 'response is a promise proxy' );
}

asyncTest( '__find single model with id', function( assert ){

    assert.expect(6);
    response = ajaxAdapter.find( 'foo', 1 );

    assert.equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax.request with the correct arguments');

    assert.equal( requestSpy.args[0][0].data.id, 1, 'should call icAjax.request with the correct arguments');

    ajaxTestSuite( assert );

    response.then( function(){
        assert.ok( response.get('content') instanceof Foo, 'response is instance of Foo' );
        start();
    });
});

asyncTest( '__find single model with no id', function( assert ){
    var options =  {data: {main: true }};

    response = ajaxAdapter.find( 'foo', null, options, true );

    assert.equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax.request with the correct arguments');

    assert.ok( requestSpy.args[0][0].data.main, 'should call icAjax.request with the correct arguments');

    ajaxTestSuite( assert );

    response.then( function(){
        assert.ok( response.get('content') instanceof Foo, 'response is instance of Foo' );
        start();
    });

});

asyncTest( '__find array of model', function( assert ){
    var options =  {data: {main: true }};
    //request
    response = ajaxAdapter.find( 'bar', null, options, false );

    ajaxTestSuite( assert );

    assert.ok( response instanceof Ember.ArrayProxy, 'should return an instance of Ember.ArrayProxy' );
    response.then( function(){
        assert.ok( response.content[0] instanceof Bar, 'should return an array of Bar models' );
        assert.ok( response.content[1] instanceof Bar, 'should return an array of Bar models' );
        start();
    });
});


asyncTest( 'find should throw error if request fails', function( assert ){
    var options = { endpoint: 'fail' },
        promise = ajaxAdapter.find( 'foo', null, options, false );

    promise.then( function( result ){
        assert.ok( false, 'find did not throw an error!' );
        start();
    },
    function( result ){
        assert.equal( result.textStatus, 'error', 'find did throw error' );
        start();
    });
});

asyncTest( 'find should not throw error if response is empty', function( assert ){
    var options = { endpoint: 'noResults' },
        promise = ajaxAdapter.find( 'foo', null, options, false );

    promise.then( function( result ){
        assert.ok( true, 'find did not throw an error.' );
        start();
    },
    function( result ){
        assert.ok( false, 'find threw an error!' );
        start();
    });
});

test( 'save() should send PUT since an id exists', function( assert ){
    var foo = Foo.create({ id: 3 });
    response = ajaxAdapter.save( '/foo', foo );
    assert.ok( requestSpy.calledOnce, 'should call icAjax request once' );
    assert.equal( requestSpy.args[0][0].url, '/foo/3', 'should call icAjax with correct url');
    assert.equal( requestSpy.args[0][0].type, 'PUT', 'should call icAjax with PUT method');
    assert.equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
});

test( 'save() should send POST since NO id exists', function( assert ){
    var foo = Foo.create({ label: 'My name' });
    response = ajaxAdapter.save( '/foo', foo );
    assert.ok( requestSpy.calledOnce, 'should call icAjax request once' );
    assert.equal( requestSpy.args[0][0].url, '/foo', 'should call icAjax with correct url');
    assert.equal( requestSpy.args[0][0].type, 'POST', 'should call icAjax with POST method');
    assert.equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
});

test( 'save() should call $.ajax with the correct arguments', function( assert ){
    var foo = Foo.create({ id: 3 });
    response = ajaxAdapter.save( '/foo', foo );
    assert.ok( requestSpy.calledOnce, 'request called once' );
    assert.equal( typeof requestSpy.args[0][0].data, 'string' ); // update to check json_decode also in 184 and 193
    assert.ok( response.then, 'response is a promise' );
});

test( 'save() requires an Object to be provided as the second parameter', function( assert ) {

    // Empty parameter

    var assertionThrown = false;

    try {
        ajaxAdapter.save( 'test/', null );
    } catch( error ) {
        assertionThrown = true;
    }

    assert.ok( assertionThrown, 'Parameter was empty' );

    // Number parameter

    assertionThrown = false;

    try {
        ajaxAdapter.save( 'test/', 4 );
    } catch( error ) {
        assertionThrown = true;
    }

    assert.ok( assertionThrown, 'Parameter was a Number' );

    // Array Parameter

    assertionThrown = false;

    try {
        ajaxAdapter.save( 'test/', [] );
    } catch( error ) {
        assertionThrown = true;
    }

    assert.ok( assertionThrown, 'Parameter was an Array' );

    // Function

    assertionThrown = false;

    try {
        ajaxAdapter.save( 'test/', function(){} );
    } catch( error ) {
        assertionThrown = true;
    }

    assert.ok( assertionThrown, 'Parameter was a Function' );

    // String Parameter

    assertionThrown = false;

    try {
        ajaxAdapter.save( 'test/', 'test' );
    } catch( error ) {
        assertionThrown = true;
    }

    assert.ok( assertionThrown, 'Parameter was a String' );

    // Object Parameter

    assertionThrown = false;

    try {
        ajaxAdapter.save( 'test/', {} );
    } catch( error ) {
        assertionThrown = true;
    }

    assert.ok( !assertionThrown, 'Parameter was an Object' );
});

test( 'deleteRecord() should call icAjax.request once', function( assert ){
    var foo = Foo.create({ id: 3 });
    response = ajaxAdapter.deleteRecord( '/foo', 3 );

    assert.ok( requestSpy.calledOnce );
    assert.equal( requestSpy.args[0][0].url, '/foo/3', 'should call icAjax with correct url');
    assert.equal( requestSpy.args[0][0].type, 'DELETE', 'should call icAjax with correct url');
    assert.equal( typeof requestSpy.args[0][0].data, 'string', 'icAjax should return a string');
    assert.ok( response.then, 'response is a proxy' );
});