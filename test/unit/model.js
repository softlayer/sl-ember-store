import Model from "sl-model";
import Ember from "ember";

chai.should();




describe.only( 'sl-model:model', function(){
    var expect = chai.expect,
    Foo,
    foo,
    Bar,
    bar,
    adapter,
    container,
    fooResponse = { id: 1, test: 'true' },
    ajaxMock = function(){
        return new Ember.RSVP.Promise(function(resolve){ resolve( fooResponse ); });
    };

    beforeEach( function(){ console.log('model beforeEach');
        Foo = Model.extend();
        Foo.reopenClass({url:'/foo'});
        Bar = Model.extend();
        Bar.reopenClass({
            endpoints: {
                default: {
                    get: '/bar',
                    post: '/barUpdate',
                    delete: '/barDelete'
                },
                car: {
                    post: '/carUpdate',
                    delete: '/carDelete'
                }
            }
        });
        adapter = {
            save: ajaxMock,
            deleteRecord: ajaxMock,
        };

        sinon.spy( adapter, 'save' );
        sinon.spy( adapter, 'deleteRecord' );

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

        container.cache['adapter:ajax']=adapter;

        foo = Foo.create({
            content: {
                test: 'foo',
                'bar': { id: 1, quiz: 'bar' },
            },
            container: container
        });


        bar = Bar.create({
            content: {
                test: 'bar',
                'car': { id: 1, quiz: 'car' },
            },
            container: container
        });

    });

    describe( 'save-default', function(){
        before(function( done ){
            foo.save().then(function(){ done(); });
        });
        after(function(){
            adapter.save.reset();
            adapter.deleteRecord.reset();
        });
        it( 'should call adapter.save with correct arguments', function(){
            expect( adapter.save.args[0][0] ).to.equal( '/foo' );
            expect( adapter.save.args[0][1].test ).to.equal( 'foo' );
        });
        it( 'should update its content with fooResponse', function(){
            expect( foo.get('content') ).to.deep.equal( fooResponse );
        });
    });

    describe( 'save-endpoint', function(){
        before(function( done ){
            bar.save().then(function(){done();});
        });
        after(function(){
            adapter.save.reset();
            adapter.deleteRecord.reset();
        });
        it( 'should call adapter.save with correct arguments', function(){
            expect( adapter.save.args[0][0] ).to.equal( '/barUpdate' );
            expect( adapter.save.args[0][1].test ).to.equal( 'bar' );
        });
        it( 'should update its content with fooResponse', function(){
            expect( bar.get('content') ).to.deep.equal( fooResponse );
        });
    });

    describe( 'save-endpoint:car', function(){
        before(function( done ){
            bar.save({endpoint:'car'}).then(function(){done();});
        });
        after(function(){
            adapter.save.reset();
            adapter.deleteRecord.reset();
        });
        it( 'should call adapter.save with correct arguments', function(){
            expect( adapter.save.args[0][0] ).to.equal( '/carUpdate' );
            expect( adapter.save.args[0][1].test ).to.equal( 'bar' );
        });
        it( 'should update its content with fooResponse', function(){
            expect( bar.get('content') ).to.deep.equal( fooResponse );
        });
    });

    describe( 'delete', function(){
        before(function( done ){
            var p = foo.deleteRecord().then(function(){ done(); });
        });
        after(function(){
            adapter.save.reset();
            adapter.deleteRecord.reset();
        });
        it( 'should call adapter.deleteRecord with correct arguments', function(){
            adapter.deleteRecord.should.have.been.calledWith( '/foo' );
        });
        it( 'should destroy foo', function(){
            expect( foo.isDestroyed );
        });
    });

    describe( 'delete-endpoint', function(){
        before(function( done ){
            var p = bar.deleteRecord().then(function(){ done(); });
        });
        after(function(){
            adapter.save.reset();
            adapter.deleteRecord.reset();
        });
        it( 'should call adapter.delete with correct arguments', function(){
            adapter.deleteRecord.should.have.been.calledWith( '/barDelete' );
        });
        it( 'should destroy bar', function(){
            expect( bar.isDestroyed );
        });
    });

    describe( 'delete-endpoint:car', function(){
        before(function( done ){
            var p = bar.deleteRecord({endpoint:'car'}).then(function(){ done(); });
        });
        after(function(){
            adapter.save.reset();
            adapter.deleteRecord.reset();
        });
        it( 'should call adapter.delete with correct arguments', function(){
            adapter.deleteRecord.should.have.been.calledWith( '/carDelete' );
        });
        it( 'should destroy bar', function(){
            expect( bar.isDestroyed );
        });
    });

});
