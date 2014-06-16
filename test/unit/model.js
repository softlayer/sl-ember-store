import Model from "sl-model";

chai.should();

var expect = chai.expect,
    Foo,
    foo;


describe( 'sl-model', function(){
    beforeEach( function(){
        Foo = Model.extend();
        Foo.reopenClass({url:'foo'});
        Foo.setAdapter( Ember.Object.extend({
            save: sinon.spy(),
            delete: sinon.spy()
        }), {});
        foo = Foo.create();
    });
    
    describe( 'save', function(){
        it( 'should call adapter.save with correct arguments', function(){
            foo.save( 'test' );
            Foo._adapter.save.should.have.been.calledWith( 'foo', 'test' );
        });
    });

    describe( 'destroy', function(){
        it( 'should call adapter.delete with correct arguments', function(){
            foo.delete( 'test' );
            Foo._adapter.delete.should.have.been.calledWith( 'foo', 'test' );
        });
    });

    describe( 'setAdapter', function(){
        it( 'should have adapter set', function(){
            expect( Foo._adapter ).to.exist;
        });

    });

    describe( 'findOne', function(){
        it( 'should call __find with options', function(){
            Foo.__find = sinon.spy();
            Foo.findOne( 'test' );
            Foo.__find.should.have.been.calledWith( null, 'test', true );
        });
    });

    describe( 'find', function(){
        it( 'should call __find with correct args', function(){
            Foo.__find = sinon.spy();
            Foo.find( 1, 'test' );
            Foo.__find.should.have.been.calledWith( 1, 'test', false );
        });
    });

    describe( '__find', function(){
        it( 'should call _adapter.__find with correct args', function(){
            Foo._adapter.__find = sinon.spy();
            Foo.__find( 1, 'test', false );
            Foo._adapter.__find.should.have.been.calledWith( 'foo', 1, 'test', false );
        });
    });

});
