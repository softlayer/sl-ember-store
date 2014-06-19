import Model from "sl-model";
import Adapter from 'sl-model/adapter';

chai.should();

var expect = chai.expect,
    adapter,
    store = {
        runPostQueryHooks: sinon.spy(),
        runPreQueryHooks: sinon.spy()
    };


describe( 'sl-model/adapter', function(){
    
    beforeEach( function(){

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
        
    });

    after(function(){
        adapter.clearCache();
        adapter.clearRequestCache();
    });
    
    describe( 'generateCacheKey', function(){
        it( 'should generate a correct cache key', function(){
            var key = adapter.generateCacheKey( '/foo', { id: 1} );
            expect( key ).to.be.equal( '/foo{"id":1}');
        });

    });

    describe( 'addToCache', function(){
        it( 'should add a string to the cache', function(){
            adapter.addToCache( '/foo', {id:1}, 'test');
            expect( adapter.cache[ adapter.generateCacheKey( '/foo', {id:1} ) ] ).to.be.equal( 'test' );
        });
    });
    
    describe( 'removeFromCache', function(){
        it( 'should remove a key from the cache', function(){
            adapter.addToCache( '/foo', {id:1}, 'test');
            adapter.removeFromCache( '/foo', {id:1} );
            expect( adapter.cache[ adapter.generateCacheKey( '/foo', {id:1} ) ] ).to.be.undefined;
        });
    });
    describe( 'clearCache', function(){
        it( 'should remove all keys from the cache', function(){
            adapter.addToCache( '/foo', {id:1}, 'test');
            adapter.addToCache( '/bar', {id:1}, 'test');
            adapter.clearCache();

            Object.keys( adapter.cache ).should.be.empty;

        });
    });

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