import Model from 'sl-ember-store/model';

var Foo = Model.extend({
});

Foo.reopenClass({
    url: '/foo'
});

export default Foo;
