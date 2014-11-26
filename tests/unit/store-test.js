import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Store from 'sl-ember-model/store';
import Model from 'sl-ember-model/model';

var Foo,
    Bar,
    store,
    AjaxAdapter,
    ajaxAdapter,
    LocalstorageAdapter,
    queryHook;

module( 'Unit - sl-ember-model/store', {

    setup: function() {
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
    teardown: function() {
        store.__find.restore();
        store.modelFor.restore();
        store.adapterFor.restore();
        ajaxAdapter.find.restore();
        Foo.create.restore();
        queryHook.reset();
    }
});

test( 'modelFor: should return the model "Foo" for type "foo" ', function() {
    ok( store.modelFor( 'foo' ) === Foo );
});

test( 'modelFor: should return the model "Bar" for type "bar" ', function() {
    ok( store.modelFor( 'bar' ) === Bar );
});

test( 'adapterFor: should return the adapter ajax for model type foo', function() {
    ok( store.adapterFor( 'foo' ) instanceof AjaxAdapter );
});

test( 'adapterFor: should return the adapter localstorage for model type bar', function() {
    ok( store.adapterFor( 'bar' ) instanceof LocalstorageAdapter );
});

test( 'findOne: should call __find with correct args', function() {
    var options = { "otherId":1 },
        args;

    store.findOne( 'foo', options );

    ok( store.__find.calledWith( 'foo', null, options, true ) );
});

test( 'find should call __find with numeric id', function() {
    var options = { "otherId": 1 };
    store.find( 'foo', 1, options );
    ok( store.__find.calledWith( 'foo', 1, options, false ) );
});

test( 'find should call __find with object for first param', function() {
    var options = { "otherId": 1 };
    store.find( 'foo', options );
    ok( store.__find.calledWith( 'foo', null, options, false ) );
});

test( 'find should call __find with only the type', function() {
    store.find( 'foo' );
    ok( store.__find.calledWith( 'foo', null, null, false ) );
});

test( '__find should have called modelFor', function() {
    store.__find( 'foo', 1, {}, false );
    ok( store.modelFor.calledWith( 'foo' ) );
});

test( '__find should have called adapterFor', function() {
    store.__find( 'foo', 1, {}, false );
    ok( store.adapterFor.calledWith( 'foo' ) );
});

test( '__find should have called AjaxAdapter.find', function() {
    store.__find( 'foo', 1, {}, false );
    ok( ajaxAdapter.find.calledWith( 'foo', 1, {}, false ) );
});

test( 'createRecord should have called modelFor', function() {
    store.createRecord( 'foo' );
    ok( store.modelFor.calledWith( 'foo' ) );
});

test( 'createRecord should have called Foo.create once', function() {
    store.createRecord( 'foo' );
    ok( Foo.create.calledOnce );
});

test( 'createRecord should have called Foo.create with an object container', function() {
    store.createRecord( 'foo' );
    ok( Foo.create.calledWith( { container: store.container } ) );
});

test( 'registerPreQueryHook should add an entry to preQueryHooks', function() {
    store.registerPreQueryHook( queryHook );
    ok( store.get( 'preQueryHooks' ).length === 1 );
});

test( 'runPreQueryHooks should run query hook once', function() {
    store.registerPostQueryHook( queryHook );
    store.runPostQueryHooks();
    ok( queryHook.calledOnce );
});
