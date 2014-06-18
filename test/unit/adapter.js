import Model from "sl-model";
import Adapter from 'sl-model/adapter';

chai.should();

var expect = chai.expect,
    adapter,
    preHook = sinon.spy(function(){  }),
    postHook =  sinon.spy(function(){  });


describe( 'sl-model/adapter', function(){
    beforeEach( function(){
        sinon.spy( postHook );

        adapter = Adapter.create({
            container:{
                lookup: function(){
                    return {
                        get: function( type ){
                            if( type === 'preQueryHooks' )
                                return [ preHook ];
                            else
                                return [ postHook ];
                        }
                    };
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
            preHook.should.have.been.calledOnce;
        });
        it( 'should not have run postqueryhook', function(){
            postHook.should.have.callCount(0);
        });
        after(function(){
            preHook.reset();
            postHook.reset();
        });
    });
    describe( 'runPostQueryHooks', function(){
        before(function(){
            adapter.runPostQueryHooks();
        });
        it( 'should run the postqueryhook once', function(){
            postHook.should.have.been.calledOnce;
        });
        it( 'should not have run prequeryhook', function(){
            preHook.should.have.callCount(0);
        });
        after(function(){
            preHook.reset();
            postHook.reset();
        });
    });
});