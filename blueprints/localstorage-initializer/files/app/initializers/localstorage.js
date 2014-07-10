module SlModel from 'sl-model';

export default {
    name: 'sl-model-localstorage',
    after: 'sl-model',

    initialize: function( container ) {
        var localStorageAdapter = SlModel.LocalstorageAdapter.extend();

        localStorageAdapter.reopenClass({
            namspace: '<%= namespace %>'
        });

        container.register('adapter:localstorage', localStorageAdapter );

    }
};
