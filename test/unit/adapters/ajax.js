import Model from "sl-model";
import Adapter from 'sl-model/adapter';
import Ajaxdapter from 'sl-model/adapters/ajax';
module icAjax from 'ic-ajax';

chai.should();

var expect = chai.expect,
    ajaxdapter,
    Foo = Model.extend(),
    Bar = Model.extend(),
    defineFixture = icAjax.defineFixture,
    response,
    responseFromCache,
    responseFromRequestCache,
    requestSpy,
    generateCacheKeySpy,
    addRequestCacheSpy,
    removeRequestCacheSpy;

describe( 'sl-model/adapter/ajax', function(){

    before( function( ){

        ajaxdapter = Ajaxdapter.create({
            container: {
                registry: [],
                cache: {},
                normalize: function( key ){
                    return key;
                },
                lookup: function( key ){
                    if( this.cache[key] ) return this.cache[key];

                    var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                    this.cache[key] = obj;
                    return obj;
                },
                lookupFactory: function( key ){
                    var item = this.registry.findBy( 'key', key );
                    return item ? item.factory : undefined;
                }
            }
        });

        //register mock data
        ajaxdapter.container.cache['store:main']={
            runPostQueryHooks: sinon.spy(),
            runPreQueryHooks: sinon.spy()
        };

        ajaxdapter.container.registry.push( { key: 'model:foo', factory: Foo } );
        ajaxdapter.container.registry.push( { key: 'model:bar', factory: Bar } );
        defineFixture( '/foo', {
            response: { id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } },
            jqXHR: {},
            testStatus: 'success'
        });
        defineFixture( '/bar', {
            response:  [ { id: 1, quiz: 'bar' }, { id: 2, quiz: 'bar2' } ],
            jqXHR: {},
            testStatus: 'success'
        });
        Foo.reopenClass( { url: '/foo'});
        Bar.reopenClass( { url: '/bar'});

        //spies
        requestSpy = sinon.spy( icAjax, 'request' );
        generateCacheKeySpy = sinon.spy(ajaxdapter, 'generateCacheKey');
        addRequestCacheSpy = sinon.spy( ajaxdapter, 'addToRequestCache' );
        removeRequestCacheSpy = sinon.spy( ajaxdapter, 'removeFromRequestCache' );


    });

    describe( '__find single model with id', function(){
        beforeEach(function( done ){
            //request
            response = ajaxdapter.find( Foo, 1 );
            responseFromRequestCache = ajaxdapter.find( Foo, 1 );
            response.then( function(){
                responseFromCache = ajaxdapter.find( Foo, 1 );
                responseFromCache.then( function(){
                    done();
                });
            });
        });


        it( 'should call icAjax.request with the correct arguments', function(){
            expect( requestSpy.args[0][0].url ).to.equal( '/foo' );
            expect( requestSpy.args[0][0].data.id ).to.equal( 1 );
        });

        ajaxTestSuite();

        singleObjectAjaxTestSuite();

    });

    describe( '__find single model with no id', function(){
        beforeEach(function( done ){
            var options =  {data: {main: true }};
            //request
            response = ajaxdapter.find( Foo, null, options, true );
            responseFromRequestCache = ajaxdapter.find( Foo, null, options, true );
            response.then( function(){
                responseFromCache = ajaxdapter.find( Foo, null, options, true );
                responseFromCache.then( function(){
                    done();
                })
            });
        });

        it( 'should call icAjax.request with the correct arguments', function(){
            expect( requestSpy.args[0][0].url ).to.equal( '/foo' );
            expect( requestSpy.args[0][0].data.main ).to.true;
        });

        ajaxTestSuite();

        singleObjectAjaxTestSuite();

    });

    describe( '__find array of models', function(){
        beforeEach(function( done ){
            var options =  {data: {main: true }};
            //request
            response = ajaxdapter.find( Bar, null, options, false );
            responseFromRequestCache = ajaxdapter.find( Bar, null, options, false );
            response.then( function(){
                responseFromCache = ajaxdapter.find( Bar, null, options, false );
                responseFromCache.then( function(){
                    done();
                })
            });
        });

        ajaxTestSuite()

        it( 'should return an instance of Ember.ArrayProxy', function(){
            response.should.be.instanceOf( Ember.ArrayProxy );
        });

        it( 'should return an array of Bar models', function(){
            response.content[0].should.to.be.instanceOf( Bar );
            response.content[1].should.to.be.instanceOf( Bar );
        })
    });

    describe( 'save', function(){
        before( function( done ){
            var foo = Foo.create({ test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
            response = ajaxdapter.save( '/foo', foo );
            response.then( function(){ done(); } );
        });
        after( function(){
            requestSpy.reset();
        });

        it( 'should call icAjax.request once', function(){
            requestSpy.should.be.calledOnce;
        });
        it( 'should call $.ajax with the correct arguments', function(){
            expect( requestSpy.args[0][0].url ).to.equal( '/foo' );
            expect( requestSpy.args[0][0].type ).to.equal( 'POST' );
            expect( requestSpy.args[0][0].data ).to.be.a( 'string' );
        });

        it( 'should return a promise proxy', function(){
            response.then.should.exist;
        });

    });

    describe( 'delete', function(){
        before(function( done ){
            //request
            var foo = Foo.create({ id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } });
            response = ajaxdapter.deleteRecord( '/foo', foo );
            response.then( function(){ done(); });
        });
        after( function(){
            requestSpy.reset();
        });
        it( 'should call icAjax.request once', function(){
            requestSpy.should.be.calledOnce;
        });

        it( 'should call $.ajax with the correct arguments', function(){
            expect( requestSpy.args[0][0].url ).to.equal( '/foo' );
            expect( requestSpy.args[0][0].type ).to.equal( 'DELETE' );
            expect( requestSpy.args[0][0].data ).to.be.a( 'string' );
            expect( requestSpy.args[0][0].data ).to.equal( JSON.stringify({ id: 1}) );

        });

        it( 'should return a promise proxy', function(){
            response.then.should.exist;
        });

    });
});


