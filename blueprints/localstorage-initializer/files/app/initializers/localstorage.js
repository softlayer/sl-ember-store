module SlEmberModelLocalstorageAdapter from 'sl-ember-store/adapters/localstorage';

export default {
    name: 'sl-ember-store-localstorage',
    after: 'sl-ember-store',

    initialize: function( container ) {
        var localStorageAdapter = SlEmberModelLocalstorageAdapter.extend();

        localStorageAdapter.reopenClass({
            namespace: '<%= namespace %>'
        });

        container.register('adapter:localstorage', localStorageAdapter );

    }
};
