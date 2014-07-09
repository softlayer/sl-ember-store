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

        container.register('store:main', SlModel.Store );

        container.register('adapter:ajax', SlModel.AjaxAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');

    }
};