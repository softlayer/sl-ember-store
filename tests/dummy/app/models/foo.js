import Model from 'sl-ember-store/model';

var Foo = Model.extend({
});

Foo.reopenClass({
    url: '/foo',
    serializer: function( data, store ){
    	if( data.meta ){
    		store.metaForType( 'foo', data.meta );
    	}

    	return data.foo;
    }
});

export default Foo;
