import Model from "sl-model";
import Adapter from 'sl-model/adapter';
import Ajaxdapter from 'sl-model/adapters/ajax';
module icAjax from 'ic-ajax';

chai.should();

var expect = chai.expect,
    ajaxdapter,
    Foo = Model.extend(),
    Bar = Model.extend(),
    Car = Model.extend(),    
    defineFixture = icAjax.defineFixture,
    response,    
    requestSpy;

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
        ajaxdapter.container.registry.push( { key: 'model:bar', factory: Car } );

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
        defineFixture( '/car', {
            response:  [],
            jqXHR: {},
            testStatus: 'success'
        });
        Foo.reopenClass( { url: '/foo'});
        Bar.reopenClass( { url: '/bar'});
        Car.reopenClass( { url: '/car'});

        //spies
        requestSpy = sinon.spy( icAjax, 'request' );

    });

    describe( '__find single model with id', function(){
        beforeEach(function( done ){
            //request
            response = ajaxdapter.find( Foo, 1 );
            
            response.then( function(){
                    done();
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
            response.finally( function(){
                    done();
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
            response.finally( function(){
                    done();
            });
        });

        ajaxTestSuite();

        it( 'should return an instance of Ember.ArrayProxy', function(){
            response.should.be.instanceOf( Ember.ArrayProxy );
        });

        it( 'should return an array of Bar models', function(){
            response.content[0].should.to.be.instanceOf( Bar );
            response.content[1].should.to.be.instanceOf( Bar );
        });
    });
    
    describe( '__find array with zero items', function(){
        beforeEach(function( done ){
            var options =  {data: {main: true }};
            //request
            response = ajaxdapter.find( Car, null, options, false );
            response.finally(function(){done();});
        });

        it( 'should reject the promise', function( done){
            response.then(function(){
                done(  new Error("error: should not have resolved the find" ));
            },function(reason){
                done();
            });
        });
        it( 'should still be an array', function(){
            response.should.be.instanceOf( Ember.ArrayProxy );
        });
        it( 'should be an empty array', function(){
            response.get('length').should.equal(0);
        });

        after( function(){
            requestSpy.reset();
        });
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
            response = ajaxdapter.deleteRecord( '/foo', 1 );
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
    });    

    it( 'should call icAjax.request once', function(){
        requestSpy.should.be.calledOnce;
    });

    it( 'should return a promise proxy', function(){
        response.then.should.exist;
        expect( Ember.PromiseProxyMixin.detect( response ) );

    });

}

function singleObjectAjaxTestSuite(){
    it( 'should return an instanceof Foo', function(){
        response.should.be.instanceOf( Foo );
    });
}


