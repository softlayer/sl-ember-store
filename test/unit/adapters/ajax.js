import Model from "sl-model";
import Adapter from 'sl-model/adapter';
import Ajaxdapter from 'sl-model/adapters/ajax';
module icAjax from 'ic-ajax';

chai.should();

var expect = chai.expect,
    ajaxdapter,
    Foo = Model.extend(),
    Bar = Model.extend(),
    defineFixture = icAjax.defineFixture;

describe( 'sl-model/adapter/ajax', function(){

    beforeEach( function(){
        console.log( 'setting up ajaxdapter' );

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
                    return this.registry.findBy( 'key', key ).factory;
                }
            }
        });
        ajaxdapter.container.cache['store:main']={ get: function(){ return []; } };
        ajaxdapter.container.registry.push( { key: 'model:foo', factory: Foo } );
        ajaxdapter.container.registry.push( { key: 'model:bar', factory: Bar } );
        defineFixture( '/foo', {
            response: { id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } },
            jqXHR: {},
            testStatus: 'success'
        });
        Foo.reopenClass( { url: '/foo'});
        Bar.reopenClass( { url: '/bar'});
    });

    describe( '__find', function(){
        var ajaxSpy;

        beforeEach(function(){
            ajaxSpy = sinon.spy( icAjax, 'request' );
        });
        afterEach(function(){
            ajaxSpy.restore();
            ajaxdapter.clearCache();
            ajaxdapter.clearRequestCache();
        });
        it( 'should call generateCacheKey', function(){
            sinon.spy(ajaxdapter, 'generateCacheKey');
            var response = ajaxdapter.__find( Foo, 1 );
            expect( ajaxdapter.generateCacheKey.calledOnce );
        });

        it( 'should call $.ajax with the correct arguments', function(){
            var response = ajaxdapter.__find( Foo, 1 );

            icAjax.request.should.calledOnce;
            expect( ajaxSpy.args[0][0].url ).to.equal( '/foo' );
            expect( ajaxSpy.args[0][0].data.id ).to.equal( 1 );

        });

        it( 'should return a promise proxy', function(){
            var response = ajaxdapter.__find( Foo, 1 );

            expect( response.then ).to.exist;

        });

        it( 'should add and remove a request to the requestCache', function(){
            var addRequestCacheSpy = sinon.spy( ajaxdapter, 'addToRequestCache' ),
                removeRequestCacheSpy = sinon.spy( ajaxdapter, 'removeFromRequestCache' ),
                request = ajaxdapter.__find( Foo, 1 );

            addRequestCacheSpy.should.have.been.calledOnce;

            request.then(function(){
                removeRequestCacheSpy.should.have.been.calledOnce;
            });

        });

        it( 'should return a promise proxy with model from cache, if cached', function(){

        });

        it( 'should return promise proxy with in flight promise, if inflight promise found', function(){

        });
    });

    describe( 'save', function(){
        it( 'should call $.ajax with the right options', function(){

        });

        it( 'should return a promise', function(){

        });
    });

    describe( 'delete', function(){

    });
});