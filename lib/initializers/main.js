'use strict';

import Store from '../store';
import Adapter from '../adapter';
import AjaxAdapter from '../adapters/ajax';
import LocalAdapter from '../adapters/localstorage';

export default {

    name: 'interface-model',

    initialize: function ( container, application ) {

        container.register('store:main', Store );

        container.register('adapter:default', Adapter );

        container.register('adapter:ajax', AjaxAdapter );

        container.register('adapter:localstorage', LocalAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');

    }
};