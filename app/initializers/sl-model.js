import Store from 'sl-model/store';
import AjaxAdapter from 'sl-model/adapters/ajax';
import LocalstorageAdapter from 'sl-model/adapters/localstorage';

/**
 * SL-Model/initializers/main
 *
 *
 * @class initializers_main
 */
export default {

    name: 'sl-model',

    initialize: function ( container, application ) {
        var localstorageAdapter = LocalstorageAdapter.extend();

        localstorageAdapter.reopenClass({
            namespace: container.lookup('application:main').get('modulePrefix')
        });

        container.register('store:main', Store );

        container.register('adapter:ajax', AjaxAdapter );

        container.register('adapter:localstorage', localstorageAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');
        
        application.inject('adapter', 'store', 'store:main');

    }
};
