import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Adapter from 'sl-ember-store/adapter';

var adapter,
    store = {
        runPostQueryHooks: sinon.spy(),
        runPreQueryHooks: sinon.spy()
    };

module( 'Unit - sl-ember-store/adapter', {
    setup: function() {
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
    teardown: function() {
        store.runPostQueryHooks.reset();
        store.runPreQueryHooks.reset();
    }
});
test( 'runPreQueryHooks should run the prequeryhook once', function() {
    adapter.runPreQueryHooks();
    ok( store.runPreQueryHooks.calledOnce );
});

test( 'runPreQueryHooks should not have run postqueryhook', function() {
    adapter.runPreQueryHooks();
    equal( store.runPostQueryHooks.callCount,0 );
});

test( 'runPostQueryHooks should run the postqueryhook once', function() {
     adapter.runPostQueryHooks();
     ok( store.runPostQueryHooks.calledOnce );
});
test( 'runPostQueryHooks should not have run the prequeryhook', function() {
     adapter.runPostQueryHooks();
     equal( store.runPreQueryHooks.callCount,0 );
});
