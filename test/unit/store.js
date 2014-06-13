import Model from "sl-model";
import Store from 'sl-model/store';

var expect = chai.expect;

describe( 'store', function(){

    var store,
        AjaxAdapter,
        LocalstorageAdapter,
        Foo,
        Bar;

    beforeEach(function(){

        AjaxAdapter = Ember.Object.extend({ type: 'ajax' });
        LocalstorageAdapter = Ember.Object.extend({ type: 'localstorage' });
        Foo = Model.extend();
        Bar = Model.extend();
        Bar.reopenClass({ adapter: 'localstorage' });

        store = Store.create({
            container: {
                registry: [],
                normalize: function( key ){
                    return key;
                },
                lookupFactory: function( key ){
                    return this.registry.findBy( 'key', key ).factory;
                }
            }
        });

        store.container.registry.push( { key: 'adapter:ajax', factory: AjaxAdapter } );
        store.container.registry.push( { key: 'adapter:localstorage', factory: LocalstorageAdapter } );

        store.container.registry.push( { key: 'model:foo', factory: Foo } );
        store.container.registry.push( { key: 'model:bar', factory: Bar } );        
    });

    describe( 'modelFor', function(){
        it( 'should return the model "Foo" for type "foo" ', function(){
            expect( store.modelFor( 'foo' ) ).to.equal( Foo );
        });

        it( 'should return the model "Bar" for type "bar" ', function(){
            expect( store.modelFor( 'bar' ) ).to.equal( Bar );
        });

    });

    describe( 'adapterFor', function(){
        it( 'should return the adapter "ajax" for model type "foo"', function(){
            expect( store.adapterFor( 'foo' ) ).to.equal( AjaxAdapter );
        });

        it( 'should return the adapter "localstorage" for model type "bar"', function(){
            expect( store.adapterFor( 'bar' ) ).to.equal( LocalstorageAdapter );
        });
    });


    describe( 'findOne', function(){

    });
    
    describe( 'find', function(){

    });

    describe( '__find', function(){

    });

    describe( 'createRecord', function(){
        it( 'should exist', function(){
            expect();
        });
    });

    describe( 'registerPreQueryHook', function(){

    });

    describe( 'registerPostQueryHook', function(){

    });
});