function ajaxTestSuite(){
    afterEach(function(){
        //reset spies
        requestSpy.reset();
        generateCacheKeySpy.reset();
        addRequestCacheSpy.reset();
        removeRequestCacheSpy.reset();
        ajaxdapter.clearCache();
        ajaxdapter.clearRequestCache();
    });

    it( 'should call generateCacheKey', function(){
        expect( ajaxdapter.generateCacheKey.calledOnce );
    });

    it( 'should call icAjax.request once', function(){
        requestSpy.should.be.calledOnce;
    });

    it( 'should return a promise proxy', function(){
        response.then.should.exist;
        expect( Ember.PromiseProxyMixin.detect( response ) );

    });

    it( 'should add and remove a request to the requestCache', function(){
        addRequestCacheSpy.should.have.been.calledOnce;
        removeRequestCacheSpy.should.have.been.calledOnce;
    });

    it( 'should return a promise proxy from cache, if cached', function(){
        responseFromCache.then.should.exist;
        expect( Ember.PromiseProxyMixin.detect( responseFromCache ) );
    });

    it( 'should return promise proxy with in flight promise, if inflight promise found', function(){
        responseFromRequestCache.then.should.exist;
        expect( Ember.PromiseProxyMixin.detect( responseFromRequestCache ) );

    });
}

function singleObjectAjaxTestSuite(){
    it( 'should return an instanceof Foo', function(){
        response.should.be.instanceOf( Foo );
    });

    it( 'should return and object from cache that is an instanceof foo', function(){
        responseFromCache.should.be.instanceOf( Foo );
    })

    it( 'should return an object from the request cache that is an instanceof foo', function(){
        responseFromRequestCache.should.be.instanceOf( Foo );
    })
}


