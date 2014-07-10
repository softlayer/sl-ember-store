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
        var LocalstorageAdapter = SlModel.LocalstorageAdapter.extend();

        LocalstorageAdapter.reopenClass({
            namespace: container.lookup('application:main').get('modulePrefix')
        });

        container.register('store:main', SlModel.Store );

        container.register('adapter:ajax', SlModel.AjaxAdapter );

        container.register('adapter:localstorage', LocalstorageAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');

    }
};