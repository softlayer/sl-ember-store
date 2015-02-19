import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Adapter from 'sl-ember-store/adapter';

var adapter,
    store = {
        runPostQueryHooks: sinon.spy(),
        runPreQueryHooks: sinon.spy()
    };

module( 'Unit - sl-ember-store/adapter', {
    beforeEach: function() {
        adapter = Adapter.create({
            container:{
                lookup: function( type ){
                    if( type === 'store:main' )
                        return store;
                    else
                        Ember.Assert( 'Container could not find "'+type+'"', false);
                }
            }
        });
    },
    afterEach: function() {
        store.runPostQueryHooks.reset();
        store.runPreQueryHooks.reset();
    }
});
test( 'runPreQueryHooks should run the prequeryhook once', function( assert ) {
    adapter.runPreQueryHooks();
    assert.ok( store.runPreQueryHooks.calledOnce );
});

test( 'runPreQueryHooks should not have run postqueryhook', function( assert ) {
    adapter.runPreQueryHooks();
    assert.equal( store.runPostQueryHooks.callCount,0 );
});

test( 'runPostQueryHooks should run the postqueryhook once', function( assert ) {
     adapter.runPostQueryHooks();
     assert.ok( store.runPostQueryHooks.calledOnce );
});
test( 'runPostQueryHooks should not have run the prequeryhook', function( assert ) {
     adapter.runPostQueryHooks();
     assert.equal( store.runPreQueryHooks.callCount,0 );
});
