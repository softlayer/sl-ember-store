module SlEmberModelLocalstorageAdapter from 'sl-ember-model/adapters/localstorage';

export default {
    name: 'sl-ember-model-localstorage',
    after: 'sl-ember-model',

    initialize: function( container ) {
        var localStorageAdapter = SlEmberModelLocalstorageAdapter.extend();

        localStorageAdapter.reopenClass({
            namespace: '<%= namespace %>'
        });

        container.register('adapter:localstorage', localStorageAdapter );

    }
};
