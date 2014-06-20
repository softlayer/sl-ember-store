
import Resolver from "ember/resolver";
module slModel from "sl-model"
module icAjax from 'ic-ajax';

chai.should();

var expect = chai.expect,
    initializerSpy,
    container, 
    store,
    Foo,
    fooResponse,
    Bar,
    barResponse,
    Car,
    carResponse;

describe( 'sl-model:', function(){
    before( function(){
        //set up ember app
        //set up models
        //set up icAjax 
    });

    it( 'should run the initializer', function(){
        initializerSpy.should.have.been.calledOnce;
    });

    it( 'should register the store in the container', function(){
        container.lookup( 'store:main' ).should.exist;
    });

    it( 'should register the ajax adapter in the container', function(){
        container.lookup( 'adapter:ajax' ).should.exist;
    });

    it( 'should inject the store in a route', function(){
        container.lookup( 'route:application' ).get( 'store' ).should.exist;
    });

    it( 'should inject the store in a controller', function(){
        container.lookup( 'controller:application' ).get( 'store' ).should.exist;
    });

    it( 'should find a single Foo model', function(){
        return store.find( 'foo', 1 ).should.eventually.be.instanceOf( Foo );
    });

    it( 'should find a single Foo model with correct content', function(){
        return store.find( 'foo', 1 ).should.eventually.equal( fooResponse );
    });

    it( 'should find a single Bar model using findOne', function(){
        return store.findOne( 'bar' ).should.eventually.be.instanceOf( Foo );
    });

    it( 'should find a single Bar model, using findOne, with correct content', function(){
        return store.findOne( 'bar' ).should.eventually.equal( barResponse );
    });

    it( 'should find an array of Car models', function(){
        return store.find( 'car' ).should.eventually.be.an( 'array' );
    });

    it( 'should find an array of Car models, with correct content', function(){
        return store.findOne( 'car' ).should.eventually.equal( barResponse );
    });    

});