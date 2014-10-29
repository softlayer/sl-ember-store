import SlModel from 'sl-model/model';

var Foo = SlModel.extend({
});

Foo.reopenClass({
    url: '/foo'
});

export default Foo;
