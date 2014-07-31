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
    localStorage,
    initializerSpy,
    container,
    store,
    Foo,
    fooResponse,
    Bar,
    barResponse,
    Car,
    carResponse,
    superCarResponse,
    crappyCarResponse,
    Dog,
    dog;

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

localStorage =  {
                    _ns: 'testLSObject',
                    setItem: function( item, content ){
                        this[item] = content;
                    },
                    getItem: function( item ){
                        return this[item];
                    }
                };

//set up models
define('SlModelTest/models/foo', [] , function(){
    Foo = SlModel.extend();
    Foo.reopenClass({ url: '/foo' });
    return Foo;
});
define('SlModelTest/models/bar', [] , function(){
    Bar = SlModel.extend();
    Bar.reopenClass({ url: '/bar' });
    return Bar;
});
define('SlModelTest/models/car', [ ] , function(){
    Car = SlModel.extend();
    Car.reopenClass({
        url: '/car',
        serializer: function( response, store ){
            return response.response;
        },
        endpoints: {
            'superCar': '/superCar',
            'crappyCar': {
                get: {
                    url: '/crappyCar',
                    serializer: function( response, store ){
                        return response.cars;
                    }
                }
            }
        }

    });
    return Car;
});

define('SlModelTest/models/dog', [ ] , function(){
    Dog = SlModel.extend();
    Dog.reopenClass({ url: '/dog', adapter: 'localstorage' });
    return Dog;
});

//set up icAjax
fooResponse = { id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } };
barResponse = { id: 1, test: 'bar', 'car': { id: 1, color: 'black' } };
carResponse = {
    response: [
        { id: 1, color: 'blue' },
        { id: 2, color: 'black' },
        { id: 3, color: 'white' }
    ],
    totalCount: 3,
    totalPages: 1
};

superCarResponse = {
    response: [
        { id: 11, color: 'super blue' },
        { id: 12, color: 'super black' },
        { id: 13, color: 'super white' }
    ],
    totalCount: 3,
    totalPages: 1
};

crappyCarResponse = {
    cars: [
        { id: 21, color: 'dull blue' },
        { id: 22, color: 'washed out black' },
        { id: 23, color: 'dingy white' }
    ],
    totalCount: 3,
    totalPages: 1
};

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
defineFixture( '/superCar', {
    response: superCarResponse,
    jqXHR: {},
    textStatus: 'success'
});
defineFixture( '/crappyCar', {
    response: crappyCarResponse,
    jqXHR: {},
    textStatus: 'success'
});

describe( 'sl-model:Integration', function(){
    beforeEach(function(done){
        //set up ember app
        visit( '/' ).then(function(){
            container = App.__container__;
            container.lookup('adapter:localstorage').set( 'localStorageMockup', localStorage );
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

    it( 'should create a new record', function(){
        var fooRecord = store.createRecord( 'foo', {test: true});
        fooRecord.get('test').should.equal( true );
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

    it( 'should find an array of Car models', function( done ){
        var cars = store.find( 'car' )

        cars.should.be.instanceof( Ember.ArrayProxy );

        cars.then( function(){
            done();
        }).catch( function( reason ){
            done( reason );
        });

    });

    it( 'should find an array of Car models, with correct content', function( done ){
        var carRecords = store.find( 'car' );
        carRecords.then(function(){
            var ajaxAdapter = container.lookup('adapter:ajax'),
                carModelized = ajaxAdapter.modelize( carResponse );
            expect( carRecords.get('content').mapBy('id') ).to.deep.equal( carModelized.response.mapBy('id') );
            done();
        },function(err){
            done(err);
        });
    });


    it( 'should find an array of superCar models, with correct content, using an endpoint', function( done ){
        var carRecords = store.find( 'car', { endpoint: 'superCar' } );
        carRecords.then(function(){
            var ajaxAdapter = container.lookup('adapter:ajax'),
                carModelized = ajaxAdapter.modelize( superCarResponse );
            expect( carRecords.get('content').mapBy('id') ).to.deep.equal( carModelized.response.mapBy('id') );
            done();
        },function(err){
            done(err);
        });
    });

    it( 'should find an array of crappyCar models, with correct content, using an endpoint', function( done ){
        var carRecords = store.find( 'car', { endpoint: 'crappyCar' } );
        carRecords.then(function(){
            var ajaxAdapter = container.lookup('adapter:ajax'),
                carModelized = ajaxAdapter.modelize( crappyCarResponse );
            expect( carRecords.get('content').mapBy('id') ).to.deep.equal( carModelized.cars.mapBy('id') );
            done();
        },function(err){
            done(err);
        });
    });

    it( 'should save a newly created bar and return the model with an id', function( done ){
        var barRecord = store.createRecord( 'bar' );
        barRecord.save().then( function( response ){
            expect( barRecord.get('id') ).to.equal( 1 );
            done();
        });
    });

    it( 'should destroy a record when calling deleteRecord', function( done ){
        var barRecord = store.createRecord( 'bar', { test: false} );

        barRecord.set( 'test', true );

        barRecord.deleteRecord().then( function( response ){
            expect( barRecord.isDestroyed );
            done();
        });
    });

    it( 'should create a localstorage record', function(){
        var dogRecord = store.createRecord( 'dog', { test: false } );
        dogRecord.get( 'test' ).should.equal( false );
        dogRecord.set( 'test2', 42 );
        dogRecord.get( 'test2' ).should.equal( 42 );
    });

    it( 'should create a localstorage record and save it', function( done){
        var dogRecord = store.createRecord( 'dog', { test: 42 } );
        dogRecord.save().then(function( result ){
            var foundDog = store.findOne('dog');
            foundDog.get('test').should.equal(42);
            done();
        });
    });
});