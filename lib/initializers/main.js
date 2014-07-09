module SlModel from 'sl-model';

/**
 * SL-Model/initializers/main
 *
 *
 * @class initializers_main
 */
export default {

    name: 'sl-model',

    initialize: function ( container, application ) {
        var localStorageAdapter = SlModel.localStorageAdapter;

        localStorageAdapter.reopenClass({
            namespace: container.lookup('application:main').get('modulePrefix')
        });

        container.register('store:main', SlModel.Store );

        container.register('adapter:ajax', SlModel.AjaxAdapter );

        container.register('adapter:ajax', localStorageAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');

    }
};