import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Store from 'sl-ember-store/store';
import Model from 'sl-ember-store/model';

var Foo,
    Bar,
    store,
    AjaxAdapter,
    ajaxAdapter,
    LocalstorageAdapter,
    queryHook;

module( 'Unit - sl-ember-store/store', {

    beforeEach: function() {
        Foo = Model.extend();
        Bar = Model.extend();
        Bar.reopenClass({ adapter: 'localstorage' });

        AjaxAdapter = Ember.Object.extend({
            type: 'ajax',
            __find: function(){},
            find: function(){
                return Ember.RSVP.resolve( [ Ember.Object.create() ] );
            }
        });

        LocalstorageAdapter = Ember.Object.extend({ type: 'localstorage' });

        store = Store.create({
            container: {
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
                    return this.registry.findBy( 'key', key ).factory;
                }
            }
        });
        store.container.registry.push( { key: 'adapter:ajax', factory: AjaxAdapter } );
        store.container.registry.push( { key: 'adapter:localstorage', factory: LocalstorageAdapter } );

        store.container.registry.push( { key: 'model:foo', factory: Foo } );
        store.container.registry.push( { key: 'model:bar', factory: Bar } );

        ajaxAdapter = store.container.lookup('adapter:ajax');


        //sinon spies
        sinon.spy( store, '__find' );
        sinon.spy( store, 'modelFor' );
        sinon.spy( store, 'adapterFor' );
        sinon.spy( ajaxAdapter, 'find' );
        sinon.spy( Foo, 'create' );
        queryHook = sinon.spy();
    },
    afterEach: function() {
        store.__find.restore();
        store.modelFor.restore();
        store.adapterFor.restore();
        ajaxAdapter.find.restore();
        Foo.create.restore();
        queryHook.reset();
    }
});

test( 'modelFor: should return the model "Foo" for type "foo" ', function( assert ) {
    assert.ok( store.modelFor( 'foo' ) === Foo );
});

test( 'modelFor: should return the model "Bar" for type "bar" ', function( assert ) {
    assert.ok( store.modelFor( 'bar' ) === Bar );
});

test( 'adapterFor: should return the adapter ajax for model type foo', function( assert ) {
    assert.ok( store.adapterFor( 'foo' ) instanceof AjaxAdapter );
});

test( 'adapterFor: should return the adapter localstorage for model type bar', function( assert ) {
    assert.ok( store.adapterFor( 'bar' ) instanceof LocalstorageAdapter );
});

test( 'findOne: should call __find with correct args', function( assert ) {
    var options = { "otherId":1 },
        args;

    store.findOne( 'foo', options );

    assert.ok( store.__find.calledWith( 'foo', null, options, true ) );
});

test( 'find should call __find with numeric id', function( assert ) {
    var options = { "otherId": 1 };
    store.find( 'foo', 1, options );
    assert.ok( store.__find.calledWith( 'foo', 1, options, false ) );
});

test( 'find should call __find with object for first param', function( assert ) {
    var options = { "otherId": 1 };
    store.find( 'foo', options );
    assert.ok( store.__find.calledWith( 'foo', null, options, false ) );
});

test( 'find should call __find with only the type', function( assert ) {
    store.find( 'foo' );
    assert.ok( store.__find.calledWith( 'foo', null, null, false ) );
});

test( '__find should have called modelFor', function( assert ) {
    store.__find( 'foo', 1, {}, false );
    assert.ok( store.modelFor.calledWith( 'foo' ) );
});

test( '__find should have called adapterFor', function( assert ) {
    store.__find( 'foo', 1, {}, false );
    assert.ok( store.adapterFor.calledWith( 'foo' ) );
});

test( '__find should have called AjaxAdapter.find', function( assert ) {
    store.__find( 'foo', 1, {}, false );
    assert.ok( ajaxAdapter.find.calledWith( 'foo', 1, {}, false ) );
});

test( 'createRecord should have called modelFor', function( assert ) {
    store.createRecord( 'foo' );
    assert.ok( store.modelFor.calledWith( 'foo' ) );
});

test( 'createRecord should have called Foo.create once', function( assert ) {
    store.createRecord( 'foo' );
    assert.ok( Foo.create.calledOnce );
});

test( 'createRecord should have called Foo.create with an object container', function( assert ) {
    store.createRecord( 'foo' );
    assert.ok( Foo.create.calledWith( { container: store.container } ) );
});

test( 'registerPreQueryHook should add an entry to preQueryHooks', function( assert ) {
    store.registerPreQueryHook( queryHook );
    assert.ok( store.get( 'preQueryHooks' ).length === 1 );
});

test( 'runPreQueryHooks should run query hook once', function( assert ) {
    store.registerPostQueryHook( queryHook );
    store.runPostQueryHooks();
    assert.ok( queryHook.calledOnce );
});
