import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Store from 'sl-ember-store/store';
import AjaxAdapter from 'sl-ember-store/adapters/ajax';
import LocalstorageAdapter from 'sl-ember-store/adapters/localstorage';

var App,
    container;

module( 'Unit - initializer: sl-ember-store', {
    beforeEach: function() {
        App = startApp();
        container = App.__container__;
    },

    afterEach: function() {
        Ember.run( App, App.destroy );
    }
});

test( 'LocalStorage adapter gets namespace set', function( assert ){
    var lsAdapter = container.lookupFactory( 'adapter:localstorage' );
    assert.equal( lsAdapter.namespace, container.lookup( 'application:main' ).get( 'modulePrefix' ) );
});

test( 'store:main gets registered', function( assert ){
    var store = container.lookupFactory( 'store:main' );
    assert.ok( Store.detect( store ) );
});

test( 'adapter:ajax gets registered', function( assert ){
    var ajaxAdapter = container.lookupFactory( 'adapter:ajax' );
    assert.ok( AjaxAdapter.detect( ajaxAdapter ) );
});

test( 'adapter:localstorage gets registered', function( assert ){
    var lsAdapter = container.lookupFactory( 'adapter:localstorage' );
    assert.ok( LocalstorageAdapter.detect( lsAdapter ) );
});

test( 'store gets injected into controllers, routes, adapters', function( assert ){
    var appRoute = container.lookup( 'route:demos/single-model' ),
        appController,
        ajaxAdapter = container.lookup( 'adapter:ajax' ),
        store = container.lookup( 'store:main' );

    assert.expect( 3 );

    assert.equal( appRoute.get( 'store' ), store );
    assert.equal( ajaxAdapter.get( 'store' ), store );

    visit( '/' ).then(function() {
        appController = container.lookup( 'controller:application' );
        assert.equal( appController.get( 'store' ), store );
    });
});
