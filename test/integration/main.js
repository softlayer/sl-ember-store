import Resolver from "ember/resolver";
import loadInitializers from 'ember/load-initializers';
import slModelInitializer from "sl-model/initializers/main";
import SlModel from "sl-model";

module icAjax from 'ic-ajax';

var expect = chai.expect,
    defineFixture = icAjax.defineFixture,
    lookupFixture = icAjax.lookupFixture,
    AppClass,
    App,
    initializerSpy,
    container, 
    store,
    Foo,
    fooResponse,
    Bar,
    barResponse,
    Car,
    carResponse;

App = Ember.Application.create({
    modulePrefix: 'SlModelTest',
    Resolver: Resolver,
    rootElement: '#SlModelTest',
    testing: true
});

App.setupForTesting();
App.injectTestHelpers();

initializerSpy = sinon.spy( slModelInitializer, 'initialize' );

loadInitializers( App, 'sl-model' );



//set up models
define('SlModelTest/models/foo', [ ] , function(){  
    Foo = SlModel.extend(); 
    Foo.reopenClass({ url: '/foo' });
    return Foo;
});
define('SlModelTest/models/bar', [ ] , function(){  
    Bar = SlModel.extend(); 
    Bar.reopenClass({ url: '/bar' });
    return Bar;
});
define('SlModelTest/models/car', [ ] , function(){  
    Car = SlModel.extend(); 
    Car.reopenClass({ url: '/car' });
    return Car;
});


//set up icAjax
fooResponse = { id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } };
barResponse = { id: 1, test: 'bar', 'car': { id: 1, color: 'black' } };
carResponse = [ { id: 1, color: 'blue' }, { id: 2, color: 'black' } ];

defineFixture( '/foo', {
    response: fooResponse,
    jqXHR: {},
    textStatus: 'success'
});
defineFixture( '/bar', {
    response:  barResponse,
    jqXHR: {},
    textStatus: 'success'
});
defineFixture( '/car', {
    response: carResponse ,
    jqXHR: {},
    textStatus: 'success'
});



describe.only( 'sl-model:', function(){
    beforeEach(function(done){
        //set up ember app
        visit( '/' ).then(function(){
            container = App.__container__;
            store = container.lookup( 'store:main');
            done();
        });
    });
    
    afterEach( function(){
        App.reset();
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
        store.find( 'foo', 1 ).should.be.instanceof( Foo );
    });

    it( 'should find a single Foo model with correct content', function( done ){
        var fooRecord = store.find( 'foo', 1 );
        fooRecord.then(function(){
            var ajaxAdapter = container.lookup('adapter:ajax'),
                fooModelized = ajaxAdapter.modelize( fooResponse );
            fooRecord.get('content').should.deep.equal( fooModelized );
            done();
        },function(err){
            done(err);
        });
    });

    it( 'should find a single Bar model using findOne', function(){
        store.findOne( 'bar' ).should.be.instanceof( Bar );
    });

    it( 'should find a single Bar model, using findOne, with correct content', function( done ){
        var barRecord = store.find( 'bar', 1 );
        barRecord.then(function(){
            var ajaxAdapter = container.lookup('adapter:ajax'),
                barModelized = ajaxAdapter.modelize( barResponse );
            barRecord.get('content').should.deep.equal( barModelized );
            done();
        },function(err){
            done(err);
        });
    });

    it( 'should find an array of Car models', function(){
        store.find( 'car' ).should.be.instanceof( Ember.ArrayProxy );
    });

    it( 'should find an array of Car models, with correct content', function( done ){
        var carRecords = store.find( 'car', 1 );
        carRecords.then(function(){
            var ajaxAdapter = container.lookup('adapter:ajax'),
                carModelized = ajaxAdapter.modelize( carResponse );
            carRecords.get('content').should.deep.equal( carModelized );
            done();
        },function(err){
            done(err);
        });
    });    

});