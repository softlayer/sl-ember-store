import SlEmberModel from 'sl-ember-model/model';

var Foo = SlEmberModel.extend({
});

Foo.reopenClass({
    url: '/foo'
});

export default Foo;
