import Model from "sl-model";

chai.should();

var expect = chai.expect,
    Foo,
    foo,
    adapter;


describe( 'sl-model', function(){
    beforeEach( function(){
        Foo = Model.extend();
        Foo.reopenClass({url:'/foo'});
        adapter = {
            save: sinon.spy(),
            delete: sinon.spy(),
            __find: sinon.spy()
        };
        foo = Foo.create({
            container: {
                lookup: function(){ return adapter; }
            }
        });
    });
    
    describe( 'save', function(){
        it( 'should call adapter.save with correct arguments', function(){
            foo.save( 'test' );
            adapter.save.should.have.been.calledWith( '/foo', 'test' );
        });
    });

    describe( 'delete', function(){
        it( 'should call adapter.delete with correct arguments', function(){
            foo.delete( 'test' );
            adapter.delete.should.have.been.calledWith( '/foo', 'test' );
        });
    });

});
