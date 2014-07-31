import Model from "sl-model";
import Adapter from 'sl-model/adapter';

chai.should();

var expect = chai.expect,
    adapter= Adapter.create({
            container:{
                lookup: function( type ){
                    if( type === 'store:main' )
                        return store;
                    else
                        Ember.Assert( 'Container could not find "'+type+'"', false);
                }
            }
        }),
    store = {
        runPostQueryHooks: sinon.spy(),
        runPreQueryHooks: sinon.spy()
    };


describe( 'sl-model/adapter', function(){
    
    describe( 'runPreQueryHooks', function(){
        before(function(){
            adapter.runPreQueryHooks();
        });
        it( 'should run the prequeryhook once', function(){
            store.runPreQueryHooks.should.have.been.calledOnce;
        });
        it( 'should not have run postqueryhook', function(){
            store.runPostQueryHooks.should.have.callCount(0);
        });
        after(function(){
            store.runPreQueryHooks.reset();
            store.runPostQueryHooks.reset();
        });
    });
    describe( 'runPostQueryHooks', function(){
        before(function(){
            adapter.runPostQueryHooks();
        });
        it( 'should run the postqueryhook once', function(){
            store.runPostQueryHooks.should.have.been.calledOnce;
        });
        it( 'should not have run prequeryhook', function(){
            store.runPreQueryHooks.should.have.callCount(0);
        });
        after(function(){
            store.runPreQueryHooks.reset();
            store.runPostQueryHooks.reset();
        });
    });
});