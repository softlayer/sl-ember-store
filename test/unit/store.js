import Model from "sl-model";
import Store from 'sl-model/store';

chai.should();

var expect = chai.expect,
    store,

    AjaxAdapter,
    ajaxadapter,
    LocalstorageAdapter,
    Foo,
    Bar,
    queryHook = sinon.spy();


describe( 'sl-model/store', function(){

    beforeEach(function(){

        AjaxAdapter = Ember.Object.extend({ type: 'ajax', __find: function(){} });
        LocalstorageAdapter = Ember.Object.extend({ type: 'localstorage' });
        Foo = Model.extend();
        Foo.reopenClass({url:'/foo'});
        Bar = Model.extend();
        Bar.reopenClass({ adapter: 'localstorage' });

        store = Store.create({
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
            expect( store.adapterFor( 'foo' ) ).to.be.an.instanceof( AjaxAdapter );
        });

        it( 'should return the adapter "localstorage" for model type "bar"', function(){
            expect( store.adapterFor( 'bar' ) ).to.be.an.instanceof( LocalstorageAdapter );
        });
    });


    describe( 'findOne', function(){
        it( 'should have called __find with correct args', function(){
            var options = { "otherId": 1 };
            store.__find = sinon.spy();
            store.findOne( 'foo', options );
            store.__find.should.have.been.calledWith( 'foo', null, options, true );
        });

    });
    
    describe( 'find', function(){
        it( 'should have called __find with the correct args', function(){
            var options = { "otherId": 1 };
            store.__find = sinon.spy();
            store.find( 'foo', 1, options );
            store.__find.should.have.been.calledWith( 'foo', 1, options, false );
        });
    });

    describe( '__find', function(){
        beforeEach( function(){
            ajaxadapter = store.container.lookup( 'adapter:ajax');
            ajaxadapter.find = sinon.spy();
            sinon.spy( store, "modelFor" );
            sinon.spy( store, "adapterFor" );
            store.__find( 'foo', 1, {}, false );
        });

        it( 'should have called modelFor with the correct args', function(){
            store.modelFor.should.have.been.calledWith( 'foo' );
        });
        it( 'should have called adapterFor with the correct args', function(){
            store.adapterFor.should.have.been.calledWith( 'foo' );
        });
        it( 'should have called AjaxAdapter.find with the correct args', function(){
            ajaxadapter.find.should.have.been.calledWith( Foo, 1, {}, false );
        });
    });

    describe( 'createRecord', function(){
        beforeEach( function(){
            sinon.spy( store, 'modelFor' );
            sinon.spy( Foo, 'create' );
            store.createRecord( 'foo' );
        });
        it( 'should have called modelFor with "foo"', function(){
            store.modelFor.should.have.been.calledWith( 'foo' );
        });
        it( 'should have called Foo.create once', function(){
            expect( Foo.create.should.have.been.called.once );
        });
        it( 'should have called Foo.create with an object container', function(){
            Foo.create.should.have.been.calledWith( { container: store.container } );
        });

    });

    describe( 'registerPreQueryHook', function(){
        before( function(){
            store.registerPreQueryHook( queryHook );
        });
        after( function(){
            store.preQueryHooks = Ember.A([]);
        });
        it( 'should add an entry to preQueryHooks', function(){
            expect( store.get( 'preQueryHooks' ) ).to.have.length(1);
        });
    });

    describe( 'runPreQueryHooks', function(){
        before( function(){
            store.registerPreQueryHook( queryHook );
            store.runPreQueryHooks();
        });
        after( function(){
            store.preQueryHooks = Ember.A([]);
            queryHook.reset();
        });
        it( 'should have run queryHook once', function(){
            queryHook.should.have.been.calledOnce;
        });
    });

    describe( 'registerPostQueryHook', function(){
        beforeEach( function(){
            store.registerPostQueryHook( queryHook );
        });
        after( function(){
            store.postQueryHooks = Ember.A([]);
        });
        it( 'should add an entry to postQueryHooks', function(){
            expect( store.get( 'postQueryHooks' ) ).to.have.length(1);
        });
    });

    describe( 'runPostQueryHooks', function(){
        before( function(){
            store.registerPostQueryHook( queryHook );
            store.runPostQueryHooks();
        });
        after( function(){
            store.postQueryHooks = Ember.A([]);
            queryHook.reset();
        });
        it( 'should have run queryHook once', function(){
            queryHook.should.have.been.calledOnce;
        });
    });
});