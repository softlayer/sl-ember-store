import Store from '../store';
import AjaxAdapter from '../adapters/ajax';
import LocalstorageAdapter from '../adapters/localstorage';
import DebugAdapter from '../debug-adapter';

/**
 * @module initializers
 */

/*
 * Register sl-ember-store objects to consuming application
 *
 * @function sl-ember-store
 * @param    {Ember.ContainerView} container
 * @param    {Ember.Application}   application
 * @returns  {void}
 */
export default function( container, application ) {
    var localstorageAdapter = LocalstorageAdapter.extend();

    localstorageAdapter.reopenClass({
        namespace: container.lookup( 'application:main' ).get( 'modulePrefix' )
    });

    container.register( 'data-adapter:main', DebugAdapter );
    container.register( 'store:main', Store );
    container.register( 'adapter:ajax', AjaxAdapter );
    container.register( 'adapter:localstorage', localstorageAdapter );

    application.inject( 'controller', 'store', 'store:main' );
    application.inject( 'route', 'store', 'store:main' );
    application.inject( 'adapter', 'store', 'store:main' );
    application.inject( 'data-adapter', 'store', 'store:main' );
}