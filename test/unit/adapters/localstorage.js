import Model from "sl-model";
import Adapter from 'sl-model/adapter';
import LocalStorageAdapter from 'sl-model/adapters/localstorage';

chai.should();

var expect = chai.expect,
    localstoragedapter,
    Foo = Model.extend(),
    Bar = Model.extend(),
    Car = Model.extend(),
    localStorage,
    defineFixture,
    response,
    responseFromCache,
    responseFromRequestCache,
    requestSpy,
    saveSpy,
    store,
    container;

describe( 'sl-model/adapter/localstorage', function(){

    before( function( ){
        container = {
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
            };
        store = {
                container:container,
                runPostQueryHooks: sinon.spy(),
                runPreQueryHooks: sinon.spy(),
                createRecord: function( type, content ){
                    var record = this.modelFor( type ).create({conatainer:this.container}).set('content',content);
                    return record;
                },
                modelFor: function( type ){
                    return this.container.lookupFactory('model:'+type);
                }
            };


        localStorage = {
            _ns: 'testLSObject',
            setItem: function( item, content ){
                this[item] = content;
            },
            getItem: function( item ){
                return this[item];
            }
        };

        localstoragedapter = LocalStorageAdapter.create({
            container: container,
            store:store
        });

        //register mock data
        localstoragedapter.container.cache['store:main']={
            runPostQueryHooks: sinon.spy(),
            runPreQueryHooks: sinon.spy()
        };

        localstoragedapter.container.registry.push( { key: 'model:foo', factory: Foo } );
        localstoragedapter.container.registry.push( { key: 'model:bar', factory: Bar } );
        localstoragedapter.container.registry.push( { key: 'model:car', factory: Car } );

        localstoragedapter.set( 'localStorageMockup', localStorage );

        Foo.reopenClass( { url: '/foo' } );
        Bar.reopenClass( { url: '/bar' } );
        Car.reopenClass( { url: '/car' } );

        //spies
        requestSpy = sinon.spy( localStorage, 'getItem' );
        saveSpy = sinon.spy( localStorage, 'setItem' );


        localstoragedapter.save( '/foo',  {id: 1, test: 'foo', 'bar': { id: 1, quiz: 'bar' } } );

        localstoragedapter.save( '/bar', { id: 1, quiz: 'bar' } );

        localstoragedapter.save( '/bar', { id: 2, quiz: 'bar2' } );
    });

    describe( '__find single model with id', function(){
        beforeEach(function( done ){
            //request
            response = localstoragedapter.find( 'foo', 1, { label: '1' } );
            response.finally(function(){done();});
        });

        it( 'should call localStorage.getItem with the correct arguments', function(){
            expect( requestSpy.args[0][0] ).to.equal( 'sl-model' );
        });

        localstorageTestSuite();

        singleObjectTestSuite();

        it( 'should reject when no model was found', function( done ){
            response = localstoragedapter.find( 'car', 1, { label: '1' } );
            response.then( function(result){
                throw 'error, find should have been rejecteed' ;
            });
            response.catch( function(result){
                done();
            });
        });

    });



    describe( '__find single model with no id', function(){
        beforeEach(function(done){
            var options =  {data: {main: true }};
            //request
            response = localstoragedapter.find( 'foo', null, options, true );
            response.then(function(){done();});
        });

        it( 'should call localStorage.getItem with the correct arguments', function(){
            expect( requestSpy.args[0][0] ).to.equal( 'sl-model' );
        });

        localstorageTestSuite();

        singleObjectTestSuite();

        it( 'should reject when no model was found', function( done ){
            response = localstoragedapter.find( 'car', null, {data: {main: true }}, true );
            response.then( function(result){
                throw( 'error, find should have been rejecteed' );
            });
            response.catch( function(result){
                done();
            });
        });

    });

    describe( '__find array of models', function(){
        beforeEach(function( done ){
            var options =  {data: {main: true }};
            //request
            response = localstoragedapter.find( 'bar', null, options, false );
            response.then(function(){done();});
        });

        localstorageTestSuite();

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
            response = localstoragedapter.find( 'car', null, options, false );
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
            var fooContent = { id: 2, test: 'foo', 'bar': { id: 1, quiz: 'bar2' } },
                foo = Foo.create( fooContent );
            response = localstoragedapter.save( '/foo', foo );
            response.then( function(){ done(); } );
        });
        after( function(){
            requestSpy.reset();
        });

        it( 'should call localStorage.getItem once', function(){
            requestSpy.should.be.calledOnce;
        });

        it( 'should return a promise proxy', function(){
            response.then.should.exist;
        });

        it( 'should add the record to the localStorage mock object', function(){
            var fooRecords = Ember.A( JSON.parse(localStorage.getItem('sl-model')).foo ),
                fooRecord = fooRecords.findBy( 'id', 2 );

            expect( fooRecord.id ).to.equal( 2 );

        });

    });

    describe( 'delete', function(){
        before(function( done ){
            //request
            var response = localstoragedapter.deleteRecord( '/foo', 2 );
            response.then( function(){ done(); });
        });
        after( function(){
            requestSpy.reset();
        });
        it( 'should call localStorage.getItem once', function(){
            requestSpy.should.be.calledOnce;
        });

        it( 'should return a promise proxy', function(){
            response.then.should.exist;
        });

        it( 'should delete the record from the localStorage mock object', function(){

            var fooRecords = Ember.A( JSON.parse(localStorage.getItem('sl-model')).foo ),
                fooRecord = fooRecords.findBy( 'id', 2 );

            expect( fooRecord ).to.be.undefined;

        });

    });
});


function localstorageTestSuite(){
    afterEach(function(){
        //reset spies
        requestSpy.reset();
    });

    it( 'should return a promise proxy', function(){
        response.then.should.exist;
        expect( Ember.PromiseProxyMixin.detect( response ) );

    });


}

function singleObjectTestSuite(){
    it( 'should return an instanceof Foo', function(){
        response.get('content').should.be.instanceOf( Foo );
    });
}


