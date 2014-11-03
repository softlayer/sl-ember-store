import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Store from 'sl-model/store';
import AjaxAdapter from 'sl-model/adapters/ajax';
import LocalstorageAdapter from 'sl-model/adapters/localstorage';

var App,
    container;

module( 'Unit - initializer: sl-model;', {
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
        appController = container.lookup( 'controller:application' ),
        ajaxAdapter = container.lookup( 'adapter:ajax' ),
        store = container.lookup( 'store:main' );

    equal( appRoute.get( 'store' ), store );
    equal( appController.get( 'store' ), store );
    equal( ajaxAdapter.get( 'store' ), store );
});
