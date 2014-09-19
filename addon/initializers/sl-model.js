import Store from '../store';
import AjaxAdapter from '../adapters/ajax';
import LocalstorageAdapter from '../adapters/localstorage';

export default function ( container, application ) {
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

};
