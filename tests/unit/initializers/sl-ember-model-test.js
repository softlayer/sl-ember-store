import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Store from 'sl-ember-model/store';
import AjaxAdapter from 'sl-ember-model/adapters/ajax';
import LocalstorageAdapter from 'sl-ember-model/adapters/localstorage';

var App,
    container;

module( 'Unit - initializer: sl-ember-model', {
    setup: function() {
        App = startApp();
        container = App.__container__;
    },

    teardown: function() {
        Ember.run( App, App.destroy );
    }
});

test( 'LocalStorage adapter gets namespace set', function(){
    var lsAdapter = container.lookupFactory( 'adapter:localstorage' );
    equal( lsAdapter.namespace, container.lookup( 'application:main' ).get( 'modulePrefix' ) );
});

test( 'store:main gets registered', function(){
    var store = container.lookupFactory( 'store:main' );
    ok( Store.detect( store ) );
});

test( 'adapter:ajax gets registered', function(){
    var ajaxAdapter = container.lookupFactory( 'adapter:ajax' );
    ok( AjaxAdapter.detect( ajaxAdapter ) );
});

test( 'adapter:localstorage gets registered', function(){
    var lsAdapter = container.lookupFactory( 'adapter:localstorage' );
    ok( LocalstorageAdapter.detect( lsAdapter ) );
});

test( 'store gets injected into controllers, routes, adapters', function(){
    var appRoute = container.lookup( 'route:application' ),
        appController,
        ajaxAdapter = container.lookup( 'adapter:ajax' ),
        store = container.lookup( 'store:main' );

    expect( 3 );

    equal( appRoute.get( 'store' ), store );
    equal( ajaxAdapter.get( 'store' ), store );

    visit( '/' ).then(function() {
        appController = container.lookup( 'controller:application' );
        equal( appController.get( 'store' ), store );
    });
});
