module SlModel from 'sl-model';

export default {
    name: 'slmodel-localstorage',
    after: 'sl-model',

    initialize: function( container ) {

        container.register('adapter:localstorage', SlModel.LocalstorageAdapter );

    }
};
