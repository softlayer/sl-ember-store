'use strict';

import Ember from 'ember';
import Store from 'store';
import AjaxAdapter from 'adapters/ajax';

export default Ember.Application.initializer({

    name: 'store',

    initialize: function ( container, application ) {

        container.register('store:main', Store );

        container.register('adapter:ajax', AjaxAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');

    }
});