import Model from "sl-model";

chai.should();

var expect = chai.expect,
    Foo,
    foo,
    adapter,
    fooResponse = { id: 1, test: 'true' },
    ajaxMock = function(){
        return new Promise(function(resolve){ resolve( fooResponse ); });
    };


describe( 'sl-model', function(){
    before( function(){
        Foo = Model.extend();
        Foo.reopenClass({url:'/foo'});
        adapter = {
            save: ajaxMock,
            delete: ajaxMock,
        };

        sinon.spy( adapter, 'save' );
        sinon.spy( adapter, 'delete' );

        foo = Foo.create({
            content: {
                test: 'foo', 
                'bar': { id: 1, quiz: 'bar' },
            },
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
        foo.container.cache['adapter:ajax']=adapter;
    });
    
    describe( 'save', function(){
        before(function( done ){
            foo.save().then(function(){ done(); });
        });
        after(function(){
            adapter.save.reset();
            adapter.delete.reset();
        });
        it( 'should call adapter.save with correct arguments', function(){
            expect( adapter.save.args[0][0] ).to.equal( '/foo' );
            expect( adapter.save.args[0][1].test ).to.equal( 'foo' );
        });
        it( 'should update its content with fooResponse', function(){
            expect( foo.get('content') ).to.deep.equal( fooResponse );
        })
    });

    describe( 'delete', function(){
        before(function( done ){
            foo.delete().then(function(){ done(); });
        });
        after(function(){
            adapter.save.reset();
            adapter.delete.reset();
        });
        it( 'should call adapter.delete with correct arguments', function(){
            foo.delete( 'test' );
            adapter.delete.should.have.been.calledWith( '/foo' );
        });
        it( 'should destroy foo', function(){
            expect( foo.isDestroyed );
        });
    });

});
