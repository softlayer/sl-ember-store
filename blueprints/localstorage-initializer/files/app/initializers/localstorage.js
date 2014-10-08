module SlModelLocalstorageAdapter from 'sl-model/adapters/localstorage';

export default {
    name: 'sl-model-localstorage',
    after: 'sl-model',

    initialize: function( container ) {
        var localStorageAdapter = SlModelLocalstorageAdapter.extend();

        localStorageAdapter.reopenClass({
            namespace: '<%= namespace %>'
        });

        container.register('adapter:localstorage', localStorageAdapter );

    }
};
