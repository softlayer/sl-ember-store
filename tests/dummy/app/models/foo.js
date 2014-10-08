import SlModel from 'sl-model/model';

var Foo = SlModel.extend({
});

Foo.reopenClass({
    url: '/api/foo',
    serializer: function( result ){
        return result.foo;
    }
});

export default Foo;
