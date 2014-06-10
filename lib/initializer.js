'use strict';

import Ember from 'ember';
import Store from './store';
import AjaxAdapter from './adapters/ajax';
import LocalAdapter from './adapters/localstorage';


export default Ember.Application.initialize({

    name: 'interface-model',

    initialize: function ( container, application ) {

        container.register('store:main', Store );

        container.register('adapter:default', Store );

        container.register('adapter:ajax', AjaxAdapter );

        container.register('adapter:localstorage', LocalAdapter );

        application.inject('controller', 'store', 'store:main');

        application.inject('route', 'store', 'store:main');

    }
});